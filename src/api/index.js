import axios from 'axios'
import PubSub from "pubsub-js"
// 请求超时时间
axios.defaults.timeout = 10000;
// post的请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 配置请求拦截器
axios.interceptors.request.use((config)=>{
    return config;
}, (error)=>{
    return Promise.error(error);
});

// 配置响应拦截器
axios.interceptors.response.use((response)=>{
    // 过滤
    if(response.status === 200){
        return Promise.resolve(response.data);
    }else {
        return Promise.reject(response.data);
    }

}, (error)=>{
    console.log(error);
});

export  default function ajax(url = '', params = {}, type = 'GET') {
    // 0. 变量
     let promise;

    // 1. 返回promise
    return new Promise((resolve, reject)=>{
         // 1.1 判断请求的类型
        if(type.toUpperCase() === 'GET'){ // get请求
            params["randomCode"] = randomCode(20);
            promise = axios({
                url,
                params
            })
        }else if(type.toUpperCase() === 'POST'){ // post请求
            promise = axios({
                method: 'post',
                url,
                data: params
            })
        }
        //  1.2 处理结果并返回
        promise.then((response)=>{
            // resolve(response);
              // console.log(response);  // 这个response就是服务器响应的结果
              if(response.status === 2){
                // 没有权限访问，说明身份已过期
                PubSub.publish("shenfenover")
            }else{
                resolve(response);
            }
        }).catch((error)=>{
            reject(error);
        })
    });
}
// 此方法是为了生成一个随机数，目的是为了不让走缓存
function randomCode(length){
    let arr = ["0","1","2","3","4","5","6","7","8","9"]
    let str = ""; 
    for(let i=0; i<length; i++){  // floor
        let index = Math.ceil(Math.random()*9); // 0~9
        str += arr[index]
    }
    return str;
}