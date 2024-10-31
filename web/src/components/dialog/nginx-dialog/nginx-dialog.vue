<template>
  <el-dialog
    :title="title"
    :visible.sync="isDialogShow"
    custom-class="nginx-dialog"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :width="width + 'px'"
    @close="closeWindow()"
  >
    <el-upload
      class="upload-demo"
      drag
      :action="''"
      :auto-upload="false"
      :on-change="fileChange"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
      <div
        slot="tip"
        class="el-upload__tip"
      >
        只能上传xml/json文件
      </div>
    </el-upload>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="closeWindow()">
        取 消
      </el-button>
      <el-button
        type="primary"
        @click="submitNginx"
      >
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {fileHeader, rkAxios} from '@/js/tools/rk-axios';
import { api } from '../../../../config/api-config';
export default {
  name: 'NginxDialog',
  components: {},
  props: {
    width: {
      type: Number,
      default: 800
    },
    title: {
      type: String,
      default: '上传配置文件'
    },
    visible: {
      type: Boolean,
      default: false
    },
    projectId:{
      type: String,
      default: ''
    }
  },
  data () {
    // 这里存放数据
    return {
      isDialogShow:false,
      autoUpload:false,
      file:''
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    visible: {
      handler(newVal) {
        this.isDialogShow = newVal;
      },
      immediate: true
    }
  },
  methods: {
    closeWindow() {
      this.$emit('close');
    },
    async submitNginx(id){
      let formData = new FormData();
      formData.append('pId', this.projectId);
      formData.append('file', this.file);
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      await rkAxios.post(api.project.nginx, formData, fileHeader).then((res)=>{
        if(res.data.code === 200){
          this.$message({type: 'success', message: '上传成功'});
          this.closeWindow();
        }else{
          this.$message.error('上传失败！');
        }
      }).catch((error)=>{
        console.error(error);
        return false;
      });
      loading.close();
    },
    fileChange(file){
      this.file = file.raw;
    }
  }
};
</script>

<style scoped lang='less'>
@import "nginx-dialog";
</style>
