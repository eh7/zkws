import * as React from 'react'
//import { Home } from "./Pages/Home";

export class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      errors: {},
      input: {},
    };
  }

  render() {
    return (
      <h1>Home Page</h1>
    );
  }
}


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
        <Home />
      </div>
    );
  }
}

/*
export function App() {
  return <h1>Hello world! Not</h1>;
}
*/
