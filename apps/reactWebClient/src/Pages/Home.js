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
      <Container>
        <h1>Home Page</h1>
        { (this.state.address) &&
          <Row>
            <Col>
              <Form.Label htmlFor="syncAddress">Your current address</Form.Label>
              <Form.Control
                type="text"
                id="syncAddress"
                aria-describedby="syncAddressBlock"
                value={this.state.address}
              />
            </Col>
          </Row>
        }
        { (this.state.syncPhrase) && 
          <Row>
            <Col>
              <Form.Label htmlFor="syncPhrase">Current syncPhrase</Form.Label>
              <Form.Control
                type="text"
                as="textarea"
                rows={3}
                id="syncPhrase"
                aria-describedby="syncPhraseBlock"
                value={this.state.syncPhrase}
              />
            </Col>
          </Row>
        }
        { (this.state.syncPhrase) && 
          <Row>
            <Col>
              <Form.Label htmlFor="syncAddress">Current syncAddress</Form.Label>
              <Form.Control
                type="text"
                id="syncAddress"
                aria-describedby="syncAddressBlock"
                value={this.state.syncAddress}
              />
            </Col>
          </Row>
        }
        {/*
        <FileUpload />
        */}
      </Container>
    )
  }
}
