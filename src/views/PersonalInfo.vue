<template>
    <div style="width: 25%;margin: 0 auto">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="姓名" prop="name" required>
                <el-input v-model.trim="form.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="mail" required>
                <el-input v-model="form.mail" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="头像">
                <el-upload
                        ref="files"
                        action="#"
                        :auto-upload="false"
                        :http-request="uploadFile"
                        list-type="picture-card">
                    <i slot="default" class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{file}">
                        <img  class="el-upload-list__item-thumbnail"
                                :src="file.url" alt="">
                        <span class="el-upload-list__item-actions">
                            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                            <i class="el-icon-zoom-in"></i>
                            </span>
                            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                              <i class="el-icon-delete"></i>
                            </span>
                         </span>
                    </div>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <!-- <el-form-item label="背景墙">
               <el-upload class="avatar-uploader"
                          :action="baseUrl+'/saveAvatar'"
                          :show-file-list="false"
                          :on-success="backAvatarSuccess"
                          :before-upload="beforeAvatarUpload">
                 <img v-if="backImgUrl" :src="backImgUrl" class="avatar">
                 <i v-else class="el-icon-plus avatar-uploader-icon"></i>
               </el-upload>
             </el-form-item>-->
            <!--            <el-form-item label="个人技能" prop="skill">-->
            <!--                <el-select v-model="form.value"-->
            <!--                           multiple-->
            <!--                           filterable-->
            <!--                           allow-create-->
            <!--                           default-first-option-->
            <!--                           placeholder="请选择文章标签">-->
            <!--                    <el-option v-for="item in form.options"-->
            <!--                               :key="item.value"-->
            <!--                               :label="item.label"-->
            <!--                               :value="item.value">-->
            <!--                    </el-option>-->
            <!--                </el-select>-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="个人介绍" prop="textarea" required>-->
            <!--                <el-input type="textarea" v-model.trim="form.textarea" :rows="6" maxlength="200"-->
            <!--                          show-word-limit></el-input>-->
            <!--            </el-form-item>-->
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                <el-button @click="onReset('form')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {setMineInfo} from "../network/minInfoRequest";
    import Variable_global from "@/global_variable";

    export default {
        name: "personalInfo",
        data() {
            const validateName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error("名称不能为空"))
                } else {
                    callback()
                }
            };
            return {
                fileData: "",
                form: {
                    name: '',
                    mail: '',
                },
                rules: {
                    name: [
                        {validator: validateName, trigger: 'blur'}
                    ],
                },
                baseUrl: this.getLocation(),
                imageUrl: '',
                backImgUrl: '',
                dialogImageUrl: '',
                dialogVisible: false,
                disabled: false
            }
        },
        methods: {
            handleRemove(file) {
                this.dialogImageUrl = "";
                this.dialogVisible = false;
                this.$refs.files.clearFiles();
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            //上传文件
            uploadFile(file) {
                this.fileData.append('picture', file.file);  // append增加数据
            },
            onSubmit(form) {
                let that = this;
                this.$refs[form].validate(valid => {
                    if (valid) {
                        let username = "";//用户名
                        if (JSON.parse(sessionStorage.getItem("user")) != null) {
                            username = JSON.parse(sessionStorage.getItem("user")).username
                        } else {
                                that.$message.error("账号过期，请重新登陆!")
                                that.$router.push({
                                    path: '/login'
                                })
                                return;
                        }
                        this.fileData = new FormData();  // new formData对象
                        this.$refs.files.submit();  // 提交调用uploadFile函数
                        this.fileData.append('name', this.form.name);  // 添加名称
                        this.fileData.append('mail', this.form.mail);  // 添加名称
                        this.fileData.append('username', username);  // 添加username
                        let url = "/file/updatePersonalInfo";
                        let param = this.fileData;
                        this.postUpload(url, param, "修改信息失败！", null).then(function (res) {
                            if (res.data.code === Variable_global.errorCode.SUCCESS) {
                                that.$message({
                                    message: res.data.data.data,
                                    type: 'success'
                                });
                                if(res.data.data.url!=null&&res.data.data.url!=""){
                                    console.info("完整图片路径",that.getPath()+":"+that.getPort()+res.data.data.url)
                                    that.$store.commit("header/setHeadUrl",that.getPath()+":"+that.getPort()+res.data.data.url);
                                    let user = JSON.parse(sessionStorage.getItem("user"));
                                    if(user!=null){
                                        user.iconUrl = res.data.data.url;
                                        sessionStorage.setItem("user",JSON.stringify(user));
                                    }else{
                                        that.$message.error("账号过期，请重新登陆!")
                                        that.$router.push({
                                            path: '/login'
                                        })
                                        return ;
                                    }
                                }
                                that.$refs.files.clearFiles();
                                that.$refs[form].resetFields();
                            } else {
                                that.$message.error(res.data.data.data);
                            }
                            console.info("修改信息返回体", res)
                        }).catch(function (res) {
                            console.info("修改信息报错返回体", res)
                            that.$message.error('服务器错误');
                        });

                    } else {
                        return false
                    }
                })
            },
            onReset(form) {
                this.$refs[form].resetFields();
            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                alert("before")
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG && !isPNG) {
                    this.$message.error('上传头像图片只能是 JPG、PNG 格式');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isLt2M && (isPNG || isJPG);
            },
            backAvatarSuccess(res, file) {
                this.backImgUrl = URL.createObjectURL(file.raw);
            }
        }
    }
</script>

<style scoped>
    .avatar-uploader {
        width: 178px;
        height: 178px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 100%;
        height: 100%;
        display: block;
    }
</style>