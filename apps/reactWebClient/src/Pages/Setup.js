import * as React from 'react'
//import Button from 'react-bootstrap/Button';
import {
  Button,
  Form,
  FormGroup,
} from 'react-bootstrap';
//import '../App.css';

export class Setup extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      errors: {},
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
    const passwordInputs = (
      <>
password inputs
            <Form.Group>
              <Form.Label htmlFor="exampleEmail">Username</Form.Label>
              <Form.Control
                type="email"
                name="email"
                id="exampleEmail"
                placeholder="example@example.com"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="examplePassword">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                id="examplePassword"
                placeholder="********"
              />
            </Form.Group>
            <Button>Submit</Button>
      </>
    )
    return (
      <>
        <Form className="form">
          <h1>Pages - Setup Page</h1>

          { this.state.keyOptions.map((option) => {
            return (
            <Form.Group className="mb-3" controlId={option.controlId}>
              <Form.Check
                id={option.id}
                type="checkbox"
                label={option.label}
                onClick={(e) => {
                  //console.log(e.target.checked)
                  //alert(e.target.id)
                  if (e.target.checked) {
                    this.state.keyOptions.map((option) => {
                      if (e.target.id !== option.id) {
                        //console.log(option.id)
                        document.getElementById(option.id).checked = false 
                      }
                    })
                  }
                }}
              />
            </Form.Group>
            )
          })}

          { (this.state?.setPassword) && passwordInputs }

        </Form>
      </>
    )
/*
        <Form className="form">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>

          <FormGroup>
            <Form.Label for="exampleEmail">Username</Form.Label>
            <Form.Input
              type="email"
              name="email"
              id="exampleEmail"
              placeholder="example@example.com"
            />
          </FormGroup>
          <FormGroup>
            <Form.Label for="examplePassword">Password</Form.Label>
            <Form.Input
              type="password"
              name="password"
              id="examplePassword"
              placeholder="********"
            />
          </FormGroup>
          <Button>Submit</Button>
        </Form>
      </>
    )
*/
  }
}
