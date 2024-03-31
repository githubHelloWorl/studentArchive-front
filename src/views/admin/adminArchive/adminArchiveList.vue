<template>
  <div>
    <el-card class="box-card all">
      <!--      <template #header>-->
      <!--        <div class="card-header">-->
      <!--          <span>我的资料</span>-->
      <!--          <el-button class="button" type="text" @click="dialogFormVisible = true"-->
      <!--                     style="float: right;margin-right: 20px;"-->
      <!--          >修改信息-->
      <!--          </el-button>-->
      <!--        </div>-->
      <!--      </template>-->

      <el-table :data="tableData" border stripe style="width: 100%;" :key="tableKey">
        <!--          <el-table-column prop="id" ></el-table-column>-->
        <el-table-column prop="archiveId" label="档案编号" width="180" />
        <el-table-column prop="sid" label="学号" width="100" />
        <el-table-column prop="userName" label="姓名" width="100" />
        <el-table-column prop="sex" label="性别" width="80" />
        <el-table-column prop="health" label="健康状况" width="100" />
        <el-table-column prop="nation" label="民族" width="80" />
        <el-table-column prop="origin" label="生源地" width="180" />
        <el-table-column prop="address" label="居住地址" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" @click="handleClick(scope.row)">查看
            </el-button>
            <!--            <el-tooltip-->
            <!--              class="box-item"-->
            <!--              effect="dark"-->
            <!--              :content="scope.row.state?'点击修改档案信息':'该学生不是您的学生,不可操作'"-->
            <!--              placement="top"-->
            <!--            >-->
            <!--              <el-button type="primary" v-if="scope.row.state === true" @click="handleClick(scope.row)">修改-->
            <!--              </el-button>-->
            <!--              <el-button type="danger" disabled v-else>禁止</el-button>-->
            <!--              &lt;!&ndash;              </el-tag>&ndash;&gt;-->
            <!--            </el-tooltip>-->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        style="margin-top: 20px;"
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="changePage"
      >
      </el-pagination>
    </el-card>

    <el-dialog v-model="dialogFormVisible" title="修改档案信息" label-position="left" label-width="auto"
               style="max-width: 600px;" >
      <el-form :model="archive" label-position="right" label-width="auto">
        <el-form-item label="性别" prop="sex">
          {{ archive.sex }}
<!--          <el-radio-group v-model="archive.sex">-->
<!--            <el-radio value="男">男</el-radio>-->
<!--            <el-radio value="女">女</el-radio>-->
<!--          </el-radio-group>-->
        </el-form-item>
        <el-form-item label="家庭地址" prop="address">
          <el-input v-model="archive.address" placeholder="请输入家庭住址" size="large" :width="100" disabled/>
        </el-form-item>
        <el-form-item label="健康状况" prop="health">
          <el-input v-model="archive.health" placeholder="请输入健康状况" size="large" :width="100" disabled/>
        </el-form-item>
        <el-form-item label="生源地" prop="origin">
          <el-input v-model="archive.origin" placeholder="请输入生源地" size="large" disabled/>
        </el-form-item>
        <el-form-item label="民族" prop="nation">
          <el-input v-model="archive.nation" placeholder="请输入民族" size="large" disabled/>
        </el-form-item>
        <el-form-item label="出生日期" prop="createTime">
          <el-date-picker
            disabled
            v-model="archive.createTime"
            type="date"
            placeholder="请输入日期"
            size="large"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
