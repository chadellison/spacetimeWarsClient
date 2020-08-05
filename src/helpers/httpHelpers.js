export const getData

import { API_HOST } from '../api/index.js';
//
// const HEADERS = {
//   'Accept': 'application/json, text/plain, */*',
//   'Content-Type': 'application/json'
// }

export const getData = async (path, action) => {
  try {
    const response = await fetch(`${API_HOST}${path}`, {
      method: 'GET',
      headers: HEADERS
    })
    const data = await response.json()
    return data
  } catch(error) {
    return error
  }
}

export const postData = async (path, body) => {
  const response = await fetch(`${API_HOST}${path}`, {
    method: 'POST',
    headers: HEADERS,
    body: body
  })
  const data = await response.json()
  return data
}
