import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { addSequenceEntry } from '../../api/sequences/sequences_api'
import messages from './messages'
import { withSnackbar } from 'notistack'

import SequenceForm from './SequenceForm'

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
    const updatedField = { [event.target.name]: event.target.value }

    const editedSequence = Object.assign(this.state.sequence, updatedField)

    this.setState({ sequence: editedSequence })
  }

  handleSubmit = event => {
    event.preventDefault()
    const { enqueueSnackbar } = this.props

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
      return <Redirect to={'/sequences'} />
    }

    return (
      <div>
        <SequenceForm
          sequence={sequence}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          cancelPath={'/sequences'}
        />
      </div>
    )
  }
}

export default withSnackbar(AddSequence)
