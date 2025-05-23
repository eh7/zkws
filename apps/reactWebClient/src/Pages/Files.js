import * as React from 'react'

import {
  Button,
  Form,
  FormGroup,
  Card,
  Row,
  Col,
  Container,
  FloatingLabel,
} from 'react-bootstrap';

import Wallet from '../services/wallet'

import FileUpload from "../Components/FileUpload"

export class Files extends React.Component {
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
      <Container>
        <Card>
          <Card.Header>Files</Card.Header>
          <FileUpload className="mt-3"/>
        </Card>
      </Container>
    )
  }
}
