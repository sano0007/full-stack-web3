import './App.css'
import {ethers} from "ethers";
import {useEffect, useState} from "react";
import {Navigation} from "./components/Navigation.tsx";
import {Search} from "./components/Search.tsx";

import RealEstate from './abis/RealEstate.json';
import Escrow from './abis/Escrow.json';
import config from './config.json';
import {Config} from "./interfaces/config-types.ts";
import {RealEstateItem} from "./interfaces/real-estate-item.ts";
import {Home} from "./components/Home.tsx";

function App() {
    const [provider, setProvider] = useState<ethers.BrowserProvider>();
    const [escrow, setEscrow] = useState<ethers.Contract>();

    const [account, setAccount] = useState<string>('');
    const [homes, setHomes] = useState<RealEstateItem[]>();
    const [home, setHome] = useState<RealEstateItem>();
    const [toggle, setToggle] = useState<boolean>(false);
    const loadBLockChain = async () => {

        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);

        const network = await provider.getNetwork();


        const realEstate = new ethers.Contract((config as Config)[String(network.chainId)].realEstate.address, RealEstate, provider);
        const totalSupply = await realEstate.totalSupply();
        const homes = []

        for (let i = 1; i <= totalSupply; i++) {
            const uri = await realEstate.tokenURI(i - 1);
            const response = await fetch(uri);
            const metadata = await response.json();
            homes.push(metadata);
        }

        setHomes(homes);

        const escrow = new ethers.Contract((config as Config)[String(network.chainId)].escrow.address, Escrow, provider);
        setEscrow(escrow);

        window.ethereum.on('accountsChanged', async () => {
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            const account = ethers.getAddress(accounts[0]);
            setAccount(account);
        })
    }

    useEffect(() => {
        loadBLockChain().then();
    }, [])

    const toggleProp = (home: RealEstateItem) => {
        setHome(home);
        toggle ? setToggle(false) : setToggle(true);
    }

    return (
        <div>
            <Navigation account={account} setAccount={setAccount}/>
            <Search/>
            <div className='cards__section'>

                <h3>Homes For You</h3>
                <hr/>

                <div className={'cards'}>
                    {homes?.map((home, index) => {
                        return (
                            <div className={'card'} key={index} onClick={() => toggleProp(home)}>
                                <div className={'card__image'} key={index}>
                                    <img src={home.image} alt={"Home"}/>
                                </div>
                                <div className={'card__info'}>
                                    <h4>{home.attributes[0].value} ETH</h4>
                                    <p>
                                        <strong>{home.attributes[2].value}</strong> bds |
                                        <strong>{home.attributes[3].value}</strong> ba |
                                        <strong>{home.attributes[4].value}</strong> sqft
                                    </p>
                                    <p>{home.address}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {toggle && home && escrow && provider && (
                <Home home={home} escrow={escrow} account={account} provider={provider} toggleProp={toggleProp}/>
            )}

        </div>
    );
}

export default App
