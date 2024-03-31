<template>
  <div>
    <el-card class="box-card all">
      <el-table :data="tableData" border stripe style="width: 80%; margin-left: 10%;" :key="tableKey">
        <!--          <el-table-column prop="id" ></el-table-column>-->
        <el-table-column prop="archiveId" label="档案编号" width="165" />
        <el-table-column prop="sid" label="学号" width="100" />
        <el-table-column prop="userName" label="姓名" width="140" />
        <el-table-column prop="department" label="院系" width="180" />
        <el-table-column prop="classes" label="班级" width="180" />
<!--        <el-table-column prop="sex" label="性别" width="80" />-->
<!--        <el-table-column prop="health" label="健康状况" width="100" />-->
<!--        <el-table-column prop="nation" label="民族" width="80" />-->
<!--        <el-table-column prop="origin" label="生源地" width="180" />-->
<!--        <el-table-column prop="address" label="居住地址" width="180" />-->
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="scope">
            <el-button type="primary" @click="handleClick(scope.row)">查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin: 20px auto auto 10%;"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="changePage"
      >
      </el-pagination>
    </el-card>

    <el-dialog v-model="dialogFormVisible" title="修改档案信息" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-descriptions
        title="修改档案"
        direction="vertical"
        :column="3"
        size="default"
        border
      >
        <el-descriptions-item label="档案编号">{{ archive.archiveId }}</el-descriptions-item>
        <el-descriptions-item label="学号">{{ archive.userAccount }}</el-descriptions-item>

        <el-descriptions-item label="姓名">{{ archive.userName }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ archive.phone }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ archive.cardId }}</el-descriptions-item>
        <el-descriptions-item label="性别">
          <el-select v-model="archive.sex" >
            <el-option label="男" value="男">男</el-option>
            <el-option label="女" value="女">女</el-option>
          </el-select>
<!--          <el-radio-group v-model="archive.sex">-->
<!--            <el-radio value="男"></el-radio>-->
<!--            <el-radio value="女"></el-radio>-->
<!--          </el-radio-group>-->
<!--          {{ archive.sex }}-->
        </el-descriptions-item>
        <el-descriptions-item label="院系">{{ archive.department }}</el-descriptions-item>
        <el-descriptions-item label="班级">{{ archive.classes }}</el-descriptions-item>
        <el-descriptions-item label="出生日期">
          <el-date-picker
            v-model="archive.createTime"
            type="date"
            size="default"
          />
        </el-descriptions-item>

        <el-descriptions-item label="健康状况">
          <el-input v-model="archive.health" placeholder="请输入健康状况" size="default" />
        </el-descriptions-item>
        <el-descriptions-item label="民族">
          <el-input v-model="archive.nation" placeholder="请输入民族" size="default" />
        </el-descriptions-item>
        <el-descriptions-item label="家庭住址">
          <el-input v-model="archive.address" placeholder="请输入家庭住址" size="default" />
        </el-descriptions-item>
        <el-descriptions-item label="生源地">
          <el-input v-model="archive.origin" placeholder="请输入生源地" size="default" />
        </el-descriptions-item>

      </el-descriptions>

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
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="updateArchive">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
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
    const studentList = JSON.parse(localStorage.getItem("studentList") as string);
    let form = ref({});
    let dialogFormVisible = ref(false);
    let tmpList = ref(<[]>[]);
    let total = ref(0);
    let pageSize = ref(10);
    let tableKey = ref(0);
    let tableData = ref(<[]>[]);

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

          // context?.$myRequest({
          //   url: "/api/user/getUserAccountByClasses?classes=" + user?.classes,
          //   method: "GET"
          // }).then(function(resp: { data: { code: number; data: []; message: String; }; }) {
          //   if (resp.data.code === 0) {
          //
          //     res.data.data.forEach((item: { sid: never, state: any }, index) => {
          //       return item.state = resp.data.data.includes(item.sid);
          //     });
          //
          //     // console.log("res.data.data =");
          //     // console.log(res.data.data);
          //
          //     // // 进行赋值
          //     // tmpList.splice(0);
          //     // tmpList.push(...res.data.data);
          //     // total.value = tmpList.length;
          //     // let start = 0, end = pageSize.value;
          //     // let length = tmpList.length;
          //     // let ans = (end < length) ? end : length;
          //     // tableData.splice(0);
          //     // tableData.push(...tmpList.slice(start, end));
          //
          //     // tableKey.value = Math.random();
          //     // console.log(tmpList);
          //     // console.log(tableData);
          //     // context?.$message({
          //     //   type: "success",
          //     //   messag: res.data.message
          //     // });
          //   }
          // });

          let tempList = ref(<[]>[]);
          // 将学生信息添加上去 院系 班级
          res.data.data.forEach((item: {}, index: number) => {
            (item as any).tname = "";
            studentList.forEach((student: {}, index: number) => {
              if (item.sid === student.userAccount) {
                item = { ...item, ...student };
                tempList.value.push(item);
              } else {
              }
            });
          });

          // console.log("tempList.value =");
          // console.log(tempList.value);

          // 分页
          tmpList.value.splice(0);
          tmpList.value.push(...(tempList.value as []));
          total.value = tempList.value.length;
          let start = 0,
            end = pageSize.value;
          let length = tmpList.value.length;
          let ans = end < length ? end : length;
          tableData.value.splice(0);
          tableData.value.push(...tmpList.value.slice(start, ans));
          // console.log(tmpList.value);

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
      // console.log(archive.value);
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
      tableData, tableKey, handleClick, dialogFormVisible, archive, updateArchive, total, pageSize, changePage
    };
  }
};


function ruleForm(ruleForm: any, arg1: {}, arg2: (newValue: any, oldValue: any) => void) {
  throw new Error("Function not implemented.");
}


</script>

<style scoped>

</style>