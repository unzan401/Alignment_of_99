<template>
  <div class="Login">
    <button class="btn btn-primary" @click="newGame()">新遊戲</button>
    <div class="container" id="containers" style="position: relative">
      <div class="row">
        <h5>
          玩家：{{ playername }}、現在點數：{{ game.point }}、已選取點數：{{
            chosepoint
          }}
        </h5>
      </div>
      <div
        class="row align-items-center"
        style="margin-bottom: 4rem; height: 3rem"
      >

      </div>

      <div class="row" style="height: 8rem">
        <div class="col-12">
          <div style="position: relative">
            <div
              class="card"
              v-for="(card, index) in deck.cards"
              :key="card"
              :style="{
                transform:
                  'translate(' + -0.05 * index + 'px , ' + -0.2 * index + 'px)',
              }"
            >
              <div class="back"></div>
            </div>
          </div>
          <div style="margin-left: 200px; position: relative">
            <card
              v-for="(card, index) in deadwoodcards"
              :key="card"
              @update="chooseCard(card)"
              :rank="card.rank"
              :suit="card.suit"
              :class="card.chose"
              :style="{
                transform:
                  'translate(' + -0.05 * index + 'px , ' + -0.2 * index + 'px)',
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import card from "@/components/card.vue";
import * as Card from "@/model/card.js";
import { firebase } from "../model/FirebaseModel";

export default {
  name: "Login",

  components: {
    card: card,
  },
  data: () => {
    return {
      game: new Card.Game(),
      chosecards: [],
      playername: "Bob",
      deck: Card.setDeck(2),
    };
  },
  computed: {
    deadwoodcards: function () {
      return this.deck.deadwood.map((i) => {
        return Card.parseCard(i);
      });
    },
  },
  methods: {
    newGame() {
      var Ref=this.game.newGame();
      firebase
      .database()
      .ref("data")
      .update(Ref)
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
