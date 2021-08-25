<template>
  <div class="api"></div>
</template>

<script>
import * as Card from "@/model/card.js";
import { firebase } from "../model/FirebaseModel";

export default {
  name: "api",
  created() {
    var game = new Card.Game();
    var Ref = game.newGame();
    var result = firebase.database().ref("data").update(Ref);
    console.log(result);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
