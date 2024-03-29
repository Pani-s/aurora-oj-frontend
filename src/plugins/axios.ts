// Add a request interceptor

import axios from "axios";

axios.defaults.withCredentials = true;
//事实证明我们加了这个也不能覆盖掉OPENAPI的配置，所以目前还是要手动去改那边的值

axios.interceptors.request.use(
  function (config: any) {
    // Do something before request is sent
    return config;
  },
  function (error: any) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response: any) {
    console.log("响应", response);
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error: any) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
