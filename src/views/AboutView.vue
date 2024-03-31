<template>
  <div id="about">
    <div>
      <a-space>
        <h1>你好 (*´▽｀)ノノ</h1>
        <div>&nbsp;</div>
        <img
          src="https://img2.imgtp.com/2024/03/17/MV638ok1.jpg"
          alt="咕哒子"
          style="width: 50%; align-self: end"
        />
        <br />
        <h1>这里是一个关于Aurora OJ的简单介绍</h1>
      </a-space>
    </div>
    <a-divider />
    <span style="font-size: 18px; color: #51416b">
      <p style="color: #666666">OJ = Online Judge 在线判题评测系统</p>
      <p>
        这是一个基于
        <b> Spring Boot + Spring Cloud 微服务 + Docker + Vue 3 + Arco Design </b
        >的编程题目在线评测系统。
      </p>
      <p>
        在系统前台，管理员可以创建、管理题目；用户可以自由搜索题目、阅读题目、编写并提交代码。
      </p>
      <p>
        在系统后端，能够根据管理员设定的题目测试用例在自主实现的代码沙箱中对代码进行编译、运行、判断输出是否正确。
      </p>
    </span>
    <div>
      <br />
      <a
        href="https://github.com/Pani-s/aurora-oj-microservice"
        target="_blank"
        style="color: black"
        >&#129409; 源码见我的github仓库-></a
      >
    </div>
    <a-divider />
    <h2 style="color: #ff5353">请注意：</h2>
    <p>
      如果想测试一下<b>写题功能模块</b>，请注意题目的用例输入非ACM模式，参数在main函数的args里。（String[]
      args）
    </p>
    <p style="color: #666666">正在努力实现ACM模式ing....T T</p>
    <a-divider />
    <span style="font-size: 18px; color: #51416b">
      <h3>以下是预览图：（点击可放大）</h3>
      <a-image-preview-group infinite>
        <a-space>
          <a-image
            src="http://pics.soogyu.xyz/pani/oj/intro/login-view.webp"
            width="200"
          />
          <a-image
            src="http://pics.soogyu.xyz/pani/oj/intro/question-view.webp"
            width="200"
          />
          <a-image
            src="http://pics.soogyu.xyz/pani/oj/intro/submit-view.webp"
            width="200"
          />
          <a-image
            src="http://pics.soogyu.xyz/pani/oj/intro/doquestion.webp"
            width="200"
          />
        </a-space>
        <a-space>
          <a-image
            src="http://pics.soogyu.xyz/pani/oj/intro/judge-config.webp"
            width="200"
          />
          <a-image
            src="http://pics.soogyu.xyz/pani/oj/intro/manage-question.webp"
            width="200"
          />
          <a-image
            src="http://pics.soogyu.xyz/pani/oj/intro/manage-user.webp"
            width="200"
          />
        </a-space>
      </a-image-preview-group>
      <!--      -->
      <!--      <a-space>-->
      <!--        <a-image-->
      <!--          width="500px"-->
      <!--          src="https://ooo.0x0.ooo/2024/03/17/OgUseb.png"-->
      <!--          title="主页就是题库"-->
      <!--        />-->
      <!--        <a-image-->
      <!--          width="500px"-->
      <!--          src="https://ooo.0x0.ooo/2024/03/17/OgUdaP.png"-->
      <!--          title="做题页面"-->
      <!--        />-->
      <!--      </a-space>-->

      <!--      <a-divider size="0" />-->
      <!--      <a-space>-->
      <!--        <a-image-->
      <!--          width="500px"-->
      <!--          src="https://ooo.0x0.ooo/2024/03/17/OgUlhB.png"-->
      <!--          title="公屏看看大家的提交情况"-->
      <!--        />-->
      <!--        <a-image-->
      <!--          width="500px"-->
      <!--          src="https://ooo.0x0.ooo/2024/03/17/OgUYIg.png"-->
      <!--          title="登录页面"-->
      <!--        />-->
      <!--      </a-space>-->
      <!--      <a-image-->
      <!--        width="500px"-->
      <!--        src="https://ooo.0x0.ooo/2024/03/17/OgUVEl.png"-->
      <!--        title="管理员添加题目页面"-->
      <!--      />-->
    </span>
  </div>
</template>
<style>
#about {
  box-shadow: #c6bad2 5px 5px 5px;
  z-index: 10;
  border-radius: 10px;
  background-color: white;
  padding: 5%;
  margin-left: 13%;
  margin-right: 13%;
}
.arco-image-preview-img-container .arco-image-preview-img {
  max-width: 80%;
}
</style>