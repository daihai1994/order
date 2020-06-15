<template>
    <div>
        <!--工具条-->
        <el-col :span="24"  style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" >
                <el-form-item prop="operator">
                    <el-input v-model="filters.operator" placeholder="操作人"  prefix-icon="el-icon-search"></el-input>
                </el-form-item>
                <el-form-item prop="ip">
                    <el-input v-model="filters.ip" placeholder="IP地址"  prefix-icon="el-icon-search"></el-input>
                </el-form-item>
                <el-form-item prop="type">
                    <el-select v-model="filters.type" placeholder="请选择" >
                        <el-option
                                v-for="item in loggerTypes"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="time">
                    <el-date-picker v-model="filters.times" type="daterange" range-separator="至" start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    format="yyyy 年 MM 月 dd 日"
                                    value-format="timestamp"
                                    @change="timeChange">
                    </el-date-picker>
                </el-form-item>
                <el-dropdown split-button type="primary" @click="btnSearch" trigger="click" style="margin-right: 20px">
                    搜索
                    <el-dropdown-menu slot="dropdown" trigger="click">
                        <el-dropdown-item @click.native="btnReset">重置</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-form>
        </el-col>
        <el-table
                ref="logger"
                :data="loggerData"
                :header-cell-style="tableHeaderColor"
                border
                highlight-current-row
                @current-change="handleTableChange"
                style="width: 100%;" v-loading="listLoading">
            <el-table-column
                    prop="operator"
                    sortable
                    label="操作人">
            </el-table-column>
            <el-table-column
                    prop="ip"
                    sortable
                    label="IP">
            </el-table-column>
            <el-table-column
                    prop="info"
                    sortable
                    label="操作内容">
            </el-table-column>
            <el-table-column
                    prop="time"
                    sortable
                    label="操作时间">
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" >
            <el-pagination layout="total, sizes, prev, pager, next, jumper"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="tableLength" style="float:right;">
            </el-pagination>
        </el-col>
    </div>
</template>

<script>
    import Variable_global from '../global_variable.js'
    export default {
        name: "logger",

        data(){
            return {
                page: 1,//当前页数
                pageSize:10,//一页显示几条
                listLoading: false,//table加载loading等待
                loggerTypes:[],//日子类型
                //筛选条件
                filters: {
                    operator: '',
                    type:"",
                    ip:"",
                    times:[],
                    startTime:"",
                    endTime:"",

                },
                loggerData: [],//数据
                tableLength:0,//数据总个数
                // 更改表头样式
                tableHeaderColor ({ rowIndex}) {
                    if (rowIndex === 0) {
                        return 'background-color: #F5F7FA;'
                    }
                },
                currentRow:{},//行数据
            }
        },
        methods: {
            //改变行选择事件
            handleTableChange(val){
                let that = this;
                if(val!=null){
                    that.currentRow = val;
                }

            },
            //查询日子类型
            searchTypes:function(){
                let that = this;
                let url = "/log/searchTypes";
                let param = {};
                that.loggerTypes = [];
                this.post_url(url, param, "查询日志类型失败！", null).then(function (res) {
                    console.info("查询日志类型返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.loggerTypes = res.data;
                        if(res.data.length>0){
                            that.filters.type = res.data[0].id;
                            that.search();
                        }
                    }

                }).catch((res)=>{
                    console.info(res)
                    that.$message.error("服务器错误！")
                });
            },
            //查询供应商
            search: function () {
                let that = this;
                let url = "/log/searchLogs";
                let param = {
                    operator:that.filters.operator,
                    type:that.filters.type,
                    startTime:that.filters.startTime,
                    endTime:that.filters.endTime,
                    ip:that.filters.ip,
                    size: that.pageSize,// 每页的记录数（行数）
                    page: that.page//第几条开始
                };
                that.loggerData = [];
                that.listLoading = true;
                this.post_url(url, param, "查询日志失败！", that.listLoading = false).then(function (res) {
                    that.listLoading = false;
                    console.info("查询日志返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.loggerData = res.data.list;
                        that.tableLength = res.data.total;
                    }

                }).catch(()=>{
                    that.listLoading = false;
                    that.$message.error("服务器错误！")
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
                this.filters.username = "";
                this.filters.modular = "";
                this.search();
            },
            /**
             * 搜索
             */
            btnSearch: function () {
                this.search();
            },
            /*时间段输入框值发生改变时触发 value：当前输入框值*/
            timeChange(value) {
                let that = this;
                let articleNum = ''
                let type = ''
                if (type !== " ") {
                    type = this.type
                }
                if (this.articleNum !== " ") {
                    articleNum = this.articleNum
                }
                let startTime = ''
                let endTime = ''
                if (this.times != null) {
                    startTime = value[0]
                    endTime = value[1]
                }
                that.filters.startTime = this.timestampToTime(value[0]);
                that.filters.endTime = this.timestampToTime(value[1]);
                console.info("开始时间",that.filters.startTime);
                console.info("结束时间",that.filters.endTime);
            },

        },
        mounted(){
            let timestampBt = this.defaultTime(new Date(),-30);
            let timestampEt = new Date().getTime();
            this.filters.startTime = this.timestampToTime(timestampBt);
            this.filters.endTime = this.timestampToTime(timestampEt);
            this.filters.times.push(timestampBt);
            this.filters.times.push(timestampEt);
            this.searchTypes();
        }
    }
</script>

<style scoped>
</style>