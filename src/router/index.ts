import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { getCurrentInstance } from "vue";
import myRequest from "@/plugins/axios";
import { ElMessage } from "element-plus";
import store from "@/store/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/login/login.vue")
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/login/register.vue")
  },
  {
    path: "/student",
    name: "student",
    component: () => import("@/views/student/index.vue"),
    children: [
      {
        path: "/teacherNotice",
        name: "通知",
        component: () => import("@/views/teacher/home.vue"),
        children: [
          {
            path: "/teacherNotice",
            name: "通知信息",
            component: () => import("@/views/teacher/teacherNotice/teacherNotice.vue")
          }
        ]
      },
      {
        path: "/studentAr",
        name: "学生-档案",
        component: () => import("@/views/student/home.vue"),
        children: [
          {
            path: "/studentArchive2",
            name: "学生-档案",
            component: () => import("@/views/student/studentArchive1/studentArchive.vue")
          }
        ]
      },
      {
        path: "/studentRP",
        name: "学生惩奖",
        component: () => import("@/views/student/home.vue"),
        children: [
          {
            path: "/studentPunish1",
            name: "惩罚 信息",
            component: () => import("@/views/student/studentPR/studentPunish2.vue")
          },
          {
            path: "/studentReward4",
            name: "证书 信息",
            component: () => import("@/views/student/studentPR/studentReward3.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/teacher",
    name: "teacher",
    component: () => import("@/views/teacher/index.vue"),
    children: [
      {
        path: "/teacherNotice",
        name: "通知",
        component: () => import("@/views/teacher/home.vue"),
        children: [
          {
            path: "/teacherNotice",
            name: "通知信息",
            component: () => import("@/views/teacher/teacherNotice/teacherNotice.vue")
          }
        ]
      },
      {
        path: "/teacherInfo",
        name: "教师信息",
        component: () => import("@/views/teacher/home.vue"),
        children: [
          {
            path: "/teacherInfo",
            name: "教师信息",
            component: () => import("@/views/teacher/teacherInfo/teacherInfo.vue")
          }
        ]
      },
      {
        path: "/teacherArchive",
        name: "学生档案管理",
        component: () => import("@/views/teacher/home.vue"),
        children: [
          {
            path: "/teacherArchive",
            name: "学生 档案",
            component: () => import("@/views/teacher/teacherArchive/teacherArchive.vue")
          }
        ]
      },
      {
        path: "/teacherRP1",
        name: "学生惩奖管理",
        component: () => import("@/views/teacher/home.vue"),
        children: [
          {
            path: "/teacherPunish",
            name: "处分信息",
            component: () => import("@/views/teacher/teacherPR1/teacherPunish1.vue")
          },
          {
            path: "/teacherPunish0-1",
            name: "证书信息",
            component: () => import("@/views/teacher/teacherPR1/teacherReward1.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("@/views/admin/index.vue"),
    children: [
      {
        path: "/adminInfo",
        name: "通知管理",
        component: () => import("@/views/admin/home.vue"),
        children: [
          {
            path: "/adminInfo",
            name: "通知管理",
            component: () => import("@/views/admin/adminNotice/adminNotice.vue")
          }
        ]
      },
      {
        path: "/adminUser",
        name: "人员管理",
        component: () => import("@/views/admin/home.vue"),
        children: [
          {
            path: "/adminStudent",
            name: "学生管理",
            component: () => import("@/views/admin/adminUser/adminStudent.vue")
          },
          {
            path: "/adminTeacher",
            name: "教师管理",
            component: () => import("@/views/admin/adminUser/adminTeacher.vue")
          }
        ]
      },
      {
        path: "/adminArchive",
        name: "档案管理",
        component: () => import("@/views/admin/home.vue"),
        children: [
          {
            path: "/adminArchive",
            name: "学生档案",
            component: () => import("@/views/admin/adminArchive/adminArchive.vue")
          }
        ]
      },
      {
        path: "/adminRP",
        name: "惩奖管理",
        component: () => import("@/views/admin/home.vue"),
        children: [
          {
            path: "/adminPunish",
            name: "惩罚信息",
            component: () => import("@/views/admin/adminPR/adminPunish.vue")
          },
          {
            path: "/adminReward",
            name: "获奖信息",
            component: () => import("@/views/admin/adminPR/adminReward.vue")
          }
        ]
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  console.log(from.path + " ====> " + to.path);

  // 未登录
  if (localStorage.getItem("loginUser") === null) {
    // 登录界面
    if (to.path === "/") {
      next();
    }

    // 不是注册页面 则转到登录页面
    if (to.path !== "/register") {
      next({ path: "/" });
    }
  }

  const user = JSON.parse(localStorage.getItem("loginUser") as string);
  // 已登录
  if (to.path === "/") {
    if (user.userRole === "student") {
      next({ path: "/studentArchive2" });
    } else if (user.userRole === "teacher") {
      next({ path: "/teacherInfo" });
    } else if (user.userRole === "admin") {
      next({ path: "/adminInfo" });
    }
  }

  myRequest({
    url: "/api/user/getCurrentUser",
    method: "GET"
  }).then((res: any) => {
    console.log(res);
    if (res.data.data === null) {
      ElMessage({ type: "error", message: "未登录,请重新登录" });
      store.dispatch(("logout"));
      next({ path: "/" });
    } else {
      // ElMessage({ type: "success", message: "登录" });
    }
  });

  next();

});

export default router;
