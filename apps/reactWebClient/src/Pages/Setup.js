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

export class Setup extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      errors: {},
      formInputShow: null,
      input: {},
      keyOptions: [
        {
          id: "privateKey",
          label: "Private Key",
          controlId: "formPrivateKeyCheckbox"
        },
        {
          id: "phrase",
          label: "Phrase",
          controlId: "formPhraseCheckbox"
        },
        {
          id: "keyStore",
          label: "Key Store",
          controlId: "formKeyStoreCheckbox"
        },
      ]
    };
  }

  render() {
    const formInputs = []
    formInputs['privateKey'] = (
      <>
        <b>Private Key Form</b>
        <Form.Group className="mb-3" controlId="privateKeyInputs">
          <Form.Check
            id='id'
            type="input"
            label=""
            key="id"
            placeholder="your private key"
          />
          <Button onClick={() => {
             alert('import')
          }}>import</Button>
        </Form.Group>
      </>
    )

    formInputs['phrase'] = (
      <>
        <b>phrase form</b>
        <Form.Group className="mb-3" controlId="privateKeyInputs">
          <Form.Check
            id='phrase'
            type="input"
            label=""
            key="id"
            placeholder="enter your phrase here"
          />
          <Button>new</Button>
        </Form.Group>
      </>
    )

    formInputs['keyStore'] = (
      <>
        <b>Key Store Form</b>

        <FloatingLabel
          controlId="floatingTextarea"
          label=""
          className="mb-3"
        >
          <Form.Control as="textarea" placeholder="Past keystore here" />
        </FloatingLabel>

      </>
    )
    //this.setState({ formInputs })

    const passwordInputs = (
      <>
        <Card border="primary" border-width="3px">
          <Card.Title className="h3 bold-tex">Password Inputs</Card.Title>
          <Form.Group>
            <Form.Label htmlFor="Password"> Password </Form.Label>
            <Form.Control
              type="password"
              name="password"
              id="password"
              placeholder="*******"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="examplePassword"> Password Check </Form.Label>
            <Form.Control
              type="password"
              name="passwordCheck"
              id="passwordCheck"
              placeholder="********"
            />
          </Form.Group>
          <Button>Submit</Button>
        </Card>
      </>
    )
    return (
      <>
        <Form className="form">
          <h1>Pages - Setup Page</h1>

          { this.state.keyOptions.map((option, index) => {
            return (
              <>
              <Form.Group className="mb-3" controlId={option.controlId}>
                <Form.Check
                  id={option.id}
                  type="checkbox"
                  label={option.label}
                  key={index}
                  onClick={(e) => {
                    //console.log(e.target.checked)
                    //alert(e.target.id)
                    if (e.target.checked) {
                      console.log(e)
                      this.state.keyOptions.map((option) => {
                        if (e.target.id !== option.id) {
                          //console.log(option.id)
                          document.getElementById(option.id).checked = false 
                        } else {
                        }
                      })
                      this.setState({ formInputShow: e.target.id })
                      this.setState({ setPassword: true })
                    }
                  }}
                />
              </Form.Group>
              </>
            )
          })}

          { (this.state.formInputShow) && formInputs[this.state.formInputShow] }
          { (this.state?.setPassword) && passwordInputs }

        </Form>
      </>
    )
  }
}
              //{ (this.state?.formInputs[option.id]) && formInputs[option.id] }
          //<h5>{ this.state.formInputShow && this.state.formInputs[this.state.formInputShow] }</h5>
