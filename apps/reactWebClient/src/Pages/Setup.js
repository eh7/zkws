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
      errors: {},
      formInputShow: null,
      errors: [],
      form: {},
      input: {},
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
      /*
      this.wallet.getNewPhrase(false)
      this.address = await this.wallet.getAddress()
      this.privateKey = await this.wallet.getPrivateKey()
      this.setState({ address: this.address })
      if (this.address) {
        this.props.handleUpdateAddress(this.address)
      }
      */
    } catch (e) {
      console.error('ERROR :: Setup :: componentDidMount :: ', e)
    }
  }

  render() {
    const formInputs = []
    formInputs['privateKeyCheckbox'] = (
      <>
        <b>Private Key Form</b>
        <Form.Group className="mb-3" controlId="privateKeyInputs">
          <Form.Check
            id='privateKey'
            type="input"
            label=""
            key="id"
            placeholder="your private key"
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
        <b>phrase form</b>
        <Form.Group className="mb-3" controlId="privateKeyInputs">
          <Form.Check
            id='phrase'
            type="input"
            label=""
            key="id"
            placeholder="enter your phrase here"
            onChange={this.handleInputChange}
          />
          <Button>new</Button>
        </Form.Group>
      </>
    )

    formInputs['keyStoreCheckbox'] = (
      <>
        <b>Key Store Form</b>

        <FloatingLabel
          controlId="keyStorefloatingTextarea"
          label=""
          className="mb-3"
        >
          <Form.Control
            as="textarea"
            placeholder="Past keystore here"
            onChange={this.handleInputChange}
          />
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
              <h1>Pages - Setup Page</h1>
            </Col>
          </Row>
              { (this.state.address) &&
                <Row>
                  <Col>
                    <p>address: {this.state.address}</p>
                  </Col>
                </Row>
              }
          <Row>
            <Col>

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
