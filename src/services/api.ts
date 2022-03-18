import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  // httpsAgent: new https.Agent({  
  //   rejectUnauthorized: false
  // })
})

