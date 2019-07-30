import Vue from "vue";
import axios from "axios";
import router from "@/router";
import Util from "@/util";
import merge from "lodash.merge";
import qs from "qs";

const ajaxUrl =
  process.env.NODE_ENV === "production"
    ? 'http://localhost:3000'
    : process.env.NODE_ENV === "development"
    // ? 'http://localhost:8001'
    ? 'http://localhost:3000'
    : '/ms';
  

const baseUrl = ajaxUrl;

Vue.prototype.BASE_URL = baseUrl;

const http = axios.create({
  timeout: 1000 * 10,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json; charset=utf-8"
  }
});

/**
 * 请求拦截
 */
http.interceptors.request.use(
  config => {
    config.headers["Authorization"] = "Bearer " + Util.getToken(); // 请求头带上token
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截
 */
http.interceptors.response.use(
  response => {
    if (response.data && response.data.code === 401) {
      // 401, token失效
      Util.clearLoginInfo();
      router.push({ name: "login" });
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = actionName => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (
    (process.env.NODE_ENV !== "production" && process.env.OPEN_PROXY
      ? "/proxyApi/"
      : baseUrl) + actionName
  );
};

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    t: new Date().getTime()
  };
  return openDefultParams ? merge(defaults, params) : params;
};

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = "json") => {
  var defaults = {
    t: new Date().getTime()
  };
  data = openDefultdata ? merge(defaults, data) : data;
  return contentType === "json" ? JSON.stringify(data) : qs.stringify(data);
};

export default http;
