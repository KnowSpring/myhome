import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css'
import './index.css';
import App from './App';
import axios from 'axios'

// 把axios对象绑定到了React组件的原型上，将来所有的react组件都能访问到axios对象
// 这里component首字母大写
React.Component.prototype.axios = axios
// 给axios对象配置默认全局路径
axios.defaults.baseURL = "http://localhost:9999/"
// 登录拦截，并每次请求除login外携带token
axios.interceptors.request.use(function(config){
  if(!window.location.href.endsWith('/login')){
    config.headers.Authorization = localStorage.getItem('token')
  }
  // console.log(config)
  return config
})


// 响应拦截器
axios.interceptors.response.use(function (response) {
  return response;
});

ReactDOM.render(<App />, document.getElementById('root'));


