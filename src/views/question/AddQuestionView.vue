<template>
  <div id="addQuestionView">
    <h1 style="font-family: 幼圆; color: #51416b">题目信息</h1>
    <a-form
      ref="formRef"
      :model="form"
      label-align="left"
      @submit="doSubmit"
      :rules="rules"
    >
      <a-form-item field="title" label="标题" validate-trigger="blur">
        <a-input v-model="form.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="tags" label="标签" validate-trigger="blur">
        <a-input-tag v-model="form.tags" placeholder="请选择标签" allow-clear />
      </a-form-item>
      <a-form-item field="content" label="题目内容" validate-trigger="blur">
        <MdEditor
          @click="
            contentZIndex = 2;
            answerZIndex = 1;
          "
          :style="`z-index: ${contentZIndex}`"
          :value="form.content"
          :handle-change="onContentChange"
        />
      </a-form-item>
      <a-form-item field="answer" label="答案" validate-trigger="blur">
        <MdEditor
          @click="
            contentZIndex = 1;
            answerZIndex = 2;
          "
          :style="`z-index: ${answerZIndex}`"
          :value="form.answer"
          :handle-change="onAnswerChange"
        />
      </a-form-item>
      <a-form-item label="判题配置" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" style="min-width: 480px">
          <a-form-item field="judgeConfig.timeLimit" label="时间限制">
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              placeholder="请输入时间限制"
              mode="button"
              :min="0"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.memoryLimit" label="内存限制">
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              placeholder="请输入内存限制"
              mode="button"
              :min="0"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.stackLimit" label="堆栈限制">
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              placeholder="请输入堆栈限制"
              mode="button"
              :min="0"
              size="large"
            />
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item
        label="测试用例配置"
        :content-flex="false"
        :merge-props="false"
        required
      >
        <a-form-item
          v-for="(judgeCaseItem, index) of form.judgeCase"
          :key="index"
          no-style
        >
          <a-space direction="vertical" style="min-width: 640px">
            <a-form-item
              :field="`form.judgeCase[${index}].input`"
              :label="`输入用例-${index}`"
              :key="index"
            >
              <a-input
                v-model="judgeCaseItem.input"
                placeholder="请输入测试输入用例"
              />
            </a-form-item>
            <a-form-item
              :field="`form.judgeCase[${index}].output`"
              :label="`输出用例-${index}`"
              :key="index"
            >
              <a-input
                v-model="judgeCaseItem.output"
                placeholder="请输入测试输出用例"
              />
            </a-form-item>
            <a-button status="danger" @click="handleDelete(index)">
              删除
            </a-button>
          </a-space>
        </a-form-item>
        <div style="margin-top: 32px">
          <a-button @click="handleAdd" type="outline" status="success"
            >新增测试用例
          </a-button>
        </div>
      </a-form-item>
      <div style="margin-top: 16px" />
      <a-form-item>
        <a-space>
          <a-button
            id="btn"
            html-type="submit"
            @click="$refs.formRef.validate()"
            type="primary"
            style="min-width: 120px"
            >提交
          </a-button>
          <a-button
            @click="$refs.formRef.resetFields()"
            style="min-width: 120px"
            >重置
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute } from "vue-router";
import { FieldRule } from "@arco-design/web-vue";
// @click="doSubmit"
const route = useRoute();
const formRef = ref(null);
const contentZIndex = ref(1);
const answerZIndex = ref(1);
// 如果页面地址包含 update，视为更新页面
let updatePage = route.path.includes("update");

let form = ref({
  title: "",
  tags: [],
  answer: "",
  content: "",
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
});

/**
 * 根据题目 id 获取老的数据
 */
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    // json 转 js 对象
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 1000,
        stackLimit: 1000,
        timeLimit: 1000,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
  } else {
    message.error("加载失败，" + res.message);
  }
};

onMounted(() => {
  updatePage = route.path.includes("update");
  if (updatePage) {
    loadData();
  }
});

//终于、、
watchEffect(() => {
  if (!route.path.includes("update")) {
    form.value = {
      title: "",
      tags: [],
      answer: "",
      content: "",
      judgeConfig: {
        memoryLimit: 1000,
        stackLimit: 1000,
        timeLimit: 1000,
      },
      judgeCase: [
        {
          input: "",
          output: "",
        },
      ],
    };
  }
});

const doSubmit = async () => {
  console.log(formRef);
  formRef?.value?.validate((r: any, Record: any) => {
    //r == void 0 验证成功通过
    if (r == void 0) {
      submitAdd();
    }
  });
  //本前端废物在这里卡了2个小时 T T
  //你是我的神！
  //https://blog.csdn.net/shi19970609/article/details/130149256
};

const submitAdd = async () => {
  console.log(form.value);
  console.log("updatePage", updatePage);
  // 区分更新还是创建
  if (updatePage) {
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("更新成功");
    } else {
      message.error("更新失败，" + res.message);
    }
  } else {
    //是添加
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("创建成功");
    } else {
      message.error("创建失败，" + res.message);
    }
  }
};

/**
 * 新增判题用例
 */
const handleAdd = () => {
  form.value.judgeCase.push({
    input: "",
    output: "",
  });
};

/**
 * 删除判题用例
 */
const handleDelete = (index: number) => {
  form.value.judgeCase.splice(index, 1);
};

const onContentChange = (value: string) => {
  form.value.content = value;
};

const onAnswerChange = (value: string) => {
  form.value.answer = value;
};
// :rules="[{ required: true, message: '标题不能为空', trigger: 'blur' }]"
const rules: Record<string, FieldRule | FieldRule[]> = {
  title: [
    {
      required: true,
      message: "标题不能为空",
    },
  ],
  answer: [
    {
      required: true,
      message: "答案不能为空",
    },
  ],
  content: [
    {
      required: true,
      message: "内容不能为空",
    },
  ],
  tags: [
    {
      required: true,
    },
  ],
};
</script>

<style scoped>
#addQuestionView {
  padding-left: 20%;
  padding-right: 20%;
}

#btn {
  background-color: #cebeff;
  color: #ffffff;
}

#btn:hover {
  background-color: #9685cc;
  transition: 0.5s;
}
</style>
