<template>
	<section>
		<!--工具条-->
		<el-col  style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input style="width:450px" v-model="filters.name" @keyup.enter.native="handleCurrentChange" placeholder="查找题目"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="handleCurrentChange">查询</el-button>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="primary">新增</el-button>
				</el-form-item> -->
			</el-form>
		</el-col>

		<!--列表-->
		<el-table  @row-click="handleEdit" :data="questions" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column className="column_center" type="selection" width="55">
			</el-table-column>
			<el-table-column  className="column_center" type="index" label="题号" width="60">
			</el-table-column>
			<el-table-column  className="column_center" prop="type" label="题型" width="80" sortable>
			</el-table-column>
			<el-table-column className="column_center" prop="title" label="题目" width="520" sortable>
			</el-table-column>
			<el-table-column className="column_center" prop="options[0][title]" label="选项A" width="150"  sortable>
			</el-table-column>
			<el-table-column className="column_center" prop="options[1][title]" label="选项B" width="150" sortable>
			</el-table-column>
			<el-table-column className="column_center" prop="options[2][title]" label="选项C" width="150" sortable>
			</el-table-column>
			<el-table-column className="column_center" prop="options[3][title]" label="选项D" width="150" sortable>
			</el-table-column>
			<el-table-column className="column_center" prop="options[4][title]" label="选项E" width="150" sortable>
			</el-table-column>
			<el-table-column className="column_center" prop="answer" label="答案" width="120" sortable>
			</el-table-column>
			<el-table-column className="column_center" label="操作" width="150">
				<template scope="scope">
					<!-- <el-button size="small"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
					<el-button type="danger" size="small" @click.stop="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger"  @click="batchRemove" style="float:left;" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination  :current-page="currentPage" layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="题目" prop="question">
					<el-input v-model="editForm.question" type="textarea" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="选项A" prop="optionA">
					<el-col>
						<el-input v-model="editForm.optionA" :min="0" :max="200" :maxlength=100 auto-complete="off"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="选项B" prop="optionB">
					<el-col>
						<el-input v-model="editForm.optionB" :min="0" :max="200" auto-complete="off"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="选项C" prop="optionC">
					<el-col>
						<el-input v-model="editForm.optionC" :min="0" :max="200" auto-complete="off"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="选项D" prop="optionD">
					<el-col>
						<el-input v-model="editForm.optionD" :min="0" :max="200" auto-complete="off"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="选项E" prop="optionE">
					<el-col>
						<el-input v-model="editForm.optionE" :min="0" :max="200" auto-complete="off"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="答案" prop="answer">
					<el-col :span="12">
						<el-select style="width:100%" v-model="editForm.answer" multiple placeholder="请选择">
							<el-option
								v-for="item in options"
								:key="item.value"
								:value="item.value">
							</el-option>
						</el-select>
					</el-col>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!-- 新增界面
		<el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="题型">
					<el-col :span="12">
						<el-select style="width:100%" v-model="addForm.types" placeholder="请选择">
							<el-option style="width:100%"
								v-for="item in types"
								:key="item.value"
								:value="item.value">
							</el-option>
						</el-select>
					</el-col>
				</el-form-item>
				<el-form-item label="题目" prop="question">
					<el-input v-model="addForm.question" type="textarea" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="选项A">
					<el-input v-model="addForm.optionA" style="width:100%" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="选项B">
					<el-input v-model="addForm.optionB" style="width:100%" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="选项C">
					<el-input v-model="addForm.optionC" style="width:100%" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="选项D">
					<el-input v-model="addForm.optionD" style="width:100%" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="选项E">
					<el-input v-model="addForm.optionE" style="width:100%" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="答案">
					<el-col :span="12">
						<el-select style="width:100%" v-model="addForm.answer" multiple placeholder="请选择">
							<el-option style="width:100%"
								v-for="item in options"
								:key="item.value"
								:value="item.value">
							</el-option>
						</el-select>
					</el-col>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog> -->
	</section>
</template>

