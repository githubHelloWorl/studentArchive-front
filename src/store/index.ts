import {createStore} from "vuex";
import * as XLSX from "xlsx";

export default createStore({
  state: {
    forgetPassFlag: 0,
    loginUser: Object,
    fileType: [ "开除学籍","严重警告","警告","记过","留校察看" ],
    fileCircle: [ "6","7","8","9","10","11","12" ],
    fileLevel: [ "校级", "院级" ],
    baseUrl: "http://localhost:8084/"
  },
  getters: {},
  mutations: {
    exportExcel(state, value) {

      const worksheet = XLSX.utils.aoa_to_sheet([value.headers, ...value.data]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const moment = require("moment");
      const formattedTime = moment().format("YYYYMMDDHHmmss");
      XLSX.writeFile(workbook, formattedTime + "-" + value.userRole + ".xlsx");
    },
    changeForgetPassFlag(state) {
      state.forgetPassFlag += 1;
    },
    setUser(state, value) {
      state.loginUser = value;
    },
    logout(state) {
      localStorage.removeItem("loginUser");
      localStorage.removeItem("studentList");
      localStorage.removeItem("teacherList");
    }
  },
  actions: {
    exportExcel(context, value) {
      context.commit("exportExcel", value);
    },
    changeForgetPassFlag(context) {
      context.commit("changeForgetPassFlag");
    },
    setUser(context, value) {
      context.commit("setUser", value);
    },
    logout(context) {
      context.commit("logout");
    }
  },
  modules: {}
});
