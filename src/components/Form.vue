<template>
	<el-form ref="form" :model="form" label-width="80px" :rules="formRules" @submit.prevent="onSubmit" style="margin:20px;width:300px">
		<el-form-item label="小程序名" prop="appName">
			<el-select v-model="form.appName" placeholder="请选择小程序名" style="display:block;width:200px;">
				<el-option
              v-for="item in appList"
              :key="item.label"
              :value="item.value">
				</el-option>
			</el-select>
		</el-form-item>
    <el-form-item label="设备" prop="deviceName">
			<el-select v-model="form.deviceName" placeholder="请选择设备" style="display:block;width:200px;">
				<el-option
              v-for="item in deviceList"
              :key="item.label"
              :value="item.value">
				</el-option>
			</el-select>
		</el-form-item>
    <el-form-item label="上传文件" prop="file">
        <el-upload action="http://118.25.21.169:3000/devices/wxcode" :data="uploadData" name="excelFile" :on-success="handleSuccess" :on-error="handleError" :beforeUpload="beforeUpload">
        <el-button size="small" type="primary">选择excel文件一起上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xlsx文件</div>
        </el-upload>
    </el-form-item>
    <!-- <form action="http://localhost:3000/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="excelFile">
        <input type="submit" value="提交">
    </form> -->
	</el-form>


  
</template>

<script>
import XLSX from 'xlsx'

export default {
    data() {
			return {
        appList:[],
        deviceList:[],
				form: {
          appName:'',
          deviceName:''
        },
        uploadData:{
          appName:'',
          code:''
        },
        formRules: {
					appName: [
						{ required: true, message: '请选择小程序', trigger: 'blur' }
					],
					deviceName: [
						{ required: true, message: '请选择设备', trigger: 'blur' }
          ],
          file:[
            // { required: true, message: '请选择文件', trigger: 'blur' }
          ]
				},
			}
		},
  methods:{
    handleSuccess() {
      console.log('submit!');
      this.$message.success('上传成功');
    },
    handleError(err,file) {
      console.log(err)
      console.log(file)
      this.$message.error(`上传失败: ${err}`);
    },
    beforeUpload (file) {
      var that = this
        this.$refs.form.validate((valid) => {
					if (valid) {
              //向后台传appName
              var appArr = that.appList
              var len = appArr.length
              for(var i=0;i<len-1;i++){
                if(appArr[i].value == this.form.appName){
                  that.uploadData.appName = appArr[i].label
                }
              }
              //向后台传设备码
              var deviceArr = that.deviceList
              var len = deviceArr.length
              for(var i=0;i<len-1;i++){
                if(deviceArr[i].value == this.form.deviceName){
                  that.uploadData.code = deviceArr[i].label
                }
              }
            
          }
      })
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      if (!extension && !extension2) {
        console.log('上传模板只能是 xls、xlsx 格式!')
      }
      return extension || extension2 
    }
  },
  mounted() {
      var that = this //注意用that
			this.$axios.get('http://118.25.21.169:3000/devices')
				.then(function (res) {

          var arr1 = res.data.appList
          for(var i=0;i<arr1.length;i++){
            var obj = {}
            obj.value = arr1[i].name
            obj.label = arr1[i].appName
            that.appList.push(obj)
          }
          var arr2 = res.data.deviceList
          for(var i=0;i<arr2.length;i++){
            var obj = {}
            obj.value = arr2[i].name
            obj.label = arr2[i].code
            that.deviceList.push(obj)
          }
        })
        
			
		}
}

</script>

<style scoped>
</style>