<template>
  <div id="about">
    <div>
      <a-space>
        <h1>你好 (*´▽｀)ノノ 这里是一个关于Aurora OJ的简单介绍</h1>
        <div>&nbsp;</div>
        <img
          src="https://img2.imgtp.com/2024/03/17/MV638ok1.jpg"
          alt="咕哒子"
          style="width: 50%"
        />
      </a-space>
    </div>
    <span style="font-size: 18px; color: #51416b">
      <p>OJ = Online Judge 在线判题评测系统</p>
      <p>
        这是一个基于 Spring Boot + Spring Cloud 微服务 + Docker（+ Vue 3 + Arco
        Design）的编程题目在线评测系统。
        在系统前台，管理员可以创建、管理题目；用户可以自由搜索题目、阅读题目、编写并提交代码。
        在系统后端，能够根据管理员设定的题目测试用例在 自主实现的代码沙箱
        中对代码进行编译、运行、判断输出是否正确。
      </p>
    </span>
    <div>
      <a href="https://github.com/Pani-s" target="_blank" style="color: black"
        >&#129409; 源码见我的github仓库-></a
      >
    </div>
    <a-divider />
    <span style="font-size: 18px; color: #51416b">
      <h3>以下是预览图：（点击可放大）</h3>

      <a-space>
        <a-image
          width="500px"
          src="https://ooo.0x0.ooo/2024/03/17/OgUseb.png"
          title="主页就是题库"
        />
        <a-image
          width="500px"
          src="https://ooo.0x0.ooo/2024/03/17/OgUdaP.png"
          title="做题页面"
        />
      </a-space>

      <a-divider size="0" />
      <a-space>
        <a-image
          width="500px"
          src="https://ooo.0x0.ooo/2024/03/17/OgUlhB.png"
          title="公屏看看大家的提交情况"
        />
        <a-image
          width="500px"
          src="https://ooo.0x0.ooo/2024/03/17/OgUYIg.png"
          title="登录页面"
        />
      </a-space>
      <a-image
        width="500px"
        src="https://ooo.0x0.ooo/2024/03/17/OgUVEl.png"
        title="管理员添加题目页面"
      />
    </span>
  </div>
</template>
<style>
#about {
  margin-left: 15%;
  margin-right: 15%;
}
</style>
