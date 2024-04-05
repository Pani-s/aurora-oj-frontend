<template>
  <div id="answerPanel">
    <a-scrollbar>
      <a-button
        shape="round"
        style="float: right"
        type="outlined"
        @click="loadData"
      >
        <icon-refresh/>
      </a-button>
      <!--    搞了半天原来是组件放到template外面了-->
      <MdViewer :value="question.answer" />
    </a-scrollbar>
  </div>
</template>
<!--:value="question.answer || '该题目还未尝试过，不能查看答案！'"-->
<script setup lang="ts">
import { defineProps, onMounted, ref, withDefaults } from "vue";
import { Question, QuestionControllerService } from "../../generated";
import MdViewer from "@/components/MdViewer.vue";

const question = ref<Question>({});
question.value
  ? (question.value.answer = "该题目还未尝试过，不能查看答案!")
  : undefined;

/**
 * 定义组件属性类型
 */
interface Props {
  questionId: string;
}

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  questionId: () => "",
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionAnswerByIdUsingGet(
    props.questionId as any
  );
  if (res.code === 0) {
    question.value = res.data;
  }
  // else {
  // question.value?.answer = "该题目还未尝试过，不能查看答案！";
  // message.error("加载失败，" + res.message);
  // }
};
</script>

<style scoped>
#answerPanel {
}
</style>
