<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <a href="/">
            <div class="title-bar">
              <img class="logo" src="../assets/oj-logo.svg" alt="?" />
              <div class="title">Aurora OJ</div>
            </div>
          </a>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div>
        <a-dropdown trigger="hover">
          <a-avatar
            class="avatar"
            shape="circle"
            :style="{ backgroundColor: '#cac6ff' }"
            >{{ store.state.user?.loginUser?.userName ?? "未登录" }}
          </a-avatar>
          <template #content>
            <template
              v-if="checkAccess(store.state.user.loginUser, ACCESS_ENUM.USER)"
            >
              <a-doption>
                <template #icon>
                  <icon-idcard />
                </template>
                <template #default>
                  <a-anchor-link>个人信息</a-anchor-link>
                </template>
              </a-doption>
              <a-doption>
                <template #icon>
                  <icon-poweroff />
                </template>
                <template #default>
                  <a-anchor-link @click="logout">退出登录</a-anchor-link>
                </template>
              </a-doption>
            </template>
            <template v-else>
              <a-doption>
                <template #icon>
                  <icon-user />
                </template>
                <template #default>
                  <a-anchor-link href="/user/login">登录</a-anchor-link>
                </template>
              </a-doption>
            </template>
          </template>
        </a-dropdown>
      </div>
      <!--      <div>-->
      <!--        {{ store.state.user?.loginUser?.userName ?? "未登录" }}-->
      <!--      </div>-->
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";
import { UserControllerService } from "../../generated";

const router = useRouter();
const store = useStore();
// 展示在菜单的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    return checkAccess(
      store.state.user.loginUser,
      item?.meta?.access as string
    );
  });
});

// 默认主页
const selectedKeys = ref(["/"]);

// 路由跳转后，更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

// setTimeout(() => {
//   store.dispatch("user/getLoginUser", {
//     userName: "鱼皮管理员",
//     userRole: ACCESS_ENUM.ADMIN,
//   });
// }, 3000);
const logout = () => {
  UserControllerService.userLogoutUsingPost();
  location.reload();
};
const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
</script>

<style scoped>
.title-bar {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.title {
  font-weight: bold;
  font-size: large;
  color: #444;
  margin-left: 18px;
}

.logo {
  height: 48px;
}

.avatar {
  cursor: default;
}
</style>
