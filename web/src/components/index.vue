<!--公用头部-->
<template>
  <div class="set-pages">
    <div class="set-header">
      <div class="logo-block">
        <i class="el-icon-element" />
        <div class="logo-name">
          前端发布平台
        </div>
      </div>
    </div>
    <div class="set-body">
      <div class="right-content">
        <div class="toolbar">
          <el-button
            type="primary"
            @click="addProject"
          >
            新增项目
          </el-button>
          <el-button
            @click="getLog"
          >
            下载日志
          </el-button>
        </div>
        <div class="table-wrapper">
          <el-table
            stripe
            :data="tableData"
          >
            <el-table-column
              prop="name"
              label="项目"
              width="200px"
            />
            <el-table-column
              prop="publishDate"
              label="最后更新日期"
              width="200px"
            >
              <template slot-scope="scope">
                {{ util.getDateString(scope.row.publishDate) }}
              </template>
            </el-table-column>

            <el-table-column
              prop="address"
              label="nginx操作"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.nginxPath"
                  type="primary"
                  @click="downloadNginx(scope.row)"
                >
                  配置下载
                </el-button>
                <el-button
                  v-if="scope.row.nginxPath"
                  type="success"
                  @click="showNginx(scope.row)"
                >
                  配置上传
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="success"
                  @click="uploadProject(scope.row)"
                >
                  版本发布
                </el-button>
                <el-button
                  type="success"
                  @click="showPlan(scope.row)"
                >
                  发布计划
                </el-button>
                <el-button
                  type="info"
                  @click="showHistory(scope.row)"
                >
                  版本回滚
                </el-button>
                <el-button
                  type="primary"
                  @click="editProject(scope.row)"
                >
                  项目编辑
                </el-button>
                <el-button
                  type="danger"
                  @click="deleteBtn(scope.row)"
                >
                  项目删除
                </el-button>
                <el-button
                  v-if="scope.row.url"
                  @click="showProject(scope.row.url)"
                >
                  访问
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              :current-page="pageId"
              :page-size="pageSize"
              :page-sizes="[10, 20, 30, 40]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>
    <project-form
      v-if="visible"
      :visible.sync="visible"
      :is-add="action"
      :project-id="projectId"
      :title="title"
      @close="closeProjectForm"
    />
    <nginx-dialog
      v-if="showUpload"
      :visible.sync="showUpload"
      :project-id="projectId"
      @close="closeNginxDialog"
    />
    <history-dialog
      v-if="historyVisible"
      :title="title"
      :visible.sync="historyVisible"
      :event="action"
      :project-id="projectId"
      @close="closeHistoryDialog"
    />
    <plan
      v-if="planVisible"
      :title="title"
      :visible.sync="planVisible"
      :project-id="projectId"
      @close="closePlanDialog"
    />
    <upload-dialog
      v-if="uploadVisible"
      :title="title"
      :visible.sync="uploadVisible"
      :event="action"
      :project-id="projectId"
      @close="closeUploadDialog"
    />
  </div>
