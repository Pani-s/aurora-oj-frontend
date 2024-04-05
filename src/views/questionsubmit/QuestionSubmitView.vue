<template>
  <div id="questionSubmitView">
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
      <!--      <template #judgeInfo="{ record }">-->
      <!--        {{ record.judgeInfo }}-->
      <!--      </template>-->
      <template #judgeInfoMemory="{ record }">
        <!--        整数除法-->
        <template
          v-if="record.judgeInfo.memory && record.judgeInfo.memory !== 0"
        >
          {{(record.judgeInfo.memory / 1024 | 0)}}kb
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
      <!--      <template #createTime="{ record }">-->
      <!--        {{ record.createTime }}-->
      <!--              {{ moment(record.createTime).format("YYYY-MM-DD") }}-->
      <!--      </template>-->
    </a-table>
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
import { QuestionStateEnum } from "@/views/questionsubmit/QuestionStateEnum";
import { QuestionStateStrEnum } from "@/views/questionsubmit/QuestionStateStrEnum";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res =
    await QuestionControllerService.listAllSubmitQuestionByPageUsingPost({
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    });
  if (res.code === 0) {
    dataList.value = res?.data?.records;
    dataList.value.forEach((item: QuestionSubmit) => {
      item.status = QuestionStateEnum[item.status];
      item.userId = maskNumber(item?.userId);
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

function maskNumber(number: number) {
  // 将数字转换为字符串
  const numStr = number.toString();
  // 获取字符串的长度
  const length = numStr.length;
  // 如果数字长度小于或等于5位，直接返回原数字
  if (length <= 5) {
    return numStr;
  }
  // 计算星号的数量，即除去前5位之外的数字长度
  const starCount = length - 7;
  // 创建遮蔽用的星号字符串
  const mask = "*".repeat(starCount);
  // 拼接字符串：开头5位 + 星号
  return numStr.slice(0, 7) + mask;
}

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
  // {
  //   title: "提交号",
  //   dataIndex: "id",
  //   ellipsis: true,
  //   width: 120,
  // },
  {
    title: "编程语言",
    dataIndex: "language",
    width: 150,
  },
  {
    title: "判题信息",
    dataIndex: "judgeInfo",
    children: [
      {
        title: "执行信息",
        dataIndex: "judgeInfo.message",
        width: 160,
      },
      {
        title: "执行内存",
        dataIndex: "judgeInfo.memory",
        width: 130,
        slotName: "judgeInfoMemory",
      },
      {
        title: "执行时间",
        dataIndex: "judgeInfo.time",
        width: 130,
        slotName: "judgeInfoTime",
      },
    ],
    width: 420,
  },
  {
    title: "判题状态",
    dataIndex: "status",
    slotName: "status",
    width: 130,
  },
  {
    title: "题号",
    dataIndex: "questionId",
    width: 130,
  },
  {
    title: "提交者",
    dataIndex: "userId",
    width: 170,
  },
  {
    title: "创建时间",
    // slotName: "createTime",
    dataIndex: "createTime",
    width: 200,
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
#questionSubmitView {
  max-width: 1280px;
  /*margin: 0 auto;*/
  padding-left: 8%;
  padding-right: 8%;
}
</style>
