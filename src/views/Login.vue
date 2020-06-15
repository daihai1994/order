<template>
  <div class="loginBox" id="loginBox" :style="{height: getHeight+'px'}">
    <div class="login" login>
      <el-card shadow="always">
        <el-avatar :src="require('../assets/image/logo.png')" :size="80" avatar></el-avatar>
        <div class="form" form style="padding: 0px 40px;">
          <el-form :model="loginForm" :rules="rules" ref="login">
            <el-form-item  prop="username">
              <el-input v-model="loginForm.username" @focus="showUnTip=true" autofocus></el-input>
            </el-form-item>
            <el-form-item  prop="password">
              <el-input show-password v-model="loginForm.password" @focus="showPsTip=true"></el-input>
            </el-form-item>
            <el-form-item  prop="verifyCode">
              <!-- 注意：prop与input绑定的值一定要一致，否则验证规则中的value会报undefined，因为value即为绑定的input输入值 -->
              <el-input v-model="loginForm.verifyCode" placeholder="请输入验证码" ></el-input>
            </el-form-item>
            <el-form-item>
              <div class="identifybox">
                <div @click="refreshCode">
                  <SIdentifys :identifyCode="identifyCode"></SIdentifys>
                </div>
                <el-button @click="refreshCode" type='text' >看不清，换一张</el-button>
              </div>
            </el-form-item>
            <el-form-item marginBottom>
              <el-checkbox v-model="autoLogin">自动登录</el-checkbox>
              <el-checkbox v-model="remPs">记住密码</el-checkbox>
