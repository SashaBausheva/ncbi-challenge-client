import React from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const styles = {
  buttons: {
    margin: '1rem .2rem 0 .2rem',
    outline: 'none'
  },
  textfield: {
    margin: '.2rem',
    width: '100%'
  }
}

// these are passed from AddSequence
const SequenceForm = ({ sequence, handleSubmit, handleChange }) => (
  <form onSubmit={handleSubmit}>
    <Grid className="form-input" container>
      <Grid item xs={12}>
        <TextField
          required
          label="Name"
          style={ styles.textfield }
          value={sequence.sequenceName}
          name="sequenceName"
          onChange={handleChange}
        />

        <TextField
          required
          label="Description"
          style={ styles.textfield }
          value={sequence.sequenceDescription}
          name="sequenceDescription"
          onChange={handleChange}
        />

        <TextField
          required
          multiline={true}
          rows={10}
          label="Sequence"
          style={ styles.textfield }
          value={sequence.sequence}
          name="sequence"
          onChange={handleChange}
        />

        <Button variant="contained" color="primary" style={ styles.buttons } type="submit">Submit</Button>
      </Grid>
    </Grid>
  </form>
)

export default SequenceForm
