<template>
  <div style="height: 100%">
    <!--logo栏位-->
    <div v-if="nav.LOGO && this.nav.LOGO.id === '1'"
         class="avatar avatar-flex"
         :style="{width: (getCollapseState == false)?'200px':'64px'}">
      <div>
        <a href="javascript:;">
          <img :src="require('@/assets'+nav.LOGO.img)" alt="" :style="{width: '50px', height: '50px',borderRadius:'50%'}">
          <span style="margin-left: 5px;font-size: 20px">{{nav.LOGO.title}}</span>
        </a>
      </div>
    </div>
    <el-menu :default-active="String(activeNav)"
             class="el-menu-vertical"
             :collapse="getCollapseState"
             :background-color="getAsideColor"
             :text-color="getATextColor"
             :active-text-color="getActiveColor"
             :unique-opened=getDoubleOpen
             :default-openeds="defaultOpen"
             ref="menu"
             router>
      <!--动态生成sideItem-->
      <template v-for="(item, parentIndex) in nav.nav">
        <SideNav :item="item" :index="parentIndex" :state="getCollapseState"></SideNav>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import SideNav from "./SideNav";
  import {mapGetters} from "vuex";
  import Axios from "axios";
  import style from "@/assets/css/public.css"

  export default {
    name: "Aside",
    data() {
      return {
        nav: [], //左侧导航数据数组
        defaultOpen: ['0'],
        bool:false,//当为false为第一次进入，处理权限，当为true时候，处理过权限
      }
    },
    computed: {
      activeNav() {
        //当前激活的导航
        return this.$route.path
      },
      /*
      * 在VUEX中获得asideColor颜色值
      * */
      ...mapGetters({
        getAsideColor: 'globalSetting/AsideColor',
        getATextColor: 'globalSetting/ATextColor',
        getActiveColor: 'globalSetting/ActiveColor',
        getDoubleOpen: 'globalSetting/DoubleOpen',
        getCollapseState: 'header/CollapseState'
      })
    },
    created() {
      //获得导航的json数据
      Axios({
        url: location.protocol + "/nav.json",
        method: "get"
      }).then(res => {
        let that = this;
        //把导航数据存入vuex中
        let user = {};
        if(JSON.parse(sessionStorage.getItem("user"))!=null){
          user = JSON.parse(sessionStorage.getItem("user"))
        }else{
          that.$message.error("账号过期，请重新登陆!")
          that.$router.push({
            path: '/login'
          })
          return ;
        }
        console.info("用户信息",user);
        let roles = user.roles;
        let navs = res.data.nav;
        let authorities = [];
        for(let i = 0;i<roles.length;i++){
          let authority = roles[i].authorities;
          for(let j = 0;j<authority.length;j++){
            if(authorities.indexOf(authority[j].name)==-1){
              authorities.push(authority[j].name);
            }
          }
        }
        console.info("存在的权限",authorities);
        console.info("全部权限",res.data.nav);
        console.info("默认权限",res.data.all);
        let nav  =res.data.nav.filter(item=> authorities.indexOf(item.title)>-1) //跟
        console.info("相同权限",nav);
        res.data.nav = nav;
        res.data.nav = res.data.nav.concat(res.data.all)
        this.$store.dispatch('header/setNavs', {
          nav: res.data.nav
        })
        this.nav = res.data
      })
    },
    components: {
      SideNav
    }
  }
</script>

<style scoped>
  @import "~font-awesome/css/font-awesome.min.css";

  .el-menu-vertical:not(.el-menu--collapse) {
    padding-top: 60px;
    width: 200px;
    min-height: 400px;
    height: calc(100% - 60px);
  }

  .aside-show {
    width: 200px;
    max-width: 200px;
    min-height: 400px;
    height: 100%;
  }

  .aside-hide {
    width: 64px;
    max-width: 64px;
    min-height: 400px;
    height: 100%;
  }

  .el-menu--collapse {
    height: 100%;
    margin-top: 60px
  }

  .el-submenu [class^=fa] {
    vertical-align: middle;
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 16px;
  }
</style>