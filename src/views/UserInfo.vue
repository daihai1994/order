<template>
    <div>
        <el-col :span="18"  style="padding-bottom: 0px;">
            <!--工具条-->
            <el-col :span="24"  style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters" class="user_form" >
                    <el-form-item  prop="name">
                        <el-input v-model="filters.name" placeholder="姓名"  prefix-icon="el-icon-search"></el-input>
                    </el-form-item>
                    <el-form-item  prop="phone">
                        <el-input v-model="filters.username" placeholder="账号/手机号"  prefix-icon="el-icon-search"></el-input>
                    </el-form-item>
                    <el-dropdown split-button type="primary" @click="btnSearch" trigger="click" style="margin-right: 10px">
                        搜索
                        <el-dropdown-menu slot="dropdown"  trigger="click">
                            <el-dropdown-item @click.native="btnReset">重置</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-dropdown split-button type="primary" @click="btnNew" trigger="click">
                        新增
                        <el-dropdown-menu slot="dropdown" trigger="click">
                            <el-dropdown-item  @click.native="btnEdit">编辑</el-dropdown-item>
                            <el-dropdown-item  @click.native="btnDelete">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form>
            </el-col>
            <el-table
                    ref="userInfo"
                    :data="tableData"
                    :header-cell-style="tableHeaderColor"
                    border
                    highlight-current-row
                    @current-change="handleTableChange"
                    style="width: 100%;" v-loading="listLoading">
                <el-table-column
                        prop="name"
                        sortable
                        label="姓名">
                </el-table-column>
                <el-table-column
                        prop="username"
                        sortable
                        label="账号/手机号">
                </el-table-column>
                <el-table-column
                        prop="mail"
                        sortable
                        label="邮箱地址">
                </el-table-column>
                <el-table-column
                        prop="registerTime"
                        sortable
                        label="注册日期"
                        :formatter="formatterTime">
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-col :span="24" >
                <el-pagination layout="total, sizes, prev, pager, next, jumper"
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :page-sizes="[10, 20, 50, 100]"
                               :page-size="pageSize"
                               :total="tableLength" style="float:right;">
                </el-pagination>
            </el-col>

            <!--新增界面-->
            <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
                <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="addForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="username">
                        <el-input v-model="addForm.username" auto-complete="off" readonly onfocus="this.removeAttribute('readonly');"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="mail">
                        <el-input v-model="addForm.mail" auto-complete="off" readonly onfocus="this.removeAttribute('readonly');"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password" auto-complete="off" show-password readonly onfocus="this.removeAttribute('readonly');"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                </div>
            </el-dialog>
            <!--编辑界面-->
            <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
                <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="editForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="username">
                        <el-input v-model="editForm.username" auto-complete="off" readonly onfocus="this.removeAttribute('readonly');"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="mail">
                        <el-input v-model="editForm.mail" auto-complete="off" readonly onfocus="this.removeAttribute('readonly');"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
                </div>
            </el-dialog>
        </el-col>
        <el-col :span="6"  style="padding-bottom: 0px;padding-left: 10px">
            <!--工具条-->
            <el-col :span="24"  style="padding-bottom: 0px;height: 62px">
                <el-row style="text-align:center" >
                    <el-button type="primary"  @click="updateUserRole">修改角色</el-button>
                </el-row>
            </el-col>
            <el-table
                    ref="roleTable"
                    :data="roleList"
                    :header-cell-style="tableHeaderColor"
                    border
                    highlight-current-row
                    @select="selectRow"
                    @select-all="selectAllRow"
                    style="width: 100%;">
                <el-table-column
                        width="55"
                        type="selection">
                </el-table-column>
                <el-table-column
                        prop="name"
                        sortable
                        label="角色">
                </el-table-column>
            </el-table>
        </el-col>
    </div>
</template>

