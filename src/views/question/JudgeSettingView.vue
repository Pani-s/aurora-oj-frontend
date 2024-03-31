<template>
  <div id="judgeSettingView">
    <div id="container-a">
      <a-layout>
        <a-layout-header>
          <h2 style="text-align: center; color: #51416b">判题设置</h2>
          <a-menu
            :openKeys="['1']"
            :selectedKeys="['0_1']"
            mode="horizontal"
            style="background-color: rgba(255, 255, 255, 0)"
          >
            <a-menu-item key="0_1">
              <IconRobot />
              判题机类型设置
            </a-menu-item>
            <a-menu-item key="0_2">
              <IconFaceSmileFill />
              待拓展
            </a-menu-item>
          </a-menu>
        </a-layout-header>
        <a-layout style="padding: 0 30px; min-height: 300px">
          <a-layout-content>
            <div id="type">
              <a-form
                ref="typeFormRef"
                label-align="left"
                @submit="doSubmit"
                :model="form"
              >
                <a-form-item field="type">
                  <a-radio-group direction="vertical" v-model="form.type">
                    <a-radio value="example">本地Java代码沙箱</a-radio>
                    <a-radio value="remote">远程代码沙箱</a-radio>
                    <a-radio value="ai">AI辅助判题</a-radio>
                    <a-radio value="thirdParty">第三方沙箱（待开发）</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-button
                  id="btn"
                  html-type="submit"
                  type="primary"
                  style="max-width: 150px; align-self: center"
                  >修改类型
                </a-button>
                <!--                @click="typeFormRef.validate()"-->
              </a-form>
              <a-space size="large" style="padding: 30px" />
            </div>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { JudgeControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";

const typeFormRef = ref(null);
// let type = ref({ type: "" });
let form = ref({
  type: " ",
});

const getType = async () => {
  try {
    const res = await JudgeControllerService.getCodeSandboxTypeUsingGet();
    if (res.code === 0) {
      form.value.type = res.data;
      // console.log(form.value.type);
    } else {
      message.error("获取代码沙箱类型失败！！" + res.message);
    }
  } catch (e) {
    message.error("获取代码沙箱类型失败:" + e);
  }
};

onMounted(() => {
  getType();
});

const doSubmit = async (values: any) => {
  // console.log(form.value.type);
  const s = form.value.type;
  if (s == "") {
    return;
  }
  try {
    const res = await JudgeControllerService.setCodeSandboxTypeUsingPost(s);
    if (res.code === 0) {
      message.success("修改成功！");
    } else {
      message.error("修改失败！" + res.message);
    }
  } catch (e) {
    message.error("修改失败:" + e);
    console.log("修改失败:" + e);
  }
};
</script>

<style scoped>
#judgeSettingView {
  padding-left: 20%;
  padding-right: 20%;
}

#container-a {
  box-shadow: #d5d5d5 1px 5px 5px;
  z-index: 10;
  border-radius: 10px;
  background-color: white;
}
</style>
