<template>
    <div>
        <el-col :span="18"  style="padding-bottom: 0px;">
            <!--工具条-->
            <el-col :span="24"  style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item   prop="name">
                        <el-input v-model="filters.name" placeholder="仓库名称"  prefix-icon="el-icon-search"></el-input>
                    </el-form-item>
                    <el-form-item   prop="phone">
                        <el-input v-model="filters.address" placeholder="仓库地址"  prefix-icon="el-icon-search"></el-input>
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
                    ref="wareHouse"
                    :data="tableData"
                    :header-cell-style="tableHeaderColor"
                    border
                    highlight-current-row
                    @current-change="handleTableChange"
                    style="width: 100%;" v-loading="listLoading">
                <el-table-column
                        prop="name"
                        sortable
                        label="仓库名称">
                </el-table-column>
                <el-table-column
                        prop="address"
                        sortable
                        label="仓库地址">
                </el-table-column>
                <el-table-column
                        prop="effective"
                        label="状态"
                        :formatter="effectiveHandle">
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-col :span="24" >
                <el-pagination layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="tableLength" style="float:right;">
                </el-pagination>
            </el-col>
        </el-col>
        <el-col :span="6"  style="padding-bottom: 0px;padding-left: 10px">
            <!--工具条-->
            <el-col :span="24"  style="padding-bottom: 0px;height: 62px">
                <el-row style="text-align:center" >
                    <el-button type="primary" :disabled="disabledOperation" @click="updateWareHouseManager">修改</el-button>
                </el-row>
            </el-col>
            <el-table
                    ref="warehouseManager"
                    :data="tableUserData"
                    :header-cell-style="tableHeaderColor"
                    border
                    highlight-current-row
                    @select="selectRow"
                    @select-all="selectAllRow"
                    style="width: 100%;"
                    v-loading="listUserLoading">
                <el-table-column
                        width="55"
                        type="selection">
                </el-table-column>
                <el-table-column
                        prop="name"
                        sortable
                        label="用户名称">
                </el-table-column>
            </el-table>
        </el-col>
        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                <el-form-item label="仓库名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="仓库地址" prop="address">
                    <el-input v-model="addForm.address" auto-complete="off" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="仓库名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="仓库地址" prop="username">
                    <el-input v-model="editForm.address" auto-complete="off" readonly onfocus="this.removeAttribute('readonly');"></el-input>
                </el-form-item>
                <el-form-item label="失效" prop="effective">
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
    </div>
</template>

