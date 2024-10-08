import * as React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Peer from "./Lib/Peer"

import NavBar from "./Components/NavBar"

import { Home } from "./Pages/Home"
import { Files } from "./Pages/Files"
import { Config } from "./Pages/Config"
import { Setup } from "./Pages/Setup"

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      authed: false,
      setup: true,
      address: null,
    };
  }

  componentDidMount = async () => {
    //alert('componentDidMount :: ' + this.state.address)
  }

  componentDidUpdate = async () => {
    console.log(this.state)
    //alert('componentDidUpdate :: ' + this.state.address)
  }

  handleUpdateAddress = (_address) => {
    this.setState({ address: _address })
  } 

  render() {
    const peer = new Peer()
    console.log('peer object: ', peer);
    console.log('peer test function: ', peer.test());

/*
      return (
        <div className="App">
          { (!this.state.address) ?
            <Setup handleUpdateAddress={ this.handleUpdateAddress }/> : (
            <NavBar />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
              <Route path="/config" element={<Config />} />
              </Routes>
            </BrowserRouter>
          )}
        </div>
      )
*/

    return (
      <div className="App">
        <NavBar />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/files" element={<Files />} />
            <Route path="/config" element={<Setup action="reset" handleUpdateAddress={ this.handleUpdateAddress } />} />
          </Routes>
        </BrowserRouter>
      </div>
    )

    //if (this.state.setup) {
    if (!this.state.address) {
      return (
        <div className="App">
          {/*
          <Setup handleUpdateAddress={ this.handleUpdateAddress }/>
          */}
          Loading...
        </div>
      )
    } else {
      return (
        <div className="App">
          <NavBar />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/files" element={<Files />} />
              <Route path="/config" element={<Setup action="reset" handleUpdateAddress={ this.handleUpdateAddress } />} />
            </Routes>
          </BrowserRouter>
        </div>
      )

//          <NavBar />
//          <Home />
//          <Config />
//          <Setup />
    }
  }
}
