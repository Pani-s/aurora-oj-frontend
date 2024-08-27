<template>
  <div id="viewQuestionView">
    <a-layout>
      <a-layout-sider
        :resize-directions="['right']"
        width="50%"
        style="min-width: 25%; max-width: 65%"
      >
        <div style="margin-left: 10px; margin-right: 10px; margin-top: 10px">
          <a-tabs default-active-key="question" lazy-load animation>
            <a-tab-pane key="question" title="题目">
              <a-scrollbar style="height: 60vh; overflow: auto">
                <a-card v-if="question" :title="question.title">
                  <!--a-descriptions 的 title="判题条件"-->
                  <a-descriptions :column="{ xs: 1, md: 2, lg: 3 }">
                    <a-descriptions-item label="时间限制">
                      {{ question.judgeConfig.timeLimit ?? 0 }} ms
                    </a-descriptions-item>
                    <a-descriptions-item label="内存限制">
                      {{ question.judgeConfig.memoryLimit ?? 0 }} KB
                    </a-descriptions-item>
                    <!--                <a-descriptions-item label="堆栈限制">-->
                    <!--                  {{ question.judgeConfig.stackLimit ?? 0 }} KB-->
                    <!--                </a-descriptions-item>-->
                  </a-descriptions>
                  <MdViewer :value="question.content || ''" />
                  <template #extra>
                    <a-space wrap>
                      <a-tag
                        v-for="(tag, index) of question.tags"
                        :key="index"
                        color="green"
                        >{{ tag }}
                      </a-tag>
                    </a-space>
                  </template>
                </a-card>
              </a-scrollbar>
            </a-tab-pane>
            <a-tab-pane key="comment" title="评论" disabled> 评论区</a-tab-pane>
            <a-tab-pane key="answer" title="答案">
              <!--            destroy-on-hide-->
              <answer-panel :questionId="id" />
            </a-tab-pane>
            <a-tab-pane key="submit" title="历史提交">
              <question-submit-list :questionId="id" />
            </a-tab-pane>
            <a-tab-pane key="debug" title="自测运行">
              <div class="bottom-bar-container">
                <!-- 折叠组件的外层容器 -->
                <div class="bottom-bar-additional-content">
                  <a-textarea
                    v-model="debugReq.input"
                    placeholder="请输入测试输入用例"
                    :auto-size="{
                      minRows: 5,
                    }"
                  />
                  <a-button
                    type="primary"
                    id="btn"
                    class="bottom-bar-button"
                    @click="doDebug"
                    :loading="loading"
                    >运行
                  </a-button>
                  <a-divider />
                  <h3>输出结果：</h3>
                  <a-textarea
                    v-model="debugResponse.output"
                    placeholder="输出结果"
                    :auto-size="{
                      minRows: 5,
                    }"
                    readonly
                  />
                  <h3>运行信息：</h3>
                  <h5 style="color: #5a5d8a">
                    {{ debugResponse.judgeInfo?.message }}
                  </h5>
                  {{ debugResponse.judgeInfo?.details }}
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-layout-sider>
      <a-layout-content style="margin: 10px; height: 82vh; overflow: hidden">
        <a-form :model="form" layout="inline" style="height: 8%">
          <a-form-item
            field="language"
            label="编程语言"
            style="min-width: 160px"
          >
            <a-select v-model="form.language" placeholder="选择编程语言">
              <a-option value="java">Java</a-option>
              <!--              <a-option value="cpp">C++</a-option>-->
              <!--              <a-option value="go">Golang</a-option>-->
            </a-select>
          </a-form-item>
          <a-form-item field="theme" label="主题" style="min-width: 120px">
            <a-select v-model="form.theme" placeholder="更改主题">
              <a-option value="vs-light">light</a-option>
              <a-option value="vs-dark">dark</a-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-badge status="success" />&nbsp;&nbsp;ACM 模式
          </a-form-item>
        </a-form>
        <CodeEditor
          :value="form.code"
          :language="form.language"
          :theme="form.theme"
          :handle-change="changeCode"
          style="height: 83%"
        />
        <!--          style="height: 60vh"-->
        <a-divider size="0" />
        <a-row>
          <a-col></a-col>
        </a-row>
        <!--        <div class="bottom-bar-container">-->
        <!--          &lt;!&ndash; 折叠组件的外层容器 &ndash;&gt;-->
        <!--          <a-collapse-->
        <!--            class="bottom-bar"-->
        <!--            v-model="activeNames"-->
        <!--            @change="handleCollapseChange"-->
        <!--          >-->
        <!--            <a-collapse-item header="自测运行" name="buttonBAndBelow">-->
        <!--              <div class="bottom-bar-additional-content">-->
        <!--                <a-textarea-->
        <!--                  v-model="debugReq.input"-->
        <!--                  placeholder="请输入测试输入用例"-->
        <!--                  :auto-size="{-->
        <!--                    minRows: 4,-->
        <!--                  }"-->
        <!--                />-->
        <!--                <a-button type="primary" id="btn" class="bottom-bar-button"-->
        <!--                  >运行-->
        <!--                </a-button>-->
        <!--                <a-divider />-->
        <!--                输出结果：-->
        <!--                <a-textarea-->
        <!--                  v-model="debugReq.input"-->
        <!--                  placeholder="输出结果"-->
        <!--                  :auto-size="{-->
        <!--                    minRows: 4,-->
        <!--                  }"-->
        <!--                />-->
        <!--              </div>-->
        <!--            </a-collapse-item>-->
        <!--          </a-collapse>-->
        <!--        </div>-->
        <a-button
          id="btn"
          type="primary"
          style="min-width: 150px; max-width: 150px; float: right"
          @click="doSubmit"
          :loading="loading"
        >
          提交代码
        </a-button>

        <!--        <div style="height: 5%">-->
        <!--          <a-row justify="start" gutter="24">-->
        <!--            <a-col span="4">-->
        <!--              <a-button-->
        <!--                id="btn"-->
        <!--                type="primary"-->
        <!--                style="min-width: 150px; max-width: 150px"-->
        <!--                @click="doSubmit"-->
        <!--              >-->
        <!--                自测运行-->
        <!--              </a-button>-->
        <!--            </a-col>-->
        <!--            <a-col span="4" offset="4">-->
        <!--              <a-button-->
        <!--                id="btn"-->
        <!--                type="primary"-->
        <!--                style="min-width: 150px; max-width: 150px"-->
        <!--                @click="doSubmit"-->
        <!--              >-->
        <!--                提交代码-->
        <!--              </a-button>-->
        <!--            </a-col>-->
        <!--          </a-row>-->
        <!--        </div>-->
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, withDefaults } from "vue";
import {
  BaseResponse_QuestionDebugResponse_,
  QuestionControllerService,
  QuestionDebugRequest,
  QuestionDebugResponse,
  QuestionVO
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import QuestionSubmitList from "@/components/QuestionSubmitList.vue";
import AnswerPanel from "@/components/AnswerPanel.vue";
import { Message } from "@arco-design/web-vue";
let loading = ref(false);
let debugReq = ref<QuestionDebugRequest>({});
let debugResponse = ref<QuestionDebugResponse>({});

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const question = ref<QuestionVO>();

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载失败，" + res.message);
  }
};
//QuestionSubmitAddRequest
const form = ref({
  theme: "vs-light",
  language: "java",
  code: "",
});

