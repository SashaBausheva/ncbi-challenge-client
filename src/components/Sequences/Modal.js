import React from 'react'
import { Link } from 'react-router-dom'

const Modal = ({ location }) => {
  const { state = {} } = location
  const { modal } = state
  return (
    <div className={modal ? 'modal' : undefined}>
      {modal && <Link to="/sequences">Close</Link>}
      <div>
        <img src="https://source.unsplash.com/random" />
      </div>
    </div>
  )
}

export default Modal
