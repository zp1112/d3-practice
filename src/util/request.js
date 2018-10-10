import axios from "axios";
// import loading from '@/utils/loading';
import { message } from "antd";
import history from "./history";

axios.defaults.withCredentials = true;

// create an axios instance
const service = axios.create({
    baseURL:
        process.env.NODE_ENV === "dev"
            ? "https://xxx.com"
            : "https://xxx.com", // api的base_url
    timeout: 20000, // request timeout
});

// // request interceptor
service.interceptors.request.use(
  config => {
    // loading.show(config);
    config.headers.token = localStorage.getItem('token')
    return config;
  },
  error => {
    // Do something with request error
    // console.log(error) // for debug
    Promise.reject(error);
  }
);

// respone interceptor
service.interceptors.response.use(
    response => {
        // loading.hide(response.config);
        const res = response.data;
        if (res.code === 1027) {
            message.error('登陆超时');
            history.replace('/user/login');
        } else if (res.code !== 200) {
            message.error(res.message);
            return Promise.reject(res.message);
        } else {
            return response.data;
        }
    },
    error => {
        // loading.hide(error.config);
        if (error.response && error.response.status === 401) {
            if (error.config.url.indexOf("logout") === -1) {
                message.error("登陆信息已过期,请重新登陆!");
            }
            setTimeout(() => {
                history.push("/user/login");
            }, 1000);
        } else if (error.response && error.response.status === 500) {
            message.error("系统错误!");
        } else if (error.message && error.message.indexOf("timeout") > -1) {
            message.error("网络超时!");
        } else if (error === "403") {
            message.error("没有请求权限!");
        } else {
            message.error("网络错误!");
        }
        return Promise.reject(error);
    }
);

export default service;
