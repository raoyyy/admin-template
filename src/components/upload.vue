<template>
  <div>
    <!-- <form action="http://localhost:3000/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="thumbnail">
      <input type="submit">
    </form>  -->
    <el-upload action="http://localhost:3000/upload" name="thumbnail" :on-success="handleSuccess" :on-error="handleError" :beforeUpload="beforeUpload">
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件 且不超过10M</div>
  </el-upload>

  <!-- <el-upload
               action="http://localhost:3000/upload"
               name="thumbnail"
               :onError="handleError"
               :onSuccess="handleSuccess"
               :beforeUpload="beforeAvatarUpload"
               >
               <el-button size="small" type="primary">点击上传</el-button>
  </el-upload> -->

  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  methods:{
    handleSuccess() {
      var that = this
      this.$axios.get('http://localhost:3000/',{
        
      })
      .then( function(){
        that.$message.success('上传成功');
      })
      .catch(function(err){
        console.log(err)
      })
    },
    handleError(err) {
      console.log("error")
      this.$message.error(`上传失败: ${err}`);
    },
    beforeUpload (file) {
      console.log(file)
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      // const isLt10M = file.size / 1024 / 1024 < 10
      if (!extension && !extension2) {
        var str = '上传模板只能是 xls、xlsx 格式!'
        console.log('上传模板只能是 xls、xlsx 格式!')
        this.handleError(str)
      }
      // if (!isLt10M) {
      //   console.log('上传模板大小不能超过 10MB!')
      //   var str = '上传模板大小不能超过 10MB!'
      //   this.handleError(str)
      // }
      return extension || extension2
    }
  },
}
</script>

<style scoped>
#excel-upload-input{
  display: none;
  z-index: -9999;
}
#drop{
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
