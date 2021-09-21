<template>
  <header>
    <!-- Fixed navbar -->
    <nav class="navbar navbar-light bg-white fixed-top">
      <div class="container-fluid">
        <router-link
          class="navbar-brand"
          to="/"
          style="font-family: 'Noto Serif TC', serif"
          ><img src="/Alignment_of_99/favicon.ico" alt="LOGO" style="width:30px">{{ Title }}</router-link
        >
        <span v-if="typeof $route.params.time !='undefined'">房間編號：{{ $route.params.time }}</span>
      </div>
      <div></div>
    </nav>
  </header>

  <!-- Begin page content -->
  <div style="padding-top: 75px">
    <router-view />
  </div>
</template>
<script>
export default {
  data: () => {
    return {
      Title: "陣營九九",
    };
  },
};
</script>
<style>
html {
  font-size: 16pt;
}
@media (max-width : 992px) {
  html {
    font-size: 14pt;
  }
}

@media (max-width : 576px) {
  html {
    font-size: 12pt;
  }
}

body {
  background-color: #45a173 !important;
}
</style>