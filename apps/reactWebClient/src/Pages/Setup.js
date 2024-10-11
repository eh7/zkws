import * as React from 'react'
//import Button from 'react-bootstrap/Button';
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
//import '../App.css';

import Wallet from '../services/wallet'

export class Setup extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      formInputShow: null,
      errors: [],
      form: {
        address: null,
        phrase: null,
      },
      input: {},
      address: null,
      syncPhrase: null,
      syncAddress: null,
      keyOptions: [
        {
          id: "privateKeyCheckbox",
          label: "Private Key",
          controlId: "formPrivateKeyCheckbox"
        },
        {
          id: "phraseCheckbox",
          label: "Phrase",
          controlId: "formPhraseCheckbox"
        },
        {
          id: "keyStoreCheckbox",
          label: "Key Store",
          controlId: "formKeyStoreCheckbox"
        },
      ]
    };
    //alert('props action ::' + this.props.action)
  }

  handleFormSubmit = (e) => {
    alert('handleFormSubmit')
    e.preventDefault()
  }

  handlePrivateKeyInputChange = (e) => {
    this.state.form.privateKey = e.target.value
    //console.log('this.handlePrivateKeyInputChange', this.state.form.privateKey)
    e.preventDefault()
  }

  handleInputChange = (e) => {
    e.preventDefault()
    this.state.form[e.target.id] = e.target.value
    console.log(e.target.id, this.state.form[e.target.id])
  }

  componentDidMount = async () => {
    try {
      this.wallet = new Wallet()
      this.wallet.getNewPhrase(false)
      this.address = await this.wallet.getAddress()
      this.privateKey = await this.wallet.getPrivateKey()
      this.setState({ address: this.address })
      if (this.address) {
        this.props.handleUpdateAddress(this.address)
      }
      //this.syncPhrase = await this.wallet.getNewPhraseData()
      this.syncPhrase = await this.wallet.getPhraseData()
      this.dataAddress = await this.wallet.getDataWalletAddress(this.syncPhrase)
      this.setState({
        syncPhrase: this.syncPhrase,
        syncAddress: this.dataAddress,
      })
    } catch (e) {
      console.error('ERROR :: Setup :: componentDidMount :: ', e)
    }
  }

  render() {
    const formInputs = []
    formInputs['privateKeyCheckbox'] = (
      <>
        <b>Private Key</b>
        <Form.Group className="mb-3" controlId="privateKeyInputs">
          <Form.Control
            id='privateKey'
            type="input"
            as="textarea"
            label=""
            key="id"
            placeholder="enter your private key"
            onChange={this.handleInputChange}
          />
          <Button onClick={() => {
             alert('import')
          }}>import</Button>
        </Form.Group>
      </>
    )

    formInputs['phraseCheckbox'] = (
      <>
        <b>Phrase</b>
        <Form.Group className="mb-3" controlId="privateKeyInputs">
          <Form.Control
            id='phrase'
            type="input"
            as="textarea"
            row="3"
            label=""
            key="id"
            placeholder="enter your phrase here"
            onChange={this.handleInputChange}
            value={this.state.form['phrase']}
          />
          <Button onClick={async (e) => {
            const randomPhrase = await this.wallet.getRandomPhraseData()
            this.state.form['phrase'] = randomPhrase 
            document.getElementById('phrase').value = randomPhrase 
            //alert('new phrase onclick :: '+ randomPhrase)
          }}>new</Button>
        </Form.Group>
      </>
    )

    formInputs['keyStoreCheckbox'] = (
      <>
        <b>Key Store JSON</b>
        <Form.Group className="mb-3" controlId="privateKeyInputs">
          <Form.Control
            as="textarea"
            placeholder="paste your keystore json here"
            onChange={this.handleInputChange}
            readOnly={false}
          />
        </Form.Group>

        <FloatingLabel
          controlId="keyStorefloatingTextarea"
          label=""
          className="mb-3"
        >
        </FloatingLabel>

      </>
    )
    //this.setState({ formInputs })

    const passwordInputs = (
        <>
          <h3>Password Inputs</h3>
          <Form.Group>
            <Form.Label htmlFor="Password"> Password </Form.Label>
            <Form.Control
              type="password"
              name="password"
              id="password"
              placeholder="*******"
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="examplePassword"> Password Check </Form.Label>
            <Form.Control
              type="password"
              name="passwordCheck"
              id="passwordCheck"
              placeholder="********"
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Button type="submit">Submit</Button>
        </>
    )
    return (
      <Container>
        { (this.state.errors) && (<Row><Col><h4>{this.state.errors}</h4></Col></Row>) }
        <Form className="form" key="SetupForm" onSubmit={this.handleFormSubmit}>
          <Row>
            <Col>
              <h1>SYNC Network Settings</h1>
            </Col>
          </Row>
            { (this.state.address) &&
              <Row>
                <Col>
                  <Form.Label htmlFor="syncAddress">Your current address</Form.Label>
                  <Form.Control
                    type="text"
                    id="myAddress"
                    aria-describedby="myAddressBlock"
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
          <Row className="py-10">
            <Col>
              <div className="p-3 border bg-light">
              <h2>Import Your Own Key</h2>
              <h5>select a data type to import</h5>
              { this.state.keyOptions.map((option, index) => {
                //const thisOptionId = 'checkbox-' + option.id
                const thisOptionId = option.id
                return (
                  <div key={index}>
                    <Form.Group className="mb-3" controlId={option.controlId} key={option.id + '-' + index}>
                      <Form.Check
                        id={thisOptionId}
                        type="checkbox"
                        label={option.label}
                        key={index}
                        onClick={(e) => {
                          if (e.target.checked) {
                            console.log(e.target.id)
                            this.state.keyOptions.map((option) => {
                              if (e.target.id !== thisOptionId) {
                                document.getElementById(thisOptionId).checked = false 
                              } else {
                              }
                              if (option.id !== thisOptionId) {
                                document.getElementById(option.id).checked = false
                                //console.log(option.id, document.getElementById(option.id).checked)
                              }
                            })
                            this.setState({ formInputShow: e.target.id })
                            this.setState({ setPassword: true })
                          } else {
                            this.setState({ formInputShow: null })
                            this.setState({ setPassword: false })
                          }
                        }}
                      />
                    </Form.Group>
                  </div>
                )
              })}
              </div>
            </Col>
          </Row>
              { (this.state.formInputShow) && 
                formInputs[this.state.formInputShow] 
              }
              { (this.state?.setPassword) && 
                passwordInputs
              }
        </Form>
      </Container>
    )
  }
}
              //{ (this.state?.formInputs[option.id]) && formInputs[option.id] }
          //<h5>{ this.state.formInputShow && this.state.formInputs[this.state.formInputShow] }</h5>
