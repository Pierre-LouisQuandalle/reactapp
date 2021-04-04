import './App.css';
import React, { Component } from 'react';
import Web3 from 'web3';
const song = require('./Nfts/Song')
const toutDou = require('./Nfts/Doucement')
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
//const network = await web3.eth.net.getNetworkType() 

var SongForACity = undefined;
class App extends Component {
  componentDidMount() {

    this.loadBlockchainData()
    this.useSong()
  }
  ClaimToken(){
    console.log("coucou")
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
    const tokenUrl = await SongForACity.methods.tokenURI(1).call()
    console.log(tokenUrl)

    // ATTTENTION : bug avec  le  serveru  vicoitre.fr qui  est configuré  pour  bloquer les requetes  HTTP cross origin et ne  permet donc  pas de lire la réponse.
    // const response  = await fetch(tokenUrl)
    // const responseData = await response.json()

    const responseData  = {
      "title": "Asset Metadata",
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Song For A City"
        },
        "description": {
          "type": "string",
          "description": "An audio album released in 2018. Listen here https://victoire-oberkampf.bandcamp.com/album/songs-for-a-city"
        },
        "image": {
          "type": "string",
          "description": "http://www.victoire-oberkampf.fr/NFT-Workshop/SongForACity.jpeg"
        }
      }
    }

    const name = responseData.properties.name.description
    const image = responseData.properties.image.description
    const description = responseData.properties.description.description
    this.setState({ token: {
      name,
      image,
      description
    }})
    
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
      <img  src="/logo.png" alt="logo"/>
      <h1>My app!</h1>
  <p>Your account: {this.state.account} </p>
  <p>Chain ID: {this.state.chainID}</p>
  <p>Block number: {this.state.lastBlock}</p>
  <div>Image : <img src={this.state.token.image} height="70" width="70" alt="Tableau song "></img></div>
            <div>Name : {this.state.token.name} </div>
            <div>Description : {this.state.token.description} </div>
            <button type="button" class="btn btn-dark" onClick={this.ClaimToken}>Claim token!</button>
</div>
    );  
  }
}

export default App;