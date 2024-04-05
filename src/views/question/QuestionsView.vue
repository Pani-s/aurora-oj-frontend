<template>
  <div id="questionsView">
    <div class="rank">
      <rank-component />
    </div>
    <a-divider />
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="title" label="名称" style="min-width: 240px">
        <a-input v-model="searchParams.title" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item field="tags" label="标签" style="min-width: 240px">
        <a-input-tag v-model="searchParams.tags" placeholder="请输入标签" />
      </a-form-item>
      <a-form-item>
        <a-button
          class="searchButton"
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
      <template #pass="{ record }">
        <!--        {{ moment(record.createTime).format("YYYY-MM-DD") }}-->
        <!--        我选择后端就返回格式化的字符串。-->
        <template v-if="record.isPass === true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="1.2em"
            height="1.2em"
            fill="currentColor"
            color="green"
          >
            <path
              fill-rule="evenodd"
              d="M20 12.005v-.828a1 1 0 112 0v.829a10 10 0 11-5.93-9.14 1 1 0 01-.814 1.826A8 8 0 1020 12.005zM8.593 10.852a1 1 0 011.414 0L12 12.844l8.293-8.3a1 1 0 011.415 1.413l-9 9.009a1 1 0 01-1.415 0l-2.7-2.7a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </template>
      </template>
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="orange"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #acceptedRate="{ record }">
        {{
          `${
            record.submitNum
              ? (record.acceptedNum / record.submitNum).toFixed(2)
              : "0.00"
          }% (${record.acceptedNum}/${record.submitNum})`
        }}
      </template>
      <template #createTime="{ record }">
        <!--        {{ moment(record.createTime).format("YYYY-MM-DD") }}-->
        <!--        我选择后端就返回格式化的字符串。-->
        {{ record.createTime }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button id="btn" @click="toQuestionPage(record)"> 做题</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import RankComponent from "@/components/RankComponent.vue";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionQueryRequest>({
  title: "",
  tags: [],
  pageSize: 10,
  current: 0,
});

const loadData = async () => {
  console.log(searchParams.value);
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res?.data?.records;
    total.value = res?.data?.total;
  } else {
    message.error("加载失败，" + res.message);
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

// {id: "1", title: "A+ D", content: "新的题目内容", tags: "["二叉树"]", answer: "新的答案", submitNum: 0,…}

const columns = [
  {
    slotName: "pass",
  },
  {
    title: "题号",
    dataIndex: "id",
  },
  {
    title: "题目名称",
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
  },
  // {
  //   title: "创建时间",
  //   slotName: "createTime",
  // },
  {
    slotName: "optional",
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
 * 跳转到做题页面
 * @param question
 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
  loadData();
};
</script>

<style>
#questionsView {
  max-width: 1280px;
  /*margin: 0 auto;*/
  padding-left: 8%;
  padding-right: 8%;
}

#btn {
  background-color: #cebeff;
  color: #ffffff;
}

#btn:hover {
  background-color: #9685cc;
  transition: 0.5s;
}
.rank{
  padding-top: 30px;
  padding-bottom: 10px;
  border-radius: 10px;

  background-image: url("http://pics.soogyu.xyz/pani/oj/240331-ballll.webp");
  /* 背景图垂直、水平均居中 */
  background-position: center center;
  /* 背景图不平铺 */
  background-repeat: no-repeat;
  /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
  /*background-attachment: fixed;*/
  /* 让背景图基于容器大小伸缩 */
  background-size: 100% 190%;
  /* 设置背景颜色，背景图加载过程中会显示背景色 */
  background-color: white;
}
.searchButton{
  color: #9685cc;
  border-color: #9685cc
}
</style>
