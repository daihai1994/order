<template>
  <div>
    <!--加载页面动画-->
    <div class="shadows" id="shadows" style="display: none">
      <div class="loadings" id="loadings" style="display: none">
        <span>{{loadTime}}</span>
        <span>秒</span>
        <span>后</span>
        <span>进</span>
        <span>入</span>
        <span>登</span>
        <span>入</span>
        <span>页</span>
        <span>面</span>
      </div>
    </div>
    <section class="section">
      <el-form :model="form" ref="passW" :rules="ruleForm" label-width="120" label-position="top">
        <el-form-item prop="oldPassword" label="旧密码">
          <el-input v-model="form.oldPassword" show-password></el-input>
        </el-form-item>
        <el-form-item prop="newPassword" label="新密码">
          <el-input v-model="form.newPassword" show-password></el-input>
        </el-form-item>
        <el-form-item prop="requirePass" label="确认密码">
          <el-input v-model="form.requirePass" show-password></el-input>
        </el-form-item>
        <el-form-item prop="code" label="验证码" class="codeItem">
          <el-input v-model="form.code" class="codeRes"></el-input>
          <div class="code"><Validate /></div>
        </el-form-item>
        <el-form-item class="btn-group">
          <el-button type="primary" @click="submit('passW')">确认修改</el-button>
          <el-button type="danger" @click="cancel('passW')">取 消</el-button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
  import Validate from "../components/Validate";
  import { mapState } from 'vuex'
  import Variable_global from "@/global_variable";
  export default {
    name: "HomeUpdatePass",
    data() {
      let oldPassword = (rule, value, callback) => {
        if(value === '') {
          callback(new Error("请输入旧密码"))
        }else {
          callback()
        }
      };
      let newPassword = (rule, value, callback) => {
        if(value === '') {
          callback(new Error("请输入新密码"))
        } if(value.length<6) {
          callback(new Error("密码长度不能少于6位"))
        } else {
          callback()
        }
      };
      let rePass = (rule, value, callback) => {
        if(value === '') {
          callback(new Error("请输入确认密码"))
        } else if(value != this.form.newPassword) {
          callback(new Error("两次密码不一致，请重新输入"))
        } else {
          callback()
        }
      };
      let codes = (rule, value, callback) => {
        if(value === '') {
          callback(new Error("验证码不能为空"))
        } else if(value.toString().toLowerCase() != this.validates.code.toString().toLowerCase()) {
          callback(new Error("验证码不正确！请重新填写"))
        } else{
          callback()
        }
      }
      return {
        loadTime:3,
        interval:"",
        form: {
          oldPassword: '',
          newPassword: '',
          requirePass: '',
          code: '',
          username:''
        },
        ruleForm: {
          oldPassword: [
            {validator: oldPassword, trigger: 'blur'}
          ],
          newPassword: [
            {validator: newPassword, trigger: 'blur'}
          ],
          requirePass: [
            {validator: rePass, trigger: 'blur'}
          ],
          code: [
            {validator: codes, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      ...mapState({
        validates: state => state.code
      })
    },
    methods: {
      submit(form) {
        let that = this;
        this.$refs[form].validate( state => {
          if(state) {
            //清空验证码
            let url = "/user/modifyPassword";//修改密码
            let username = "";//用户名
            if(JSON.parse(sessionStorage.getItem("user"))!=null){
              username = JSON.parse(sessionStorage.getItem("user")).username
            }else{
              if(state!="login"){
                that.$message.error("账号过期，请重新登陆!")
                that.$router.push({
                  path: '/login'
                })
                return ;
              }

            }
            that.form.username = username;
            let param = that.form;
            that.post_url(url, param, "修改密码失败！",null).then(function (res) {
              console.info("修改密码返回体",res);
              if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                that.$message.success("修改密码成功,3秒后会进入登入页面！");
                let loadDom = document.getElementById("loadings")
                loadDom.style.display = "block"
                let shadowDom = document.getElementById("shadows")
                shadowDom.style.display = "block"
                let intervalId = setInterval(function(){
                  that.loadTime = that.loadTime-1;
                },1000);
                that.interval = intervalId;
                setTimeout(that.successBeFore,3000)
              }else {
                that.$message.error("修改密码失败！");
              }
            }).catch(res=>{
              that.$message.error("服务器错误！");
              console.info(res);
            });
          }
        })
      },
      successBeFore(){
        if(this.interval!=null&&this.interval!=""){
          clearInterval(this.interval);
        }
        // let loadingDom = document.getElementById("loadings")
        // loadingDom.style.display = "none"
        // let shadowDom = document.getElementById("shadows")
        // shadowDom.style.display = "none"
        location.href = this.getLocation();
      },
      cancel(form) {
        this.$refs[form].resetFields()
      }
    },
    components: {
      Validate
    }
  }
</script>

<style scoped>
  .shadows {
    position: absolute;
    background-color: #FFFFFF;
    width: 95%;
    height: 95%;
    z-index: 1000;
  }

  .shadows .loadings {
    position: absolute;
    top: 50%;
    left: 42%;
  }

  .section {
    width: 25%;
    margin: 0 auto;
  }

  .btn-group {
    text-align: center;
  }

  .codeItem {
    position: relative;
  }

  .codeRes {
    width: 30%;
  }

  .code {
    width: 25%;
    height: 40px;
    position: absolute;
    top: 0;
    left: 35%;
  }

</style>