<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<style>
#app {
}
</style>
<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

/**
 * 全局初始化函数，有全局单次调用的代码，都可以写到这里
 */
const doInit = () => {
  console.log("不要靠近，会变的不幸、、");
};

onMounted(() => {
  doInit();
});
</script>
<style>
.arco-input-wrapper {
  background-color: white;
  border-radius: 4px;
  border: 1px solid #c2c2c2;
}

.arco-textarea {
  background-color: white;
  border-radius: 4px;
  border: 1px solid #c2c2c2;
}
</style>