<template>
  <div style="margin: 2%;">
    <el-card style="width: 70%;margin-left: 15%;">
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="id" label="账号" width="180" />
        <el-table-column prop="vname" label="姓名" width="180" />
        <el-table-column prop="address" label="手机号" />
        <el-table-column prop="apartmentNum" label="地址" />
        <el-table-column prop="isDelete" label="性别">
          <template #default="scope">
            <div v-if="scope.row.isDelete === '0'">开放</div>
            <div v-else>不开放</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="danger" @click="villageDelete(scope.row)">删除</el-button>
            <el-button type="info" @click="dialogVisableClick(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          @current-change="changePage"
        >
        </el-pagination>
      </template>
    </el-card>


    <el-dialog v-model="dialogVisable" title="Warning" width="500" destroy-on-close center>
      <div>
        <el-form :model="myRow" label-width="auto">
          <el-form-item label="小区名" prop="vname" width="240">
            <el-input v-model="myRow.vname" placeholder="请输入小区名" />
          </el-form-item>
          <el-form-item label="地址" prop="address" width="240">
            <el-input v-model="myRow.address" placeholder="请输入地址" />
          </el-form-item>
          <el-form-item label="公寓数量" prop="apartmentNum" width="240">
            <el-input-number v-model.number="myRow.apartmentNum" placeholder="请输入公寓数量" min="0" />
          </el-form-item>
          <el-form-item label="是否开放" prop="isDelete" width="150">
            <el-select v-model="myRow.isDelete" style="width:150px;">
              <el-option label="是" value="0"></el-option>
              <el-option label="否" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisable = false">取消</el-button>
          <el-button type="primary" @click="villageModify()">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>

export default {
  props: {
    ruleForm: Object,
    flag: 0
  },
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      tmpList: [],
      dialogVisable: false,
      myRow: null
    };
  },
  methods: {
    changePage(page) {
      page = page - 1;
      const that = this;
      let start = page * that.pageSize, end = that.pageSize * (page + 1);
      let length = that.tmpList.length;
      let ans = (end < length) ? end : length;
      that.tableData = that.tmpList.slice(start, ans);
    },
    dialogVisableClick(row) {
      this.myRow = row;
      this.dialogVisable = true;
    },
    villageModify() {
      const that = this;

      // that.$myRequest({
      //   url: that.$store.state.village.villageModify,
      //   method: "POST",
      //   data: that.myRow
      // }).then(function(resp) {
      //   if (resp.data.code === 0) {
      //     that.$message({
      //       type: "success",
      //       message: "小区信息修改成功"
      //     });
      //   } else {
      //     that.$message({
      //       type: "error",
      //       message: "操作失败,可能不存在这个小区"
      //     });
      //   }
      // });
    },
    villageDelete(row) {
      const that = this;
      //
      // that.$myRequest({
      //   url: that.$store.state.village.villageDelete,
      //   method: "POST",
      //   data: row
      // }).then(function(resp) {
      //   if (resp.data.code === 0) {
      //     that.$message({
      //       type: "success",
      //       message: "小区设置成未开放成功"
      //     });
      //     // window.location.reload();
      //     that.$router.go(0);
      //   } else {
      //
      //     that.$message({
      //       type: "error",
      //       message: "操作失败,可能不存在这个小区"
      //     });
      //   }
      // });
    }
  },
  watch: {
    flag: {
      handler(newFlag, oldFlag) {
        const that = this;
        const form = {
          vname: that.ruleForm.vname,
          address: that.ruleForm.address,
          isDelete: that.ruleForm.isDelete
        };
        // that.$myRequest({
        //   url: that.$store.state.village.villageInfo,
        //   method: "POST",
        //   data: form
        // }).then(function(resp) {
        //   if (resp.data.code === 0) {
        //     that.$message({
        //       type: "success",
        //       message: "success"
        //     });
        //
        //     // 进行赋值
        //     that.tmpList = resp.data.data;
        //     that.total = resp.data.data.length;
        //     let start = 0, end = that.pageSize;
        //     let length = that.tmpList.length;
        //     let ans = (end < length) ? end : length;
        //     that.tableData = that.tmpList.slice(start, end);
        //
        //   } else {
        //     that.$message({
        //       type: "error",
        //       message: "error"
        //     });
        //   }
        // });
      },
      immediate: true,
      deep: true
    }
  }
};
</script>


<style scoped>

</style>