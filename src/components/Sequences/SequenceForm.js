import React from 'react'
import { Link } from 'react-router-dom'

const SequenceForm = ({ sequence, handleSubmit, handleChange, cancelPath }) => (
  <form onSubmit={handleSubmit}>
    <label>Name</label>
    <input
      required
      placeholder="Sequence Name"
      value={sequence.sequenceName}
      name="sequenceName"
      onChange={handleChange}
    />

    <label>Description</label>
    <input
      required
      placeholder="Description"
      value={sequence.sequenceDescription}
      name="sequenceDescription"
      onChange={handleChange}
    />

    <label>Sequence</label>
    <input
      required
      placeholder="Sequence"
      value={sequence.sequence}
      name="sequence"
      onChange={handleChange}
    />

    <button type="submit">Submit</button>
    <Link to={cancelPath}>
      <button>Cancel</button>
    </Link>
  </form>
)

export default SequenceForm
