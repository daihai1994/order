<template>
    <el-row>
        <el-col :span="6">
                    <!-- ************************************物品大类*************************************************** -->

            <span style="font-size: 20px;">物品大类</span>
            <!--工具条-->
            <el-col :span="24"  style="padding-bottom: 0px;margin-top: 15px">
                <el-form :inline="true" :model="goodsCategory" >
                    <el-form-item  prop="name" style="margin-right: 10px">
                        <el-input v-model="goodsCategory.name" placeholder="名称" style="width: 150px"  prefix-icon="el-icon-search" ></el-input>
                    </el-form-item>
                    <el-form-item  prop="effective" style="margin-right: 10px">
                        <el-select v-model="goodsCategory.effective" placeholder="请选择" style="width: 100px" >
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="margin-right: 5px" >
                        <el-button type="primary" @click.native="btnSearchGoodsCategory" :loading="false" style="margin-right: 10px;"  >搜索</el-button>
                        <el-dropdown split-button type="primary" @click="btnNewGoodsCategory" trigger="click" style="width:100px " >
                            新增
                            <el-dropdown-menu slot="dropdown" trigger="click">
                                <el-dropdown-item  @click.native="btnEditGoodsCategory">编辑</el-dropdown-item>
                                <el-dropdown-item  @click.native="btnDeleteGoodsCategory">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-table
                    ref="goodsCategory"
                    :data="goodsCategoryData"
                    :header-cell-style="tableHeaderColor"
                    border
                    highlight-current-row
                    @current-change="rowChangeGoodsCategoryData"
                    style="width: 100%;" :v-loading="goodsCategoryLoading">
                <el-table-column
                        prop="name"
                        sortable
                        label="名称">
                </el-table-column>
                <el-table-column
                        prop="effective"
                        label="状态"
                        :formatter="effectiveHandle">
                </el-table-column>
            </el-table>
            <!--分页工具条-->
            <el-col :span="24" >
                <el-pagination small layout="total, sizes, prev, pager, next, jumper"
                               @size-change="handleSizeChangeGoodsCategory"
                               @current-change="handleCurrentChangeGoodsCategory"
                               :page-sizes="[10, 20, 50, 100]"
                               :page-size="pageSizeGoodsCategory"
                               :total="tableLengthGoodsCategory" style="float:right;">
                </el-pagination>
            </el-col>
        </el-col>
        <!-- ************************************物品大类新增*************************************************** -->
        <el-dialog title="物品大类新增" :visible.sync="addFormVisibleGoodsCategory" :close-on-click-modal="false">
            <el-form :model="addFormGoodsCategory" label-width="100px" :rules="addFormGoodsCategoryRules" ref="addFormGoodsCategory">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addFormGoodsCategory.name" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisibleGoodsCategory = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmitGoodsCategory" :loading="addLoadingGoodsCategory">提交</el-button>
            </div>
        </el-dialog>
        <!-- ************************************物品大类编辑*************************************************** -->
        <el-dialog title="物品大类编辑" :visible.sync="editFormVisibleGoodsCategory" :close-on-click-modal="false">
            <el-form :model="editFormGoodsCategory" label-width="100px" :rules="editFormGoodsCategoryRules" ref="editFormGoodsCategory">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editFormGoodsCategory.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="失效" prop="role_id">
                    <el-select v-model="editFormGoodsCategory.effective" placeholder="请选择" >
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
                <el-button @click.native="editFormVisibleGoodsCategory = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmitGoodsCategory" :loading="editLoadingGoodsCategory">提交</el-button>
            </div>
        </el-dialog>
        <el-col :span="6" style="margin-left: 10px;margin-right: 10px">
            <!-- ************************************物品子类*************************************************** -->
            <span style="font-size: 20px;">物品子类</span>
            <el-col :span="24"  style="padding-bottom: 0px;margin-top: 15px">
                <el-form :inline="true" :model="goodsSubCategory" >
                    <el-form-item prop="name" style="margin-right: 10px">
                        <el-input v-model="goodsSubCategory.name" placeholder="名称" style="width: 150px"   prefix-icon="el-icon-search"></el-input>
                    </el-form-item>
                    <el-form-item prop="effective" style="margin-right: 10px">
                        <el-select v-model="goodsSubCategory.effective" placeholder="请选择" style="width: 100px" >
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="margin-right: 5px">
                        <el-button type="primary" @click.native="btnSearchGoodsSubCategory" :loading="false" style="margin-right: 10px"  >搜索</el-button>
                        <el-dropdown split-button type="primary" @click="btnNewGoodsSubCategory" trigger="click"  >
                            新增
                            <el-dropdown-menu slot="dropdown" trigger="click">
                                <el-dropdown-item  @click.native="btnEditGoodsSubCategory">编辑</el-dropdown-item>
                                <el-dropdown-item  @click.native="btnDeleteGoodsSubCategory">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-table
                    ref="goodsSubCategory"
                    :data="goodsSubCategoryData"
                    :header-cell-style="tableHeaderColor"
                    border
                    highlight-current-row
                    @current-change="rowChangeGoodsSubCategoryData"
                    style="width: 100%;" v-loading="goodsSubCategoryLoading">
                <el-table-column
                        prop="name"
                        sortable
                        label="名称">
                </el-table-column>
                <el-table-column
                        prop="effective"
                        label="状态"
                        :formatter="effectiveHandle">
                </el-table-column>
            </el-table>
            <!--分页工具条-->
            <el-col :span="24" >
                <el-pagination small layout="total, sizes, prev, pager, next, jumper"
                               @size-change="handleSizeChangeGoodsSubCategory"
                               @current-change="handleCurrentChangeGoodsSubCategory"
                               :page-sizes="[10, 20, 50, 100]"
                               :page-size="pageSizeGoodsSubCategory"
                               :total="tableLengthGoodsSubCategory" style="float:right;">
                </el-pagination>
            </el-col>
            <!-- ************************************物品子类新增*************************************************** -->
            <el-dialog title="物品子类新增" :visible.sync="addFormVisibleGoodsSubCategory" :close-on-click-modal="false">
                <el-form :model="addFormGoodsSubCategory" label-width="100px" :rules="addFormGoodsSubCategoryRules" ref="addFormGoodsSubCategory">
                    <el-form-item label="大类" prop="goodsCategoryId">
                        <el-select v-model="addFormGoodsSubCategory.goodsCategoryId" filterable placeholder="请选择" >
                            <el-option
                                    v-for="item in goodsCategoryList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="addFormGoodsSubCategory.name" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addFormVisibleGoodsSubCategory = false">取消</el-button>
                    <el-button type="primary" @click.native="addSubmitGoodsSubCategory" :loading="addLoadingGoodsSubCategory">提交</el-button>
                </div>
            </el-dialog>
            <!-- ************************************物品子类编辑*************************************************** -->
            <el-dialog title="物品子类编辑" :visible.sync="editFormVisibleGoodsSubCategory" :close-on-click-modal="false">
                <el-form :model="editFormGoodsSubCategory" label-width="100px" :rules="editFormGoodsSubCategoryRules" ref="editFormGoodsSubCategory">
                    <el-form-item label="大类" prop="goodsCategoryId">
                        <el-select v-model="editFormGoodsSubCategory.goodsCategoryId" filterable placeholder="请选择" >
                            <el-option
                                    v-for="item in goodsCategoryList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="editFormGoodsSubCategory.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="失效" prop="role_id">
                        <el-select v-model="editFormGoodsSubCategory.effective" placeholder="请选择" >
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
                    <el-button @click.native="editFormVisibleGoodsSubCategory = false">取消</el-button>
                    <el-button type="primary" @click.native="editSubmitGoodsSubCategory" :loading="editLoadingGoodsSubCategory">提交</el-button>
                </div>
            </el-dialog>
        </el-col>
        <el-col :span="11">
            <!-- ************************************物品*************************************************** -->
            <span style="font-size: 20px;">物品</span>
            <el-col :span="24"  style="padding-bottom: 0px;margin-top: 15px">
                <el-form :inline="true" :model="goods" class="user_form" >
                    <el-form-item  prop="name" style="margin-right: 10px">
                        <el-input v-model="goods.name" placeholder="名称" style="width: 150px"   prefix-icon="el-icon-search"></el-input>
                    </el-form-item>
                    <el-form-item  prop="abbreviation" style="margin-right: 10px">
                        <el-input v-model="goods.abbreviation" placeholder="简称" style="width: 150px"   prefix-icon="el-icon-search"></el-input>
                    </el-form-item>
                    <el-form-item  prop="effective" style="margin-right: 10px">
                        <el-select v-model="goods.effective" placeholder="请选择" style="width: 100px" >
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  style="margin-right: 10px">
                        <el-button type="primary" @click.native="btnSearchGoods" :loading="false" style="margin-right: 10px" >搜索</el-button>
                        <el-dropdown split-button type="primary" @click="btnNewGoods" trigger="click" >
                            新增
                            <el-dropdown-menu slot="dropdown" trigger="click">
                                <el-dropdown-item  @click.native="btnEditGoods">编辑</el-dropdown-item>
                                <el-dropdown-item  @click.native="btnDeleteGoods">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-table
                    :data="goodsData"
                    :header-cell-style="tableHeaderColor"
                    border
                    highlight-current-row
                    @current-change="rowChangeGoodsData"
                    style="width: 100%;" v-loading="goodsLoading">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="计量单位">
                                <span>{{ props.row.unit }}</span>
                            </el-form-item>
                            <el-form-item label="规格型号">
                                <span>{{ props.row.type }}</span>
                            </el-form-item>
                            <el-form-item label="尺寸">
                                <span>{{ props.row.size }}</span>
                            </el-form-item>
                            <el-form-item label="质量">
                                <span>{{ props.row.weight }}</span>
                            </el-form-item>
                            <el-form-item label="保存温度">
                                <span>{{ props.row.temperature }}</span>
                            </el-form-item>
                            <el-form-item label="参考价钱(元)">
                                <span>{{ props.row.price }}</span>
                            </el-form-item>
                            <el-form-item label="物品描述">
                                <span>{{ props.row.description }}</span>
                            </el-form-item>
                            <el-form-item label="登记时间">
                                <span>{{ props.row.registerTime }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="name"
                        sortable
                        label="名称">
                </el-table-column>
                <el-table-column
                        prop="abbreviation"
                        sortable
                        label="简称">
                </el-table-column>
                <el-table-column
                        prop="effective"
                        label="状态"
                        :formatter="effectiveHandle">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="operationPicture(scope.row)" type="text" size="small">图片操作</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页工具条-->
            <el-col :span="24" >
                <el-pagination small layout="total, sizes, prev, pager, next, jumper"
                               @size-change="handleSizeChangeGoods"
                               @current-change="handleCurrentChangeGoods"
                               :page-sizes="[10, 20, 50, 100]"
                               :page-size="pageSizeGoods"
                               :total="tableLengthGoods" style="float:right;">
                </el-pagination>
            </el-col>
            <!-- ************************************物品新增*************************************************** -->
            <el-dialog title="物品新增" :visible.sync="addFormVisibleGoods" :close-on-click-modal="false">
                <el-form :model="addFormGoods" label-width="100px" :rules="addFormGoodsRules" ref="addFormGoods">
                    <el-form-item label="大类" prop="goodsCategoryId">
                        <el-select v-model="addFormGoods.goodsCategoryId" filterable placeholder="请选择" @change="goodsCategoryChange" >
                            <el-option
                                    v-for="item in goodsCategoryList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="子类" prop="goodsSubCategoryId">
                        <el-select v-model="addFormGoods.goodsSubCategoryId" filterable placeholder="请选择" >
                            <el-option
                                    v-for="item in goodsSubCategoryList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="addFormGoods.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="简称" prop="abbreviation">
                        <el-input v-model="addFormGoods.abbreviation" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="计量单位" prop="unit">
                        <el-input v-model="addFormGoods.unit" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="规格型号" prop="type">
                        <el-input v-model="addFormGoods.type" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="尺寸" prop="size">
                        <el-input v-model="addFormGoods.size" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="质量" prop="weight">
                        <el-input type="number" v-model.number="addFormGoods.weight" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="保存温度" prop="temperature">
                        <el-input type="number" v-model.number="addFormGoods.temperature" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="参考报价" prop="price">
                        <el-input type="number" v-model.number="addFormGoods.price" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="物品描述" prop="description">
                        <el-input v-model="addFormGoods.description" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addFormVisibleGoods = false">取消</el-button>
                    <el-button type="primary" @click.native="addSubmitGoods" :loading="addLoadingGoods">提交</el-button>
                </div>
            </el-dialog>
            <!-- ************************************物品编辑*************************************************** -->
            <el-dialog title="物品编辑" :visible.sync="editFormVisibleGoods" :close-on-click-modal="false">
                <el-form :model="editFormGoods" label-width="100px" :rules="editFormGoodsRules" ref="editFormGoods">
                    <el-form-item label="失效" prop="role_id">
                        <el-select v-model="editFormGoods.effective" placeholder="请选择" >
                            <el-option
                                    v-for="item in effectiveList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="大类" prop="goodsCategoryId">
                        <el-select v-model="editFormGoods.goodsCategoryId" filterable placeholder="请选择" @change="goodsCategoryChangeUpdate" >
                            <el-option
                                    v-for="item in goodsCategoryList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="子类" prop="goodsSubCategoryId">
                        <el-select v-model="editFormGoods.goodsSubCategoryId" filterable placeholder="请选择" >
                            <el-option
                                    v-for="item in goodsSubCategoryList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="editFormGoods.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="简称" prop="abbreviation">
                        <el-input v-model="editFormGoods.abbreviation" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="计量单位" prop="unit">
                        <el-input v-model="editFormGoods.unit" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="规格型号" prop="type">
                        <el-input v-model="editFormGoods.type" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="尺寸" prop="size">
                        <el-input v-model="editFormGoods.size" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="质量" prop="weight">
                        <el-input type="number" v-model.number="editFormGoods.weight" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="保存温度" prop="temperature">
                        <el-input type="number" v-model.number="editFormGoods.temperature" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="参考报价" prop="price">
                        <el-input type="number" v-model.number="editFormGoods.price" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="物品描述" prop="description">
                        <el-input v-model="editFormGoods.description" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editFormVisibleGoods = false">取消</el-button>
                    <el-button type="primary" @click.native="editSubmitGoods" :loading="editLoadingGoods">提交</el-button>
                </div>
            </el-dialog>
            <!-- ************************************物品图片操作*************************************************** -->
            <el-dialog title="物品图片操作" center :visible.sync="editFormVisibleGoodsPicture" :close-on-click-modal="false" width="63%" style="align-items: center">
                <el-upload
                        class="upload-demo"
                        ref="upload"
                        action="#"
                        :on-preview="handlePreview"
                        :on-change="handleChange"
                        :on-remove="handleRemove"
                        :on-exceed="handleExceed"
                        :file-list="fileList"
                        name="picture"
                        :http-request="uploadFile"
                        list-type="picture"
                        multiple
                        :limit="limitSize"
                        :data='pictureGoodsId'
                        :on-success="onSuccess"
                        :on-error="imgUploadError"
                        :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M，最多有5张</div>
                </el-upload>
                        <viewer :images="picturesList" style="">
                            <div v-for="item in pictures" style="width: 200px;height:200px;display: inline-block;margin-left: 5px" >
                                <span class="el-image-viewer__btn" style="width: 30px;height: 30px;background: white;font-size: 30px;position:relative;right: -170px;top:30px" @click="deleteGoodsPicture(item.id)">
                                  <i class="el-icon-circle-close" ></i>
                                </span>
                                <img  :src="item.url" :key="item.url" style="width: 200px;height:200px" >
                            </div>
                        </viewer>

            </el-dialog>
            <!--                                :preview-src-list="picturesList"-->

        </el-col>
    </el-row>
</template>
<style>
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
        width: 70%;
    }
    .el-carousel__item el-image {
        color: #475669;
        opacity: 0.75;
        margin: 0;
    }
