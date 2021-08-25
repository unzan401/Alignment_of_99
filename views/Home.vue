<template>
  <div class="index">
    <Index v-if="login" />
    <Login v-else />
  </div>
</template>

<script>
// @ is an alias to /src
import Index from "@/components/index.vue";
import Login from "@/components/login.vue";

export default {
  name: "index",
  components: {
    Index,
    Login,
  },
  data() {
    return {
      login: true,
    };
  },
  created () {
    if (document.cookie.indexOf("Align99")!=-1){
      this.login = true;
      
    }
  }
};
</script>
