<template>
  <div class="Index" v-if="loading">
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
        <div class="col-12" v-if="player.myturn">
          <button
            class="btn btn-secondary"
            :disabled="playSituation"
            @click="play()"
            v-if="playOptionView == false"
          >
            {{ ability }}
          </button>
          <div class="btn-group align-items-center" role="group" v-else>
            <button
              v-for="item in playOptionView.selections"
              :key="item"
              class="btn btn-secondary"
              @click="play(item.name)"
              :disabled="item.disabled"
            >
              {{ item.name }}
            </button>
            <label style="margin-right: 1rem">{{
              playOptionView.ability
            }}</label>
          </div>
        </div>
        <div class="col-12" v-else>
          <h4>不是你的回合。</h4>
        </div>
      </div>

      <div class="row" style="min-height: 8rem">
        <div class="col-6">
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
        <div class="col-6">
          <h1 style="margin-top: -3rem; margin-bottom: 3rem">
            順序：<span v-if="game.order">↓</span><span v-else>↑</span>
          </h1>
          <div class="row" v-for="(item, key) in game.player" :key="item">
            <div
              class="w-100"
              style="position: relative; height: 3rem"
              v-if="key != playername"
            >
              <span>{{ key }}</span>
              <div
                class="card"
                v-for="(card, index) in item.cards"
                :key="card"
                :style="{
                  transform:
                    'translate(' + (8 + 0.5 * index) + 'rem,    1.5rem)',
                }"
              >
                <div class="back"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row" style="height: 4rem">
        <h4 v-if="player.gameover">你輸了</h4>
        <div v-else class="col-12">
          <div style="margin-left: 100px; position: relative">
            <card
              v-for="(card, index) in cards"
              :key="card"
              @update="chooseCard(card)"
              :rank="card.rank"
              :suit="card.suit"
              :class="card.chose"
              :style="{
                transform: 'translate(' + 20 * index + 'px , ' + 0 + 'px)',
              }"
            />
            <button
              class="btn btn-danger"
              @click="quit()"
              v-if="player.myturn"
              style="margin-left: -120px"
            >
              投降
            </button>
          </div>
        </div>
      </div>
      <div class="row">
        <h5>{{ message }}</h5>
      </div>
    </div>
  </div>
</template>

<script>
import card from "@/components/card.vue";
import * as Card from "@/model/card.js";
import { firebase } from "../model/FirebaseModel";

