import {ethers} from 'hardhat';

const tokens = (n: number) => {
    return ethers.parseUnits(n.toString(), 'ether');
}

describe('Escrow', () => {
    it('saves the address', async () => {
        // Deploy Real Estate
        const RealEstate = await ethers.getContractFactory('RealEstate');
        let realEstate = await RealEstate.deploy();

        // Mint
        let transaction = await realEstate.mint("https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS");
    });
});
