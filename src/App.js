import './App.css';
import React, { Component } from 'react';
import Web3 from 'web3';


class App extends Component {
  componentWillMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    const network = await web3.eth.net.getNetworkType()
    const chainID = await web3.eth.getChainId()
    this.setState({chainID})
    const lastBlock = await web3.eth.getBlockNumber()
    this.setState({lastBlock})
    const accounts = await web3.eth.getAccounts()
    this.setState({account:accounts[0]})
    const ethEnabled = () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
        return true;
      }
      return false;
    }     
    ethEnabled()
    console.log("network:", network,chainID,lastBlock,accounts[0])
  }
  constructor(props) {
    super(props)
    this.state = {
      account:''
    }
    }
  
  render() {
     return (
      <div className="container">
      <h1>My app!</h1>
      <p>Your account:{this.state.account} </p>
      <p>Chain ID: {this.state.chainID}</p>
      <p>Block number: {this.state.lastBlock}</p>
      </div>
    );
  }
}

export default App;