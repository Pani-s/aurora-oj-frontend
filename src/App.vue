<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <template v-else-if="route.path.startsWith('/view/question')">
      <question-layout/>
    </template>
    <template v-else>
      <basic-layout />
    </template>
  </div>
</template>
<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import QuestionLayout from "@/layouts/QuestionLayout.vue";

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

//Stop error resizeObserver
const debounce = (callback: (...args: any[]) => void, delay: number) => {
  let tid: any;
  return function (...args: any[]) {
    const ctx = self;
    tid && clearTimeout(tid);
    tid = setTimeout(() => {
      callback.apply(ctx, args);
    }, delay);
  };
};

const _ = (window as any).ResizeObserver;
(window as any). ResizeObserver = class ResizeObserver extends _ {
  constructor(callback: (...args: any[]) => void) {
    callback = debounce (callback, 50);
    super(callback);
  }
};


</script>
<style>
#app {
}
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