export default {
  name: "Index",

  components: {
    card: card,
  },
  data: () => {
    return {
      game: new Card.Game(),
      chosecards: [],
      playername: "",
      deck: Card.setDeck(2),
      player: new Card.Player(),
      cards: [],
      deadwoodcards: [],
      loading: true,
      message: "",
    };
  },
  created() {
    var api = "data/" + this.$route.params.time + "/";
    async function startGame(time) {
      var res = await new Card.Game(time);
      return res;
    }
    startGame(this.$route.params.time).then((res) => {
      this.game = res;
      firebase
        .database()
        .ref(api + "point")
        .on("value", (snapshot) => {
          var data = snapshot.val();
          this.game.point = data;
        });

      var ref = firebase.database().ref(api);
      async function getvalue() {
        var snapshot = await ref.once("value");
        return snapshot.val();
      }
      getvalue().then((res) => {
        var data = res;
        this.game.deck = data.deck;
        this.playername = res.playername[this.$route.params.user];
        this.player.gameover = data.player[this.playername].gameover;
        this.player.myturn = data.player[this.playername].myturn;
        var player = {};
        if (this.player.gameover & this.player.myturn) {
          this.nextPlayer();

          this.game.playername.forEach((i) => {
            player[i] = {
              cards:
                typeof this.game.player[i].cards === "undefined"
                  ? []
                  : this.game.player[i].cards,
              gameover: this.game.player[i].gameover,
              myturn: this.game.player[i].myturn,
              role: this.game.player[i].role,
            };
          });
          firebase
            .database()
            .ref(api + "/player/")
            .update(player);
        }

        this.player.role = data.player[this.playername].role;
        this.player.cards = data.player[this.playername].cards;
        if (typeof data.deck.deadwood === "undefined") {
          data.deck.deadwood = [];
        }

        this.deadwoodcards = data.deck.deadwood.map((i) => {
          return Card.parseCard(i);
        });

        if (typeof this.player.cards == "undefined") {
          this.player.cards = [];
          if (this.player.myturn) {
            this.nextPlayer();
            this.player.gameover = true;
            this.game.playername.forEach((i) => {
              player[i] = {
                cards:
                  typeof this.game.player[i].cards === "undefined"
                    ? []
                    : this.game.player[i].cards,
                gameover: this.game.player[i].gameover,
                myturn: this.game.player[i].myturn,
                role: this.game.player[i].role,
              };
            });
            firebase
              .database()
              .ref(api + "/player/")
              .update(player);
          }
        }
        this.cards = this.player.cards.map((i) => {
          return Card.parseCard(i);
        });
        if (typeof data.deck.deadwood === "undefined") {
          data.deck.deadwood = [];
        }
        this.deadwoodcards = data.deck.deadwood.map((i) => {
          return Card.parseCard(i);
        });
        data.playername.forEach((i) => {
          this.game.player[i].cards = data.player[i].cards;
          this.game.player[i].gameover = data.player[i].gameover;
          this.game.player[i].myturn = data.player[i].myturn;
        });
        firebase
          .database()
          .ref(api)
          .on("value", (snapshot) => {
            var data = snapshot.val();
            this.game.deck = data.deck;
            this.player.cards = data.player[this.playername].cards;
            this.player.gameover = data.player[this.playername].gameover;
            this.player.myturn = data.player[this.playername].myturn;
            this.player.role = data.player[this.playername].role;
            this.game.order = data.order;
            if (typeof this.player.cards == "undefined") {
              this.player.cards = [];
              if (this.player.myturn) {
                this.nextPlayer();
                this.player.gameover = true;
                this.game.playername.forEach((i) => {
                  player[i] = {
                    cards:
                      typeof this.game.player[i].cards === "undefined"
                        ? []
                        : this.game.player[i].cards,
                    gameover: this.game.player[i].gameover,
                    myturn: this.game.player[i].myturn,
                    role: this.game.player[i].role,
                  };
                });
                firebase
                  .database()
                  .ref(api + "/player/")
                  .update(player);
              }
            }
            this.cards = this.player.cards.map((i) => {
              return Card.parseCard(i);
            });
            if (typeof data.deck.deadwood === "undefined") {
              data.deck.deadwood = [];
            }
            this.deadwoodcards = data.deck.deadwood.map((i) => {
              return Card.parseCard(i);
            });
            data.playername.forEach((i) => {
              this.game.player[i].cards = data.player[i].cards;
              this.game.player[i].gameover = data.player[i].gameover;
              this.game.player[i].myturn = data.player[i].myturn;
            });
          });
      });
    });
  },
  updated() {
    var api = "data/" + this.$route.params.time + "/";
    if (this.player.gameover & this.player.myturn) {
      this.nextPlayer();
      var player = {};
      this.game.playername.forEach((i) => {
        player[i] = {
          cards:
            typeof this.game.player[i].cards === "undefined"
              ? []
              : this.game.player[i].cards,
          gameover: this.game.player[i].gameover,
          myturn: this.game.player[i].myturn,
          role: this.game.player[i].role,
        };
      });
      firebase
        .database()
        .ref(api + "/player/")
        .update(player);
    }
  },
  computed: {
    chosepoint: function () {
      return Card.chosePoint(this.chosecards);
    },
    ability: function () {
      var dict = {
        4: "迴轉",
        11: "抽2張",
        13: "99!",
      };
      return dict[this.chosepoint] ? dict[this.chosepoint] : "打牌";
    },
    playSituation: function () {
      if (this.chosecards.length == 1) {
        if (
          ([4, 5, 7, 9, 10, 11, 12, 13].indexOf(this.chosecards[0].rank) !=
            -1) |
          (this.chosepoint == "joker")
        ) {
          //檢查是不是特殊牌
          return false;
        } else {
          if (this.chosecards[0].rank + this.game.point <= 99) {
            return false;
          }
        }
      } else if (this.chosecards.length == 2) {
        if (
          [4, 5, 7, 9, 10, 11, 12, 13].indexOf(
            Math.abs(this.chosecards[0].rank - this.chosecards[1].rank)
          ) != -1
        ) {
          //檢查是特殊牌
          return false;
        }
      }
      return true;
    },
    playOptionPlayers: function () {
      return this.game.playername.map((i) => {
        return {
          name: i,
          disabled: i == this.playername,
        };
      });
    },
    playOptionView: function () {
      switch (this.chosepoint) {
        case 5:
          return {
            ability: "指定一名玩家從他開始",
            selections: this.playOptionPlayers,
          };
        case 7:
          return {
            ability: "指定一名玩家交換所有手牌",
            selections: this.playOptionPlayers,
          };
        case 9:
          return {
            ability: "指定一名玩家抽一張手牌",
            selections: this.playOptionPlayers,
          };
        case 10:
          return {
            ability: "將點數+10或-10",
            selections: [
              {
                name: "+10",
                disabled: this.game.point + 10 > 99,
              },
              {
                name: "-10",
                disabled: this.game.point - 10 < 0,
              },
            ],
          };
        case 12:
          return {
            ability: "將點數+20或-20",
            selections: [
              {
                name: "+20",
                disabled: this.game.point + 20 > 99,
              },
              {
                name: "-20",
                disabled: this.game.point - 20 < 0,
              },
            ],
          };
        case "joker":
          return {
            ability: "指定一名玩家知道他的身分",
            selections: this.playOptionPlayers,
          };
        default:
          return false;
      }
    },
  },
  methods: {
    quit() {
      this.nextPlayer();
      var api = "data/" + this.$route.params.time + "/";
      var player = {};
      if (typeof this.game.deck.deadwood === "undefined") {
        this.game.deck.deadwood = [];
      }

      Array.prototype.push.apply(this.game.deck.deadwood, this.player.cards);
      this.game.playername.forEach((i) => {
        if (i != this.playername) {
          player[i] = {
            cards:
              typeof this.game.player[i].cards === "undefined"
                ? []
                : this.game.player[i].cards,
            gameover: this.game.player[i].gameover,
            myturn: this.game.player[i].myturn,
            role: this.game.player[i].role,
          };
        } else {
          player[i] = {
            cards: [],
            gameover: true,
            myturn: false,
            role: this.game.player[i].role,
          };
        }
      });
      this.game.player[this.playername].cards = [];
      this.game.player[this.playername].gameover = true;
      this.game.player[this.playername].myturn = false;

      var deck = {
        cards: this.game.deck.cards,
        deadwood: this.game.deck.deadwood,
      };

      firebase
        .database()
        .ref(api + "/player/")
        .update(player);

      firebase
        .database()
        .ref(api + "/deck/")
        .update(deck);
    },
    plusPoint(rank) {
      this.game.point = this.game.point + parseInt(rank);
    },
    play(selection) {
      if (this.chosecards.length != 0) {
        var card = this.chosecards.map((i) => {
          return Card.parseCard(i, true);
        });
        var api = "data/" + this.$route.params.time + "/";
        var point = this.player.play(
          card,
          this.game.deck,
          this.game.point,
          selection
        );
        switch (point[1]) {
          case "joker":
            this.message +=
              selection + "的陣營是" + this.game.player[selection].role + "；";

            this.nextPlayer();
            break;
          case 4:
            this.game.order = !this.game.order;
            this.nextPlayer();
            break;
          case 5:
            this.game.player[selection].myturn = true;
            this.game.player[this.playername].myturn = false;
            break;
          case 7:
            var temp = this.game.player[this.playername].cards;
            this.game.player[this.playername].cards =
              this.game.player[selection].cards;
            this.game.player[selection].cards = temp;
            this.nextPlayer();
            break;
          case 9:
            this.game.player[this.playername].cards.push(
              this.game.player[selection].cards.pop()
            );
            this.nextPlayer();
            break;
          default:
            this.nextPlayer();
            break;
        }
        var deck = this.game.deck;
        var order = this.game.order;
        var player = {};
        this.game.playername.forEach((i) => {
          player[i] = {
            cards:
              typeof this.game.player[i].cards === "undefined"
                ? []
                : this.game.player[i].cards,
            gameover: this.game.player[i].gameover,
            myturn: this.game.player[i].myturn,
            role: this.game.player[i].role,
          };
        });
        var data = {
          deck: deck,
          order: order,
          player: player,
          point: point[0],
        };
        firebase.database().ref(api).update(data);
      }
      this.chosecards = [];
    },
    nextPlayer() {
      this.game.player[this.playername].myturn = false;
      var namelist = Array.from(this.game.playername);
      if (this.game.order) {
        namelist.push(namelist.shift());
      } else {
        namelist.unshift(namelist.pop());
      }
      this.game.player[
        namelist[this.game.playername.indexOf(this.playername)]
      ].myturn = true;
    },
    chooseCard(card) {
      if (card.chose == "chose") {
        this.chosecards.splice(this.chosecards.indexOf(card), 1);
        card.chose = "";
      } else {
        if (this.chosecards.length < 2) {
          if (
            (this.chosecards.length == 0) |
            ((card.suit != "joker") & (this.chosepoint != "joker"))
          ) {
            this.chosecards.push(card);
            card.chose = "chose";
          }
        }
      }
    },
  },
  mounted() {},
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
