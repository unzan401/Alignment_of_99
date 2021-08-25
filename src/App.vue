<template>
  <header>
    <!-- Fixed navbar -->
    <nav class="navbar navbar-light bg-white fixed-top">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/" style="font-family: 'Noto Serif TC', serif;">{{ Title }}</router-link>
        <span>房間編號：{{ $route.params.time }}</span>
      </div>
      <div>
        
      </div>
    </nav>
  </header>

  <!-- Begin page content -->
  <div class="container" style="padding-top: 80px">
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


</style>