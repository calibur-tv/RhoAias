<style lang="scss">
  #header {
    .main {
      position: relative;
    }
  }
</style>

<template>
  <header id="header">
    <div class="main border-bottom">
      <router-link to="/">calibur</router-link>
      <div class="avatar"></div>
    </div>
    <div class="tabs">
      <router-link to="/">帖子</router-link>
      <router-link to="/bangumi/news">番剧</router-link>
    </div>
  </header>
</template>
