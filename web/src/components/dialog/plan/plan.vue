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
        width="160"
      >
        <template slot-scope="scope">
          {{ getDateString(scope.row.planDate) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="info"
        label="备注"
      />
      <el-table-column
        label="状态"
        width="80"
      >
        <template slot-scope="scope">
          {{ getStatus(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="executedInfo"
        label="发布日志"
      />
      <el-table-column
        prop="address"
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            type="danger"
            @click="deletePlan(scope.row.id)"
          >
            删除
          </el-button>
          <el-button
            v-if="scope.row.status === 0"
            type="primary"
            @click="immediate(scope.row.id)"
          >
            立即发布
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
  name: 'Plan',
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
    this.showPlan(this.projectId);
  },
  methods: {
    closeWindow() {
      this.$emit('close');
    },
    //
    async showPlan(id) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      await rkAxios.get(api.project.getPlanByPId, {pId: id}).then((res)=>{
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
    getStatus(status){
      let statusLabelSet = {
        0: '未触发',
        1: '成功',
        2: '失败'
      };
      return statusLabelSet[status];
    },
    // 删除计划
    async deletePlan(id) {
      this.$confirm('是否删除该计划?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rkAxios.delete(api.project.plan, {id:id}).then((res)=>{
          if(res.data.code === 200){
            this.$message({type: 'success', message: '删除成功！'});
            this.showPlan(this.projectId);
          }else{
            this.$message.error('删除失败！');
          }
        }).catch((error)=>{
          console.error(error);
          this.$message.error('删除失败！');
          return false;
        });
      }).catch(() => {
        return false;
      });
    },
    getDateString(timestamp){
      return moment(Number(timestamp)).format('YYYY-MM-DD HH:mm');
    },
    immediate(id){
      this.$confirm('是否立即执行该计划?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rkAxios.post(api.project.immediatePublish, {id:id}).then((res)=>{
          if(res.data.code === 200){
            this.$message({type: 'success', message: '发布成功！'});
            this.showPlan(this.projectId);
          }else{
            this.$message.error('发布失败！');
          }
        }).catch((error)=>{
          console.error(error);
          this.$message.error('发布失败！');
          return false;
        });
      }).catch(() => {
        return false;
      });
    }
  }
};

</script>

<style scoped lang="less">
@import "../history-dialog/history-dialog.less";
</style>
