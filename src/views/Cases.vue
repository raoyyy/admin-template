<template>
	<section>
		<!--工具条-->
		<el-col  style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" v-on:click="handleCreate">创建案件</el-button>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="primary">新增</el-button>
				</el-form-item> -->
			</el-form>
		</el-col>

		<!--列表-->
		<el-table  @row-click="handleEdit" :data="cases" border highlight-current-row @selection-change="selsChange" :row-style="rowClass" style="width: 100%;">
			<!-- <el-table-column className="column_center" type="selection" width="55">
			</el-table-column> -->
			<el-table-column className="column_center" prop="name" label="名称">
			</el-table-column>
            <el-table-column className="column_center" prop="customer" label="客户名称">
			</el-table-column>
            <el-table-column className="column_center" prop="category" label="所属分类">
			</el-table-column>
			<el-table-column className="column_center" label="操作">
				<template slot-scope="scope">
					<!-- <el-button size="small"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
					<el-button type="danger" size="small" @click.stop="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" ref="addForm" :rules="addFormRules">
				<el-form-item label="名称" prop="name">
					<el-input v-model="addForm.name" style="width:100%" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="客户名称" prop="customer">
					<el-input v-model="addForm.customer" style="width:100%" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="所属分类" prop="category">
                    <el-select style="width:100%" v-model="addForm.category" placeholder="请选择">
                        <el-option
                            v-for="item in categories"
                            :key="item.value"
                            :value="item.name">
                        </el-option>
                    </el-select>
				</el-form-item>
                <el-form-item label="案例介绍" prop="introduce">
					<el-input v-model="addForm.introduce" type="textarea" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="头图" prop="imageUrl">
					<el-upload
						ref="addForm"
						class="avatar-uploader"
						action="https://upload-z2.qiniup.com"
						:data="uptoken"
                        :show-file-list="false"
                        :file-list="images"
						:on-success="handleAvatarSuccess"
						:on-error="handleError"
						:before-upload="beforeAvatarUpload">
						<img v-if="addForm.imageUrl" :src="addForm.imageUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
                <el-form-item label="案例图片" prop="caseImageUrl">
                    <div v-for="item in addForm.images">
                        <img :src="item.url"  class="avatar case-image">
                        <el-input class="image-input" v-model="item.introduce" placeholder="添加图片说明"></el-input>
                    </div>
                    <el-upload
						ref="addForm"
						class="avatar-uploader"
						action="https://upload-z2.qiniup.com"
						:data="uptoken"
                        :show-file-list="false"
						:on-success="handleCaseImageSuccess"
						:on-error="handleCaseImageError"
						:before-upload="beforeCaseImageUpload">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
						<!-- <img v-if="addForm.caseImageUrl" :src="addForm.caseImageUrl" class="avatar"> -->
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit">保存</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="客户名称" prop="customer">
					<el-input v-model="editForm.customer" style="width:100%" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="所属分类" prop="category">
                    <el-select style="width:100%" v-model="editForm.category" placeholder="请选择">
                        <el-option
                            v-for="item in categories"
                            :key="item.value"
                            :value="item.name">
                        </el-option>
                    </el-select>
				</el-form-item>
				<el-form-item label="案例介绍" prop="introduce">
					<el-input v-model="editForm.introduce" type="textarea" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="头图" prop="imageUrl">
					<el-upload
						ref="editForm"
						class="avatar-uploader"
						action="https://upload-z2.qiniup.com"
						:data="uptoken"
                        :show-file-list="false"
                        :file-list="images"
						:on-success="handleAvatarSuccess"
						:on-error="handleError"
						:before-upload="beforeAvatarUpload">
						<img v-if="editForm.imageUrl" :src="editForm.imageUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
                <el-form-item label="案例图片" prop="images">
                    <div v-for="item in editForm.images">
                        <img :src="item.url"  class="avatar case-image">
                        <el-input class="image-input" v-model="item.introduce" placeholder="添加图片说明"></el-input>
                    </div>
                    <el-upload
						ref="editForm"
						class="avatar-uploader"
						action="https://upload-z2.qiniup.com"
						:data="uptoken"
                        :show-file-list="false"
						:on-success="handleCaseImageSuccess"
						:on-error="handleCaseImageError"
						:before-upload="beforeCaseImageUpload">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
						<!-- <img v-if="addForm.caseImageUrl" :src="addForm.caseImageUrl" class="avatar"> -->
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit">保存</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>

	export default {
		data() {
			return {
				rowClass: function(row,index) {
					return {"height":"100px"}
                },
                name:'',
                customer:'',
                category:'',
                cases:[],
                categories:[],
				uptoken:{
					token:''
                },
                images:[],
				addFormVisible:false,
				// filters: {
				// 	name: ''
				// },
				sels: [],//列表选中列
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
				},
				//编辑界面数据
				editForm: {
                    _id:'',
					name:'',
                    customer:'',
                    category:'',
                    imageUrl:'',
                    caseImageUrl:'',
                    introduce:'',
                    images:[],
				},
				addForm: {
                    name:'',
                    customer:'',
                    category:'',
                    imageUrl:'',
                    caseImageUrl:'',
                    introduce:'',
                    images:[],
				},
				addFormRules: {
					name: [
						{ required: true, message: '请输入题目', trigger: 'blur' }
					]
				},
			}
		},
		computed:{
		},
		methods: {
            getCategories(){
				var that = this
				this.$axios.get('http://localhost:3000/categories')
					.then(function (res){
						console.log(res.data.categories)
						that.categories = res.data.categories
					})
			},
			getCases(){
				var that = this
				this.$axios.get('http://localhost:3000/cases')
					.then(function (res){
						console.log(res.data.cases)
                        that.cases = res.data.cases
                        console.log(that.cases)
					})
			},
			getUptoken(){
				var that = this
				this.$axios.get('http://localhost:3000/uptoken/')
					.then(function(res) {
						console.log(res.data)
						that.uptoken.token = res.data.uptoken
					})
					console.log(this.uptoken)
			},
			handleAvatarSuccess(res, file) {
				console.log('上传图片')
				this.addForm.imageUrl ='http://pcf00qjix.bkt.clouddn.com/'+ res.key  //七牛云上面的图片地址
				this.editForm.imageUrl ='http://pcf00qjix.bkt.clouddn.com/'+ res.key  //七牛云上面的图片地址
			},
			beforeAvatarUpload(file) {
			},
			handleError(err){
				console.log(err)
            },
            handleCaseImageSuccess(res, file){
                this.addForm.caseImageUrl ='http://pcf00qjix.bkt.clouddn.com/'+ res.key  //七牛云上面的图片地址
                var file = {};
                file.url = 'http://pcf00qjix.bkt.clouddn.com/'+ res.key
                file.introduce = ''
                this.addForm.images.push(file)
                console.log(123)
                console.log(this.addForm.images)
            },
            beforeCaseImageUpload(){

            },
            handleCaseImageError(){

            },
			//显示新增界面
			handleCreate: function () {
				this.addFormVisible = true;
					this.addForm = {
                        name:'',
                        customer:'',
                        category:'',
                        imageUrl:'',
                        caseImageUrl:'',
                        introduce:'',
                        images:[],//对象，图片url和图片描述title
					}
			},
			addSubmit: function () {
				var that = this
				console.log('submit')
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							let para = Object.assign({}, this.addForm);
							console.log(para)
							this.$axios.post('http://localhost:3000/cases/',
							{
								name: para.name,
                                customer: para.customer,
                                category: para.category,
                                imageUrl: para.imageUrl,
                                caseImageUrl: para.caseImageUrl,
                                introduce: para.introduce,
                                images: para.images,//对象，图片url和图片描述title
							})
							.then(function (res){
									that.$message({
									message: '添加成功',
									type: 'success'
								});
								that.addFormVisible = false
								that.getCases()
							})
						})
					}
				})
			},
			handleEdit: function (row, event, column) {
				console.log(row)
				this.disabled = false
				this.editForm = {
                    _id:'',
					name:'',
                    customer:'',
                    category:'',
                    imageUrl:'',
                    caseImageUrl:'',
                    introduce:'',
                    images:[],
				}
                this.editFormVisible = true;
                this.editForm._id = row._id
				this.editForm.name = row.name
				this.editForm.customer =row.customer
                this.editForm.category =row.category
                this.editForm.imageUrl =row.imageUrl
                this.editForm.caseImageUrl =row.caseImageUrl
                this.editForm.introduce =row.introduce
                this.editForm.images =row.images
			},
			editSubmit: function () {
				var that = this
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							let para = Object.assign({}, this.editForm);
							console.log(para)
							this.$axios.post('http://localhost:3000/cases/edit',
							{
                                name: para.name,
                                id: para._id,
                                customer: para.customer,
                                category: para.category,
                                imageUrl: para.imageUrl,
                                caseImageUrl: para.caseImageUrl,
                                introduce: para.introduce,
                                images: para.images,//对象，图片url和图片描述title
							})
							.then(function (res) {
								that.$message({
									message: '提交成功',
									type: 'success'
								});
								that.getCases()
							})
							this.editLoading = false;
							//NProgress.done();
							
							this.$refs['editForm'].resetFields();
							this.editFormVisible = false;
						});
					}
				});
			},
			//删除
			handleDel: function (index, row) {
				var that = this
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					console.log(row._id) //通过row._id去数据库删除
					// console.log("index:" +index) 从0开始
					this.$axios.post('http://localhost:3000/cases/delete',
					{
						id:row._id
					})
					.then(function (res) {
						that.$message({
							message: '删除成功',
							type: 'success'
						});
						that.getCases()
					})
					}).catch((error) => {
					console.log(error)
				})
			},		
			// 批量删除
			batchRemove: function () {
			},
			handleCurrentChange(val) {

			},
			selsChange: function (sels) {
				this.sels = sels;
			}
		},
		mounted() {
            this.getUptoken()
            this.getCategories()
            this.getCases()
		}
	}
		

</script>

<style >

    .case-image {
        border: 1px solid #eee;
        border-radius: 5px;
        margin-left: 65px;
    }
    .image-input {
        width: 325px;
        margin: 10px 0 30px 0;
    }

	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 325px;
		height: 160px;
		line-height: 160px;
		text-align: center;
	}
	.avatar {
		width: 325px;
		height: 160px;
		display: block;
        margin: 0 auto;
	}

	.column_center {
		text-align: center !important;
	}

	.el-table th{
        background:#f4f4f4 !important;
    }

	.toolbar {
		background:#f4f4f4 !important;
		padding: 5px
	}
</style>