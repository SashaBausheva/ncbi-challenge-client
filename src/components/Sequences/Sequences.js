import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'

import { indexSequenceEntries } from '../../api/sequences/sequences_api'

import { render, ReactDOM } from 'react-dom'
import Modal from 'react-modal'
import _ from 'lodash'

// Import React Table
import ReactTable from 'react-table'
import 'react-table/react-table.css'

// const rawData = makeData()

// const requestData = (pageSize, page, sorted, filtered) => {
//   return new Promise((resolve, reject) => {
//     // You can retrieve your data however you want, in this case, we will just use some local data.
//     let filteredData = rawData
//
//     // You can use the filters in your request, but you are responsible for applying them.
//     if (filtered.length) {
//       filteredData = filtered.reduce((filteredSoFar, nextFilter) => {
//         return filteredSoFar.filter(row => {
//           return (row[nextFilter.id] + '').includes(nextFilter.value);
//         })
//       }, filteredData)
//     }
//     // You can also use the sorting in your request, but again, you are responsible for applying it.
//     const sortedData = _.orderBy(
//       filteredData,
//       sorted.map(sort => {
//         return row => {
//           if (row[sort.id] === null || row[sort.id] === undefined) {
//             return -Infinity
//           }
//           return typeof row[sort.id] === 'string'
//             ? row[sort.id].toLowerCase()
//             : row[sort.id]
//         }
//       }),
//       sorted.map(d => (d.desc ? 'desc' : 'asc'))
//     )
//
//     // You must return an object containing the rows of the current page, and optionally the total pages number.
//     const res = {
//       rows: sortedData.slice(pageSize * page, pageSize * page + pageSize),
//       pages: Math.ceil(filteredData.length / pageSize)
//     }
//
//     // Here we'll simulate a server response with 500ms of delay.
//     setTimeout(() => resolve(res), 500)
//   })
// }

class Sequences extends Component {
  constructor () {
    super()
    this.state = {
      data: [],
      pages: null,
      loading: true
    }
    this.fetchData = this.fetchData.bind(this)
  }

  requestData = (pageSize, page, sorted, filtered) => {
    return new Promise((resolve, reject) => {
      // You can retrieve your data however you want, in this case, we will just use some local data.

      indexSequenceEntries()
        .then((response) => {
          let filteredData = response.data.sequences
          console.log('filtered data is ', filteredData)

          // You can use the filters in your request, but you are responsible for applying them.
          if (filtered.length) {
            console.log('fil length', filtered)
            filteredData = filtered.reduce((filteredSoFar, nextFilter) => {
              console.log('so far', filteredSoFar, 'next', nextFilter)
              return filteredSoFar.filter(row => {
                return ((row[nextFilter.id]).toLowerCase() + '').includes((nextFilter.value).toLowerCase())
              })
            }, filteredData)
          }
          // You can also use the sorting in your request, but again, you are responsible for applying it.
          const sortedData = _.orderBy(
            filteredData,
            sorted.map(sort => {
              console.log('sorted is', sorted)
              return row => {
                if (row[sort.id] === null || row[sort.id] === undefined) {
                  return -Infinity
                }
                return typeof row[sort.id] === 'string'
                  ? row[sort.id].toLowerCase()
                  : row[sort.id]
              }
            }),
            sorted.map(d => (d.desc ? 'desc' : 'asc'))
          )

          console.log('sored data ', sortedData)

          console.log('filtered', filtered)

          // You must return an object containing the rows of the current page, and optionally the total pages number.
          const res = {
            rows: sortedData.slice(pageSize * page, pageSize * page + pageSize),
            pages: Math.ceil(filteredData.length / pageSize)
          }

          // Here we'll simulate a server response with 500ms of delay.
          setTimeout(() => resolve(res), 500)
        })
        .catch((error) => {
          console.log(error)
        })
    })
  }

  fetchData (state, instance) {
    // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
    // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
    this.setState({ loading: true })
    // Request the data however you want.  Here, we'll use our mocked service we created earlier
    this.requestData(
      state.pageSize,
      state.page,
      state.sorted,
      state.filtered
    ).then(res => {
      console.log('fetch dta state ', state)
      // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
      this.setState({
        data: res.rows,
        pages: res.pages,
        loading: false
      })
    })
  }

  render () {
    const { data, pages, loading } = this.state
    console.log('state is ', this.state)
    console.log(data)
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
              id: 'sequenceDescription',
              accessor: d => d.sequenceDescription
            },
            {
              Header: 'Sequence',
              accessor: 'sequence',
              Cell: ({ row }) => (
                <Link to={{
                  pathname: '/sequences/:id',
                  state: { modal: true }
                }}
                className="link">
                  {row.sequence}
                </Link>
              ) }
          ]}
          // manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          data={data}
          pages={pages} // Display the total number of pages
          loading={loading} // Display the loading overlay when we need it
          onFetchData={this.fetchData} // Request new data when things change
          filterable
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />
      </div>
    )
  }
}

render(<Sequences />, document.getElementById('root'))

export default withRouter(Sequences)
