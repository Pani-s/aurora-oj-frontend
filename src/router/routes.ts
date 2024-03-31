import { RouteRecordRaw } from "vue-router";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import NoAuthView from "@/views/NoAuthView.vue";
import ACCESS_ENUM from "@/access/accessEnum";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import QuestionsView from "@/views/question/QuestionsView.vue";
import ViewQuestionView from "@/views/question/ViewQuestionView.vue";
import QuestionSubmitView from "@/views/question/QuestionSubmitView.vue";
import MyQuestionSubmitView from "@/views/question/MyQuestionSubmitView.vue";
import BasicLayout from "@/layouts/BasicLayout.vue";
import ManageUserView from "@/views/user/ManageUserView.vue";
import UserInfoView from "@/views/user/UserInfoView.vue";
import JudgeSettingView from "@/views/question/JudgeSettingView.vue";
import UserLayout from "@/layouts/UserLayout.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    children: [
      {
        path: "/user/login",
        name: "用户登录",
        component: UserLoginView,
      },
      {
        path: "/user/register",
        name: "用户注册",
        component: UserRegisterView,
      },
    ],
    meta: {
      hideInMenu: true,
    },
  },

  {
    path: "/",
    name: "主页",
    component: QuestionsView,
  },
  // {
  //   path: "/questions",
  //   name: "题库",
  //   component: QuestionsView,
  // },
  {
    path: "/question_submit",
    name: "提交列表",
    component: QuestionSubmitView,
  },

  {
    //定义动态参数路由，开启 props 为 true，可以在页面的 props 中直接获取到动态参数（题目 id）
    path: "/view/question/:id",
    name: "在线做题",
    component: ViewQuestionView,
    props: true,
    meta: {
      access: ACCESS_ENUM.USER,
      hideInMenu: true,
    },
  },

  // {
  //   path: "/my_question_submit",
  //   name: "我的历史提交",
  //   component: MyQuestionSubmitView,
  //   meta: {
  //     access: ACCESS_ENUM.USER,
  //   },
  // },

  // {
  //   path: "/add/question",
  //   name: "创建题目",
  //   component: AddQuestionView,
  //   meta: {
  //     access: ACCESS_ENUM.ADMIN,
  //   },
  // },
  // {
  //   path: "/update/question",
  //   name: "更新题目",
  //   component: AddQuestionView,
  //   meta: {
  //     access: ACCESS_ENUM.ADMIN,
  //     hideInMenu: true,
  //   },
  // },
  {
    path: "/me",
    name: "我的",
    component: BasicLayout,
    meta: {
      access: ACCESS_ENUM.USER,
    },
    children: [
      {
        path: "/my/submit",
        name: "我的历史提交",
        component: MyQuestionSubmitView,
        meta: {
          access: ACCESS_ENUM.USER,
        },
      },
      {
        path: "/my/info",
        name: "我的个人信息",
        component: UserInfoView,
        meta: {
          access: ACCESS_ENUM.USER,
        },
      },
    ],
  },
  {
    path: "/manage",
    name: "管理",
    component: BasicLayout,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
    children: [
      {
        path: "/manage/question/",
        name: "管理题目",
        component: ManageQuestionView,
        meta: {
          access: ACCESS_ENUM.ADMIN,
        },
      },
      {
        path: "/update/question",
        name: "更新题目",
        component: AddQuestionView,
        meta: {
          access: ACCESS_ENUM.ADMIN,
          hideInMenu: true,
        },
      },
      {
        path: "/add/question",
        name: "创建题目",
        component: AddQuestionView,
        meta: {
          access: ACCESS_ENUM.ADMIN,
        },
      },
      {
        path: "/manage/user",
        name: "用户管理",
        component: ManageUserView,
        meta: {
          access: ACCESS_ENUM.ADMIN,
        },
      },
      {
        path: "/manage/judge_settings",
        name: "判题设置",
        component: JudgeSettingView,
        meta: {
          access: ACCESS_ENUM.ADMIN,
        },
      },
    ],
  },
  // {
  //   path: "/manage/question/",
  //   name: "管理题目",
  //   component: ManageQuestionView,
  //   meta: {
  //     access: ACCESS_ENUM.ADMIN,
  //   },
  // },

  //test
  // {
  //   path: "/hide",
  //   name: "隐藏页面",
  //   component: HomeView,
  //   meta: {
  //     hideInMenu: true,
  //   },
  // },
  {
    path: "/noAuth",
    name: "无权限",
    component: NoAuthView,
    meta: {
      hideInMenu: true,
    },
  },
  // {
  //   path: "/admin",
  //   name: "管理员可见",
  //   component: AdminView,
  //   meta: {
  //     access: ACCESS_ENUM.ADMIN,
  //   },
  // },
  {
    path: "/about",
    name: "关于",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];
