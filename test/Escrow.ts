import {ethers} from 'hardhat';
import {expect} from "chai";
import {Escrow, RealEstate} from "../typechain-types";
import {Signer} from "ethers";

const tokens = (n: number) => {
    return ethers.parseUnits(n.toString(), 'ether');
}

describe('Escrow', () => {
    let buyer: Signer, seller: Signer, inspector: Signer, lender: Signer
    let realEstate: RealEstate, escrow: Escrow

    beforeEach(async () => {
        //Setup accounts
        [buyer, seller, inspector, lender] = await ethers.getSigners();

        // Deploy Real Estate
        const RealEstate = await ethers.getContractFactory('RealEstate');
        realEstate = await RealEstate.deploy();

        // Mint
        let transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS");
        await transaction.wait();

        const Escrow = await ethers.getContractFactory('Escrow');
        escrow = await Escrow.deploy(
            await seller.getAddress(),
            await realEstate.getAddress(),
            await inspector.getAddress(),
            await lender.getAddress()
        );

        //Approve property
        transaction = await realEstate.connect(seller).approve(await escrow.getAddress(), 0);
        await transaction.wait();

        // List property
        transaction = await escrow.connect(seller).list(0, tokens(10), tokens(5), await buyer.getAddress());
        await transaction.wait();
    })

    describe('Deployment', async () => {
        it('Returns NFT address', async () => {
            const nftAddress = await escrow.nftAddress();
            expect(nftAddress).to.be.equal(await realEstate.getAddress());
        });
        it('Returns seller', async () => {
            const sellerAddress = await escrow.seller();
            expect(sellerAddress).to.be.equal(await seller.getAddress());
        });
        it('Returns inspector', async () => {
            const inspectorAddress = await escrow.inspector();
            expect(inspectorAddress).to.be.equal(await inspector.getAddress());
        });
        it('Returns lender', async () => {
            const lenderAddress = await escrow.lender();
            expect(lenderAddress).to.be.equal(await lender.getAddress());
        });
    })

    describe('Listing', async () => {
        it('Updates as listed', async () => {
            const isListed = await escrow.isListed(0);
            expect(isListed).to.be.true;
        });
        it('Updates ownership', async () => {
            expect(await realEstate.ownerOf(0)).to.be.equal(await escrow.getAddress());
        });
        it('Returns buyer', async () => {
            const buyerAddress = await escrow.buyer(0);
            expect(buyerAddress).to.be.equal(await buyer.getAddress());
        });
        it('Returns escrow amount', async () => {
            const escrowAmount = await escrow.escrowAmount(0);
            expect(escrowAmount).to.be.equal(tokens(5));
        });
        it('Returns purchase price', async () => {
            const purchasePrice = await escrow.purchasePrice(0);
            expect(purchasePrice).to.be.equal(tokens(10));
        });
    })

    describe('Deposits', async () => {
        it('Updates contract balance', async () => {
            const transaction = await escrow.connect(buyer).depositEarnest(0, {value: tokens(5)});
            await transaction.wait();

            const escrowBalance = await escrow.getBalance();
            expect(escrowBalance).to.be.equal(tokens(5));
        });
    })

    describe('Inspection', async () => {
        it('Updates inspection status', async () => {
            const transaction = await escrow.connect(inspector).updateInspectionStatus(0, true);
            await transaction.wait();

            const isInspectionPassed = await escrow.inspectionPassed(0);
            expect(isInspectionPassed).to.be.true;
        });
    })

    describe('Approval', async () => {
        it('Updates approval status', async () => {
            let transaction = await escrow.connect(buyer).approveSale(0);
            await transaction.wait();

            transaction = await escrow.connect(seller).approveSale(0);
            await transaction.wait();

            transaction = await escrow.connect(lender).approveSale(0);
            await transaction.wait();

            expect(await escrow.approval(0, await buyer.getAddress())).to.be.true;
            expect(await escrow.approval(0, await seller.getAddress())).to.be.true;
            expect(await escrow.approval(0, await lender.getAddress())).to.be.true;
        });
    })

    describe('Sale', async () => {
        beforeEach(async () => {
            let transaction = await escrow.connect(buyer).depositEarnest(0, {value: tokens(5)});
            await transaction.wait();

            transaction = await escrow.connect(inspector).updateInspectionStatus(0, true);
            await transaction.wait();

            transaction = await escrow.connect(buyer).approveSale(0);
            await transaction.wait();

            transaction = await escrow.connect(seller).approveSale(0);
            await transaction.wait();

            transaction = await escrow.connect(lender).approveSale(0);
            await transaction.wait();

            await lender.sendTransaction({to: await escrow.getAddress(), value: tokens(5)});

            transaction = await escrow.connect(seller).finalizeSale(0);
            await transaction.wait();
        })

        it("Updates ownership", async () => {
            expect(await realEstate.ownerOf(0)).to.be.equal(await buyer.getAddress());
        });
        it("Updates balance", async () => {
            expect(await escrow.getBalance()).to.be.equal(0);
        });
    });
});
