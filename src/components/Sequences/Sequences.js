import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { withSnackbar } from 'notistack'
import messages from './messages'

import { indexSequenceEntries } from '../../api/sequences/sequences_api'
import '../../index.scss'

import { render } from 'react-dom'
import Modal from 'react-modal'
import _ from 'lodash'

// Import React Table
import ReactTable from 'react-table'
import 'react-table/react-table.css'

Modal.setAppElement(document.getElementById('root'))

class Sequences extends Component {
  constructor () {
    super()
    this.state = {
      data: [],
      pages: null,
      loading: true,
      modalOpen: false,
      modalContent: {
        sequenceName: '',
        sequenceDescription: '',
        sequence: ''
      }
    }
    this.fetchData = this.fetchData.bind(this)
    this.openModal = this.openModal.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal (row) {
    if (!this.state.modalOpen) {
      console.log('this is row', row)
      this.setState({
        modalContent: {
          sequenceName: row._original.sequenceName,
          sequenceDescription: row._original.sequenceDescription,
          sequence: row._original.sequence
        },
        modalOpen: true
      })
    }
  }

  afterOpenModal () {
  // references are now sync'd and can be accessed.
  }

  closeModal () {
    if (this.state.modalOpen) {
      this.setState({
        modalContent: {
          row: {
            sequenceName: '',
            sequenceDescription: '',
            sequence: ''
          }
        },
        modalOpen: false
      })
    }
  }

  requestData = (pageSize, page, sorted, filtered) => {
    return new Promise((resolve, reject) => {
      // You can retrieve your data however you want, in this case, we will just use some local data.
      const { enqueueSnackbar } = this.props

      indexSequenceEntries()
        .then((response) => {
          const filteredData = response.data.sequences

          // You can also use the sorting in your request, but again, you are responsible for applying it.
          const sortedData = _.orderBy(
            filteredData,
            sorted.map(sort => {
              return row => {
                if (row[sort.id] === null || row[sort.id] === undefined) {
                  return -Infinity
                }
                return typeof row[sort.id] === 'string'
                  ? row[sort.id].toLowerCase()
                  : row[sort.id].toLowerCase()
              }
            }),
            sorted.map(d => (d.desc ? 'desc' : 'asc'))
          )

          console.log('sorted data is ', sortedData)
          // You must return an object containing the rows of the current page, and optionally the total pages number.
          const res = {
            rows: sortedData.slice(pageSize * page, pageSize * page + pageSize),
            pages: Math.ceil(filteredData.length / pageSize)
          }

          console.log('res is ', res)
          console.log('filtered data is ', filteredData)

          // Here we'll simulate a server response with 500ms of delay.
          setTimeout(() => resolve(res), 500)
        })
        .catch(() => {
          enqueueSnackbar(messages.loadSequencesFailure, { variant: 'error' })
        })
    })
  }

  fetchData (state, instance) {
    // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
    // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
    this.setState({ loading: true })
    console.log('state page is ', state.page)
    // Request the data however you want.  Here, we'll use our mocked service we created earlier
    this.requestData(
      state.pageSize,
      state.page,
      state.sorted,
      state.filtered
    ).then(res => {
      // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
      this.setState({
        data: res.rows,
        pages: res.pages,
        loading: false
      })
      console.log('request data just ran')
    })
  }

  filterCaseInsensitive (filter, row) {
    const id = filter.pivotId || filter.id
    return (
      row[id] !== undefined
        ? String(row[id].toLowerCase()).includes(filter.value.toLowerCase())
        : true)
  }

  renderLetter (sequence) {
    const array = sequence.split('')
    return array
  }

  render () {
    console.log('this state is ', this.state)
    console.log('at first', this.state.modalContent)
    return (
      <div>
        <ReactTable
          columns={[
            {
              Header: 'Name',
              accessor: 'sequenceName'
            },
            {
              Header: 'Description',
              accessor: 'sequenceDescription'
            },
            {
              Header: 'Sequence',
              accessor: 'sequence',
              Cell: ({ row }) => (
                <span className="sequence-link" onClick= { () => this.openModal(row) }>{row.sequence}</span>
              ) }
          ]}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          data={this.state.data}
          pages={this.state.pages} // Display the total number of pages
          loading={this.state.loading} // Display the loading overlay when we need it
          onFetchData={this.fetchData} // Request new data when things change
          filterable
          defaultFilterMethod={(filter, row) => this.filterCaseInsensitive(filter, row) }
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />

        <Modal
          isOpen={this.state.modalOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
        >
          {this.state.modalContent.sequence ? <div><h2>Sequence Info</h2>
            <button onClick={this.closeModal}>close</button>
            <div>Name: {this.state.modalContent.sequenceName}</div>
            <div>Description: {this.state.modalContent.sequenceDescription}</div>
            <div>Sequence:</div>
            <div className="full-sequence">
              {(this.renderLetter(this.state.modalContent.sequence)).map((letter, index) => {
                switch (letter) {
                case 'A':
                  return <span style={{ color: 'red' }} key={index}>{letter}</span>
                case 'T':
                  return <span style={{ color: 'orange' }} key={index}>{letter}</span>
                case 'C':
                  return <span style={{ color: 'blue' }} key={index}>{letter}</span>
                default:
                  return <span style={{ color: 'green' }} key={index}>{letter}</span>
                }
              }) } </div>
          </div> : '' }
        </Modal>
      </div>
    )
  }
}

render(<Sequences />, document.getElementById('root'))

export default withSnackbar(withRouter(Sequences))
