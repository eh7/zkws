import * as React from 'react'

import Peer from "./Lib/Peer"

import NavBar from "./Components/NavBar"

import { Home } from "./Pages/Home"
import { Config } from "./Pages/Config"

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      authed: false,
    };
  }

  render() {
    const peer = new Peer()
    console.log('peer object: ', peer);
    console.log('peer test function: ', peer.test());
    return (
      <div>
        <NavBar />
        <Home />
        <Config />
      </div>
    );
  }
}
