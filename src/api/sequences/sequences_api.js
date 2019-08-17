import apiUrl from '../../apiConfig'
import axios from 'axios'

export const indexSequenceEntries = () => {
  return axios({
    url: apiUrl + '/sequences',
    method: 'GET'
  })
}

export const addSequenceEntry = (sequence) => {
  return axios({
    url: `${apiUrl}/sequences`,
    method: 'POST',
    data: { sequence: sequence }
  })
}
