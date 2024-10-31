<template>
  <el-dialog
    :title="title"
    :visible.sync="isDialogShow"
    custom-class="common-dialog"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :width="width + 'px'"
    @close="closeWindow('project')"
  >
    <el-form
      ref="project"
      :model="project"
      :rules="rules"
    >
      <el-form-item
        label="项目名称"
        prop="name"
        class="addItem"
      >
        <el-input
          v-model.trim="project.name"
          autocomplete="off"
          class="inputText"
        />
      </el-form-item>
      <el-form-item
        label="服务器ip"
        prop="host"
        class="addItem"
      >
        <el-input
          v-model.trim="project.host"
          autocomplete="off"
          class="inputText"
          placeholder="类似于：192.168.1.1"
        />
      </el-form-item>
      <el-form-item
        label="Ssh用户名"
        prop="username"
        class="addItem"
      >
        <el-input
          v-model.trim="project.username"
          autocomplete="off"
          class="inputText"
          placeholder="类似于：root"
        />
      </el-form-item>
      <el-form-item
        label="服务器ssh端口"
        prop="port"
        class="addItem"
      >
        <el-input
          v-model.trim="project.port"
          autocomplete="off"
          class="inputText"
          placeholder="通常是：22"
        />
      </el-form-item>
      <el-form-item
        label="前端项目部署路径"
        prop="serverPath"
        class="addItem"
      >
        <el-input
          v-model.trim="project.serverPath"
          autocomplete="off"
          class="inputText"
          placeholder="类似于：/root/project"
        />
      </el-form-item>
      <el-form-item
        label="项目目录名称"
        prop="serverPath"
        class="addItem"
      >
        <el-input
          v-model.trim="project.projectDirName"
          autocomplete="off"
          class="inputText"
          placeholder="类似于：dist"
        />
      </el-form-item>
      <el-form-item
        label="Ssh密码"
        prop="password"
        class="addItem"
      >
        <el-input
          v-model.trim="project.password"
          type="password"
          class="inputText"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="项目的访问路径"
        prop="url"
        class="addItem"
      >
        <el-input
          v-model.trim="project.url"
          autocomplete="off"
          class="inputText"
          placeholder="类似于：http://localhost:8080/#/index"
        />
      </el-form-item>
      <el-form-item
        label="Nginx执行文件路径"
        prop="nginxPath"
        class="addItem"
      >
        <el-input
          v-model.trim="project.nginxPath"
          autocomplete="off"
          class="inputText"
          placeholder="类似于：/usr/local/nginx/sbin/nginx"
        />
      </el-form-item>
      <el-form-item
        label="Nginx配置文件路径"
        prop="nginxConfPath"
        class="addItem"
      >
        <el-input
          v-model.trim="project.nginxConfPath"
          autocomplete="off"
          class="inputText"
          placeholder="类似于：/usr/local/nginx/conf/nginx.conf"
        />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="closeWindow('project')">
        取 消
      </el-button>
      <el-button
        type="primary"
        @click="submitUser()"
      >
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { rkAxios } from '@/js/tools/rk-axios';
import { api } from '../../../../config/api-config';
import { util } from '@/js/tools/util';
export default {
  name: 'ProjectForm',
  components: {},
  props: {
    width: {
      type: Number,
      default: 800
    },
    title: {
      type: String,
      default: '新增项目'
    },
    visible: {
      type: Boolean,
      default: false
    },
    isAdd:{
      type: String,
      default: 'editProject'
    },
    projectId:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isDialogShow: false,
      project: {
        name: '',
        projectDirName: '',
        host: '',
        username: '',
        port: '',
        serverPath: '',
        password: '',
        url: '',
        nginxPath: '',
        nginxConfPath: ''
      },
      rules: {
        name: [{ required: true, message:'请输入项目名称', trigger: 'blur' }],
        host: [ { required: true, message:'请输入服务器IP', trigger: 'blur' }],
        username: [ { required: true, message:'请输入Ssh用户名', trigger: 'blur' }],
        port: [{ required: true, message:'请输入服务器Ssh端口', trigger: 'blur' }],
        serverPath: [ { required: true, message:'请输入前端项目部署路径', trigger: 'blur' }]

      }
    };
  },
  watch: {
    visible: {
      handler(newVal) {
        this.isDialogShow = newVal;
        if(this.isDialogShow === true){
          if (this.isAdd === 'editProject') {
            this.showDetail(this.projectId);
          }else{
            this.$set(this.rules, 'password', [ { required: true, message:'请输入SSh密码', trigger: 'blur' }]);
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    closeWindow(formName) {
      this.$refs.project.resetFields();
      this.$emit('close');
    },
    submitUser(){
      this.$refs.project.validate(async (valid) => {
        if (valid) {
          let type, family;
          if(this.$props.isAdd === 'editProject'){
            type = 'put';
            family = '编辑';

          }else{
            type = 'post';
            family = '新增';
          }
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let result = await rkAxios[type](api.project.project, this.project).then((res)=>{
            return util.verifyResultCode(res);
          }).catch((error)=>{
            console.error(error);
            return false;

          });
          loading.close();
          if(!result){
            this.$message.error(`项目${family}失败！`);
            return;
          }

          this.$refs.project.resetFields();
          this.$emit('close');
          this.$message.success(`项目${family}成功！`);

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    showDetail (id){
      rkAxios.get(api.project.detail, {id:id}).then((res)=>{
        this.project = res.data.result;
      }).catch((error)=>{
        console.error(error);
        return false;
      });
    }
  }
};
</script>

<style scoped lang="less">
@import "project-form";
</style>
