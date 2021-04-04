import './App.css';
import React, { Component } from 'react';
import Web3 from 'web3';
const song = require('./Nfts/Song')
const toutDou = require('./Nfts/Doucement')
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
//const network = await web3.eth.net.getNetworkType() 

var SongForACity = undefined;
class App extends Component {
  componentWillMount() {

    this.loadBlockchainData()
    this.useSong()
  }

  async loadBlockchainData() {
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
  }
  async useSong(){
    SongForACity = new web3.eth.Contract(song.abi, song.address, {
      from: this.state.account
    })
    const tokenName =await SongForACity.methods.name().call()
    this.setState({tokenName})
    const totalToken =await SongForACity.methods.tokenCounter().call()
    this.setState({totalToken})
    const tokenUrl = await SongForACity.methods.tokenURI(0).call()
    fetch('https://cors-anywhere.herokuapp.com/'+tokenUrl, {
        method: "GET",
        headers: {
          "Content-Type": 'application/json',
          redirect: 'follow'
        }
    })
    .then(fetchResponse => {
      console.log(fetchResponse)
      return fetchResponse.json()
    })
    .then(responseData => {
      console.log(responseData)
      const name = responseData.properties.name.description
      const img = responseData.properties.image.description
      const description = responseData.properties.description.description
      this.setState({ token: {
        name,
        img,
        description
      }})
    })
    console.log("adress:", toutDou.address, song.address,tokenName,totalToken,)
    
  }
  constructor(props) {
    super(props)
    this.state = {
      account:'',
      chainID: '',
      lastBlock: '',
      tokenName:'',
      totalToken:'',
      token:{
        image:'',
        name:'',
        description:''
      }
    }
    }
  
  render() {
     return (
      <div className="container">
      <h1>My app!</h1>
      <p>Your account: {this.state.account} </p>
      <p>Chain ID: {this.state.chainID}</p>
      <p>Block number: {this.state.lastBlock}</p>
      <div>Image : <img src={this.state.image} height="70" width="70" alt="Tableau song "></img></div>
                <div>Name : {this.state.name} </div>
                <div>Description : {this.state.description} </div>
      </div>
    );  
  }
}

export default App;