<!--              <span @click="retrievePassword" style="margin-left: 30px;cursor:pointer">忘记密码</span>-->
              <router-link style="margin-left: 30px" target="_blank" :to="{path:'/retrievePassword'}">忘记密码</router-link>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :style="{width: '100%'}" :loading="loading" @click="login('login')">登 录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
  import SIdentifys from "../views/SIdentify.vue";
  import {axiosUtil} from "../network/axiosUtil";
  import Footer from "../views/layout/rightMain/Footer";
  import global from "../global_variable";

  export default {
    name: "Login",
    components: {
      SIdentifys,
      Footer
    },
    data() {
      let username = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("请输入用户名"))
        } else {
           this.showUnTip = false
           callback()
         }
      };
      let password = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("请输入密码"))
        }else {
           this.showPsTip = false
           callback()
         }
      };
      let verifyCode = (rule, value, callback) => {
        // console.info("当前验证码",this.identifyCode);
        // console.info("输入验证码",value);
        // if (value === '') {
        //   callback(new Error("请输入验证码"))
        // }else if(value != this.identifyCode){
        //   callback(new Error("验证码不正确!"))
        //   this.refreshCode();
        // }else {
           callback()
         // }
      }
      return {
        identifyCodes: '1234567890',
        identifyCode: '',
        loading:false,//提交后的按钮等待效果
        showUnTip: false, //是否显示用户名输入提示
        showPsTip: false, //是否显示密码输入提示
        autoLogin: false, //是否勾选自动登录功能
        remPs: false, //是否勾选记住密码
        height: '',
        loginForm: {
          username: '',
          password: '',
          verifyCode:'',//验证码
        },
        rules: {
          username: [
            {validator: username, trigger: 'blur'}
          ],
          password: [
            {
              validator: password, trigger: 'blur'
            }
          ],
          verifyCode: [
            {
              validator: verifyCode, trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      //找回密码
      retrievePassword(){
        console.info("进入忘记密码页面")
        let routeUrl = this.$router.push({
          path: '/retrievePassword',
        })
        window.open(routeUrl.href, '_blank');
      },
      // 生成随机数
      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
      },
      // 切换验证码
      refreshCode() {
        this.identifyCode = ''
        this.makeCode(this.identifyCodes, 4)
      },
      // 生成四位随机验证码
      makeCode(o, l) {
        for (let i = 0; i < l; i++) {
          this.identifyCode += this.identifyCodes[
                  this.randomNum(0, this.identifyCodes.length)
                  ]
        }
        console.log(this.identifyCode)
      },
      login(form) {
        let that = this;
        that.$refs[form].validate(state => {
          if (state) {
            that.loading = true;
            axiosUtil({
              url:"/rsa/getRsaPublicKey",
              method:'post',
            }).then(res=>{
              res = res.data;
              console.info(res)
              if(res!=null && res.code === 1001){
                global.rsaAes.serverPublicKey = res.data;
                sessionStorage.setItem("serverPublicKey", res.data)
                let param = {
                  username: that.loginForm.username,
                  password: that.loginForm.password
                }
                let url = '/user/login';
                //校验后台用户数据
                that.post_url(url, param, "登录失败！",that.loading = false,"login").then(res => {
                  that.loading = false;

                  if(res != null && res.headers.code ==global.errorCode.SUCCESS) {
                    that.$store.commit("header/setHeadUrl",this.getPath()+":"+this.getPort()+res.data.iconUrl);
                    if(that.remPs == true) {
                      let obj = new Array()
                      obj.push({
                        remember: true,
                        user: res.data
                      })
                      window.localStorage.setItem("remember", JSON.stringify(obj))
                    }
                    if(that.autoLogin == true) {
                      window.localStorage.setItem("autoLogin", that.autoLogin)
                    }
                    sessionStorage.setItem("user", JSON.stringify(res.data))
                      sessionStorage.setItem("profile", JSON.stringify({
                        username: res.data.username,
                        token: '15951924745'
                      }))

                    sessionStorage.setItem("titleItem",null);
                      that.$message({
                        type: 'success',
                        message: '登录成功',
                        duration: 2000
                      })
                    that.$router.push({
                      path: '/home'
                    })
                  }else{
                      that.$message.error("登录失败，用户名或密码错误，请重新登录")
                      that.$router.push({
                        path: '/login'
                      })
                  }
                }).catch(()=>function(){
                  that.loading = false;
                  that.$message.error("登录失败，用户名或密码错误，请重新登录")
                })

                //测试账号
                // if(that.loginForm.username === "test" && that.loginForm.password === "test123" && that.loginForm.verifyPass === "test123") {
                //   /*把登录成功的个人信息存入session域中*/
                //   let profile = new Object()
                //   profile.username = that.loginForm.username
                //   profile.password = that.loginForm.password
                //   sessionStorage.setItem("profile", JSON.stringify({
                //     username: profile.username,
                //     token: '154954264jun'
                //   }))
                //   that.$message({
                //     type: 'success',
                //     message: '登录成功',
                //     duration: 2000
                //   })
                //   //登录成功 跳转到首页
                //   that.$router.push({
                //     path: '/home'
                //   })
                // } else {
                //   //登录失败继续登录
                //   that.$message.error("登录失败，用户名或密码错误，请重新登录")
                //   that.$router.push({
                //     path: '/login'
                //   })
                // }
              }else{
                that.$message.error("登录失败，获取服务端公钥失败")
                that.loading = false;
              }
            }).catch(()=>{
              that.loading = false;
              that.$message.error("登录失败，获取服务端公钥失败")
            })

          }
        })
      },
      /**
       * 注册
       */
      // toRegister() {
      //   this.$router.push({
      //     path: '/register'
      //   })
      // }
    },
    computed: {
      getHeight() {
        this.height = document.documentElement.clientHeight
        return this.height
      }
    },
    mounted() {
      // 验证码初始化
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
      let _this = this
      window.addEventListener('resize', function () {
        _this.height = document.documentElement.clientHeight
      })
      window.addEventListener('keyup', function (event) {
        if (event.key == 'Enter') {
          _this.login('login')
        }
      })

      //进来先判断，上次登录是否勾选了自动登录和记住密码
      //勾选了记住密码
      let obj = window.localStorage.getItem("remember")
      if(obj!=null){
        this.remPs = obj.remember
        this.loginForm.username = obj.user.username
        this.loginForm.password = obj.user.password
      }

    }
  }
</script>

<style scoped>

  #loginBox {
    position: relative;
    width: 100%;
    background: url("../assets/image/login.jpg");
    background-repeat: no-repeat;
    background-size: cover;
  }
  .identifybox{
    display: flex;
    justify-content: space-between;
    margin-top:7px;
  }
  .login[login] {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 400px;
    height: 500px;
  }

  .login [avatar] {
    position: absolute;
    top: -40px;
    left: 40%;
  }

  .login .form[form] {
    margin-top: 40px;
  }

  .login .form [tip] > p {
    line-height: 1.5em;
    margin: 0;
    padding: 0;
    color: #C0C4CC;
    animation: tip 0.8s ease;
  }

  @keyframes tip {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  [marginBottom] {
    margin-bottom: 0;
  }

  [register="true"] a {
    float: right;
    margin-top: 0;
    margin-bottom: 10px;
    margin-left: 10px;
    text-decoration: none;
    color: #606266;
  }

  [register="true"] a:nth-child(1):hover {
    color: #409EFF;
  }

  [register="true"] a:nth-child(2):hover {
    color: #E6A23C;
  }
</style>