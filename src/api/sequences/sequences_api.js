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

export const addSequencesFromFile = (jsonFile) => {
  return axios({
    url: `${apiUrl}/upload`,
    method: 'POST',
    data: { sequences: jsonFile.sequences }
  })
}