<script>

	//import NProgress from 'nprogress'

	export default {
		data() {
			return {
				options:[
					{
						value:'A'
					},
					{
						value:'B'
					},
					{
						value:'C'
					},
					{
						value:'D'
					},
					{
						value:'E'
					}
				],
				types:[
					{ value:'单选题'},
					{ value:'多选题'},
					{ value:'判断题'}
				],
				optionValue:[],
				filters: {
					name: ''
				},
				questions:[],
				total: 0,
				page: 1,
				currentPage:1,
				listLoading: false,
				sels: [],//列表选中列
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					question: "",
					optionA: '',
					optionB: '',
					optionC: '',
					optionD: '',
					optionE: '',
					answer:[]
				}

				// Visible: false,//新增界面是否显示
				// addLoading: false,
				// addFormRules: {
				// 	name: [
				// 		{ required: true, message: '请输入题目', trigger: 'blur' }
				// 	]
				// },
				// //新增界面数据addForm
				// addForm: {
				// 	types:[],
				// 	question: '',
				// 	optionA: '',
				// 	optionB: '',
				// 	optionC: '',
				// 	optionD: '',
				// 	optionE: '',
				// 	answer:[]
				// }

			}
		},
		computed:{
		},
		methods: {
			handleEdit: function (row, event, column) {
				this.editFormVisible = true;
				this.editForm.answer = []
				
				this.editForm.question = row.title
				this.editForm.optionA = row.options[0].title
				this.editForm.optionB = row.options[1].title
				if(row.options.length>2){
					this.editForm.optionC = row.options[2].title
					this.editForm.optionD = row.options[3].title
				}
				if(row.options.length>4){
					this.editForm.optionE = row.options[4].title
				}
				var answerArr = []
				answerArr = row.answer.split('')
				for(var i=0;i<answerArr.length;i++){
					if(answerArr[i]!=' '){
						if(this.editForm.answer.indexOf(answerArr[i]) == -1){
							this.editForm.answer.push(answerArr[i])
						}
					}
				}
			},
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						// this.$confirm('确认提交吗？', '提示', {}).then(() => {
						// 	this.editLoading = true;
						// 	//NProgress.start();
						// 	let para = Object.assign({}, this.editForm);
						// 	console.log(para)
						// 	this.editQuestions(para)
						// 	this.editLoading = false;
						// 	//NProgress.done();
						// 	this.$message({
						// 		message: '提交成功',
						// 		type: 'success'
						// 	});
						// 	this.$store.getters.getLatestQuestions;
						// 	this.$refs['editForm'].resetFields();
						// 	this.editFormVisible = false;
						// });
					}
				});
			},
			editQuestions: function(question) {
				// var questionIndex = this.$store.state.questionIndex				
				// // var question = this.$store.excelData[questionIndex]
				// var data = this.$store.state.excelData
				// data[questionIndex] = question
				// this.$store.commit('editQuestion',data)
				// console.log(question)
			},
			//删除
			handleDel: function (index, row) {
				var that = this
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					console.log(row._id) //通过row._id去数据库删除
					// console.log("index:" +index) 从0开始
					this.$axios.post('http://localhost:3000/questions',
					{
						id:row._id
					})
					.then(function (res) {
						that.$message({
							message: '删除成功',
							type: 'success'
						});
						that.getQuestions()
					})
					// removeUser(para).then((res) => {
					// 	this.listLoading = false;
					// 	//NProgress.done();
					// 	this.$message({
					// 		message: '删除成功',
					// 		type: 'success'
					// 	});
					// 	this.getUsers();
					// });
				})		
			},		
			// 批量删除
			batchRemove: function () {
				var that = this
				var ids = this.sels.map(item => item._id);
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					this.$axios.post('http://localhost:3000/questions/delBatch',
					{
						id:ids
					})
					.then(function (res) {
						that.$message({
							message: '删除成功',
							type: 'success'
						});
						that.getQuestions()
					})
				}).catch(() => {

				});
			},
			handleCurrentChange(val) {
				this.page = val;
				if(typeof val == 'number'){
					this.currentPage = val
				}else {
					// console.log('按下回车返回第一页')
					this.currentPage = 1 //查询时，返回第一页
					this.page = 1
				}
				this.getQuestions();
			},
			// 获取题目列表
			getQuestions() {
				var that = this
				let para = {
					name: this.filters.name,
					page: this.page
				};
				this.listLoading = true;
				this.$axios.get('http://localhost:3000/questions/list',
				{
					params:para
				})
				.then(function (res) {
					var page = that.page
					console.log("page: "+page)
					
					that.total = res.data.questions.length;
					console.log("total: "+that.total)
					if( page*20<= that.total){
						that.questions = res.data.questions.slice((page-1)*20,(page*20))
					} else{
						that.questions = res.data.questions.slice((page-1)*20,that.total)
					}
					that.listLoading = false;
				})
				.catch(function (error) {
					console.log(error);
				});
			},
			// //删除
			// handleDel: function (index, row) {
			// 	this.$confirm('确认删除该记录吗?', '提示', {
			// 		type: 'warning'
			// 	}).then(() => {
			// 		this.listLoading = true;
			// 		//NProgress.start();
			// 		let para = { id: row.id };
			// 		removeUser(para).then((res) => {
			// 			this.listLoading = false;
			// 			//NProgress.done();
			// 			this.$message({
			// 				message: '删除成功',
			// 				type: 'success'
			// 			});
			// 			this.getUsers();
			// 		});
			// 	}).catch(() => {

			// 	});
			// },
			//显示编辑界面
			// handleEdit: function (index, row) {
			// 	this.editFormVisible = true;
			// 	this.editForm = Object.assign({}, row);
			// },
			//显示新增界面
			// handleAdd: function () {
			// 	this.addFormVisible = true;
			// 	this.addForm = {
			// 		types:[],
			// 		question: '',
			// 		optionA: '',
			// 		optionB: '',
			// 		optionC: '',
			// 		optionD: '',
			// 		optionE: '',
			// 		answer:[]
			// 	};
			// },
			// //编辑
			// editSubmit: function () {
			// 	this.$refs.editForm.validate((valid) => {
			// 		if (valid) {
			// 			this.$confirm('确认提交吗？', '提示', {}).then(() => {
			// 				this.editLoading = true;
			// 				//NProgress.start();
			// 				let para = Object.assign({}, this.editForm);
			// 				para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
			// 				editUser(para).then((res) => {
			// 					this.editLoading = false;
			// 					//NProgress.done();
			// 					this.$message({
			// 						message: '提交成功',
			// 						type: 'success'
			// 					});
			// 					this.$refs['editForm'].resetFields();
			// 					this.editFormVisible = false;
			// 					this.getUsers();
			// 				});
			// 			});
			// 		}
			// 	});
			// },
			//新增
			// addSubmit: function () {
			// 	var that = this
			// 	this.$refs.addForm.validate((valid) => {
			// 		if (valid) {
			// 			this.$confirm('确认提交吗？', '提示', {}).then(() => {
			// 				this.addLoading = true;
			// 				let para = Object.assign({}, this.addForm);
			// 				console.log(para)
			// 				this.$axios.post('http://localhost:3000/questions/',
			// 				{
			// 					params:para
			// 				})
			// 				.then(function (res) {
			// 					that.total = res.data.questions.length;
			// 					if( page*20<= that.total){
			// 						that.questions = res.data.questions.slice((page-1)*20,(page*20))
			// 					} else{
			// 						that.questions = res.data.questions.slice((page-1)*20,that.total)
			// 					}
			// 					that.addLoading = false;
			// 				})
			// 				.catch(function (error) {
			// 					console.log(error);
			// 				});
			// 			});
			// 		}
			// 	});
			// },
			selsChange: function (sels) {
				this.sels = sels;
			}
		},
		mounted() {
			var that = this //注意用that
			this.$axios.get('http://localhost:3000/questions')
				.then(function (res) {
					that.questions = res.data.questions
					that.total = that.questions.length
				})
			this.getQuestions()
		}
	}
		

</script>

<style >
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