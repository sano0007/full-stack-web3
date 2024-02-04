import {ethers} from "hardhat";
import {Signer} from "ethers";
import {Escrow, RealEstate} from "../typechain-types";

let buyer: Signer, seller: Signer, inspector: Signer, lender: Signer
let realEstate: RealEstate, escrow: Escrow

const tokens = (n: number) => {
    return ethers.parseUnits(n.toString(), 'ether');
}

async function main() {
    //Setup accounts
    [buyer, seller, inspector, lender] = await ethers.getSigners();

    // Deploy Real Estate
    const RealEstate = await ethers.getContractFactory('RealEstate');
    realEstate = await RealEstate.deploy();

    console.log(`Deployed RealEstate Contract at: ${await realEstate.getAddress()}`);
    console.log('Minting 3 properties... \n');

    for (let i = 0; i < 3; i++) {
        let transaction = await realEstate.connect(seller).mint(`https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/${i + 1}.json`);
        await transaction.wait();
    }

    // Deploy Escrow
    const Escrow = await ethers.getContractFactory('Escrow');
    const escrow = await Escrow.deploy(
        await seller.getAddress(),
        await realEstate.getAddress(),
        await inspector.getAddress(),
        await lender.getAddress()
    )
    await escrow.waitForDeployment();

    console.log(`Deployed Escrow Contract at: ${await escrow.getAddress()}`);

    for (let i = 0; i < 3; i++) {
        // Approve properties...
        let transaction = await realEstate.connect(seller).approve(await escrow.getAddress(), i);
        await transaction.wait();
    }

    // Listing Properties...
    let transaction = await escrow.connect(seller).list(0, tokens(20), tokens(10), await buyer.getAddress());
    await transaction.wait();

    transaction = await escrow.connect(seller).list(1, tokens(15), tokens(5), await buyer.getAddress());
    await transaction.wait();

    transaction = await escrow.connect(seller).list(2, tokens(10), tokens(5), await buyer.getAddress());
    await transaction.wait();

    console.log('Finished.');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});