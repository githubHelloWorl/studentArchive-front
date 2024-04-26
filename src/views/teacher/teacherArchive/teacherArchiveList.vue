<template>
  <div>
    <el-card class="box-card all">
      <el-table :data="tableData" border stripe style="width: 94%; margin-left: 3%;">
        <el-table-column prop="archiveId" label="档案编号" width="160" align="center"/>
        <el-table-column prop="sid" label="学号" width="120" align="center"/>
        <el-table-column prop="userName" label="姓名" width="150" align="center"/>
        <el-table-column prop="department" label="院系" width="150" align="center"/>
        <el-table-column prop="classes" label="班级" width="165" align="center"/>
        <el-table-column prop="phone" label="手机号" width="115" align="center"/>
        <el-table-column prop="cardId" label="身份证号" width="165" align="center"/>
        <el-table-column label="操作" fixed="right" align="center">
          <template #default="scope">
            <el-button type="primary" @click="handleClick(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          style="margin: 20px auto auto 3%;"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="changePage"
      >
      </el-pagination>
    </el-card>

    <el-dialog v-model="dialogFormVisible" title="学生档案信息" label-position="left" label-width="auto"
               style="min-width: 800px;margin: 5% auto">
      <el-descriptions
          title=""
        direction="vertical"
        :column="3"
        size="default"
        border
      >
        <el-descriptions-item label="档案编号" align="center">{{ archive.archiveId }}</el-descriptions-item>
        <el-descriptions-item label="学号" align="center">{{ archive.userAccount }}</el-descriptions-item>
        <el-descriptions-item label="姓名" align="center">
<!--          <el-input v-model="archive.userName" placeholder="请输入姓名" size="default" />-->
          {{ archive.userName }}
        </el-descriptions-item>
        <el-descriptions-item label="身份证号" align="center">
