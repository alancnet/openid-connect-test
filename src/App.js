import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import {getConfig, getLoginUrl, decodeQuery, getToken, getUserInfo, getAccountUrl} from './util'
import jwtDecode from 'jwt-decode'

class App extends Component {
  constructor() {
    super()
    this.state = {
      config: ''
    }
  }
  componentWillMount() {
    const set = (key) => (val) => this.setState({[key]: val})
    getConfig().then(set('config'))
    getLoginUrl().then(set('loginUrl'))
    getAccountUrl().then(set('accountUrl'))
    const search = decodeQuery(window.location.search)
    const hash = decodeQuery(window.location.hash)
    if (hash.error) {
      this.setState({
        error: {
          response: search.error,
          message: hash.error,
          description: hash.error_description
        }
      })
    }

    if (hash.access_token) {
      this.setState({
        tokenInfo: hash
      })
      this.setState({
        token: jwtDecode(hash.access_token)
      })

      getUserInfo(hash.access_token).then(set('userInfo'))

    }
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
          <a href={this.state.loginUrl}>Login</a> | 
          <a href={this.state.accountUrl}>Account</a>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {this.state.error ? <div>
          <h3>{this.state.error.response}</h3>
          <h4>{this.state.error.message}</h4>
          <p>{this.state.error.description}</p>
        </div> : null}
        <pre>
          {JSON.stringify(this.state.tokenInfo, null, 2)}
        </pre>
        <pre>
          {JSON.stringify(this.state.userInfo, null, 2)}
        </pre>
        <pre>
          {JSON.stringify(this.state.token, null, 2)}
        </pre>
        <pre>
          {JSON.stringify(this.state.config, null, 2)}
        </pre>
      </div>
    )
  }
}

export default App;
