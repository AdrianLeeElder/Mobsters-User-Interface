import axios from 'axios'
import Vue from "vue"

const client = axios.create({
  baseURL: `http://localhost:8050`,
  headers: {
    'Access-Control-Allow-Origin': 'http://localhost:8080'
  }
})

const apiVersion = "/api/v1/"
const mobstersApi = apiVersion + "mobsters"

export default {
  async execute (method, resource, data) {
    // inject the accessToken for each request
    let accessToken = await Vue.prototype.$auth.getAccessToken()
    return client({
      method,
      url: resource,
      data,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(req => {
      return req.data
    })
  },
  getMobsters (number) {
    return this.execute('get', mobstersApi + `?pageNumber=${number}`)
  },
  getTotalMobsterPages() {
    return this.execute('get', mobstersApi + '/total-pages')
  }
}