<!--          <el-input v-model="archive.cardId" placeholder="请输入身份证号" size="default" />-->
          {{ archive.cardId }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号" align="center">
<!--          <el-input v-model="archive.phone" placeholder="请输入手机号" size="default" />-->
          {{ archive.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="性别" align="center">
<!--          <el-select v-model="archive.sex">-->
<!--            <el-option label="男" value="男">男</el-option>-->
<!--            <el-option label="女" value="女">女</el-option>-->
<!--          </el-select>-->
          {{ archive.sex }}
        </el-descriptions-item>
        <el-descriptions-item label="院系" align="center">
<!--          <el-input v-model="archive.department" placeholder="请输入院系" size="default" />-->
          {{ archive.department }}
        </el-descriptions-item>
        <el-descriptions-item label="班级" align="center">
<!--          <el-input v-model="archive.classes" placeholder="请输入班级" size="default" />-->
          {{ archive.classes }}
        </el-descriptions-item>
        <el-descriptions-item label="出生日期" align="center" width="200px">
<!--          <el-date-picker-->
<!--            v-model="archive.createTime"-->
<!--            type="date"-->
<!--            size="default"-->
<!--          />-->
          {{ new Date(archive.createTime).toLocaleDateString() }}
        </el-descriptions-item>

        <el-descriptions-item label="健康状况" align="center">
<!--          <el-input v-model="archive.health" placeholder="请输入健康状况" size="default" />-->
          {{ archive.health }}
        </el-descriptions-item>
        <el-descriptions-item label="民族" align="center">
<!--          <el-input v-model="archive.nation" placeholder="请输入民族" size="default" />-->
          {{ archive.health }}
        </el-descriptions-item>
        <el-descriptions-item label="家庭住址" align="center">
<!--          <el-input v-model="archive.address" placeholder="请输入家庭住址" size="default" />-->
          {{ archive.health }}
        </el-descriptions-item>
        <el-descriptions-item label="生源地" align="center" :span="3">
<!--          <el-input v-model="archive.origin" placeholder="请输入生源地" size="default"/>-->
          {{ archive.health }}
        </el-descriptions-item>
        <el-descriptions-item label="学生获奖信息" align="center" :span="3">
          <el-text v-for="(reward,index) in studentPR.reward" :key="index" :label="reward" :value="reward">
            {{ (index === 0 ? "" : " , ") + reward }}
          </el-text>
        </el-descriptions-item>
        <el-descriptions-item label="学生处分信息" align="center" :span="3">
          <el-text v-for="(punish,index) in studentPR.punish" :key="index" :label="punish" :value="punish">
            {{ (index === 0 ? "" : " , ") + punish }}
          </el-text>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">确定</el-button>
<!--          <el-button type="primary" @click="updateArchive">-->
<!--            确定-->
<!--          </el-button>-->
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {getCurrentInstance, ref, watch} from "vue";


export default {
  props: ["ruleForm"],
  setup(props: any, content: any) {
    interface PR {
      punish: [string],
      reward: [string]
    };

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
    let studentPR = ref<PR>({ punish: [""], reward: [""] });

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
     * 得到列表
     */
    const getTable = () => {
      form.value = props.ruleForm;

      context?.$myRequest({
        url: "/api/archive/queryArchive",
        method: "POST",
        data: form.value
      }).then(function(res: { data: { code: number; data: []; message: String; }; }) {
        if (res.data.code === 0) {

          // 更改学生信息
          context?.$myRequest({
            url: "/api/user/queryPostStudent",
            method: "POST",
            data: {}
          }).then(function(res: any) {
            if (res.data.code === 0) {

              studentList.splice(0);
              studentList.push(...(res.data.data as []));
              localStorage.setItem("studentList", JSON.stringify(studentList));

            } else {
              context?.$message({
                type: "error",
                message: res.data.message
              });
            }
          });

          let tempList = ref(<[]>[]);
          // 将学生信息添加上去 院系 班级
          res.data.data.forEach((item: {}, index: number) => {
            (item as any).tname = "";
            studentList.forEach((student: {}, index: number) => {
              if ((item as any).sid === (student as any).userAccount) {
                item = { ...item, ...student };
                (tempList as any).value.push(item);
              } else {
              }
            });
          });

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
        } else {
          context?.$message({
            type: "error",
            messag: res.data.message
          });
        }

        props.ruleForm.flag = 0;
      });
    };

    /**
     * 监听
     * 得到学生档案
     */
    watch(props.ruleForm, (newValue, oldValue) => {
      if (props.ruleForm.flag === 0) {
        return;
      }

      getTable();

    }, { immediate: true, deep: true });

    /**
     * 得到奖惩信息
     * @param row
     */
    const handleClick = (row: {}) => {
      archive.value = row;
      getPRByuserAccount((row as any).sid);
      dialogFormVisible.value = true;
    };

    /**
     * 修改档案
     */
    const updateArchive = () => {

      context?.$myRequest({
        url: "/api/user/updateUserArchive",
        method: "POST",
        data: archive.value
      }).then(function(res: { data: { code: number; data: {}; message: String; }; }) {
        if (res.data.code === 0) {
          context?.$message({
            type: "success",
            message: "档案修改成功"
          });
          getTable();
        } else {
          context?.$message({
            type: "error",
            message: res.data.message
          });
        }
        dialogFormVisible.value = false;
      });
    };

    /**
     * 得到用户PR
     */
    const getPRByuserAccount = (userAccount: string) => {
      context?.$myRequest({
        url: "/api/PR/getPRByAccountState?userAccount=" + userAccount,
        method: "GET"
      }).then(function(res: { data: { code: number; data: []; message: String; }; }) {
        if (res.data.code === 0) {
          studentPR.value.reward.splice(0);
          studentPR.value.punish.splice(0);
          res.data.data.forEach((item: any, index) => {
            if ((item as any).fileInfo === "1") {
              studentPR.value.reward.push(item.fileName);
            } else {
              studentPR.value.punish.push(item.fileName);
            }
          });
        } else {
          context?.$message({
            type: "error",
            messag: res.data.message
          });
        }
      });
    };

    return {
      tableData, tableKey, handleClick, dialogFormVisible, archive, updateArchive, total, pageSize, changePage, studentPR
    };
  }
};

</script>

<style scoped>

</style>