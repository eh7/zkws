import * as React from 'react'

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
    return (
      <div>
        <NavBar />
        <Home />
        <Config />
      </div>
    );
  }
}
