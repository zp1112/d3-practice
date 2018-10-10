import React from "react";

const MyContext = React.createContext();

class MyProvider extends React.Component {
  state = {
    text: 1,
  }

  updateText = () => this.setState({ text: this.state.text + 1 })

  render () {
    return (
      <MyContext.Provider value={{...this.state, updateText: this.updateText}}>
        <React.Fragment>
            {this.props.children}
            <button onClick={this.updateText}>click</button>
        </React.Fragment>
      </MyContext.Provider>
    )
  }
}

class Person extends React.Component {
  render () {
    return (
      <MyContext.Consumer>
        {context => (<React.Fragment><div>this is {context.text}</div>
            <button onClick={context.updateText}>click</button></React.Fragment>)}
      </MyContext.Consumer>
    )
  }
}

export default class Demo extends React.Component {
  render() {
    return (
      <MyProvider>
        <Person />
      </MyProvider>
      )
    }
}