import {RealEstateItem} from "../interfaces/real-estate-item.ts";
import {ethers} from "ethers";

import close from '../assets/close.svg'
import {useEffect, useState} from "react";

interface HomeProps {
    home: RealEstateItem;
    provider: ethers.BrowserProvider;
    account: string;
    escrow: ethers.Contract;
    toggleProp: (home: RealEstateItem) => void;
}

export function Home({home, escrow, provider, account, toggleProp}: HomeProps) {
    const [hasBought, setHasBought] = useState<boolean>(false);
    const [hasLended, setHasLended] = useState<boolean>(false);
    const [hasInspected, setHasInspected] = useState<boolean>(false);
    const [hasSold, setHasSold] = useState<boolean>(false);

    const [buyer, setBuyer] = useState();
    const [lender, setLender] = useState();
    const [inspector, setInspector] = useState();
    const [seller, setSeller] = useState();

    const [owner, setOwner] = useState<string>('')
    const fetchDetails = async () => {

        // buyer
        const buyer = await escrow.getBuyerAddress(home.id);
        setBuyer(buyer);
        const hasBought = await escrow.approval(home.id, buyer);
        setHasBought(hasBought);

        // seller
        const seller = await escrow.seller();
        setSeller(seller);
        const hasSold = await escrow.approval(home.id, seller);
        setHasBought(hasSold);

        // lender
        const lender = await escrow.lender();
        setLender(lender);
        const hasLended = await escrow.approval(home.id, lender);
        setHasBought(hasLended);

        // inspector
        const inspector = await escrow.inspector();
        setInspector(inspector);
        const hasInspected = await escrow.approval(home.id, inspector);
        setHasBought(hasInspected);

    }

    const fetchOwner = async () => {
        if (await escrow.isListed(home.id)) return;
        const owner = await escrow.buyer(home.id);
        setOwner(owner);
    }

    const buyHandler = async () => {
        console.log('🍅')
        const escrowAmount = await escrow.escrowAmount(home.id);
        const signer = await provider.getSigner();

        // Buyer deposit earnest
        let transaction = await escrow.connect(signer).depositEarnest(home.id, {value: escrowAmount});
        console.log('🌸🌸🌸', transaction)

        // Buyer approves...
        transaction = await escrow.connect(signer).approveSale(home.id);
        await transaction.wait();

        setHasBought(true);
    }
    const inspectHandler = async () => {
        const signer = await provider.getSigner();

        // Inspector update status
        const transaction = await escrow.connect(signer).updateInspectionStatus(home.id, true);
        await transaction.wait();

        setHasInspected(true);
    }
    const lendHandler = async () => {
        const signer = await provider.getSigner();

        // Lender approves...
        const transaction = await escrow.connect(signer).approveSale(home.id);
        await transaction.wait();

        // Lender sends funds to contract...
        const lendAmount = (await escrow.purchasePrice(home.id) - await escrow.escrowAmount(home.id));
        await signer.sendTransaction({to: await escrow.getAddress(), value: lendAmount.toString(), gasLimit: 60000});

        setHasLended(true);
    }
    const sellHandler = async () => {
        const signer = await provider.getSigner();

        // Seller approves...
        let transaction = await escrow.connect(signer).approveSale(home.id);
        await transaction.wait();

        // Seller finalize...
        transaction = await escrow.connect(signer).finalizeSale(home.id);
        await transaction.wait();

        setHasSold(true);
    }

    useEffect(() => {
        fetchDetails().then();
        fetchOwner().then();
    }, [hasSold]);
    const handleClick = () => toggleProp(home);

    return (
        <div className="home">
            <div className={'home__details'}>
                <div className={"home__image"}>
                    <img src={home.image} alt={"Home"}/>
                </div>
                <div className={"home__overview"}>
                    <h1>{home.name}</h1>
                    <p>
                        <strong>{home.attributes[2].value}</strong> bds |
                        <strong>{home.attributes[3].value}</strong> ba |
                        <strong>{home.attributes[4].value}</strong> sqft |
                    </p>
                    <p>{home.address}</p>
                    <h2>{home.attributes[0].value} ETH</h2>

                    {owner ? (
                        <div className='home__owned'>
                            Owned by {owner.slice(0, 6) + '...' + owner.slice(38, 42)}
                        </div>
                    ) : (
                        <div>
                            {(account === inspector) ? (
                                <button className='home__buy' onClick={() => inspectHandler()} disabled={hasInspected}>
                                    Approve Inspection
                                </button>
                            ) : (account === lender) ? (
                                <button className='home__buy' onClick={() => lendHandler()} disabled={hasLended}>
                                    Approve & Lend
                                </button>
                            ) : (account === seller) ? (
                                <button className='home__buy' onClick={() => sellHandler()} disabled={hasSold}>
                                    Approve & Sell
                                </button>
                            ) : (
                                <button className='home__buy' onClick={() => buyHandler()} disabled={hasBought}>
                                    Buy
                                </button>
                            )}

                            <button className='home__contact'>
                                Contact agent
                            </button>
                        </div>
                    )}
                    <hr/>
                    <h2>Overview</h2>
                    <p>
                        {home.description}
                    </p>
                    <hr/>
                    <h2>Facts and features</h2>
                    <ul>
                        {home.attributes.map((attribute, index) => (
                            <li key={index}><strong>{attribute.trait_type}</strong> : {attribute.value}</li>
                        ))}
                    </ul>
                </div>
                <button onClick={handleClick} className={"home__close"}>
                    <img src={close} alt={"Close"}/>
                </button>
            </div>
        </div>
    );
}