<template>
    <div>
        <!--工具条-->
        <el-col :span="24"  style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" >
                <el-form-item prop="goodsId">
                    <el-select v-model="filters.goodsId" filterable placeholder="请选择">
                        <el-option
                                v-for="item in goodsList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="warehouseId">
                    <el-select v-model="filters.warehouseId" filterable placeholder="请选择" >
                        <el-option
                                v-for="item in warehouseList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
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

                    </el-dropdown-menu>
                </el-dropdown>
            </el-form>
        </el-col>
        <el-table
                ref="stock"
                :data="stockData"
                :header-cell-style="tableHeaderColor"
                border
                highlight-current-row
                @current-change="handleTableChange"
                style="width: 100%;" v-loading="listLoading">
            <el-table-column type="expand">
                <template slot-scope="date">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="商品大类">
                            <span>{{ date.row.goods.goodsCategory }}</span>
                        </el-form-item>
                        <el-form-item label="商品子类">
                            <span>{{ date.row.goods.goodsSubCategory }}</span>
                        </el-form-item>
                        <el-form-item label="计量单位">
                            <span>{{ date.row.goods.unit }}</span>
                        </el-form-item>
                        <el-form-item label="规格型号">
                            <span>{{ date.row.goods.type }}</span>
                        </el-form-item>
                        <el-form-item label="尺寸">
                            <span>{{ date.row.goods.size }}</span>
                        </el-form-item>
                        <el-form-item label="质量">
                            <span>{{ date.row.goods.weight }}</span>
                        </el-form-item>
                        <el-form-item label="保存温度">
                            <span>{{ date.row.goods.temperature }}</span>
                        </el-form-item>
                        <el-form-item label="参考价钱(元)">
                            <span>{{ date.row.goods.price }}</span>
                        </el-form-item>
                        <el-form-item label="物品描述">
                            <span>{{ date.row.goods.description }}</span>
                        </el-form-item>
                        <el-form-item label="登记时间">
                            <span>{{ date.row.goods.registerTime }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                    prop="goods.name"
                    sortable
                    label="商品名称">
            </el-table-column>
            <el-table-column
                    prop="quantity"
                    sortable
                    label="商品数量">
            </el-table-column>
            <el-table-column
                    prop="warehouse.name"
                    sortable
                    label="仓库名称">
            </el-table-column>
            <el-table-column
                    prop="warehouse.address"
                    sortable
                    label="仓库地址">
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" >
            <el-pagination layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="tableLength" style="float:right;">
            </el-pagination>
        </el-col>
        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                <el-form-item label="商品" prop="goodsId">
                    <el-select v-model="addForm.goodsId" filterable placeholder="请选择">
                        <el-option
                                v-for="item in goodsList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="仓库" prop="warehouseId">
                    <el-select v-model="addForm.warehouseId" filterable placeholder="请选择" >
                        <el-option
                                v-for="item in warehouseList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数量" prop="quantity">
                    <el-input-number v-model="addForm.quantity" auto-complete="off" ></el-input-number>
                </el-form-item>
                <el-form-item label="备注" prop="reason">
                    <el-input type="textarea" v-model="addForm.reason" auto-complete="off" rows="2"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Variable_global from '../global_variable.js'
    export default {
        name: "Stock",

        data(){
            return {
                page: 1,//当前页数
                pageSize:10,//一页显示几条
                listLoading: false,//table加载loading等待
                addFormVisible: false,//新增界面是否显示
                addLoading: false,//新增提交等待页面
                addFormRules: {
                    goodsId: [{ required: true, message: '请选择商品', trigger: 'change' },],
                    warehouseId: [{ required: true, message: '请选择仓库', trigger: 'change' },],
                    quantity: [{ required: true, message: '请输入数量', trigger: 'blur' },],
                    reason: [{ required: true, message: '请输入备注', trigger: 'blur' },],
                },
                //新增界面数据
                addForm: {
                    goodsId: '',
                    warehouseId: '',
                    quantity:'',
                    reason:'',
                },
                //筛选条件
                filters: {
                    goodsId: 0,
                    warehouseId:0,
                },
                stockData: [],//数据
                tableLength:0,//数据总个数
                // 更改表头样式
                tableHeaderColor ({ rowIndex}) {
                    if (rowIndex === 0) {
                        return 'background-color: #F5F7FA;'
                    }
                },
                currentRow:{},//行数据
                goodsList:[],//商品选择
                warehouseList:[],//仓库选择
            }
        },
        mounted(){
            this.searchGoodsList();
            this.searchWarehouseList();
            this.search();
        },
        methods: {
            //改变行选择事件
            handleTableChange(val){
                let that = this;
                if(val!=null){
                    that.currentRow = val;
                }

            },
            //查询全部商品
            searchGoodsList:function(){
                let that = this;
                let url = "/goods/searchAllGoods";
                let param = {
                };
                that.goodsList = [];
                this.post_url(url, param, "查询全部商品失败！", null).then(function (res) {
                    console.info("查询全部商品返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        let all = {
                            id:0,
                            name:'全部'
                        }
                        res.data.unshift(all);
                        that.goodsList = res.data;
                    }

                }).catch(()=>{
                    that.listLoading = false;
                    that.$message.error("服务器错误！")
                });
            },
            //查询全部仓库
            searchWarehouseList:function(){
                let that = this;
                let url = "/warehouse/searchAllWarehouses";
                let param = {
                };
                that.warehouseList = [];
                this.post_url(url, param, "查询全部仓库失败！", null).then(function (res) {
                    console.info("查询全部仓库返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        let all = {
                            id:0,
                            name:'全部'
                        }
                        res.data.unshift(all);
                        that.warehouseList = res.data;
                    }

                }).catch(()=>{
                    that.listLoading = false;
                    that.$message.error("服务器错误！")
                });
            },
            //查询库存信息
            search: function () {
                let that = this;
                let url = "/stock/searchStock";
                let param = {
                    goodsId:that.filters.goodsId,
                    warehouseId:that.filters.warehouseId,
                    size: that.pageSize,// 每页的记录数（行数）
                    page: that.page//第几条开始
                };
                that.stockData = [];
                that.listLoading = true;
                this.post_url(url, param, "查询库存信息失败！", that.listLoading = false).then(function (res) {
                    that.listLoading = false;
                    console.info("查询库存信息返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.stockData = res.data.list;
                        that.tableLength = res.data.total;
                    }

                }).catch(()=>{
                    that.listLoading = false;
                    that.$message.error("服务器错误！")
                });
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
                    goodsId: 0,
                    warehouseId:0,
                };
                this.search();
            },
            //新增
            btnNew() {
                let that = this;
                that.addFormVisible = true;//打开新增页面
                that.addForm = {
                    goodsId: '',
                    warehouseId: '',
                    quantity:'',
                    reason:'',
                };//重置form信息
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let that = this;
                            let url = "/stock/modifyStock";//新增供应商
                            let param = that.addForm;
                            this.post_url(url, param, "新增库存失败！", that.addLoading = false).then(function (res) {
                                that.addLoading = false;
                                console.info(res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("新增库存成功");
                                    that.addFormVisible = false;
                                    that.addForm = {
                                        goodsId: '',
                                        warehouseId: '',
                                        quantity:'',
                                        reason:''};
                                    that.search();
                                }else{
                                    that.$message.error("新增库存失败");
                                }
                            }).catch(() => {
                                that.editLoading = false;
                                that.$message.error("新增库存失败");
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

        },
    }
</script>

<style scoped>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 100px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 40%;
    }
    .el-carousel__item el-image {
        color: #475669;
        opacity: 0.75;
        margin: 0;
    }
</style>