import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import myRequest from "@/plugins/axios";
import { ElMessage } from "element-plus";

const app = createApp(App);

app.config.globalProperties.$myRequest = myRequest;
app.config.globalProperties.$message = ElMessage;

app.use(ElementPlus).use(store).use(router).mount("#app");
