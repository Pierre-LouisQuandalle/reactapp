import './App.css';
import React, { Component } from 'react';
import Web3 from 'web3';
const song = require('./Nfts/Song')
const toutDou = require('./Nfts/Doucement')
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
//const network = await web3.eth.net.getNetworkType() 

var SongForACity = undefined;
var Doucement = undefined;
class App extends Component {
  componentDidMount() {

    this.loadBlockchainData()
    this.useSong()
    this.viewDoucement()
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
    const address=song.address
    this.setState({address})
    const tokenName =await SongForACity.methods.name().call()
    this.setState({tokenName})
    const totalToken =await SongForACity.methods.tokenCounter().call()
    this.setState({totalToken})
    const tokenUrl = await SongForACity.methods.tokenURI(0).call()
    console.log(tokenUrl)

    // ATTTENTION : bug avec  le  serveru  victoire-oberkampf.fr qui est configuré pour bloquer les requetes HTTP cross origin et ne  permet donc  pas de lire la réponse.
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

  async viewDoucement(){
    Doucement = new web3.eth.Contract(toutDou.abi, toutDou.address, {
      from: this.state.account
    })
    const address2=toutDou.address
    this.setState({address2})
    const tokenName2 =await Doucement.methods.name().call()
    this.setState({tokenName2})
    const totalToken2 =await Doucement.methods.tokenCounter().call()
    this.setState({totalToken2})
    const tokenUrl2 = await Doucement.methods.tokenURI(0).call()
    console.log(tokenUrl2)
    //meme probleme de requete a cause de cors
    //const response  = await fetch(tokenUrl2)
    //const responseData = await response.json()
    const responseData={
      "title": "Asset Metadata",
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Tout Doucement"
        },
        "description": {
          "type": "string",
          "description": "An audio album released in 2019. Listen here https://victoire-oberkampf.bandcamp.com/album/tout-doucement"
        },
        "image": {
          "type": "string",
          "description": "http://www.victoire-oberkampf.fr/NFT-Workshop/ToutDoucement.jpeg"
        }
      }
    }
    const name = responseData.properties.name.description
    const image = responseData.properties.image.description
    const description = responseData.properties.description.description
    this.setState({ token2: {
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
      address:'',
      token:{
        image:'',
        name:'',
        description:''
      },
      adress2:'',
      tokenName2:'',
      totalToken2:'',
      tokenUrl2:'',
      token2:{
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
      <h1 style={{fontSize:'70px',marginLeft:'-10px'}}><center>NftApp</center></h1>
  <h4>Your account: {this.state.account} </h4>

  <h5>Chain ID: {this.state.chainID}</h5>
  <h5>Block number: <b>{this.state.lastBlock}</b></h5>
  <div className="card" styleName="width: 18rem;">
  <img src={this.state.token.image}  alt="Tableau song " class="card-img-top"></img>
  <div className="card-body">
  <h3 className="song">Song for a City</h3>
  <p className="card-text">Une peinture Nft déployée sur Rinkeby.</p>
  </div>
  <ul className="list-group list-group-flush">
    <li className="list-group-item">Name : {this.state.token.name}</li>
    <li className="list-group-item">Number : {this.state.totalToken}</li>
    <li className="list-group-item">Description : {this.state.token.description}</li>
    <li className="list-group-item" >Address : "<a href="https://testnets.opensea.io/assets/victoire-oberkampf-song-for-a-city" class="link-info">{this.state.address }</a>" (View on OpenSea)</li>
    <li className="list-group-item" class="text-center"><button type="button" class="btn btn-dark .btn-lg" 
    onClick={(event) => {event.preventDefault()
      SongForACity.methods.claimAToken().send({ from: this.state.account })
        }}
    >Claim token !</button></li>
  </ul>
  </div>
  <p></p>
  <p></p>
  <div className="card" styleName="width: 18rem;">
  <img src={this.state.token2.image}  alt="Tout Doucement" class="card-img-top"></img>
  <div className="card-body">
  <h3 className="song">Tout Doucement</h3>
  <p className="card-text">Une photographie représentant des petits personnages qui pendouillent déployée sur Rinkeby.</p>
  </div>
  <ul className="list-group list-group-flush">
    <li className="list-group-item">Name : {this.state.token2.name}</li>
    <li className="list-group-item">Number : {this.state.totalToken2}</li>
    <li className="list-group-item">Description : {this.state.token2.description}</li>
    <li className="list-group-item" >Address : "<a href="https://testnets.opensea.io/assets/victoire-oberkampf-tout-doucement" class="link-info">{this.state.address2 }</a>" (View on OpenSea)</li>
    <li className="list-group-item" class="text-center"><button type="button" class="btn btn-success .btn-lg" 
    onClick={(event) => {event.preventDefault()
      Doucement.methods.buyAToken().send({ from: this.state.account,value: 2*10**17 })}}
      >Buy this token !</button></li>
  </ul>
  </div>
</div>
    );  
  }
}

export default App;