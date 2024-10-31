<template>
  <el-dialog
    :title="title"
    :visible.sync="isDialogShow"
    custom-class="upload-dialog"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :width="width + 'px'"
    @close="closeWindow"
  >
    <div class="upload-dialog-inner">
      <el-upload
        class="upload-demo"
        drag
        accept=".zip"
        action="''"
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
          只能上传zip文件
        </div>
      </el-upload>
      <div class="row">
        备注：<el-input v-model="info" />
      </div>
      <div class="row">
        定时发布：
        <el-radio-group v-model="isPlan">
          <el-radio :label="0">
            立即
          </el-radio>
          <el-radio :label="1">
            计划
          </el-radio>
        </el-radio-group>
      </div>
      <div
        v-if="isPlan"
        class="row"
      >
        定时时间：
        <el-date-picker
          v-model="planDate"
          type="datetime"
          placeholder="选择日期时间"
        />
      </div>
      <div
        slot="footer"
        class="dialog-footer row"
      >
        <el-button @click="closeWindow()">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="uploadProject"
        >
          确 定
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {fileHeader, rkAxios} from '@/js/tools/rk-axios';
import { api } from '../../../../config/api-config';
export default {
  name: 'UploadDialog',
  components: {},
  props: {
    width: {
      type: Number,
      default: 800
    },
    title: {
      type: String,
      default: '项目详情'
    },
    visible: {
      type: Boolean,
      default: false
    },
    event:{
      type: String,
      default: 'showDetail'
    },
    projectId:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isDialogShow: false,
      file: null,
      path:api.project.publish,
      autoUpload:false,
      info: null,
      isPlan: 0,
      planDate: null
    };
  },
  watch: {
    visible: {
      handler(newVal) {
        this.isDialogShow = newVal;

      },
      immediate: true
    }
  },
  methods:{
    closeWindow() {
      this.$emit('close');
    },
    // 发布
    async uploadProject(){
      let formData = new FormData();
      formData.append('pId', this.projectId);
      if(this.info){
        formData.append('info', this.info);
      }

      formData.append('file', this.file);
      formData.append('isPlan', this.isPlan);
      if(this.isPlan){
        formData.append('planDate', new Date(this.planDate).getTime());
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      await rkAxios.post(api.project.publish, formData, fileHeader).then((res)=>{
        if(res.data.code === 200){
          this.$message({type: 'success', message: '发布成功!'});
          this.closeWindow();
        }else{
          this.$message.error('发布失败！');
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

<style scoped lang="less">
  @import "upload-dialog.less";
</style>