<!--          <el-button type="primary" @click="updateArchive">-->
<!--            修改-->
<!--          </el-button>-->
        </div>
      </template>
    </el-dialog>

    <!--    <el-dialog v-model="dialogFormVisible" title="修改档案信息" label-position="left" label-width="auto"-->
    <!--               style="max-width: 600px;">-->
    <!--      <el-form :model="archive" :inline="true">-->
    <!--        <el-form-item label="档案编号" prop="archiveId">-->
    <!--          <el-input v-model="archive.archiveId" size="large" :width="100" disabled />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="性别" prop="sex">-->
    <!--          <el-radio-group v-model="archive.sex">-->
    <!--            <el-radio value="男">男</el-radio>-->
    <!--            <el-radio value="女">女</el-radio>-->
    <!--          </el-radio-group>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="家庭地址" prop="address">-->
    <!--          <el-input v-model="archive.address" placeholder="请输入家庭住址" size="large" :width="100" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="健康状况" prop="health">-->
    <!--          <el-input v-model="archive.health" placeholder="请输入健康状况" size="large" :width="100" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="生源地" prop="origin">-->
    <!--          <el-input v-model="archive.origin" placeholder="请输入生源地" size="large" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="民族" prop="nation">-->
    <!--          <el-input v-model="archive.nation" placeholder="请输入民族" size="large" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="出生日期" prop="createTime">-->
    <!--          <el-date-picker-->
    <!--            v-model="archive.createTime"-->
    <!--            type="date"-->
    <!--            placeholder="请输入日期"-->
    <!--            size="large"-->
    <!--          />-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <template #footer>-->
    <!--        <div class="dialog-footer">-->
    <!--          <el-button @click="dialogFormVisible = false">取消</el-button>-->
    <!--          <el-button type="primary" @click="updateArchive">-->
    <!--            修改-->
    <!--          </el-button>-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script lang="ts">
import { ref, reactive, getCurrentInstance, onMounted, watch, toRef } from "vue";


export default {
  props: ["ruleForm"],
  setup(props: any, content: any) {

    const context = getCurrentInstance()?.appContext.config.globalProperties;
    const user = context?.$store.state.loginUser;
    // let archive: {} = reactive(<{}>{});
    let archive = ref(<{}>{});
    // let archive = {};
    let form = ref({});
    let dialogFormVisible = ref(false);
    let tmpList = ref([]);
    let total = ref(0);
    let pageSize = ref(10);
    let tableKey = ref(0);
    let tableData = ref([]);

    /**
     * 改变页码
     */
    const changePage = (page: number) => {
      page = page - 1;
      let start = page * pageSize.value,
        end = pageSize.value * (page + 1);
      let length = tmpList.value.length;

      let ans = end < length ? end : length;
      tableData.value.splice(0);
      tableData.value.push(...tmpList.value.slice(start, ans));
    };

    /**
     * 监听
     * 得到学生档案
     */
    watch(props.ruleForm, (newValue, oldValue) => {
      if (props.ruleForm.flag === 0) {
        return;
      }

      form.value = props.ruleForm;

      context?.$myRequest({
        url: "/api/archive/queryArchive",
        method: "POST",
        data: form.value
      }).then(function(res: { data: { code: number; data: []; message: String; }; }) {
        if (res.data.code === 0) {

          // 分页
          tmpList.value.splice(0);
          tmpList.value.push(...(res.data.data as []));
          total.value = res.data.data.length;
          // console.log("total = ")
          // console.log(total)
          let start = 0,
            end = pageSize.value;
          let length = tmpList.value.length;
          let ans = end < length ? end : length;
          tableData.value.splice(0);
          tableData.value.push(...tmpList.value.slice(start, ans));

        } else {
          context?.$message({
            type: "error",
            messag: res.data.message
          });
        }

        props.ruleForm.flag = 0;
      });

    }, { immediate: true, deep: true });

    const handleClick = (row: {}) => {
      archive.value = row;
      dialogFormVisible.value = true;
      console.log(archive.value);
    };

    /**
     * 修改档案
     */
    const updateArchive = () => {
      console.log("updateArchive = ");
      console.log(archive.value);

      context?.$myRequest({
        url: "/api/archive/updateArchive",
        method: "POST",
        data: archive.value
      }).then(function(res: { data: { code: number; data: {}; message: String; }; }) {
        if (res.data.code === 0) {
          context?.$message({
            type: "success",
            message: "档案修改成功"
          });
        } else {
          context?.$message({
            type: "error",
            message: res.data.message
          });
        }
        dialogFormVisible.value = false;
      });
    };

    return {
      tableData, tableKey, handleClick, dialogFormVisible, archive, updateArchive, changePage, total, pageSize
    };
  }
};


</script>

<style scoped>

</style>