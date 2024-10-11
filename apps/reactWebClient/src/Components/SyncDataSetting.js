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

export default class SyncDataSettings extends React.Component {
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
      this.syncPhrase = await this.wallet.getPhraseData()
      this.dataAddress = await this.wallet.getDataWalletAddress(this.syncPhrase)
      this.setState({
        address: this.address,
        syncAddress: this.dataAddress,
        syncPhrase: this.syncPhrase, 
      })
    } catch (e) {
      console.error('ERROR :: Setup :: componentDidMount :: ', e)
    }
  }

  render() {
    return (
      <Container className="mb-3">
        { (this.state.address) &&
          <Row>
            <Col>
              <Form.Label htmlFor="address">Personal address</Form.Label>
              <Form.Control
                type="text"
                id="address"
                aria-describedby="addressBlock"
                value={this.state.address}
              />
            </Col>
          </Row>
        }
        { (this.state.syncPhrase) && 
          <Row>
            <Col>
              <Form.Label htmlFor="syncAddress">Data syncAddress</Form.Label>
              <Form.Control
                type="text"
                id="syncAddress"
                aria-describedby="syncAddressBlock"
                value={this.state.syncAddress}
              />
            </Col>
          </Row>
        }
        { (this.state.syncPhrase) && 
          <Row>
            <Col>
              <Form.Label htmlFor="syncPhrase">Data syncPhrase</Form.Label>
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
      </Container>
    )
  }
}
