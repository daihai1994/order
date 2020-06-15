<template>
    <el-row>
        <el-col :span="12">
            <!--工具条-->
            <el-col :span="24"  style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters"  >
                    <el-form-item   prop="name">
                        <el-input v-model="filters.name" placeholder="角色"  prefix-icon="el-icon-search"></el-input>
                    </el-form-item>
                    <el-form-item  prop="effective" style="margin-right: 10px">
                        <el-select v-model="filters.effective" placeholder="请选择" style="width: 100px" >
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-dropdown split-button type="primary" @click="btnSearch" trigger="click" style="margin-right: 10px">
                        搜索
                        <el-dropdown-menu slot="dropdown" trigger="click">
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
                    ref="role"
                    :data="roleData"
                    :header-cell-style="tableHeaderColor"
                    border
                    highlight-current-row
                    @current-change="handleTableChange"
                    style="width: 100%;" v-loading="listLoading">
                <el-table-column
                        prop="name"
                        sortable
                        label="角色">
                </el-table-column>
                <el-table-column
                        prop="effective"
                        label="状态"
                        :formatter="effectiveHandle">
                </el-table-column>
            </el-table>
            <!--新增界面-->
            <el-dialog title="新增角色" :visible.sync="addFormVisible" :close-on-click-modal="false">
                <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                    <el-form-item label="角色名称" prop="name">
                        <el-input v-model="addForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                </div>
            </el-dialog>
            <!--编辑界面-->
            <el-dialog title="编辑角色" :visible.sync="editFormVisible" :close-on-click-modal="false">
                <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                    <el-form-item label="角色名称" prop="name">
                        <el-input v-model="editForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="是否有效" prop="effective">
                        <el-select v-model="editForm.effective" placeholder="请选择" >
                            <el-option
                                    v-for="item in effectiveList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
                </div>
            </el-dialog>
        </el-col>
        <el-col :span="11" style="padding-left: 10px;">
            <!--工具条-->
            <el-col :span="24"  style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filtersAuth"  >
                    <el-form-item   prop="name" >
                        <el-input v-model="filtersAuth.name" placeholder="权限"    prefix-icon="el-icon-search"></el-input>
                    </el-form-item>
                    <el-form-item  prop="effective" style="margin-right: 10px">
                        <el-select v-model="filtersAuth.effective" placeholder="请选择" style="width: 100px" >
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-dropdown split-button type="primary" @click="btnAuthSearch" trigger="click" style="margin-right: 10px">
                        搜索
                        <el-dropdown-menu slot="dropdown" trigger="click">
                            <el-dropdown-item @click.native="btnAuthReset">重置</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-dropdown split-button type="primary" @click="btnAuthNew" trigger="click" style="margin-right: 10px">
                        新增
                        <el-dropdown-menu slot="dropdown" trigger="click">
                            <el-dropdown-item  @click.native="btnAuthEdit">编辑</el-dropdown-item>
                            <el-dropdown-item  @click.native="btnAuthDelete">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button type="primary"  @click="updateRoleAuthId">修改角色</el-button>
                </el-form>
            </el-col>
            <el-table
                    ref="auth"
                    :data="authData"
                    :header-cell-style="tableHeaderColor"
                    border
                    highlight-current-row
                    @select="selectRow"
                    @select-all="selectAllRow"
                    @current-change="handleTableChangeAuth"
                    style="width: 100%;" v-loading="authListLoading">
                <el-table-column
                        width="55"
                        type="selection">
                </el-table-column>
                <el-table-column
                        prop="name"
                        sortable
                        label="权限">
                </el-table-column>
                <el-table-column
                        prop="effective"
                        label="状态"
                        :formatter="effectiveHandle">
                </el-table-column>
            </el-table>
            <!--新增界面-->
            <el-dialog title="新增权限" :visible.sync="addAuthFormVisible" :close-on-click-modal="false">
                <el-form :model="addAuthForm" label-width="100px" :rules="addAuthFormRules" ref="addAuthForm">
                    <el-form-item label="权限名称" prop="name">
                        <el-input v-model="addAuthForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addAuthFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="addAuthSubmit" :loading="addAuthLoading">提交</el-button>
                </div>
            </el-dialog>
            <!--编辑界面-->
            <el-dialog title="编辑权限" :visible.sync="editAuthFormVisible" :close-on-click-modal="false">
                <el-form :model="editAuthForm" label-width="80px" :rules="editAuthFormRules" ref="editAuthForm">
                    <el-form-item label="权限名称" prop="name">
                        <el-input v-model="editAuthForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="是否有效" prop="effective">
                        <el-select v-model="editAuthForm.effective" placeholder="请选择" >
                            <el-option
                                    v-for="item in effectiveList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editAuthFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="editAuthSubmit" :loading="editAuthLoading">提交</el-button>
                </div>
            </el-dialog>
        </el-col>
    </el-row>
