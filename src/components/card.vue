<template>
  <div class="card" :class="suit+' rank'+rank" @click="choosecard()" >
    <div class="face"></div>
  </div>
</template>

<script>
export default {
  name:"card",
  data: function(){
    return {
      height:0
    };
  },
  props: [
    "rank","suit"
  ],
  methods: {
    choosecard (){
      this.$emit("update",true)
    }
  },
};
</script>

<style scoped>
</style>