/**
 * 提交代码
 */
const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }

  const res = await QuestionControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    message.success("提交成功，请耐心等待评判结果");
  } else {
    message.error("提交失败," + res.message);
  }
};

/**
 * 提交代码
 */
const doDebug = async () => {
  if (!question.value?.id) {
    return;
  }
  loading.value = true;
  const res : BaseResponse_QuestionDebugResponse_ = await QuestionControllerService.doQuestionSubmitDebugUsingPost({
    code: form.value.code,
    language: form.value.language,
    input: debugReq.value.input,
    questionId: question.value.id,
  });
  console.log(res)
  if (res.code === 0) {
    debugResponse.value= { ...res.data };
    if(res.data?.isSuccess === false){
      message.error("代码执行错误 ~");
    }
  } else {
    message.error("提交失败," + res.message);
  }
  loading.value = false;
};

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const changeCode = (value: string) => {
  form.value.code = value;
};

const onCollapse = (val: any, type: any) => {
  const content = type === "responsive" ? "触发响应式收缩" : "点击触发收缩";
  Message.info({
    content,
    duration: 2000,
  });
};
</script>

<style>
#viewQuestionView {
  max-width: 98%;
  margin: 0 auto;
}

#viewQuestionView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}

.arco-resizebox-trigger-icon-wrapper {
  min-width: 10px;
  transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.arco-resizebox {
  transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

/*.bottom-bar-container {*/
/*  !* 底部栏的容器样式 *!*/
/*  position: absolute;*/
/*  bottom: 0;*/
/*  padding-bottom: 20px;*/
/*  !*width: 100%;*!*/
/*  !*max-width: inherit;*!*/
/*  width: 30%;*/
/*  background-color: #f5f5f5;*/
/*  z-index: 1000; !* 确保底部栏在最上层 *!*/
/*}*/

/*.bottom-bar {*/
/*  !* 折叠组件的样式 *!*/
/*  border: 1px solid #5f39cb; !* 与Element UI侧边栏样式保持一致 *!*/
/*}*/

/*!* 当按钮B及下方区域激活时显示额外内容 *!*/
/*.bottom-bar-item__content.a-collapse-item__content--inactive[name="buttonBAndBelow"]*/
/*  + .bottom-bar-additional-content {*/
/*  display: block;*/
/*}*/
</style>