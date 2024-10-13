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
  Modal,
} from 'react-bootstrap'

import Wallet from '../services/wallet'
import Sync from '../services/sync'

export default class InitialSettup extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      errors: {},
      input: {},
      showInitialSetup: false,
    }
  }

  handleClose = () => this.setState({ showInitialSetup: false })

  handleShow = () => this.setState({ showInitialSetup: true })

  componentDidMount = async () => {
    try {
      this.sync = new Sync()
      this.wallet = new Wallet()
      this.wallet.getNewPhrase(false)
      this.address = await this.wallet.getAddress()
      this.privateKey = await this.wallet.getPrivateKey()
      this.setState({
        address: this.address,
      })
      this.setState({ showInitialSetup: false })
    } catch (e) {
      console.error('ERROR :: InitialSetup :: componentDidMount :: ', e)
    }
  }

  render() {
    return (
      <Container className="m-2">
        <Row>
          <Col>

            <Modal
              show={this.state.showInitialSetup}
              onHide={this.handleClose}
              backdrop="static"
              keyboard={false}
              {...this.props}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>InitialSetup Modal</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p>Please enter a secret phrase and password or just use a select the type of data to import.....</p>
                <Form>
                  <Form.Group className="mb-3" controlId="initForm.ControlInputPAssword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      id="password"
                      type="password"
                      placeholder="enter password here"
                      autoFocus
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="initForm.ControlInputPasswordCheck">
                    <Form.Label>Password Check</Form.Label>
                    <Form.Control
                      id="passwordCheck"
                      type="password"
                      placeholder="enter password check here"
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="initForm.ControlTextareaPhrase"
                  >
                    <Form.Label>Example textarea</Form.Label>
                    <Form.Control id="phrase"  as="textarea" rows={3} />
                  </Form.Group>
                </Form>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                <Button variant="primary" onClick={this.handleClose}>Save changes</Button>
              </Modal.Footer>
            </Modal>

          </Col>
        </Row>
      </Container>
    )
  }
}
