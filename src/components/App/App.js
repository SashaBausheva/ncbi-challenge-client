import React, { Component, Fragment } from 'react'
import { Route } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'

import AutoDismissAlert from '../AutoDismissAlert/AutoDismissAlert'
import Header from '../Header/Header'

import Sequences from '../Sequences/Sequences'
import AddSequence from '../Sequences/AddSequence'

class App extends Component {
  constructor () {
    super()

    this.state = {
      user: null,
      alerts: []
    }
  }

  setUser = user => this.setState({ user })

  clearUser = () => this.setState({ user: null })

  alert = ({ heading, message, variant }) => {
    this.setState({ alerts: [...this.state.alerts, { heading, message, variant }] })
  }

  render () {
    const { alerts, user } = this.state

    return (
      <Fragment>
        <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
          <Header user={user} />
          {alerts.map((alert, index) => (
            <AutoDismissAlert
              key={index}
              heading={alert.heading}
              variant={alert.variant}
              message={alert.message}
            />
          ))}
          <main className="container">
            <Route path='/sequences' render={() => (
              <Sequences alert={this.alert} />
            )} />
            <Route path='/add-sequence' render={() => (
              <AddSequence alert={this.alert} />
            )} />
          </main>
        </SnackbarProvider>
      </Fragment>
    )
  }
}

export default App