<script>
    import Variable_global from '../global_variable.js'
    export default {
        name: "UserInfo",

        data(){
            let password = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error("请输入密码"))
                }else  if (value.length<6) {
                    callback(new Error("密码长度不能少于6位"))
                }else{
                    callback()
                }

            };
            return {
                page: 1,//当前页数
                pageSize:10,//一页显示几条
                listLoading: false,//table加载loading等待
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,//编辑提交等待页面
                editFormRules: {//编辑页面不能为空
                    name: [{ required: true, message: '请输入姓名', trigger: 'blur' },],
                    username: [{ required: true, message: '请输入账号/手机号', trigger: 'blur'}],
                },
                //编辑界面数据
                editForm: {
                    name: '',
                    username: '',
                    password: '',
                    mail:""
                },
                currentRow:{},//选择行数据
                addFormVisible: false,//新增界面是否显示
                addLoading: false,//新增提交等待页面
                addFormRules: {
                    name: [{ required: true, message: '请输入姓名', trigger: 'blur' },],
                    username: [{ required: true, message: '请输入账号/手机号', trigger: 'blur'}],
                    password: [{validator: password, trigger: 'blur'}],
                },
                //新增界面数据
                addForm: {
                    name: '',
                    username: '',
                    password: '',
                    mail:''
                },
                //筛选条件
                filters: {
                    name: '',
                    username:''
                },
                tableData: [],//数据
                tableLength:0,//数据总个数
                // 更改表头样式
                tableHeaderColor ({ rowIndex}) {
                    if (rowIndex === 0) {
                        return 'background-color: #F5F7FA;'
                    }
                },
                roleList:[],//角色List
                roleSelect:[],//勾选的角色
            }
        },
        methods: {
            //改变角色事件
            selectRole(val,row){
                console.info("改变角色事件触发",val+"---"+row)
                this.addForm.role_id= val;
            },
            //改变行选择事件
            handleTableChange(val){
                let that = this;
                if(val!=null){
                    that.currentRow = val;
                    that.$nextTick(function(){
                        that.roleSelect = [];
                        let ruleLists = val.roles;
                        if (that.$refs.roleTable) {
                            that.$refs.roleTable.clearSelection();//清除全部的选中状态
                        }
                        for(let i = 0;i<that.roleList.length;i++){
                            let roleId = that.roleList[i].id;
                            for(let j = 0;j<ruleLists.length;j++){
                                let userRoleId = ruleLists[j].id;
                                if(roleId==userRoleId){
                                    that.$refs.roleTable.toggleRowSelection(that.roleList[i],true);
                                    that.roleSelect.push(that.roleList[i].id)
                                    break;
                                }
                            }
                        }
                    })
                }

            },
            //格式化时间
            formatterTime(row) {
                if (row.registerTime != null && row.registerTime.length > 19) {
                    return row.registerTime.substring(0, 19)
                }else{
                    return row.registerTime;
                }
            },
            //查询语句
            search: function () {
                let that = this;
                that.tableData = [];
                // that.tableLength = 0;
                that.listLoading = true;
                let url = "/role/searchAllRoles";//查询全部角色
                let param = {
                    name:"",
                    effective:1
                };
                that.post_url(url, param, "角色查询失败！",null).then(function (res) {
                    console.info(res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.roleList = res.data;//角色List
                        let url = "/user/searchAllUser";
                        let param = {
                            name: that.filters.name,
                            username: that.filters.username,
                            size: that.pageSize,// 每页的记录数（行数）
                            page: that.page//第几条开始
                        }
                        that.post_url(url, param, "查询失败！", that.listLoading = false).then(function (res) {
                            that.listLoading = false;
                            console.info(res);
                            if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                that.tableData = res.data.list;
                                that.tableLength = res.data.total;
                                if(res.data.total>0){
                                    that.$refs.userInfo.setCurrentRow(res.data.list[0]);
                                }
                            }
                        }).catch(res=>{
                            console.info(res);
                            that.listLoading = false;
                        });
                    }else{
                        that.listLoading = false;
                        that.$message.error("角色查询失败！");
                    }
                }).catch(res=>{
                    that.listLoading = false;
                    console.info(res);
                });


            },
            //初始页page、初始每页数据数pageSize和数据data
            handleSizeChange(size) {
                    this.pageSize = size;
                    this.search();
            },
            handleCurrentChange(val) {
                    this.page = val;
                    this.search();
            },
            //重置
            btnReset() {
                this.filters={
                    name: '',
                    username:''
                };
                this.search();
            },
            //新增页面的打开
            btnNew() {
                let that = this;
                that.addFormVisible = true;//打开新增页面
                that.addForm = {};//重置form信息

            },
            //删除
            btnDelete() {
                let that = this;
                let ids = this.currentRow.username;
                if (ids == ''||ids == null) {
                    this.$alert('请选择要删除的记录', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                } else {
                    this.$confirm('确认删除选中记录吗？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        that.listLoading = true;
                        let param={
                            username:this.currentRow.username//删除 用户username
                        }
                        let url = "/user/deleteUser";//删除用户
                        this.post_url(url, param, "删除失败！",that.listLoading = false).then(function (res) {
                            that.listLoading = false;
                            console.info(res);
                            if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                that.$message.success("删除成功");
                                that.search();
                            }
                        });
                    }).catch(() => {

                    });
                }
            },
            //打开编辑页面
            btnEdit:function(){
                let that = this;
                if(this.currentRow.username==null){
                    this.$alert('请选择要编辑的数据', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                }else{
                    that.editFormVisible = true;//打开新增页面
                    that.editForm = {
                        name: this.currentRow.name,//名称
                        username: this.currentRow.username,//账号
                        mail:this.currentRow.mail,
                    };//重置form信息
                }
            },
            //提交编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let that = this;
                            let url = "/user/updateUser";//编辑提交
                            let param = that.editForm;
                            this.post_url(url, param, "修改失败！",that.editLoading = false).then(function (res) {
                                that.editLoading = false;
                                console.info(res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("修改成功");
                                    that.editFormVisible = false;
                                    that.editForm = {};
                                    that.currentRow = {};
                                    that.search();
                                }else{
                                    that.$message.error("修改失败");
                                }
                            }).catch(() => {

                            });
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let that = this;
                            let url = "/user/addUser";//新增用户
                            let param = that.addForm;
                            this.post_url(url, param, "新增失败！",that.addLoading = false).then(function (res) {
                                that.addLoading = false;
                                console.info(res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("新增成功");
                                    that.addFormVisible = false;
                                    that.addForm = {};
                                    that.search();
                                }else{
                                    that.$message.error("新增失败");
                                }
                            }).catch(() => {

                            });
                        });
                    }
                });
            },
            /**
             * 搜索
             */
            btnSearch: function () {
                this.search();
            },
            /**
             * 修改用户权限
             */
            updateUserRole(){
                let that = this;
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    let url = "/user/updateUserRole";//修改用户权限
                    let param = {
                        username:that.currentRow.username,
                        roleId:that.roleSelect
                    };
                    this.post_url(url, param, "修改用户权限失败！", null).then(function (res) {
                        console.info("修改用户权限返回体",res);
                        if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                            that.$message.success("修改用户权限成功");
                            that.search();
                        }else{
                            that.$message.error("修改用户权限失败");
                        }
                    }).catch(() => {
                        that.$message.error("修改用户权限失败");
                    });
                });
            },
            //勾选用户
            selectRow(selection,row){
                let that = this;
                that.roleSelect = [];
                selection.forEach(function(item,index){
                    that.roleSelect.push(item.id)
                })
            },
            //勾选全部用户
            selectAllRow(selection){
                let that = this;
                that.roleSelect = [];
                selection.forEach(function(item,index){
                    that.roleSelect.push(item.id)
                })
            },
        },
        mounted(){
            this.search();
        }
    }
</script>

<style scoped>
</style>