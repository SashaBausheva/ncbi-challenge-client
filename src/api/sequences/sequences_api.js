import apiUrl from '../../apiConfig'
import axios from 'axios'

export const indexSequenceEntries = () => {
  return axios({
    url: apiUrl + '/sequences',
    method: 'GET'
  })
}
