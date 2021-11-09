import logo from './logo.svg';
import './App.css';
import getWeb3 from "./getWeb3";
import AffinityToken from "./contracts/AffinityToken.json"
import { useEffect, useState } from 'react';


function App() {

  let [state, setState] =  useState({
    web3: null,
    users: ["0xf5791766C5Aa125012f499E2d90199CA060CDFAA", "0x84Fca96Fb025FECC56bba7A481eF6C529D06e0FB", "0xe68141e9d50dbe4124A39d6473dd63B83b468c25"],
    accounts: null,
    contract: null
  });

  const loadWeb3 = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log(networkId);
      const deployedNetwork = AffinityToken.networks[networkId];
      const instance = new web3.eth.Contract(
        AffinityToken.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      setState(state, state.web3 = web3, state.accounts = accounts, state.contract = instance);
      console.log(state.users);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  useEffect( 
    () => {
      loadWeb3()
    }, [state.web3]
  );

  useEffect( 
    () => {
      console.log(state.storageValue);
    }, [state.storageValue]
  );


  const handleMinting = async (event) => {
    console.log(event.target.value);

    if (state.address1 && state.amount){
      
      console.log(state.accounts);
      
      // await contract.methods.set(inputVlaue).send({ from: accounts[0] });
      let balance = await state.contract.methods.balanceOf(state.accounts[0]).call();
      console.log("balance before minting is ", balance);


      // Get the value from the contract to prove it worked.
      // const response = await contract.methods.get().call();

      console.log(state.address1, " and amount is ", state.amount);
      
      let mint = await state.contract.methods.mint(state.address1, state.amount.concat("000000000000000000")).send({ from: state.accounts[0] });
      // let mint = await state.contract.methods.mint("0xf5791766C5Aa125012f499E2d90199CA060CDFAA", "10000000000000000000").send({ from: state.accounts[0] });
      console.log(mint);

      // state.contract.methods.mint("0xf5791766C5Aa125012f499E2d90199CA060CDFAA", 10*10**18).then( function (result) {
      //   console.log(result);
      // }).catch(function (err){
      //   console.log(err);
      // });

      balance = await state.contract.methods.balanceOf(state.accounts[0]).call();
      console.log("balance after minting is ", balance);

      // Update state with the result.
      setState(state, state.storageValue = balance);


    } else {
      console.log("address1 or amount is not set yet");
    }
    
    
  }

  const handleAddress1 = (event) => {
    // console.log(state);
    setState(state, state.address1 = event.target.value);
    console.log(state);
  }

  const handleAmount = (event) => {
    // console.log(state);
    setState(state, state.amount = event.target.value);
    console.log(state);

  }



  const handleTransfer = async (event) => {

    console.log(event.target.value);

    if (state.address1 && state.amount){
      
      console.log(state.accounts);
      
      // await contract.methods.set(inputVlaue).send({ from: accounts[0] });
      let balance = await state.contract.methods.balanceOf(state.address1).call();
      console.log("balance before minting is ", balance);


      // Get the value from the contract to prove it worked.
      // const response = await contract.methods.get().call();

      console.log(state.address1, " and amount is ", state.amount);
      
      let tranfer = await state.contract.methods.transfer(state.address1, state.amount.concat("000000000000000000")).send({ from: state.accounts[0] });
      // let mint = await state.contract.methods.mint("0xf5791766C5Aa125012f499E2d90199CA060CDFAA", "10000000000000000000").send({ from: state.accounts[0] });
      console.log(tranfer);

      // state.contract.methods.mint("0xf5791766C5Aa125012f499E2d90199CA060CDFAA", 10*10**18).then( function (result) {
      //   console.log(result);
      // }).catch(function (err){
      //   console.log(err);
      // });

      balance = await state.contract.methods.balanceOf(state.address1).call();
      console.log("balance after minting is ", balance);

      // Update state with the result.
      setState(state, state.storageValue = balance);


    } else {
      console.log("address1 or amount is not set yet");
    }


  }

  const handleMintingToAllAccounts = async (event) => {
    console.log(state.users);
    state.users.map( async (account) => {
      let mint = await state.contract.methods.mint(account, "10".concat("000000000000000000")).send({ from: state.accounts[0] });
      console.log(mint);
    });
  }


  return (
    <div className="App App-header">
      <span><input type="button" value={state.storageValue}></input></span>
      <input type="text" placeholder="Any Address" onChange={handleAddress1}></input>
      <input type="text" placeholder="amount" onChange={handleAmount}></input>
      <input type="button" value="Mint" onClick={handleMinting}></input>
      <input type="button" value="Transfer" onClick={handleTransfer}></input>
      <input type="button" value="Mint 10 Tokens To All Accounts" onClick={handleMintingToAllAccounts}></input>
      
    </div>
  );
}

export default App;
