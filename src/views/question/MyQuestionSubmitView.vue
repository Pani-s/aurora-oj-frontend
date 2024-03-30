<template>
  <div id="myQuestionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionId" label="题号" style="min-width: 240px">
        <a-input v-model="searchParams.questionId" placeholder="请输入" />
      </a-form-item>
      <a-form-item field="language" label="编程语言" style="min-width: 240px">
        <a-select
          v-model="searchParams.language"
          :style="{ width: '320px' }"
          placeholder="选择编程语言"
        >
          <a-option>java</a-option>
          <a-option>cpp</a-option>
          <a-option>go</a-option>
          <a-option>html</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button
          type="outline"
          @click="doSubmit"
          shape="round"
          style="color: #9685cc; border-color: #9685cc"
          >搜索
        </a-button>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #judgeInfoMemory="{ record }">
        <!--        整数除法-->
        <template
          v-if="record.judgeInfo.memory && record.judgeInfo.memory !== 0"
        >
          {{( (record.judgeInfo.memory / 1024) | 0 )}}kb
        </template>
        <template v-else> -</template>
        <!--        {{ record.judgeInfo.memory && record.judgeInfo.memory !== 0 && (record.judgeInfo.memory / 1024 | 0) + "kb"}}-->
        <!--        {{ !record.judgeInfo.memory && " - "}}-->
      </template>

      <template #judgeInfoTime="{ record }">
        <template v-if="record.judgeInfo.time && record.judgeInfo.time !== 0">
          {{ record.judgeInfo.time }}ms
        </template>
        <template v-else> -</template>
        <!--        {{ record.judgeInfo.time && record.judgeInfo.time !== 0 && record.judgeInfo.time + "ms"}}-->
        <!--        {{ !record.judgeInfo.time && " - "}}-->
      </template>

      <template #status="{ record }">
        <!--              {{ JSON.stringify(record.judgeInfo) }}-->
        <div
          style="font-weight: bold"
          :style="{ color: getStatusColor(record.status) }"
        >
          {{ record.status }}
        </div>
      </template>

      <template #optional="{ record }">
        <a-space>
          <a-button id="btn" @click="showAnswer(record.code)">
            查看代码
          </a-button>
          <a-button
            @click="retry(record.id)"
            v-if="record.status === QuestionStateStrEnum.ERROR_STR"
          >
            Retry~
          </a-button>
        </a-space>
      </template>

      <!--      <template #createTime="{ record }">-->
      <!--        {{ record.createTime }}-->
      <!--              {{ moment(record.createTime).format("YYYY-MM-DD") }}-->
      <!--      </template>-->
    </a-table>

    <a-modal v-model:visible="visible" @ok="handleOk">
      <template #title> 你的代码~ </template>
      <a-textarea :model-value="ans" auto-size disabled></a-textarea>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  QuestionControllerService,
  QuestionSubmit,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { QuestionStateEnum } from "@/views/question/QuestionStateEnum";
import { useStore } from "vuex";
import { QuestionStateStrEnum } from "@/views/question/QuestionStateStrEnum";

const tableRef = ref();
const store = useStore();
const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
});

const visible = ref(false);
const ans = ref<string>("");

const showAnswer = (code: string) => {
  visible.value = true;
  ans.value = code;
};
const handleOk = () => {
  visible.value = false;
};

const retry = async (id: string) => {
  const para = {
    id: id
  };
  try{
    const res =
      await QuestionControllerService.retryMyErrorSubmitUsingPost(para);
    if (res.code === 0) {
      message.success("重新提交成功！");
    } else {
      message.error("重试失败，请稍后再试：" + res.message);
    }
  }catch (e){
    message.error("加载失败，请稍后再试：" + e);
  }
};

const loadData = async () => {
  const res =
    await QuestionControllerService.listMySubmitQuestionByPageUsingPost({
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    });
  if (res.code === 0) {
    dataList.value = res?.data?.records;
    dataList.value.forEach((item: QuestionSubmit) => {
      item.status = QuestionStateEnum[item.status];
      item.judgeInfo = JSON.parse(item.judgeInfo);
      // if (item.judgeInfo.memory == 0) {
      //   item.judgeInfo.memory = "-";
      // }
    });
    total.value = res?.data?.total;
  } else {
    message.error("加载失败，请稍后再试：" + res.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "提交号",
    dataIndex: "id",
    ellipsis: true,
    width: 100,
  },
  {
    title: "编程语言",
    dataIndex: "language",
    width: 100,
  },
  {
    title: "判题信息",
    dataIndex: "judgeInfo",
    children: [
      {
        title: "执行信息",
        dataIndex: "judgeInfo.message",
        ellipsis: true,
        tooltip: true,
        width: 140,
      },
      {
        title: "执行内存",
        dataIndex: "judgeInfo.memory",
        slotName: "judgeInfoMemory",
        width: 80,
      },
      {
        title: "执行时间",
        dataIndex: "judgeInfo.time",
        slotName: "judgeInfoTime",
        width: 80,
      },
    ],
    width: 300,
  },
  {
    title: "判题状态",
    dataIndex: "status",
    slotName: "status",
    width: 80,
  },
  {
    title: "题号",
    dataIndex: "questionId",
    width: 100,
  },
  {
    title: "提交时间",
    // slotName: "createTime",
    dataIndex: "updateTime",
    width: 160,
  },
  {
    slotName: "optional",
    width: 180,
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const router = useRouter();

/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};

const getStatusColor = (statusEnum: string) => {
  if (statusEnum === QuestionStateStrEnum.RUNNING_STR) {
    return "orange";
  } else if (statusEnum === QuestionStateStrEnum.WAITING_STR) {
    return "lightblue";
  } else if (statusEnum === QuestionStateStrEnum.SUCCESS_STR) {
    return "green";
  } else if (statusEnum === QuestionStateStrEnum.FAILED_STR) {
    return "red";
  } else if (statusEnum === QuestionStateStrEnum.ERROR_STR) {
    return "brown";
  }
  // 返回默认颜色或者其他逻辑
  return "brown";
};
</script>

<style scoped>
#myQuestionSubmitView {
  max-width: 1280px;
  /*margin: 0 auto;*/
  padding-left: 8%;
  padding-right: 8%;
}
</style>