<script>
    import Variable_global from '../global_variable.js'
    export default {
        name: "Warehouse",

        data(){
            return {
                disabled:true,//默认右侧新增/删除仓库人员按钮为禁用
                page: 1,//当前页数
                pageSize:10,//一页显示几条
                listLoading: false,//table加载loading等待
                listUserLoading:false,//仓库对应管理人员的loading等待
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,//编辑提交等待页面
                editFormRules: {//编辑页面不能为空
                    name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' },],
                    address: [{ required: true, message: '请输入仓库地址', trigger: 'blur'}],
                    effective:[{ required: true, message: '请选择是否有效', trigger: 'change'}],
                },
                //编辑界面数据
                editForm: {
                    name: '',
                    address: '',
                    effective:1,
                    id:0,
                },
                currentRow:{},//选择行数据
                addFormVisible: false,//新增界面是否显示
                addLoading: false,//新增提交等待页面
                addFormRules: {
                    name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' },],
                    address: [{ required: true, message: '请输入仓库地址', trigger: 'blur'}],
                },
                //新增界面数据
                addForm: {
                    name: '',
                    address:""
                },
                //筛选条件
                filters: {
                    name: '',
                    address:'',
                    effective:2
                },
                tableData: [],//数据
                tableLength:0,//数据总个数
                tableUserData:[],//仓库所对应的管理者人员信息
                tableAllUserData:[],//所有的人员
                // 更改表头样式
                tableHeaderColor ({ rowIndex}) {
                    if (rowIndex === 0) {
                        return 'background-color: #F5F7FA;'
                    }
                },
                handleVisible:false,//新增/修改/删除仓库管理人员
                //编辑页面是否有效
                effectiveList:[{
                    value: 0,
                    label: '无效'
                },{
                    value: 1,
                    label: '有效'
                },],
                //操作按钮
                disabledOperation:true,
                //仓库管理用户选中状态
                operationSelect:[],
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
            }
        },
        methods: {
            //对是否失效处理
            effectiveHandle(row){
                if (row.effective==1) {
                    return '有效'
                }else{
                    return '无效'
                }
            },
            //勾选用户
            selectRow(selection,row){
                let that = this;
                that.operationSelect = [];
                selection.forEach(function(item,index){
                    that.operationSelect.push(item.username)
                })
            },
            //勾选全部用户
            selectAllRow(selection){
                let that = this;
                that.operationSelect = [];
                selection.forEach(function(item,index){
                    that.operationSelect.push(item.username)
                })
            },
            //改变行选择事件
            handleTableChange(val){
                let that = this;
                this.$nextTick(function(){
                    that.currentRow = val;
                    that.disabledOperation = false;
                    that.operationSelect = [];
                    let userOperationList = val.warehouseManager;
                    if (that.$refs.warehouseManager) {
                        that.$refs.warehouseManager.clearSelection();//清除全部的选中状态
                    }
                    for(let i = 0;i<that.tableUserData.length;i++){
                        let userName = that.tableUserData[i].username;
                        for(let j = 0;j<userOperationList.length;j++){
                            let operationUserName = userOperationList[j].username;
                            if(userName==operationUserName){
                                that.$refs.warehouseManager.toggleRowSelection(that.tableUserData[i],true);
                                that.operationSelect.push(that.tableUserData[i].username)
                                break;
                            }
                        }
                    }
                })


            },
            //查询仓库管理语句
            searchWareHouseOperation: function () {
                this.listLoading = true;
                let that = this;
                that.tableData = [];
                let url = "/warehouse/searchWarehouses";
                let param = {
                    name: that.filters.name,
                    address: that.filters.address,
                    size: that.pageSize,// 每页的记录数（行数）
                    page: that.page,//第几条开始
                    effective:that.filters.effective,
                }
                this.post_url(url, param, "查询失败！", that.listLoading = false).then(function (res) {
                    that.listLoading = false;
                    console.info(res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.tableData = res.data.list;
                        that.tableLength = res.data.total;
                        if(res.data.total>0){
                            that.$refs.wareHouse.setCurrentRow(res.data.list[0]);
                        }else{
                            that.disabledOperation = true;
                        }
                    }
                }).catch(()=>{
                    that.listLoading = false;
                    that.$message.error("查询失败！")
                });
            },
            //查询仓库管理用户语句
            search: function () {
                let that = this;
                let url = "/user/searchUserByRoleId";
                let param = {
                    roleId:2//仓库管理员ID 测试阶段，写死
                }
                that.tableUserData = [];
                this.post_url(url, param, "查询失败！", that.listUserLoading = false).then(function (res) {
                    that.listUserLoading = false;
                    console.info(res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.tableUserData = res.data;
                    }

                }).catch(()=>{
                    that.listUserLoading = false;
                    that.$message.error("查询失败！")
                });
                setTimeout(that.searchWareHouseOperation(),100);
            },
            //初始页page、初始每页数据数pageSize和数据data
            handleSizeChange(size) {
                if (size != this.pageSize) {
                    this.pageSize = size;
                    this.search();
                }
            },
            handleCurrentChange(val) {
                if (val != this.page) {
                    this.page = val;
                    this.search();
                }
            },
            //重置
            btnReset() {
                this.filters = {
                    name: '',
                    address:'',
                    effective:2
                };
                this.search();
            },
            //新增
            btnNew() {
                let that = this;
                that.addFormVisible = true;//打开新增页面
                that.addForm = {};//重置form信息
            },
            //删除
            btnDelete() {
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
                            id:this.currentRow.id//删除 仓库ID
                        }
                        let url = "/warehouse/deleteWarehouse";//删除仓库
                        this.post_url(url, param, "删除失败！",that.listLoading = false).then(function (res) {
                            that.listLoading = false;
                            console.info(res);
                            if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                that.$message.success("删除成功");
                                that.currentRow = {};
                                that.search();
                            }
                        });
                    }).catch(() => {
                        that.listLoading = false;
                        that.$message.error("删除失败");
                    });
                }
            },
            //打开编辑页面
            btnEdit:function(){
                let that = this;
                if(this.currentRow.id==null){
                    this.$alert('请选择要编辑的数据', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                }else{
                    that.editFormVisible = true;//打开新增页面
                    that.editForm = {
                        name: this.currentRow.name,//名称
                        address: this.currentRow.address,//地址
                        effective: this.currentRow.effective,//是否有效
                        id:this.currentRow.id
                    };
                }
            },
            //提交编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let that = this;
                            let url = "/warehouse/updateWarehouse";//编辑提交
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
                                that.editLoading = false;
                                that.$message.error("修改失败");
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
                            let url = "/warehouse/addWarehouse";//新增用户
                            let param = that.addForm;
                            this.post_url(url, param, "新增失败！", that.addLoading = false).then(function (res) {
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
                                that.editLoading = false;
                                that.$message.error("新增失败");
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
             * 修改仓库管理权限
             */
            updateWareHouseManager:function(){
                let that = this;
                that.handleVisible = true;
                console.info("用户ID",that.operationSelect)
                let id = that.currentRow.id;//仓库ID
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.addLoading = true;
                    let url = "/warehouse/updateWarehouseManager";//修改仓库管理员
                    let param = {
                        wareHouseId:that.currentRow.id,
                        wareHouseManager:that.operationSelect
                    };
                    this.post_url(url, param, "修改仓库管理员失败！", that.addLoading = false).then(function (res) {
                        that.addLoading = false;
                        console.info(res);
                        if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                            that.$message.success("修改仓库管理员成功");
                            that.search();
                        }else{
                            that.$message.error("修改仓库管理员失败");
                        }
                    }).catch(() => {
                        that.$message.error("修改仓库管理员失败");
                    });
                });
            },
        },
        mounted(){
            this.search();
        }
    }
</script>

<style scoped>
</style>