import * as React from 'react'

import Wallet from '../services/wallet'

import FileUpload from "../Components/FileUpload"

export class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      errors: {},
      input: {},
    };
  }

  componentDidMount = async () => {
    try {
      this.wallet = new Wallet()
      this.wallet.getNewPhrase(false)
      this.address = await this.wallet.getAddress()
      this.privateKey = await this.wallet.getPrivateKey()
      //if (this.address) {
      //  this.props.handleUpdateAddress(this.address)
      //}
      //this.syncPhrase = await this.wallet.getNewPhraseData()
      this.syncPhrase = await this.wallet.getPhraseData()
      this.dataAddress = await this.wallet.getDataWalletAddress(this.syncPhrase)
      this.setState({
        syncPhrase: this.syncPhrase, 
        address: this.address,
        syncAddress: this.dataAddress,
      })
    } catch (e) {
      console.error('ERROR :: Setup :: componentDidMount :: ', e)
    }
  }

  render() {
    return (
      <>
        <h1>Home Page</h1>
        { (this.state.address) &&
          <p>address: {this.state.address}</p>
        }
        { (this.state.syncPhrase) && 
          <p>syncPhrase: {this.state.syncPhrase}</p>
        }
        { (this.state.syncAddress) && 
          <p>syncAddress: {this.state.syncAddress}</p>
        }
        {/*
        <FileUpload />
        */}
      </>
    )
  }
}