</template>

<script>
    import Variable_global from "@/global_variable";
    import {axiosUtil} from "@/network/axiosUtil";
    import global from "@/global_variable";
    import AlobalData from "@/global_variable";

    export default {
        name: "authority",
        data(){
            return {
                //选中角色行数据
                currentRow:{},
                //选中权限行数据
                currentRowAuth:{},
                //角色筛选条件
                filters:{
                    name:"",
                    effective:2,
                },
                //权限筛选条件
                filtersAuth:{
                    name:"",
                    effective:2,
                },
                //角色数据
                roleData:[],
                //权限数据
                authData:[],
                // 更改表头样式
                tableHeaderColor ({ rowIndex}) {
                    if (rowIndex === 0) {
                        return 'background-color: #F5F7FA;'
                    }
                },
                //角色表加载等待
                listLoading:false,
                //权限表加载等待
                authListLoading:false,
                //有效，无效，全部select
                options:[{
                    value: 0,
                    label: '无效'
                },{
                    value: 1,
                    label: '有效'
                },{
                    value: 2,
                    label: '全部'
                }],
                /************************************新增数据******************************************/
                //新增页面
                addFormVisible:false,
                //新增实体类
                addForm:{
                    name:""
                },
                //新增规则
                addFormRules:{
                    name: [{ required: true, message: '请输入角色', trigger: 'blur' },],
                },
                //提交等待
                addLoading:false,
                /************************************编辑数据******************************************/
                //编辑页面
                editFormVisible:false,
                //编辑实体类
                editForm:{
                    name:"",
                    id:0,
                    effective:0
                },
                //编辑规则
                editFormRules:{
                    name: [{ required: true, message: '请输入角色', trigger: 'blur' },],
                    effective:[{ required: true, message: '请选择是否有效', trigger: 'change'}],
                },
                //编辑提交等待
                editLoading:false,
                //编辑页面是否有效
                effectiveList:[{
                    value: 0,
                    label: '无效'
                },{
                    value: 1,
                    label: '有效'
                },],

                /************************************新增权限数据******************************************/
                //新增权限页面
                addAuthFormVisible:false,
                //新增权限实体类
                addAuthForm:{
                    name:"",
                    roleId:0
                },
                //新增权限规则
                addAuthFormRules:{
                    name: [{ required: true, message: '请输入权限', trigger: 'blur' },],
                },
                //提交权限等待
                addAuthLoading:false,
                /************************************编辑数据******************************************/
                //编辑权限页面
                editAuthFormVisible:false,
                //编辑权限实体类
                editAuthForm:{
                    name:"",
                    id:0,
                    effective:0,
                    roleId:0,
                },
                //编辑权限规则
                editAuthFormRules:{
                    name: [{ required: true, message: '请输入权限', trigger: 'blur' },],
                    effective:[{ required: true, message: '请选择是否有效', trigger: 'change'}],
                },
                //编辑权限提交等待
                editAuthLoading:false,
                //选择权限
                authSelect:[],

            }
        },
        //进入页面，初始化数据
        mounted(){
            this.btnAuthSearch();
            this.btnSearch();
        },
        methods:{
            //对是否失效处理
            effectiveHandle(row){
                if (row.effective==1) {
                    return '有效'
                }else{
                    return '无效'
                }
            },
            /**
             * 查询角色
             */
            btnSearch(){
                let that = this;
                let param = that.filters;
                let url = "/role/searchAllRoles";
                this.roleData = [];
                that.listLoading = true;
                this.post_url(url, param, "查询角色失败！", that.listLoading = false).then(function (res) {
                    that.listLoading = false;
                    console.info("查询角色返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.roleData = res.data;
                        if(res.data.length>0){
                            that.$refs.role.setCurrentRow(res.data[0]);
                        }
                    }

                }).catch(()=>{
                    that.listLoading = false;
                    that.$message.error("查询角色失败！")
                });
            },
            /**
             * 查询权限
             */
            btnAuthSearch(){
                let that = this;
                let param = that.filtersAuth;
                let url = "/authority/searchAllAuthorities";
                this.authData = [];
                that.currentRowAuth={};
                that.authListLoading = true;
                this.post_url(url, param, "查询权限失败！", that.authListLoading = false).then(function (res) {
                    that.authListLoading = false;
                    console.info("查询权限返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.authData = res.data;
                        that.$nextTick(function(){
                            if (that.currentRow != null && that.currentRow.id!="") {
                                that.authSelect = [];
                                let authList = that.currentRow.authorities;
                                if (that.$refs.auth) {
                                    that.$refs.auth.clearSelection();//清除全部的选中状态
                                }
                                for (let i = 0; i < res.data.length; i++) {
                                    let authId = res.data[i].id;
                                    for (let j = 0; j < authList.length; j++) {
                                        let roleAuthId = authList[j].id;
                                        if (authId == roleAuthId) {
                                            console.info("匹配相同");
                                            that.$refs.auth.toggleRowSelection(res.data[i], true);
                                            that.authSelect.push(that.authData[i].id)
                                            break;
                                        }
                                    }
                                }
                            }
                        })
                    }

                }).catch((res)=>{
                    console.info(res)
                    that.listLoading = false;
                    that.$message.error("查询权限失败！")
                });
            },
            /**
             * 角色重置
             */
            btnReset(){
                this.filters = {
                    name:"",
                    effective:2,
                };
                this.btnSearch();
                //校验后台用户数据
                // axiosUtil({
                //     url: "sms/sendSms",
                //     method: 'post',
                //     data: {
                //         phone:"15951924745"
                //     },
                // }).then(function(res){
                //     console.info(res)
                // }).catch(function(res){
                //
                // });
            },
            /**
             * 权限重置
             */
            btnAuthReset(){
                this.filtersAuth.name = "";
                this.filtersAuth.effective = 2;
                this.btnAuthSearch();
                // axiosUtil({
                //     url: "sms/getSms",
                //     method: 'post',
                //     data: {
                //
                //     },
                // }).then(function(res){
                //     console.info(res)
                // }).catch(function(res){
                //
                // });
            },
            /**
             * 角色新增页面的打开
             */
            btnNew(){
                this.addFormVisible = true;
                this. addForm = {
                    name:"",

                }
            },
            /**
             * 权限新增页面的打开
             */
            btnAuthNew(){
                this.addAuthFormVisible = true;
                this.addAuthForm.name = "";
            },
            /**
             * 角色新增页面的提交
             */
            addSubmit(){
                let that = this;
                let param = that.addForm;
                let url = "/role/addRole";
                that.addLoading = true;
                this.post_url(url, param, "新增角色失败！", that.addLoading = false).then(function (res) {
                    that.addLoading = false;
                    console.info("新增角色返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.addFormVisible = false;
                        that.$message.success("新增角色成功！");
                        that.btnSearch();
                    }
                }).catch(()=>{
                    that.addLoading = false;
                    that.$message.error("新增角角色失败！")
                });
            },
            /**
             * 权限新增页面的提交
             */
            addAuthSubmit(){
                let that = this;
                let param = that.addAuthForm;
                let url = "/authority/addAuthority";
                that.addAuthLoading = true;
                this.post_url(url, param, "新增权限失败！", that.addAuthLoading = false).then(function (res) {
                    that.addAuthLoading = false;
                    console.info("新增权限返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.addAuthFormVisible = false;
                        that.$message.success("新增权限成功！");
                        that.btnAuthSearch();
                    }
                }).catch(()=>{
                    that.addAuthLoading = false;
                    that.$message.error("新增权限色失败！")
                });
            },
            /**
             * 角色编辑页面的打开
             */
            btnEdit(){
                let that = this;
                if(this.currentRow.id==null){
                    this.$alert('请选择要编辑的数据', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                }else{
                    that.editFormVisible = true;//打开新增页面
                    that.editForm = {
                        name: this.currentRow.name,//名称
                        effective: this.currentRow.effective,//是否有效
                        id:this.currentRow.id
                    };
                }
            },
            /**
             * 权限编辑页面的打开
             */
            btnAuthEdit(){
                let that = this;
                if(this.currentRowAuth.id==null){
                    this.$alert('请选择要编辑的数据', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                }else{
                    that.editAuthFormVisible = true;//打开新增页面
                    that.editAuthForm = {
                        name: this.currentRowAuth.name,//名称
                        effective: this.currentRowAuth.effective,//是否有效
                        id:this.currentRowAuth.id,
                        roleId:this.currentRowAuth.roleId,
                    };
                }
            },
            /**
             * 角色编辑页面的提交
             */
            editSubmit(){
                let that = this;
                let param = that.editForm;
                let url = "/role/updateRole";
                that.editLoading = true;
                this.post_url(url, param, "修改角色失败！", that.editLoading = false).then(function (res) {
                    that.editLoading = false;
                    console.info("修改角色返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.editFormVisible = false;
                        that.$message.success("修改角色成功！");
                        that.btnSearch();
                    }
                }).catch(()=>{
                    that.editLoading = false;
                    that.$message.error("修改角角色失败！")
                });
            },
            /**
             * 权限编辑页面的提交
             */
            editAuthSubmit(){
                let that = this;
                let param = that.editAuthForm;
                let url = "/authority/updateAuthority";
                that.editAuthLoading = true;
                this.post_url(url, param, "修改权限失败！", that.editAuthLoading = false).then(function (res) {
                    that.editAuthLoading = false;
                    console.info("修改权限返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.editAuthFormVisible = false;
                        that.$message.success("修改权限成功！");
                        that.btnAuthSearch();
                    }
                }).catch(()=>{
                    that.editAuthLoading = false;
                    that.$message.error("修改角角色失败！")
                });
            },
            /**
             * 删除角色
             */
            btnDelete(){
                let that = this;
                let ids = this.currentRow.id;
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
                            id:this.currentRow.id//删除 角色ID
                        }
                        let url = "/role/deleteRole";//删除角色
                        this.post_url(url, param, "删除失败！",that.listLoading = false).then(function (res) {
                            that.listLoading = false;
                            console.info(res);
                            if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                that.$message.success("删除成功");
                                that.currentRow = {};
                                that.btnSearch();
                            }
                        });
                    }).catch(() => {
                        that.listLoading = false;
                        that.$message.error("删除失败");
                    });
                }
            },
            /**
             * 删除权限
             */
            btnAuthDelete(){
                let that = this;
                let ids = this.currentRowAuth.id;
                if (ids == ''||ids == null) {
                    this.$alert('请选择要删除的记录', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                } else {
                    this.$confirm('确认删除选中记录吗？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        that.authListLoading = true;
                        let param={
                            id:this.currentRowAuth.id//删除 权限ID
                        }
                        let url = "/authority/deleteAuthority";//删除权限
                        this.post_url(url, param, "删除失败！",that.authListLoading = false).then(function (res) {
                            that.authListLoading = false;
                            console.info(res);
                            if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                that.$message.success("删除成功");
                                that.currentRowAuth = {};
                                that.btnAuthSearch();
                            }
                        });
                    }).catch(() => {
                        that.authListLoading = false;
                        that.$message.error("删除失败");
                    });
                }
            },
            /**
             * 角色行选中改变事件
             */
            handleTableChange(row){
                let that = this;
                if(row!=null){
                    this.$nextTick(function(){
                        that.currentRow = row;
                        that.authSelect = [];
                        console.info("选中角色行",row)
                        let authList = row.authorities;
                        if (that.$refs.auth) {
                            that.$refs.auth.clearSelection();//清除全部的选中状态
                        }
                        for(let i = 0;i<that.authData.length;i++){
                            let authId = that.authData[i].id;
                            for(let j = 0;j<authList.length;j++){
                                let roleAuthId = authList[j].id;
                                if(authId==roleAuthId){
                                    that.$refs.auth.toggleRowSelection(that.authData[i],true);
                                    that.authSelect.push(that.authData[i].id)
                                    break;
                                }
                            }
                        }
                    })
                }

            },
            /**
             * 权限行选中改变事件
             */
            handleTableChangeAuth(row){
                let that = this;
                if(row!=null){
                    this.$nextTick(function(){
                        that.currentRowAuth = row;

                    })
                }
            },
            //勾选权限
            selectRow(selection,row){
                let that = this;
                that.authSelect = [];
                selection.forEach(function(item,index){
                    that.authSelect.push(item.id)
                })
            },
            //勾选全部权限
            selectAllRow(selection){
                let that = this;
                that.authSelect = [];
                selection.forEach(function(item,index){
                    that.authSelect.push(item.id)
                })
            },
            //修改角色的权限
            updateRoleAuthId(){
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.addLoading = true;
                    let that = this;
                    let url = "/role/updateAuthority";//修改角色下的权限
                    let param = {
                        roleId:that.currentRow.id,
                        authorities:that.authSelect
                    };
                    this.post_url(url, param, "修改角色下权限失败！", that.addLoading = false).then(function (res) {
                        that.addLoading = false;
                        console.info(res);
                        if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                            that.$message.success("修改角色下权限成功");
                            that.btnSearch();
                        }else{
                            that.$message.error("修改角色下权限失败");
                        }
                    }).catch(() => {
                        that.editLoading = false;
                        that.$message.error("修改角色下权限失败");
                    });
                });
            }
        }
    }
</script>

<style scoped>

</style>