</style>
<script>
    import Variable_global from "@/global_variable";
    import Viewer from 'v-viewer'

    export default {
        name: "Goods",
        data(){
            return{
                /************************物品大类**********************************/
                //物品大类筛选类 effective 0无效 1有效 2全部
                goodsCategory:{
                    name:'',
                    effective:2
                },
                //物品大类数据
                goodsCategoryData:[],
                //物品大类数据一共多少条
                tableLengthGoodsCategory:0,
                //物品大类table加载等待
                goodsCategoryLoading:false,
                //物品大类table默认一页行数
                pageSizeGoodsCategory:10,
                //物品大类table默认显示第几页
                pageGoodsCategory:1,
                //物品大类选中行
                goodsCategorySelect:{},
                //新增物品大类页面是否打开
                addFormVisibleGoodsCategory:false,
                //新增物品大类对象
                addFormGoodsCategory:{
                    name:""
                },
                //新增物品大类的规则
                addFormGoodsCategoryRules:{
                    name:[{required: true, message: '请输入名称', trigger: 'blur'}]
                },
                //提交新增物品大类等待状态
                addLoadingGoodsCategory:false,
                //修改物品大类页面是否打开
                editFormVisibleGoodsCategory:false,
                //修改物品大类对象
                editFormGoodsCategory:{
                    name:"",
                    id:0,
                    effective:0
                },
                //修改物品大类的规则
                editFormGoodsCategoryRules:{
                    name:[{required: true, message: '请输入名称', trigger: 'blur'}]
                },
                //提交修改物品大类等待状态
                editLoadingGoodsCategory:false,
                /************************物品子类**********************************/
                //物品子类筛选类 effective 0无效 1有效 2全部
                goodsSubCategory:{
                    name:'',
                    effective:2,
                    goodsCategoryId:0
                },
                goodsCategoryList:[],//物品大类，全部信息
                //物品子类数据
                goodsSubCategoryData:[],
                //物品子类数据一共多少条
                tableLengthGoodsSubCategory:0,
                //物品子类table加载等待
                goodsSubCategoryLoading:false,
                //物品子类table默认一页行数
                pageSizeGoodsSubCategory:10,
                //物品子类table默认显示第几页
                pageGoodsSubCategory:1,
                //物品子类选中行
                goodsSubCategorySelect:{},
                //新增物品子类页面是否打开
                addFormVisibleGoodsSubCategory:false,
                //新增物品子类对象
                addFormGoodsSubCategory:{
                    name:"",
                    goodsCategoryId:0
                },
                //新增物品子类的规则
                addFormGoodsSubCategoryRules:{
                    name:[{required: true, message: '请输入名称', trigger: 'blur'}]
                },
                //提交新增物品子类等待状态
                addLoadingGoodsSubCategory:false,
                //修改物品子类页面是否打开
                editFormVisibleGoodsSubCategory:false,
                //修改物品子类对象
                editFormGoodsSubCategory:{
                    name:"",
                    id:0,
                    effective:0,
                    goodsCategory:0
                },
                //修改物品子类的规则
                editFormGoodsSubCategoryRules:{
                    name:[{required: true, message: '请输入名称', trigger: 'blur'}]
                },
                //提交修改物品子类等待状态
                editLoadingGoodsSubCategory:false,
                /************************物品**********************************/
                //物品子类全部信息
                goodsSubCategoryList:[],
                //物品筛选类 effective 0无效 1有效 2全部
                goods:{
                    name:'',
                    abbreviation:'',//简称
                    effective:2,
                    goodsSubCategoryId:0
                },
                //物品数据
                goodsData:[],
                //物品数据一共多少条
                tableLengthGoods:0,
                //物品table加载等待
                goodsLoading:false,
                //物品table默认一页行数
                pageSizeGoods:10,
                //物品table默认显示第几页
                pageGoods:1,
                //物品选中行
                goodsSelect:{},
                //新增物品页面是否打开
                addFormVisibleGoods:false,
                //物品图片操作
                editFormVisibleGoodsPicture:false,
                //新增物品对象
                addFormGoods:{
                    name:"",
                    goodsCategoryId:0,
                    goodsSubCategoryId:0,
                    abbreviation:"",
                    unit:"",
                    type:"",
                    size:"",
                    weight:0,
                    temperature:0,
                    price:0,
                    description:"",
                },
                //新增物品的规则
                addFormGoodsRules:{
                    name:[{required: true, message: '请输入名称', trigger: 'blur'}],
                    goodsCategoryId:[{required: true, message: '请选择大类', trigger: 'change'}],
                    goodsSubCategoryId:[{required: true, message: '请选择子类', trigger: 'change'}],
                    abbreviation:[{required: true, message: '请输入简称', trigger: 'blur'}],
                    unit:[{required: true, message: '请输入计量单位', trigger: 'blur'}],
                    type:[{required: true, message: '请输入规格型号', trigger: 'blur'}],
                    size:[{required: true, message: '请输入尺寸', trigger: 'blur'}],
                    weight:[{required: true, message: '请输入质量', trigger: 'blur'}],
                    temperature:[{required: true, message: '请输入保存温度', trigger: 'blur'}],
                    price:[{required: true, message: '请输入参考价钱', trigger: 'blur'}],
                    description:[{required: true, message: '请输入物品描述', trigger: 'blur'}],

                },
                //提交新增物品等待状态
                addLoadingGoods:false,
                //修改物品页面是否打开
                editFormVisibleGoods:false,
                //修改物品对象
                editFormGoods:{
                    id:0,
                    name:"",
                    goodsCategoryId:0,
                    goodsSubCategoryId:0,
                    abbreviation:"",
                    unit:"",
                    type:"",
                    size:"",
                    weight:0,
                    temperature:0,
                    price:0,
                    description:"",
                    effective:0,
                },
                //修改物品的规则
                editFormGoodsRules:{
                    name:[{required: true, message: '请输入名称', trigger: 'blur'}],
                    goodsCategoryId:[{required: true, message: '请选择大类', trigger: 'change'}],
                    goodsSubCategoryId:[{required: true, message: '请选择子类', trigger: 'change'}],
                    abbreviation:[{required: true, message: '请输入简称', trigger: 'blur'}],
                    unit:[{required: true, message: '请输入计量单位', trigger: 'blur'}],
                    type:[{required: true, message: '请输入规格型号', trigger: 'blur'}],
                    size:[{required: true, message: '请输入尺寸', trigger: 'blur'}],
                    weight:[{required: true, message: '请输入质量', trigger: 'blur'}],
                    temperature:[{required: true, message: '请输入保存温度', trigger: 'blur'}],
                    price:[{required: true, message: '请输入参考价钱', trigger: 'blur'}],
                    description:[{required: true, message: '请输入物品描述', trigger: 'blur'}],
                },
                //提交修改物品等待状态
                editLoadingGoods:false,
                /**********************************公共信息***************************************************/
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
                //编辑页面是否有效
                effectiveList:[{
                    value: 0,
                    label: '无效'
                },{
                    value: 1,
                    label: '有效'
                },],
                // 更改表头样式
                tableHeaderColor ({ rowIndex}) {
                    if (rowIndex === 0) {
                        return 'background-color: #F5F7FA;'
                    }
                },
                //图片删除
                visible:false,
                //图片list
                pictures:[],
                //图片urllist
                picturesList:[],
                //要删除的照片ID
                pictureId:0,
                //新增图片按钮等待
                addLoadingGoodsPicture:false,
                //图片list
                fileList:[],
                fileData: '',  // 文件上传数据（多文件合一）
                //图片上传头
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                //图片上传的参数
                pictureGoodsId: {
                    goodsId:0,
                },
                //图片个数限制
                limitSize:5,
                //图片最多个数
                limitMaxSize:5,
            }
        },
        mounted(){
            this.btnSearchGoodsCategory();
        },
        methods: {
            // aaa(item){
            //     let viewer = new Viewer(document.getElementById(item.url), {
            //
            //         url: item.url,
            //
            //     });
            // },
            //对是否失效处理
            effectiveHandle(row){
                if (row.effective==1) {
                    return '有效'
                }else{
                    return '无效'
                }
            },
            /************************物品大类**********************************/
            //查询物品大类信息
            btnSearchGoodsCategory:function(){
                let that = this;
                //清理物品信息
                that.goods={
                        name:'',
                        abbreviation:'',//简称
                        effective:2,
                        goodsSubCategoryId:0
                }
                that.goodsData = [];
                that.tableLengthGoods = 0;
                //清理物品子类信息
                that.goodsSubCategory={
                    name:'',
                    effective:2,
                    goodsCategoryId:0
                }
                that.goodsSubCategoryData = [];
                that.tableLengthGoodsSubCategory = 0;
                //清理物品大类
                that.goodsCategoryData = [];
                that.tableLengthGoodsCategory = 0;
                that.goodsCategoryLoading = true;
                let url = "/goods/searchGoodsCategory";
                let param = {
                    name: that.goodsCategory.name,
                    effective: that.goodsCategory.effective,
                    size: that.pageSizeGoodsCategory,// 每页的记录数（行数）
                    page: that.pageGoodsCategory//第几条开始
                }
                this.post_url(url, param, "物品大类查询失败！", that.goodsCategoryLoading = false).then(function (res) {
                    that.goodsCategoryLoading = false;
                    console.info("查询物品大类返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.goodsCategoryData = res.data.list;
                        that.tableLengthGoodsCategory = res.data.total;
                        if(res.data.total>0){
                            that.$refs.goodsCategory.setCurrentRow(res.data.list[0]);
                        }
                    }
                }).catch(res=>{
                    console.info("查询物品大类返回体报错",res);
                    that.goodsCategoryLoading = false;
                });
            },
            //打开物品大类信息新增页面
            btnNewGoodsCategory:function(){
                let that = this;
                that.addFormVisibleGoodsCategory = true;//打开新增页面
                that.addFormGoodsCategory = {
                    name:""
                };//重置form信息
            },
            //提交新增物品大类信息
            addSubmitGoodsCategory:function(){
                this.$refs.addFormGoodsCategory.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoadingGoodsCategory = true;
                            let that = this;
                            let url = "/goods/addGoodsCategory";//新增物品大类
                            let param = that.addFormGoodsCategory;
                            this.post_url(url, param, "新增物品大类失败！",that.addLoadingGoodsCategory = false).then(function (res) {
                                that.addLoadingGoodsCategory = false;
                                console.info("新增物品大类返回体",res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("新增物品大类成功");
                                    that.addFormVisibleGoodsCategory = false;
                                    that.btnSearchGoodsCategory();
                                }else{
                                    that.$message.error("新增物品大类失败");
                                }
                            }).catch(() => {
                                that.addLoadingGoodsCategory = false
                            });
                        });
                    }
                });
            },
            //打开物品大类信息编辑页面
            btnEditGoodsCategory:function(){
                let that = this;
                if(this.goodsCategorySelect.name==null){
                    this.$alert('请选择要编辑的数据', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                }else{
                    console.info("是否有效",this.goodsCategorySelect.effective)
                    that.editFormVisibleGoodsCategory = true;//打开编辑页面
                    that.editFormGoodsCategory = {
                        name: this.goodsCategorySelect.name,//名称
                        id: this.goodsCategorySelect.id,//主键
                        effective:this.goodsCategorySelect.effective ,//是否有效
                    };//重置form信息
                }
            },
            //提交修改物品大类信息
            editSubmitGoodsCategory:function(){
                this.$refs.editFormGoodsCategory.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoadingGoodsCategory = true;
                            let that = this;
                            let url = "/goods/updateGoodsCategory";//修改物品大类
                            let param = that.editFormGoodsCategory;
                            this.post_url(url, param, "修改物品大类失败！",that.editLoadingGoodsCategory = false).then(function (res) {
                                that.editLoadingGoodsCategory = false;
                                console.info("修改物品大类返回体",res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("修改物品大类成功");
                                    that.editFormVisibleGoodsCategory = false;
                                    that.btnSearchGoodsCategory();
                                }else{
                                    that.$message.error("新增物品大类失败");
                                }
                            }).catch(() => {
                                that.editLoadingGoodsCategory = false
                            });
                        });
                    }
                });
            },
            //删除物品大类信息
            btnDeleteGoodsCategory:function(){
                let that = this;
                let ids = this.goodsCategorySelect.id;
                if (ids == ''||ids == null) {
                    this.$alert('请选择要删除的记录', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                } else {
                    this.$confirm('确认删除选中记录吗？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        that.goodsCategoryLoading = true;
                        let param={
                            id:this.goodsCategorySelect.id//删除 物品大类
                        }
                        let url = "/goods/deleteGoodsCategory";//删除物品大类
                        this.post_url(url, param, "删除物品大类失败！",that.goodsCategoryLoading = false).then(function (res) {
                            that.goodsCategoryLoading = false;
                            console.info(res);
                            if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                that.$message.success("删除物品大类成功");
                                that.btnSearchGoodsCategory();
                            }
                        });
                    }).catch(() => {
                        that.goodsCategoryLoading = false;
                        that.$message.warning("删除物品大类失败");
                    });
                }
            },
            //点击物品大类row触发事件
            rowChangeGoodsCategoryData:function(row){
                if(row!=null&&row.id!=null) {
                    this.goodsCategorySelect = row;
                    this.goodsSubCategory.goodsCategoryId = row.id;
                    this.btnSearchGoodsSubCategory();
                }
            },
            //物品大类table改变一页多少行触发事件
            handleSizeChangeGoodsCategory:function(size){
                if (size != this.pageSizeGoodsCategory) {
                    this.pageSizeGoodsCategory = size;
                    this.btnSearchGoodsCategory();
                }
            },
            //物品大类改变页面触发事件
            handleCurrentChangeGoodsCategory:function(page){
                if (page != this.pageGoodsCategory) {
                    this.pageGoodsCategory = page;
                    this.btnSearchGoodsCategory();
                }
            },
            /************************物品子类**********************************/
            //物品子类的查询
            btnSearchGoodsSubCategory:function(){
                let that = this;
                // 查询子类默认把物品删除
                that.goodsData = [];
                that.tableLengthGoods = 0;

                that.goodsSubCategoryData = [];
                that.tableLengthGoodsSubCategory = 0;
                that.goodsSubCategoryLoading = true;
                let url = "/goods/searchGoodsSubCategory";
                let param = {
                    name: that.goodsSubCategory.name,
                    effective: that.goodsSubCategory.effective,
                    size: that.pageSizeGoodsSubCategory,// 每页的记录数（行数）
                    page: that.pageGoodsSubCategory,//第几条开始
                    goodsCategoryId:that.goodsSubCategory.goodsCategoryId
                }
                this.post_url(url, param, "物品子类查询失败！", that.goodsSubCategoryLoading = false).then(function (res) {
                    that.goodsSubCategoryLoading = false;
                    console.info("查询物品子类返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.goodsSubCategoryData = res.data.list;
                        that.tableLengthGoodsSubCategory = res.data.total;
                        if(res.data.total>0){
                            that.$refs.goodsSubCategory.setCurrentRow(res.data.list[0]);
                        }
                    }
                }).catch(res=>{
                    console.info("查询物品子类返回体报错",res);
                    that.goodsSubCategoryLoading = false;
                });
            },
            //打开物品子类信息新增页面
            btnNewGoodsSubCategory:function(){
                let that = this;
                if(that.goodsCategorySelect.name==null){
                    that.$alert('请先选择物品大类', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                }else{
                    that.goodsCategoryList=[];
                    that.addFormVisibleGoodsSubCategory = true;//打开新增页面
                    that.addFormGoodsSubCategory = {
                        name:"",
                        goodsCategoryId:that.goodsCategorySelect.id,
                    };//重置form信息
                    let url = "/goods/searchAllGoodsCategory";//查询全部角色
                    let param = {};
                    this.post_url(url, param, "物品大类查询全部失败！").then(function (res) {
                        console.info(res);
                        if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                            that.goodsCategoryList = res.data;//物品大类List
                        }else{
                            that.$message.error("物品大类查询全部失败！");
                        }
                    }).catch(res=>{
                        console.info("物品大类查询全部失败",res);
                    });

                }
            },
            //物品子类新增的提交
            addSubmitGoodsSubCategory:function(){
                this.$refs.addFormGoodsSubCategory.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoadingGoodsSubCategory = true;
                            let that = this;
                            let url = "/goods/addGoodsSubCategory";//新增物品子类
                            let param = that.addFormGoodsSubCategory;
                            this.post_url(url, param, "新增物品子类失败！",that.addLoadingGoodsSubCategory = false).then(function (res) {
                                that.addLoadingGoodsSubCategory = false;
                                console.info("新增物品子类返回体",res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("新增物品子类成功");
                                    that.addFormVisibleGoodsSubCategory = false;
                                    that.btnSearchGoodsSubCategory();
                                }else{
                                    that.$message.error("新增物品子类失败");
                                }
                            }).catch(() => {
                                that.addLoadingGoodsSubCategory = false
                            });
                        });
                    }
                });
            },
            //打开物品子类信息编辑页面
            btnEditGoodsSubCategory:function(){
                let that = this;
                if(this.goodsSubCategorySelect.name==null){
                    this.$alert('请选择要编辑的数据', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                }else{
                    console.info("是否有效",this.goodsSubCategorySelect.effective)
                    that.editFormVisibleGoodsSubCategory = true;//打开编辑页面
                    that.editFormGoodsSubCategory = {
                        name: this.goodsSubCategorySelect.name,//名称
                        id: this.goodsSubCategorySelect.id,//主键
                        effective:this.goodsSubCategorySelect.effective ,//是否有效
                        goodsCategoryId:this.goodsSubCategorySelect.goodsCategoryId,//大类Id
                    };//重置form信息
                    let url = "/goods/searchAllGoodsCategory";//查询全部角色
                    let param = {};
                    this.post_url(url, param, "物品大类查询全部失败！").then(function (res) {
                        console.info(res);
                        if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                            that.goodsCategoryList = res.data;//物品大类List
                        }else{
                            that.$message.error("物品大类查询全部失败！");
                        }
                    }).catch(res=>{
                        console.info("物品大类查询全部失败",res);
                    });
                }
            },
            //物品子类修改提交
            editSubmitGoodsSubCategory:function(){
                this.$refs.editFormGoodsSubCategory.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoadingGoodsSubCategory = true;
                            let that = this;
                            let url = "/goods/updateGoodsSubCategory";//修改物品子类
                            let param = that.editFormGoodsSubCategory;
                            this.post_url(url, param, "修改物品子类失败！",that.editLoadingGoodsSubCategory = false).then(function (res) {
                                that.editLoadingGoodsSubCategory = false;
                                console.info("修改物品子类返回体",res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("修改物品子类成功");
                                    that.editFormVisibleGoodsSubCategory = false;
                                    that.btnSearchGoodsSubCategory();
                                }else{
                                    that.$message.error("新增物品子类失败");
                                }
                            }).catch(() => {
                                that.editLoadingGoodsSubCategory = false
                            });
                        });
                    }
                });
            },
            //删除物品子类信息
            btnDeleteGoodsSubCategory:function(){
                let that = this;
                let ids = this.goodsSubCategorySelect.id;
                if (ids == ''||ids == null) {
                    this.$alert('请选择要删除的记录', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                } else {
                    this.$confirm('确认删除选中记录吗？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        that.goodsSubCategoryLoading = true;
                        let param={
                            id:this.goodsSubCategorySelect.id//删除 物品子类
                        }
                        let url = "/goods/deleteGoodsSubCategory";//删除物品子类
                        this.post_url(url, param, "删除物品子类失败！",that.goodsSubCategoryLoading = false).then(function (res) {
                            that.goodsSubCategoryLoading = false;
                            console.info(res);
                            if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                that.$message.success("删除物品子类成功");
                                that.btnSearchGoodsSubCategory();
                            }
                        });
                    }).catch(() => {
                        that.goodsSubCategoryLoading = false;
                        that.$message.warning("删除物品子类失败");
                    });
                }
            },
            //点击物品子类row触发事件
            rowChangeGoodsSubCategoryData:function(row){
                if(row!=null&&row.id!=null){
                    this.goodsSubCategorySelect = row;
                    this.goods.goodsSubCategoryId = row.id;
                    this.btnSearchGoods();
                }
            },
            //物品子类table改变一页多少行触发事件
            handleSizeChangeGoodsSubCategory:function(size){
                if (size != this.pageSizeGoodsSubCategory) {
                    this.pageSizeGoodsSubCategory = size;
                    this.btnSearchGoodsSubCategory();
                }
            },
            //物品子类改变页面触发事件
            handleCurrentChangeGoodsSubCategory:function(page){
                if (page != this.pageGoodsSubCategory) {
                    this.pageGoodsSubCategory = page;
                    this.btnSearchGoodsSubCategory();
                }
            },
            /************************物品**********************************/
            //改变物品大类触发事件
            goodsCategoryChange:function(row){
                let that = this;
                that. goodsSubCategoryList= [];
                that.addFormGoods.goodsSubCategoryId = "";
                console.info("物品大类触发改变事件",row)
                let url = "/goods/searchAllGoodsSubCategory";//查询全部子类
                let param = {
                    goodsCategoryId:row
                };
                this.post_url(url, param, "物品子类查询全部失败！").then(function (res) {
                    console.info("物品子类查询全部",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.goodsSubCategoryList = res.data;//物品子类List
                        if(res.data.length>0){
                            that.addFormGoods.goodsSubCategoryId=res.data[0].id;
                        }
                    }else{
                        that.$message.error("物品子类查询全部失败！");
                    }
                }).catch(res=>{
                    console.info("物品子类查询全部失败",res);
                });
            },
            //改变物品大类触发事件
            goodsCategoryChangeUpdate:function(row){
                let that = this;
                that. goodsSubCategoryList= [];
                that.editFormGoods.goodsSubCategoryId = "";
                console.info("物品大类触发改变事件",row)
                let url = "/goods/searchAllGoodsSubCategory";//查询全部子类
                let param = {
                    goodsCategoryId:row
                };
                this.post_url(url, param, "物品子类查询全部失败！").then(function (res) {
                    console.info("物品子类查询全部",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.goodsSubCategoryList = res.data;//物品子类List
                        if(res.data.length>0){
                            that.editFormGoods.goodsSubCategoryId=res.data[0].id;
                        }
                    }else{
                        that.$message.error("物品子类查询全部失败！");
                    }
                }).catch(res=>{
                    console.info("物品子类查询全部失败",res);
                });
            },
            //物品的查询
            btnSearchGoods:function(){
                let that = this;
                that.goodsData = [];
                that.tableLengthGoods = 0;
                that.goodsLoading = true;
                let url = "/goods/searchGoodsByCategory";
                let param = {
                    name: that.goods.name,
                    abbreviation:that.goods.abbreviation,
                    effective: that.goods.effective,
                    size: that.pageSizeGoods,// 每页的记录数（行数）
                    page: that.pageGoods,//第几条开始
                    goodsSubCategoryId:that.goods.goodsSubCategoryId
                }
                this.post_url(url, param, "物品查询失败！", that.goodsLoading = false).then(function (res) {
                    that.goodsLoading = false;

                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        if(res.data.list!=null&&res.data.list.length>0){
                            for(let i = 0;i<res.data.list.length;i++){
                                let pictures = res.data.list[i].pictures;
                                for(let j = 0;j<pictures.length;j++){
                                    let picture = pictures[j].url;
                                    picture = that.getPath()+":"+that.getPort()+picture;
                                    pictures[j].url = picture;
                                }
                            }
                        }
                        that.goodsData = res.data.list;
                        that.tableLengthGoods = res.data.total;
                    }
                    console.info("查询物品返回体",res);
                }).catch(res=>{
                    console.info("查询物品返回体报错",res);
                    that.goodsLoading = false;
                });
            },
            //打开物品信息新增页面
            btnNewGoods:function(){
                let that = this;
                if(that.goodsSubCategorySelect.name==null){
                    that.$alert('请先选择物品子类', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                }else{
                    that.goodsCategoryList=[];
                    that.goodsSubCategoryList=[];
                    that.addFormVisibleGoods = true;//打开新增页面
                    that.addFormGoods = {
                        name:"",
                        goodsCategoryId:that.goodsCategorySelect.id,
                        goodsSubCategoryId:that.goodsSubCategorySelect.id,
                        abbreviation:"",
                        unit:"",
                        type:"",
                        size:"",
                        weight:0,
                        temperature:0,
                        price:0,
                        description:"",
                    };//重置form信息
                    let url = "/goods/searchAllGoodsCategory";//查询全部大类
                    let param = {};
                    this.post_url(url, param, "物品大类查询全部失败！").then(function (res) {
                        console.info(res);
                        if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                            that.goodsCategoryList = res.data;//物品大类List
                        }else{
                            that.$message.error("物品大类查询全部失败！");
                        }
                    }).catch(res=>{
                        console.info("物品大类查询全部失败",res);
                    });
                     url = "/goods/searchAllGoodsSubCategory";//查询全部子类
                     param = {
                         goodsCategoryId:that.goodsCategorySelect.id
                     };
                    this.post_url(url, param, "物品子类查询全部失败！").then(function (res) {
                        console.info("物品子类查询全部",res);
                        if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                            that.goodsSubCategoryList = res.data;//物品子类List
                        }else{
                            that.$message.error("物品子类查询全部失败！");
                        }
                    }).catch(res=>{
                        console.info("物品子类查询全部失败",res);
                    });

                }
            },
            //提交物品新增
            addSubmitGoods:function(){
                this.$refs.addFormGoods.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoadingGoods = true;
                            let that = this;
                            let url = "/goods/addGoods";//新增物品
                            let param = that.addFormGoods;
                            this.post_url(url, param, "新增物品失败！",that.addLoadingGoods = false).then(function (res) {
                                that.addLoadingGoods = false;
                                console.info("新增物品返回体",res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("新增物品成功");
                                    that.addFormVisibleGoods = false;
                                    that.btnSearchGoods();
                                }else{
                                    that.$message.error("新增物品失败");
                                }
                            }).catch(() => {
                                that.addLoadingGoods = false
                            });
                        });
                    }
                });
            },
            //打开物品信息编辑页面
            btnEditGoods:function(){
                let that = this;
                if(that.goodsSelect.name==null){
                    that.$alert('请先选择物品子类', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                }else{
                    that.goodsCategoryList=[];
                    that.goodsSubCategoryList=[];
                    that.editFormVisibleGoods = true;//打开新增页面
                    that.editFormGoods = {
                        id:that.goodsSelect.id,
                        effective:that.goodsSelect.effective,
                        name:that.goodsSelect.name,
                        goodsCategoryId:that.goodsSelect.goodsCategoryId,
                        goodsSubCategoryId:that.goodsSelect.goodsSubCategoryId,
                        abbreviation:that.goodsSelect.abbreviation,
                        unit:that.goodsSelect.unit,
                        type:that.goodsSelect.type,
                        size:that.goodsSelect.size,
                        weight:that.goodsSelect.weight,
                        temperature:that.goodsSelect.temperature,
                        price:that.goodsSelect.price,
                        description:that.goodsSelect.description,
                    };//重置form信息
                    let url = "/goods/searchAllGoodsCategory";//查询全部大类
                    let param = {};
                    this.post_url(url, param, "物品大类查询全部失败！").then(function (res) {
                        console.info(res);
                        if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                            that.goodsCategoryList = res.data;//物品大类List
                        }else{
                            that.$message.error("物品大类查询全部失败！");
                        }
                    }).catch(res=>{
                        console.info("物品大类查询全部失败",res);
                    });
                    url = "/goods/searchAllGoodsSubCategory";//查询全部子类
                    param = {
                        goodsCategoryId:that.goodsSelect.goodsCategoryId
                    };
                    this.post_url(url, param, "物品子类查询全部失败！").then(function (res) {
                        console.info("物品子类查询全部",res);
                        if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                            that.goodsSubCategoryList = res.data;//物品子类List
                        }else{
                            that.$message.error("物品子类查询全部失败！");
                        }
                    }).catch(res=>{
                        console.info("物品子类查询全部失败",res);
                    });

                }
            },
            //提交物品编辑
            editSubmitGoods:function(){
                this.$refs.editFormGoods.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoadingGoods = true;
                            let that = this;
                            let url = "/goods/updateGoods";//修改物品
                            let param = that.editFormGoods;
                            this.post_url(url, param, "修改物品失败！",that.editLoadingGoods = false).then(function (res) {
                                that.editLoadingGoods = false;
                                console.info("修改物品返回体",res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("修改物品成功");
                                    that.editFormVisibleGoods = false;
                                    that.btnSearchGoods();
                                }else{
                                    that.$message.error("修改物品失败");
                                }
                            }).catch(() => {
                                that.editLoadingGoods = false
                            });
                        });
                    }
                });
            },
            //删除物品信息
            btnDeleteGoods:function(){
                let that = this;
                let ids = this.goodsSelect.id;
                if (ids == ''||ids == null) {
                    this.$alert('请选择要删除的记录', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                } else {
                    this.$confirm('确认删除选中记录吗？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        that.goodsLoading = true;
                        let param={
                            id:this.goodsSelect.id//删除 物品
                        }
                        let url = "/goods/deleteGoods";//删除物品
                        this.post_url(url, param, "删除物品失败！",that.goodsLoading = false).then(function (res) {
                            that.goodsLoading = false;
                            console.info(res);
                            if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                that.$message.success("删除物品成功");
                                that.btnSearchGoods();
                            }
                        });
                    }).catch(() => {
                        that.goodsLoading = false;
                        that.$message.warning("删除物品失败");
                    });
                }
            },
            //物品图片操作
            operationPicture:function(row){
                console.info("点击查看图片",row.pictures);
                let that = this;
                that.goodsSelect = row;

                 that.pictures = row.pictures;
                that.picturesList = [];
                 for(let i = 0;i<row.pictures.length;i++){
                     that.picturesList.push(row.pictures[i].url)
                 }
                 let size = 5;
                 size = that.limitMaxSize-row.pictures.length;
                 if(size==0){
                     size = -1;
                 }
                that.limitSize = size;
                 console.info("当前图片个数",size);
                that.pictureGoodsId.goodsId = row.id;
                that.editFormVisibleGoodsPicture = true;
            },
            //点击图片
            pictureClick:function(res){
                console.info("当前点击的图片",res);
                let that = this;
                that.pictureId = res
            },
            //删除图片
            deleteGoodsPicture:function(id){
                let that = this;
                this.$confirm('确认删除选中照片吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    that.visible = false;
                    let param={
                        id:id //删除 物品的图片ID
                    }
                    let url = "/goods/deleteGoodsPicture";//删除物品的图片
                    this.post_url(url, param, "删除物品失败！",that.visible = false).then(function (res) {
                        that.visible = false;
                        console.info(res);
                        if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                            that.$message.success("删除物品成功");
                            that.editFormVisibleGoodsPicture = false;//关闭图片页面
                            that.pictureId = 0;//清空选择的图片
                            that.goodsSelect = {};//清空选择的物品信息
                            that.btnSearchGoods();
                        }
                    });
                })
            },
            //上传文件
            uploadFile(file){
                this.fileData.append('picture', file.file);  // append增加数据
            },
            //提交新增图片
            submitUpload() {
                let that = this;
                if (this.fileList.length === 0) {
                    this.$message({
                        message: '请先选择文件',
                        type: 'warning'
                    })
                } else {
                        this.fileData = new FormData();  // new formData对象
                        this.$refs.upload.submit();  // 提交调用uploadFile函数
                        this.fileData.append('goodsId', this.goodsSelect.id);  // 添加物品ID
                        console.info("提交新增图片goodsId",this.goodsSelect.id)
                        console.info("提交新增图片List",this.fileList)
                        console.info("提交新增图片信息",this.fileData)
                        let url = "/file/addGoodsPicture";
                        let param = this.fileData;
                    this.postUpload(url, param, "上传图片失败！",null).then(function (res) {
                        if(res.data.code===Variable_global.errorCode.SUCCESS){
                            that.$message({
                                message: res.data.data,
                                type: 'success'
                            });
                            that.$refs.upload.clearFiles();
                            that.editFormVisibleGoodsPicture = false;
                            that.btnSearchGoods();
                        }else{
                            that.$message.error(res.data.data);
                        }
                        console.info("提交新增图片返回体",res)
                    }).catch(function(res){
                        console.info("提交新增图片报错返回体",res)
                        that.$message.error('上传失败，请重新上传');
                    });
                }
            },
            // 图片上传成功后，后台返回图片的路径
            onSuccess:function(res){
                if(res.code==1001){
                    this.$message({
                        message: '恭喜你，上传成功',
                        type: 'success'
                    });
                }else{
                    this.$message.error('上传失败，请重新上传');
                }
            },
            //图片上传失败调用
            imgUploadError(err, file, fileList){
                console.log(err)
                this.$refs.upload.clearFiles();
                this.$message.error('上传图片失败!');
            },
            //移除
            handleRemove(file, fileList) {
                this.fileList = fileList;
                // return this.$confirm(`确定移除 ${ file.name }？`);
            },
            //点击图片
            handlePreview(file) {
                console.log(file);
            },
            //图片改变事件
            handleChange(file, fileList){
                let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name);
                if (existFile) {
                    this.$message.error('当前文件已经存在!');
                    fileList.pop();
                }
                this.fileList = fileList;
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共存在了 ${this.picturesList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            //点击物品row触发事件
            rowChangeGoodsData:function(row){
                if(row!=null&&row.id!=null) {
                    this.goodsSelect = row;
                }
            },
            //物品table改变一页多少行触发事件
            handleSizeChangeGoods:function(size){
                if (size != this.pageSizeGoods) {
                    this.pageSizeGoods= size;
                    this.btnSearchGoods();
                }
            },
            //物品改变页面触发事件
            handleCurrentChangeGoods:function(page){
                if (page != this.pageGoods) {
                    this.pageGoods = page;
                    this.btnSearchGoods();
                }
            },
        }
    }
</script>

<style scoped>

</style>