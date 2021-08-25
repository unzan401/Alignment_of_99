<template>
  <div class="Index">
    <button class="btn btn-primary" @click="newGame()">新遊戲</button>
    <div class="container" id="containers" style="position: relative">
      <p v-for="item in list" :key="item">
      <a v-bind:href="'/game/'+item+'/0/'">
        {{item}}
      </a>
      </p>
    </div>
  </div>
</template>

<script>
import * as Card from "@/model/card.js";
import { firebase } from "../model/FirebaseModel";

export default {
  name: "Index",

  data: () => {
    return {
      game: new Card.Game(),
      list: [],
    };
  },
  created() {
    var api = "data/";
    firebase
      .database()
      .ref(api)
      .on("value", (snapshot) => {
        var data = Object.keys(snapshot.val());
        this.list=data
      });
  },
  methods: {
    newGame() {
      var Ref = this.game.newGame();
      firebase.database().ref("data").update(Ref);
    },
  },
  mounted() {
    // var $container = document.getElementById("container");
    // create Deck
    // add to DOM
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card:before,
.card:after {
  font-size: 0.65rem !important;
}

.card.chose {
  margin-top: -0.65rem;
}

.btn {
  margin: 3px;
}
</style>
