import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { withSnackbar } from 'notistack'

import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

import SequenceForm from './SequenceForm'
import { addSequenceEntry } from '../../api/sequences/sequences_api'
import messages from './messages'

const styles = {
  paper: {
    maxWidth: '600px',
    padding: '2rem',
    margin: '2rem auto'
  }
}

class AddSequence extends Component {
  constructor (props) {
    super(props)

    this.state = {
      sequence: {
        sequenceName: '',
        sequenceDescription: '',
        sequence: ''
      },
      createdSequenceId: null
    }
  }

  handleChange = event => {
    // keep track of every single change in the fields and update state
    const updatedField = { [event.target.name]: event.target.value }
    const editedSequence = Object.assign(this.state.sequence, updatedField)
    this.setState({ sequence: editedSequence })
  }

  handleSubmit = event => {
    event.preventDefault()
    const { enqueueSnackbar } = this.props

    // when submitted, trigger axios POST request and success/fail message
    addSequenceEntry(this.state.sequence)
      .then(res => this.setState({ createdSequenceId: res.data.sequence._id }))
      .then(() => enqueueSnackbar(messages.addSequenceSuccess, { variant: 'success' }))
      .catch(() => { enqueueSnackbar(messages.addSequenceFailure, { variant: 'error' }) })
  }

  render () {
    const { handleChange, handleSubmit } = this
    const { createdSequenceId, sequence } = this.state
    console.log('created seq id', createdSequenceId)

    if (createdSequenceId) {
      // keep track of created sequence ID to redirect to sequences page
      return <Redirect to={'/sequences'} />
    }

    return (
      // pass handleSubmit, handleChange, and sequence from here to SequenceForm
      <div style={{ marginTop: '2rem' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper style={ styles.paper }>
              <SequenceForm
                sequence={sequence}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withSnackbar(AddSequence)
