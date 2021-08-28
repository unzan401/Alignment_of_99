<template>
  <div class="index">
    <Index v-if="login" />

  </div>
</template>

<script>
// @ is an alias to /src
import Index from "@/components/index.vue";


export default {
  name: "index",
  components: {
    Index,
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
