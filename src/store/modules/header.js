const state = {
  nav: [], //左侧导航栏数据
  isCollapse: false,  //是否收缩左侧导航栏 false为展开 true为收缩
  asideTitle: [
    {
      title: '人员信息',
      path: '/userInfo',
      activeIndex: 0
    }
  ], //存储点击左侧导航栏后的导航名，作为标题显示头
  crumbs: [
    '人员管理','人员信息'
  ], //存储面包屑
  activeIndex: 0,  //当前活跃的标题下标
  count: 0,  //下标增值变量
  url:"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",//头像url
}

const getters = {
  CollapseState: state => {
    return state.isCollapse
  },
  AsideTitle: state => {
    return state.asideTitle
  },
  active: state => {
    return state.activeIndex
  },
  Count: state => {
    return state.count
  },
  Crumbs: state => {
    return state.crumbs
  },
  Navs: state => {
    return state.nav
  },
  HeadUrl: state=>{
    return state.url
  },
}

const mutations = {
  setCollapse(state, payload) {
    state.isCollapse = payload
  },
  setAside(state, values) {
    state.asideTitle.push(values)
  },
  delOrAddAside(state, value) {
    state.asideTitle = value
  },
  setActiveIndex(state, value) {
    state.activeIndex = value
  },
  setCount(state, value) {
    state.count = value
  },
  setCrumbs(state, crumbs) {
    state.crumbs = crumbs
  },
  setNav(state, values) {
    state.nav = values
  },
  setHeadUrl(state, url) {
    state.url = url
  },
}

const actions = {
  setNavs(context, nav) {
    context.commit('setNav', nav)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}