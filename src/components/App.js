import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import MemoryToken from '../abis/MemoryToken.json'
import brain from '../brain.png'

const CARD_ARRAY = [
  {
    name: 'fries',
    img: '/images/fries.png'
  },
  {
    name: 'cheeseburger',
    img: '/images/cheeseburger.png'
  },
  {
    name: 'ice-cream',
    img: '/images/ice-cream.png'
  },
  {
    name: 'pizza',
    img: '/images/pizza.png'
  },
  {
    name: 'milkshake',
    img: '/images/milkshake.png'
  },
  {
    name: 'hotdog',
    img: '/images/hotdog.png'
  },
  {
    name: 'fries',
    img: '/images/fries.png'
  },
  {
    name: 'cheeseburger',
    img: '/images/cheeseburger.png'
  },
  {
    name: 'ice-cream',
    img: '/images/ice-cream.png'
  },
  {
    name: 'pizza',
    img: '/images/pizza.png'
  },
  {
    name: 'milkshake',
    img: '/images/milkshake.png'
  },
  {
    name: 'hotdog',
    img: '/images/hotdog.png'
  }
]

class App extends Component {

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }else{
      window.alert("Install Meta Mask");
    }
  }

  async loadBlockchainData(){
    const web3 = window.web3;
    let account = await web3.eth.getAccounts();
    this.setState({
      ...this.state,
      account: account[0]
    })
    let networkId = await web3.eth.net.getId();
    if(MemoryToken.networks[networkId]){
      let token = new web3.eth.Contract(MemoryToken.abi,MemoryToken.networks[networkId].address)
      this.setState({
        ...this.state,
        token
      })
      const totalSupply = await token.methods.totalSupply().call();
      this.setState({
        ...this.state,
        totalSupply: totalSupply.toString()
      })
      let balanceOf = await token.methods.balanceOf(account[0]).call();
      for(let i=0;i<balanceOf;i++){
        let id = await token.methods.tokenOfOwnerByIndex(account[0],i).call();
        let tokenURI = await token.methods.tokenURI(id).call();
        this.setState({
          ...this.state,
          tokenURIs: [...this.state.tokenURIs,tokenURI]
        })
      }
    }else{
      window.alert("Something Went Wrong!")
    }
    
  }
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData()
    this.setState({
      ...this.state,
      cardArray: CARD_ARRAY.sort(() => 0.5 - Math.random())
    })
  }
  flipCard = async (cardId) => {
    if(this.state.cardsChoosenId.includes(cardId)){
      return
    }
    let alreadyChoosen = this.state.cardsChoosenId.length;
    this.setState({
      cardsChoosenId: [...this.state.cardsChoosenId,cardId]
    })
    setTimeout(() => {
      if(alreadyChoosen === 1){
        console.log(this.state.cardsChoosenId[0],cardId)
        if(this.state.cardArray[this.state.cardsChoosenId[0]].name === this.state.cardArray[cardId].name){
          window.alert("Matched")
          this.state.token.methods.mint(
            this.state.account,
            window.location.origin + this.state.cardArray[cardId].img.toString()
          ).send({from: this.state.account})
          .on('transactionHash',(hash) => {
            this.setState({
              cardsWon: [...this.state.cardsWon,this.state.cardsChoosenId[0],cardId],
              tokenURIs: [...this.state.tokenURIs,window.location.origin+this.state.cardArray[cardId].img],
              cardsChoosenId: []
            })
          })
        }else{
          window.alert("no match")
          this.setState({
            cardsChoosenId: []
          })
        }
        
      }
      
    },100)
    
  }
  chooseImage(cardId){
    // cardId = cardId.toString();
    if(this.state.cardsWon.includes(cardId)){
      return window.location.origin + '/images/white.png'
    }
    if(this.state.cardsChoosenId.includes(cardId)){
      return window.location.origin + this.state.cardArray[cardId].img
    }
    return window.location.origin + '/images/blank.png'
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      token: null,
      totalSupply: 0,
      tokenURIs: [],
      cardArray: [],
      cardsChoosenId: [],
      cardsWon: []
    }
  }
  
  render() {
    return (
      <div>
        {console.log(this.state)}
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
          <img src={brain} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; Memory Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-muted"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">

                <div className="grid mb-4" >

                  {this.state.cardArray.map((card,key) => 
                    <>
                      {<img
                      key={key}
                      src={this.chooseImage(key)}
                      data-id={key}
                      onClick = {(e) => {
                        let cardId = key
                        if(!this.state.cardsWon.includes(cardId.toString())){
                          this.flipCard(cardId)
                        }
                      }}
                      />}
                    </>
                  )}

                </div>

                <div>

                  {/* Code goes here... */}

                  <div className="grid mb-4" >

                    {this.state.tokenURIs.map((tkn,idx) => 
                      <img 
                        
                        key={idx}
                        src={tkn} 
                      />
                    )}

                  </div>

                </div>

              </div>

            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
