import React from 'react'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'
import '../../index.scss'

// just a simple home page!

const Home = () => (
  <div className="home-component">
    <Container>
      <h4>Welcome to the brand new, state of the art UI visualizing the DNA sequence data from the National Center for Biotechnology Information (NCBI)!</h4>
      <h5>...well, almost.</h5>
      <br/>
      <img src="./dna-sequence.gif" height="300px"/>
      <br/>
      <br/>
      <h5>You can <Link to={'/sequences'}>view all database sequences</Link> or <Link to={'/add-sequence'}>add a sequence</Link> manually.</h5>
    </Container>
  </div>
)

export default Home
