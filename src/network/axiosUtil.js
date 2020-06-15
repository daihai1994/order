import Axios from "axios";
Axios.defaults.withCredentials = true
export function axiosUtil(config) {
  const instance = Axios.create({
    baseURL: 'http://192.168.2.104:8081',
    //baseURL: 'http://192.168.2.133:8081',
    timeout: 500000,
     // 'Content-Type': "application/json;charset=utf-8",
     //  xhrFields: {withCredentials:true},
    // "Access-Control-Expose-Headers":"serverEncryptedKey,appPublicKey,serverPublicKey,code"
    // "Access-Control-Allow-Origin":"Content-Type, Content-Length, Authorization, Accept, X-Requested-With , appEncryptedKey,appPublicKey,serverPublicKey,appSignature,code",
    // "Access-Control-Allow-Headers":"PUT,POST,GET,DELETE,OPTIONS",
    // "Access-Control-Allow-Methods":"3.2.1",
    // "X-Powered-By":"*",
  })
  //响应拦截器
  instance.interceptors.response.use(res => {


    console.info("进入拦截器");
    return res
  }, error => {
    console.log(error)
    // if(error.indexOf("timeout of ")>-1){
    //   this.$message.error("请求超时")
    // }else{
    //   this.$message.error("未知错误")
    // }
  })
  return instance(config);
}