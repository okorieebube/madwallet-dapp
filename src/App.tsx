import React, { useState } from 'react';
import { ethers } from "ethers";
import Web3Modal, { IProviderOptions } from "web3modal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";
import abi from "./abi/greeter.json"

// 0x59439Ec0B3358Ef5141871a7aDA145AB9d2FA623


function App() {
  const INFURA_ID = '14473c74fc2c4c3d9288574899889a62';
  const CONTRACT_ADDRESS = '0x59439Ec0B3358Ef5141871a7aDA145AB9d2FA623';

  const [provider, setProvider]: any = useState();
  const [library, setLibrary]: any = useState();
  const [account, setAccount]: any = useState();
  const [network, setNetwork]: any = useState();

  const [greet, setGreet]: any = useState();


  function getProviderOptions() {
    const providerOptions = {
      coinbasewallet: {
        package: CoinbaseWalletSDK,
        options: {
          infuraId: INFURA_ID
        }
      },
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: INFURA_ID
        }
      }
    };
    return providerOptions;
  };

  const web3Modal = new Web3Modal({
    network: "ropsten",
    providerOptions: getProviderOptions(),
    cacheProvider: true,
    disableInjectedProvider: false,
  });




  const connect = async () => {
    try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();

      setProvider(provider);
      setLibrary(library);
      if (accounts) setAccount(accounts[0]);
      setNetwork(network);
      console.log('connect...')

    } catch (error) {
      console.log({ error });
    }
  }


  const refreshState = () => {
    setAccount();
    setNetwork();
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
    console.log('disconnect...')
  };

  const sayHi = async () => {
    try {
      const signer = library.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        abi.abi, signer
      );

      console.log("pop wallet...");
      let result = await connectedContract.greet();
      console.log({ result })
      console.log(`Greeting successfull...`);
    } catch (err) {
      console.log(err)
    }
  }

  const setGreeting = async (msg: string) => {
    try {
      console.log('args', msg)
      const signer = library.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        abi.abi, signer
      );

      console.log("pop wallet...");
      let result = await connectedContract.setGreeting(msg);
      console.log({ result })
      console.log(`Greeting successfull...`);
    } catch (err) {
      console.log(err)
    }
  }



  return (
    <div className="App">
      <header className="App-header">
        <div>Connection Status: {account ? `true` : `false`}</div>
        <div>Wallet Address: {account}</div>
        {!account && <button onClick={() => { connect() }}>Connect Wallet </button>}
        {account && <button onClick={() => { disconnect() }}>Disconnect </button>} <br />
        {account &&
          <>
            <button onClick={() => { sayHi() }}>Say Hi! </button> <br />
            <input type="text" value={greet} onInput={(e) => { setGreet((e.target as HTMLInputElement)?.value) }} />
            <button onClick={() => { setGreeting(greet) }}> New Greeting </button>
          </>
        }
      </header>
    </div>
  );
}

export default App;
