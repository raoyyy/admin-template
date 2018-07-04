<template>
	<el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:300px">
		<el-form-item label="小程序名">
			<el-select v-model="form.appName" placeholder="请选择小程序名" style="display:block;width:200px;">
				<el-option label="yylhealth" value="yylhealth"></el-option>
				
			</el-select>
		</el-form-item>
        <el-form-item label="设备">
			<el-select v-model="form.device" placeholder="请选择设备" style="display:block;width:200px;">
				<el-option label="YR01BP8621510309255051" value="YR01BP8621510309255051"></el-option>
				<el-option label="YR01BP8621510309255052" value="YR01BP8621510309255052"></el-option>
			</el-select>
		</el-form-item>
        <el-upload action="http://localhost:3000/upload" name="thumbnail" :on-success="handleSuccess" :on-error="handleError" :beforeUpload="beforeAvatarUpload">
        <el-button size="small" type="primary">点击上传Excel文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xlsx文件</div>
        </el-upload>
	</el-form>
</template>

<script>
import XLSX from 'xlsx'

export default {
    data() {
			return {
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
			}
		},
  methods:{
    onSubmit() {
				console.log('submit!');
			},  
    handleSuccess() {
      console.log("success")
      this.$message.success('上传成功');
    },
    handleError(err) {
      this.$message.error(`上传失败: ${err}`);
    },
    beforeAvatarUpload (file) {
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!extension && !extension2 && !extension3 && !extension4) {
        console.log('上传模板只能是 xls、xlsx 格式!')
      }
      if (!isLt10M) {
        console.log('上传模板大小不能超过 10MB!')
      }
      return extension || extension2  && isLt10M
    }
  },
}

</script>

<style scoped>
</style>