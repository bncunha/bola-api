const axios = require('axios')
async function ping() {
  axios.get('https://bolao-staging.herokuapp.com/teste').then();
  axios.get('https://bolao-prod.herokuapp.com/teste').then();
}

ping();