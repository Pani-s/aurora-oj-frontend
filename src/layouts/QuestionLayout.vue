<template>
  <div id="questionLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <a-row id="questionHeader" align="center" :wrap="false">
          <a-col flex="150px" style="margin-left: 4%">
            <a href="/" style="text-decoration: none">
              <div class="title-bar">
                <img class="logo" src="../assets/oj-logo.svg" alt="?" />
                <div class="title">Aurora OJ</div>
              </div>
            </a>
          </a-col>
          <a-col flex="auto" id="questionList">
            <a-button
              type="outline"
              @click="handleClick"
              class="searchButton"
              style="color: #9685cc; border-color: #9685cc"
            >
              题目列表（待开发T T）
            </a-button>
          </a-col>
          <a-col flex="100px">
            <div>
              <a-avatar
                class="avatar"
                shape="circle"
                :style="{ backgroundColor: '#cac6ff' }"
                :image-url="store.state.user.loginUser.userAvatar ?? userImg"
              >
              </a-avatar>
            </div>
          </a-col>
        </a-row>
        <a-drawer
          :width="340"
          :visible="visible"
          @ok="handleOk"
          @cancel="handleCancel"
          placement="left"
          unmountOnClose
        >
          <template #title>题目列表</template>
          <div>挖个坑，未完成</div>
        </a-drawer>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup="ts">
import { useStore } from "vuex";
import { ref } from "vue";

const visible = ref(false);
const userImg =
  "https://k.sinaimg.cn/n/sinakd10116/300/w1000h900/20200512/51c6-itmiwrz3680406.jpg/w700d1q75cms.jpg";
const store = useStore();

const handleClick = () => {
  visible.value = true;
};
const handleOk = () => {
  visible.value = false;
};
const handleCancel = () => {
  visible.value = false;
};
</script>

<style scoped>
#questionLayout .header {
  box-shadow: #e5e5e5 1px 1px 5px;
  z-index: 10;
  /*这样就不会被覆盖了*/
}

#questionLayout .content {
  /*background: linear-gradient(to right, #e5f2ff, #fdebff);*/
  /*background: url("https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png");*/
  background: rgba(242, 242, 250, 0.56);
  /*background: linear-gradient(180deg, #f3f3ff 0%, #ffffff 30%);*/
  /*margin-bottom: 16px;*/
  padding: 20px;
}

.title-bar {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.logo {
  height: 30px;
}

.avatar {
  cursor: default;
}

.title {
  font-weight: bold;
  font-size: large;
  color: #444;
  margin-left: 18px;
}

#questionList {
  margin-left: 50px;
}

#questionHeader {
  padding: 10px;
}
</style>