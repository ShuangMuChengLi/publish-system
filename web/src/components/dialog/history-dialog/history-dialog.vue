<template>
  <el-dialog
    :title="title"
    :visible.sync="isDialogShow"
    custom-class="history-dialog"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :width="width + 'px'"
    @close="closeWindow"
  >
    <el-table
      height="500"
      stripe
      :data="tableData"
    >
      <el-table-column
        prop="publishDate"
        label="发布日期"
      >
        <template slot-scope="scope">
          {{ getDateString(scope.row.publishDate) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="filePath"
        label="备份路径"
      />
      <el-table-column
        prop="info"
        label="备注"
      />
      <el-table-column
        prop="address"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.$index !== 0"
            type="primary"
            @click="resetHistory(scope.row.id)"
          >
            回滚
          </el-button>
          <el-button
            v-if="scope.$index !== 0"
            type="danger"
            @click="deleteVersion(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { rkAxios } from '@/js/tools/rk-axios';
import { api } from '../../../../config/api-config';
import moment from 'moment';
export default {
  name: 'HistoryDialog',
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
    return{
      isDialogShow: false,
      tableData:[],
      path:api.project.publish
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
  mounted() {
    this.showHistory(this.projectId);
  },
  methods: {
    closeWindow() {
      this.$emit('close');
    },
    // 还原
    async showHistory(id) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      await rkAxios.get(api.project.history, {pId: id}).then((res)=>{
        if(res.data.code === 200){
          this.tableData = res.data.result;
        }else{
          this.$message.error('数据错误！');
        }
      }).catch((error)=>{
        console.error(error);
        return false;
      });
      loading.close();
    },
    // 回退版本
    async resetHistory(id) {
      this.$prompt('请输入备注', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async ({ value }) => {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        await rkAxios.post(api.project.restore, {id:id, info: value}).then((res)=>{
          if(res.data.code === 200){
            this.$message({type: 'success', message: '回退成功！'});
            this.showHistory(this.projectId);
            this.bus.$emit('updateProjectList');
          }else{
            this.$message.error('回退失败！');
          }
        }).catch((error)=>{
          console.error(error);
          return false;
        });
        loading.close();
      }).catch(() => {
        return false;
      });
    },
    // 版本
    async deleteVersion(id) {
      this.$confirm('是否删除该版本?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rkAxios.delete(api.project.version, {id:id}).then((res)=>{
          if(res.data.code === 200){
            this.$message({type: 'success', message: '删除成功！'});
            this.showHistory(this.projectId);
            this.bus.$emit('updateProjectList');
          }else{
            this.$message.error('删除失败！');
          }
        }).catch((error)=>{
          console.error(error);
          return false;
        });
      }).catch(() => {
        return false;
      });
    },
    getDateString(timestamp){
      return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
    }
  }
};

</script>

<style scoped lang="less">
  @import "history-dialog.less";
</style>
