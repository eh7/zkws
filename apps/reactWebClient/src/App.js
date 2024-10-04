import * as React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Peer from "./Lib/Peer"

import NavBar from "./Components/NavBar"

import { Home } from "./Pages/Home"
import { Config } from "./Pages/Config"
import { Setup } from "./Pages/Setup"

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      authed: false,
      setup: true,
    };
  }

  render() {
    const peer = new Peer()
    console.log('peer object: ', peer);
    console.log('peer test function: ', peer.test());

    if (this.state.setup) {
      return (
        <div className="App">
          <Setup />
        </div>
      )
    } else {
      return (
        <div className="App">
          <NavBar />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
            <Route path="/config" element={<Config />} />
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