</template>
<script>
import { rkAxios } from '@/js/tools/rk-axios';
import { api } from '../../config/api-config';
import rkUtil from 'rk-util';
import { util } from '@/js/tools/util';
import ProjectForm from './dialog/project-form/project-form';
import NginxDialog from './dialog/nginx-dialog/nginx-dialog.vue';
import HistoryDialog from './dialog/history-dialog/history-dialog';
import UploadDialog from './dialog/upload-dialog/upload-dialog';
import Plan from '@/components/dialog/plan/plan';
export default {
  name: 'Index',
  components: {Plan, HistoryDialog, ProjectForm, NginxDialog, UploadDialog},
  data() {
    return {
      util,
      tableData: [

      ],
      visible:false,
      action:'addProject',
      projectId:'',
      showUpload:false,
      historyVisible:false,
      planVisible:false,
      uploadVisible: false,
      title:'',
      pageId: 1,
      pageSize:10,
      total:0
    };
  },
  watch: {
    visible:{
      handler:function(newVal){
        if(newVal === false){
          this.refresh();
        }
      }
    }
  },
  mounted() {
    this.init();
  },
  methods:{
    async init(){
      this.bus.$on('updateProjectList', ()=>{
        this.getList();
      });
      await this.getList();
    },
    // 获取列表
    async getList(){
      let result = await rkAxios.get(api.project.list, {pageId:this.pageId, pageSize:this.pageSize}).then((res)=>{
        return util.verifyResult(res);
      }).catch((error)=>{
        console.error(error);
        return false;
      });
      if(!result) return;

      this.tableData = result;
      this.total = this.tableData.length;
    },
    closeProjectForm(){
      this.visible = false;
      this.refresh();
    },
    closeHistoryDialog(){
      this.historyVisible = false;
      this.refresh();
    },
    closePlanDialog(){
      this.planVisible = false;
    },
    closeUploadDialog(){
      this.uploadVisible = false;
      this.refresh();
    },
    closeNginxDialog(){
      this.showUpload = false;
      this.refresh();
    },
    // 添加项目
    addProject(){
      this.action = 'addProject';
      this.title = '新增项目';
      this.visible = true;
    },
    // 刷新页面
    refresh(){
      rkAxios.get(api.project.list).then((res)=>{
        this.tableData = util.verifyResult(res);
        this.total = this.tableData.length;
      }).catch((error)=>{
        console.error(error);
        return false;
      });
    },
    // 删除项目
    deleteBtn (row){
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.deleteProject(row);
        this.$message({type: 'success', message: '删除成功!'});
      }).catch(() => {
      });
    },
    deleteProject (row) {
      rkAxios.delete(api.project.project, {id:row.id}).then((res)=>{
        if(res.data.code === 200){
          this.refresh();
        }else{
          this.$message.error('删除失败');
        }
      }).catch((error)=>{
        console.error(error);
        return false;
      });
    },
    // 编辑
    editProject(row){
      this.title = '编辑项目';
      this.projectId = row.id;
      this.action = 'editProject';
      this.visible = true;
    },
    // 访问
    showProject(url) {
      if(url){
        window.open(url);
      }
    },
    showNginx(row){
      this.projectId = row.id;
      this.showUpload = true;
    },
    showHistory(row){
      this.title = '版本列表';
      this.projectId = row.id;
      this.action = 'showHistory';
      this.historyVisible = true;
    },
    showPlan(row){
      this.title = '版本列表';
      this.projectId = row.id;
      this.planVisible = true;
    },
    // 发布
    uploadProject(row){
      this.title = '发布项目';
      this.projectId = row.id;

      this.uploadVisible = true;
    },
    // 下载nginx
    async downloadNginx(row){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      await rkAxios.get(api.project.nginx, {id: row.id}).then((res)=>{
        console.log('response: ', res);
        // new Blob([data])用来创建URL的file对象或者blob对象
        let url = window.URL.createObjectURL(new Blob([res.data]));
        // 生成一个a标签
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        // 生成时间戳
        let timestamp = new Date().getTime();
        link.download = 'nginx.conf';
        document.body.appendChild(link);
        link.click();
      }).catch((error)=>{
        console.error(error);
        return false;
      });
      loading.close();
    },
    // 重启nginx
    restartNginx(row){
      rkAxios.post(api.project.nginxRestart, {id: row.id}).then((res)=>{
        if(res.data.code === 200){
          this.$message({type: 'success', message: '重启成功!'});
        }else{
          this.$message.error('重启失败！');
        }
      }).catch((error)=>{
        console.error(error);
        return false;
      });
    },
    // 分页
    handleSizeChange(pageSize){
      this.pageSize = pageSize;
      this.getList();
    },
    handleCurrentChange(pageId){
      this.pageId = pageId;
      this.getList();
    },
    getLog(){
      rkAxios.get(api.project.log).then((res)=>{
        // new Blob([data])用来创建URL的file对象或者blob对象
        let url = window.URL.createObjectURL(new Blob([res.data]));
        // 生成一个a标签
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        // 生成时间戳
        link.download = 'forever.log';
        document.body.appendChild(link);
        link.click();
      }).catch((error)=>{
        console.error(error);
        return false;
      });
    }
  }
};
</script>
<style scoped lang="less">
@import "./set";
</style>
