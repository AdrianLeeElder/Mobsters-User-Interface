import axios from 'axios'
import Vue from "vue"

const client = axios.create({
  baseURL: `http://localhost:8080`
})

const apiVersion = "/api/v1/"
const mobstersApi = apiVersion + "mobsters"
const actionJobsApi = apiVersion + "action-jobs"
const actionTemplatesApi = apiVersion + "action-templates"
const actionConfigApi = apiVersion + "action-configs"

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
    })
    .then(response => {
      return response.data
    }).catch(error => {
      return error.response;
    }) 
  },
  getMobsters (number) {
    return this.execute('get', mobstersApi + `?pageNumber=${number}`)
  },
  getMobsters () {
    return this.execute('get', mobstersApi + `/all`)
  },
  getTotalMobsterPages() {
    return this.execute('get', mobstersApi + '/total-pages')
  },
  /**
   * Show action jobs for the given mobster, and the limit.
   */
  getActionJobs(mobsterId, pageNumber, pageSize) {
    return this.execute('get', actionJobsApi + '/mobster/' + mobsterId + '/' + pageNumber + '/' + pageSize)
  },
  getActionJobStatistics(template) {
    return this.execute('get', actionJobsApi + '/statistics/' + template);
  },
  getActionTemplates() {
    return this.execute('get', actionTemplatesApi);
  },
  saveActionTemplate(template) {
    return this.execute('post', actionTemplatesApi, template);
  },
  deleteActionTemplate(id) {
    return this.execute('delete', actionTemplatesApi + '/' + id);
  },
  getActionConfigs() {
    return this.execute('get', actionConfigApi)
  }
}