import * as React from 'react'

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
      <h1>Pages - Home Page</h1>
    );
  }
}
