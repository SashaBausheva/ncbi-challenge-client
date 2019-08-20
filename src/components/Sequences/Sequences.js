import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { withSnackbar } from 'notistack'
import { saveAs } from 'file-saver'
import Modal from 'react-modal'
import _ from 'lodash'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import { indexSequenceEntries, addSequencesFromFile } from '../../api/sequences/sequences_api'
import messages from './messages'
import '../../index.scss'

Modal.setAppElement(document.getElementById('root'))

const styles = {
  paper: {
    padding: '2rem',
    margin: '2rem'
  },
  box: {
    backgroundColor: '#f5f5fc',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'row',
    height: '55vh',
    borderRadius: '10px'
  }
}

// Modal styles
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

class Sequences extends Component {
  constructor () {
    super()
    this.state = {
      data: [],
      pages: null,
      loading: true,
      // modal is closed unless triggered
      modalOpen: false,
      // and its content is empty unless otherwise stated
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
    // update state when modal is open
    if (!this.state.modalOpen) {
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
    // might implement features in the future
  }

  closeModal () {
    // update state when modal is closed
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
      const { enqueueSnackbar } = this.props

      // Retrieve data using axios GET request
      indexSequenceEntries()
        .then((response) => {
          let filteredData = response.data.sequences
          // keep filtering until you reach the end of the array
          if (filtered.length) {
            filteredData = filtered.reduce((filteredSoFar, nextFilter) => {
              // ensure filtering is case-insensitive
              return filteredSoFar.filter(row => {
                return ((row[nextFilter.id] + '').toLowerCase()).includes((nextFilter.value).toLowerCase())
              })
            }, filteredData)
          }

          // take filtered data and use lodash to order it
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
            // make it ascenfing unless descending is specified
            sorted.map(d => (d.desc ? 'desc' : 'asc'))
          )
          // finally, return number of pages and rows
          const res = {
            rows: sortedData.slice(pageSize * page, pageSize * page + pageSize),
            pages: Math.ceil(filteredData.length / pageSize)
          }
          setTimeout(() => resolve(res), 500)
        })
        .catch(() => {
          // alert if something went wrong (e.g. GET request failed)
          enqueueSnackbar(messages.loadSequencesFailure, { variant: 'error' })
        })
    })
  }

  fetchData (state, instance) {
    // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
    this.setState({ loading: true })
    this.requestData(
      state.pageSize,
      state.page,
      state.sorted,
      state.filtered
    ).then(res => {
      // Now just get the rows of data to React Table (and update anything else like total pages or loading)
      this.setState({
        data: res.rows,
        pages: res.pages,
        loading: false
      })
    })
  }

  // this should be a simpler customFilter; however right now the table is using
  // the filter above. I kept it  here to work with it later
  filterCaseInsensitive (filter, row) {
    const id = filter.pivotId || filter.id
    return (
      row[id] !== undefined
        ? String(row[id].toLowerCase()).includes(filter.value.toLowerCase())
        : true)
  }

  // break sequence strings into arrays to be able to assign letter color
  renderLetter (sequence) {
    const array = sequence.split('')
    return array
  }

  // GET all sequence entries, create a blob, and use saveAs to trigger download
  downloadJson () {
    indexSequenceEntries()
      .then((response) => {
        const sequences = JSON.stringify(response.data)
        const blob = new Blob([sequences], { type: 'text/plain;charset=utf-8' })
        saveAs(blob, new Date() + '-DNA-json.json')
      })
  }

  // when there's a change in the upload form (JSON file selected), fire upload
  onChange = (event) => {
    const reader = new FileReader()
    reader.onload = this.onReaderLoad
    reader.readAsText(event.target.files[0])
  }

  onReaderLoad = (event) => {
    const { enqueueSnackbar } = this.props
    const obj = JSON.parse(event.target.result)
    addSequencesFromFile(obj)
      .then(
        // when POST is successful, refresh the table
        () => this.refReactTable.fireFetchData(),
        document.getElementById('sequence_file').reset())
      .catch(() => {
        // alert if failed
        enqueueSnackbar(messages.uploadSequencesFailure, { variant: 'error' })
      })
  }

  render () {
    return (
      <div>
        <ReactTable
          style={{ marginTop: '3rem' }}
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
          ref={(refReactTable) => { this.refReactTable = refReactTable }}
        />
        <br />

        <form onSubmit={this.handleSubmit} id="sequence_file" encType="multipart/form-data">
          <Grid
            justify="space-between"
            container
          >
            <Grid item>
              <Button style={{ outline: 'none' }} onClick={this.downloadJson} color="primary" variant="contained">Download Table</Button>
            </Grid>
            <Grid item>
              <Button color="primary" style={{ outline: 'none' }}><span style={{ marginRight: '1rem' }}>Upload JSON file</span><input type="file" name="file" onChange={this.onChange}/></Button>
            </Grid>
          </Grid>
        </form>

        <Modal
          styles={customStyles}
          isOpen={this.state.modalOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
        >
          <div className="text-right"><Button style={{ alignItems: 'right', outline: 'none' }} color="primary" onClick={this.closeModal}>close</Button></div>
          {this.state.modalContent.sequence ? <div className="sequence-info">
            <div><h5>Name:</h5> <div style={{ marginBottom: '.5rem' }}>{this.state.modalContent.sequenceName}</div></div>
            <div><h5>Description:</h5> <div style={{ marginBottom: '.5rem' }}>{this.state.modalContent.sequenceDescription}</div></div>
            <div><h5>Sequence:</h5></div>
            <Box style={styles.box}>
              <div className="full-sequence">
                {(this.renderLetter(this.state.modalContent.sequence)).map((letter, index) => {
                  switch (letter) {
                  case 'A':
                    return <span style={{ color: 'blue' }} key={index}>{letter}</span>
                  case 'T':
                    return <span style={{ color: 'orange' }} key={index}>{letter}</span>
                  case 'C':
                    return <span style={{ color: 'red' }} key={index}>{letter}</span>
                  default:
                    return <span style={{ color: 'green' }} key={index}>{letter}</span>
                  }
                }) } </div>
            </Box>
          </div> : '' }
        </Modal>
      </div>
    )
  }
}
export default withSnackbar(withRouter(Sequences))
