<template>
  <div class="Index row">
    <div class="chatroom">
      <div class="col-12" style="font-size:12pt">
        <div class="sticky-top" style="background-color:#45a173">
        <h5> <span v-if="watcher">觀戰者</span><span v-else> {{ playername }}</span> <span class="d-inlineblock d-lg-none" style="float:right;cursor:pointer" @click="changeChatroom()">x</span></h5>
          <form v-bind:onsubmit="sendMessage">
            <input
              type="text"
              v-model="text"
              style="width: calc(100% - 60px)"
            /><button
              type="submit"
              class="btn btn-primary d-inlineblock"
              style="width: 50px; padding: 3px; font-size: 0.8rem"
            >
              傳送
            </button>
          </form>
          </div>
        
        <div v-for="message in chatroomMessages" :key="message" style="">
          <span style="font-size:0.5rem;margin-right:0.3rem">{{message.timestamp}}</span>{{ message.user }}：{{ message.text }}</div>
      </div>
    </div>

      <div
        class="layout"
        v-if="gameover == false"
      >
      <div class=" container">
        <span class="sticky-top d-inlineblock d-lg-none" style="background-color:white;height:1rem;width:1rem;cursor:pointer;z-index:500" @click="changeChatroom()">訊息></span>
        <div class="row" style="height: 3rem; margin-top: 3.5rem">
          <div
            class="col-12"
            style="position: relative; justify-content: center; display: flex"
          >
            <div style="width: 12rem; position: relative">
              <div
                class="card"
                v-for="i in publicData.deckLength"
                :key="i"
                :style="{
                  transform:
                    'translate(' +
                    (3 + -0.01 * i) +
                    'rem , ' +
                    -0.01 * i +
                    'rem)',
                }"
              >
                <div class="back"></div>
              </div>
              <card
                v-for="(card, index) in deadwoodcards"
                :key="card"
                :rank="card.rank"
                :suit="card.suit"
                :class="card.chose"
                :style="{
                  transform:
                    'translate(' +
                    (9 + -0.01 * index) +
                    'rem , ' +
                    -0.01 * index +
                    'rem)',
                }"
              />
            </div>
          </div>
        </div>
        <div
          class="row"
          v-if="playerList != false"
          :class="{ 'd-none d-lg-flex': playerList.length > 4 }"
        >
          <div class="col playerState" v-for="item in playerList" :key="item">
            <div
              class="row"
              :class="{
                playerActive: publicData.player[publicData.number] == item,
              }"
              style="position: relative"
            >
              <div class="col-12">
                <div>{{ item }}</div>
                <div>{{ publicData.playerState[item].role }}</div>
              </div>
              <div
                class="col-12"
                style="position: relative; height: 4rem; overflow: hidden"
              >
                <div
                  class="card"
                  v-for="i in publicData.playerState[item].handLength"
                  :key="i"
                  :style="{
                    transform: 'translate(' + (2.5 + 0.5 * i) + 'rem,    3rem)',
                  }"
                >
                  <div class="back"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 超過5名玩家的UI處理 -->
        <div
          class="row d-lg-none justify-content-between"
          v-if="(playerList != false) & (playerList.length > 4)"
          :class="{ 'd-none d-md-flex': playerList.length > 6 }"
        >
          <div
            class="col playerState"
            v-for="item in playerList.filter((i, index) => {
              return (index > 0) & (index < playerList.length - 1);
            })"
            :key="item"
          >
            <div
              class="row"
              :class="{
                playerActive: publicData.player[publicData.number] == item,
              }"
              style="position: relative"
            >
              <div class="col-12">
                <div>{{ item }}</div>
                <div>{{ publicData.playerState[item].role }}</div>
              </div>
              <div
                class="col-12"
                style="position: relative; height: 4rem; overflow: hidden"
              >
                <div
                  class="card"
                  v-for="i in publicData.playerState[item].handLength"
                  :key="i"
                  :style="{
                    transform: 'translate(' + (2.5 + 0.5 * i) + 'rem,    3rem)',
                  }"
                >
                  <div class="back"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="row d-lg-none justify-content-between"
          v-if="(playerList != false) & (playerList.length > 4)"
          :class="{ 'd-none d-md-flex': playerList.length > 6 }"
        >
          <div
            class="col playerState"
            v-for="item in playerList.filter((i, index) => {
              return (index == 0) | (index == playerList.length - 1);
            })"
            :key="item"
          >
            <div
              class="row"
              :class="{
                playerActive: publicData.player[publicData.number] == item,
              }"
              style="position: relative"
            >
              <div class="col-12">
                <div>{{ item }}</div>
                <div>{{ publicData.playerState[item].role }}</div>
              </div>
              <div
                class="col-12"
                style="position: relative; height: 4rem; overflow: hidden"
              >
                <div
                  class="card"
                  v-for="i in publicData.playerState[item].handLength"
                  :key="i"
                  :style="{
                    transform: 'translate(' + (2.5 + 0.5 * i) + 'rem,    3rem)',
                  }"
                >
                  <div class="back"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- under md 超過8人 -->
        <div
          class="row d-md-none justify-content-between"
          v-if="(playerList != false) & (playerList.length > 6)"
        >
          <div
            class="col playerState"
            v-for="item in playerList.filter((i, index) => {
              return (index > 1) & (index < playerList.length - 2);
            })"
            :key="item"
          >
            <div
              class="row"
              :class="{
                playerActive: publicData.player[publicData.number] == item,
              }"
              style="position: relative"
            >
              <div class="col-12">
                <div>{{ item }}</div>
                <div>{{ publicData.playerState[item].role }}</div>
              </div>
              <div
                class="col-12"
                style="position: relative; height: 4rem; overflow: hidden"
              >
                <div
                  class="card"
                  v-for="i in publicData.playerState[item].handLength"
                  :key="i"
                  :style="{
                    transform: 'translate(' + (2.5 + 0.5 * i) + 'rem,    3rem)',
                  }"
                >
                  <div class="back"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="row d-md-none justify-content-between"
          v-if="(playerList != false) & (playerList.length > 6)"
        >
          <div
            class="col playerState"
            v-for="item in playerList.filter((i, index) => {
              return (index == 1) | (index == playerList.length - 2);
            })"
            :key="item"
          >
            <div
              class="row"
              :class="{
                playerActive: publicData.player[publicData.number] == item,
              }"
              style="position: relative"
            >
              <div class="col-12">
                <div>{{ item }}</div>
                <div>{{ publicData.playerState[item].role }}</div>
              </div>
              <div
                class="col-12"
                style="position: relative; height: 4rem; overflow: hidden"
              >
                <div
                  class="card"
                  v-for="i in publicData.playerState[item].handLength"
                  :key="i"
                  :style="{
                    transform: 'translate(' + (2.5 + 0.5 * i) + 'rem,    3rem)',
                  }"
                >
                  <div class="back"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="row d-md-none justify-content-between"
          v-if="(playerList != false) & (playerList.length > 6)"
        >
          <div
            class="col playerState"
            v-for="item in playerList.filter((i, index) => {
              return (index == 0) | (index == playerList.length - 1);
            })"
            :key="item"
          >
            <div
              class="row"
              :class="{
                playerActive: publicData.player[publicData.number] == item,
              }"
              style="position: relative"
            >
              <div class="col-12">
                <div>{{ item }}</div>
                <div>{{ publicData.playerState[item].role }}</div>
              </div>
              <div
                class="col-12"
                style="position: relative; height: 4rem; overflow: hidden"
              >
                <div
                  class="card"
                  v-for="i in publicData.playerState[item].handLength"
                  :key="i"
                  :style="{
                    transform: 'translate(' + (2.5 + 0.5 * i) + 'rem,    3rem)',
                  }"
                >
                  <div class="back"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p class="text-center">
            <span class="counterclockwise" :class="{ active: publicData.order }"
              ><img src="/img/clockwise.png" alt="" style="height: 60px"
            /></span>
          </p>
        </div>

        <div
          class="row"
          :class="{
            playerActive: publicData.player[publicData.number] == playername,
          }"
          v-if="publicData != false"
        >
          <div v-if="alive" class="col-12">
            <div style="position: relative; height: 6rem">
              <card
                v-for="(card, index) in cardParse"
                :key="card"
                @update="chooseCard(card)"
                :rank="card.rank"
                :suit="card.suit"
                :class="card.chose"
                :style="{
                  transform:
                    'translate(' + (15 * index + 135) + 'px , ' + '3rem)',
                }"
              />
            </div>
          </div>
          <h4 v-else>你輸了</h4>
          <div>{{ playername }}</div>
          <div>{{ role }}</div>
          <div>
            現在點數：{{ publicData.point }}、已選取點數：{{ chosepoint }}
          </div>
        </div>
        <div class="row">
          <h5>{{ message }}</h5>
        </div>
        <div class="row align-items-center">
          <div class="col-12" v-if="myturn & !watcher">
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
            </div>
            <label v-if="playOptionView" style="margin-right: 1rem">{{
              playOptionView.ability
            }}</label>
          </div>
          <div class="col-12" v-else>
            <h5>不是你的回合。</h5>
          </div>
          <div class="col-12" v-if="watcher">正處於觀戰者模式</div>
        </div>
        <button
          type="button"
          class="btn btn-danger"
          data-bs-toggle="modal"
          data-bs-target="#giveupModal"
          v-if="myturn & !watcher"
        >
          投降
        </button>

        <!-- Modal -->
        <div
          class="modal fade"
          id="giveupModal"
          tabindex="-1"
          aria-labelledby="giveupModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-sm">
            <div class="modal-content">
              <div class="modal-header">
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">是否確定投降？</div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  取消
                </button>
                <button
                  type="button"
                  class="btn btn-danger"
                  data-bs-dismiss="modal"
                  @click="giveup()"
                >
                  投降
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <div class="layout" v-else>
        <div class="container">
        <span class="sticky-top d-inlineblock d-lg-none" style="background-color:white;height:1rem;width:1rem;cursor:pointer;z-index:500" @click="changeChatroom()">訊息></span>

        <button type="button" class="btn btn-primary" @click="restart()">
          重開一局
        </button>
        <h5>遊戲結束，{{ winner }}陣營勝利。</h5>
        <h5 v-for="(item, key) in publicData.playerState" :key="item">
          {{ key }}、陣營為{{ item.role }}
        </h5>
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
      chosecards: [],
      playername: null,
      playerList: false,
      publicData: false,
      cards: [],
      deadwoodcards: [],
      message: "",
      myturn: false,
      alive: true,
      role: null,
      cardParse: [],
      gameover: false,
      winner: null,
      watcher: false,
      chatroomMessages: [],
      text: "",
    };
  },
  created() {
    var api = "data/" + this.$route.params.time + "/";
    firebase
      .database()
      .ref(api + "public/")
      .once("value", (snapshot) => {
        this.publicData = snapshot.val();
        if (typeof this.$route.params.user == "undefined") {
          // 觀戰者模式
          this.playername = this.publicData.player[this.publicData.number];
          this.watcher = true;
        } else {
          this.playername = this.publicData.player[this.$route.params.user];
        }
        this.playerList = this.publicData.player;
        this.playerList = this.playerList
          .splice(this.playerList.indexOf(this.playername))
          .splice(1);
        Array.prototype.push.apply(this.playerList, this.publicData.player);

        this.playerList = this.playerList.reverse();
      })
      .then(() => {
        firebase
          .database()
          .ref(api + "public/")
          .on("value", (snapshot) => {
            this.publicData = snapshot.val();
            this.myturn =
              this.publicData.player[this.publicData.number] == this.playername;
            this.alive = this.publicData.playerState[this.playername].alive;

            this.gameover = this.publicData.gameover;
            if (this.gameover) {
              this.winner = this.publicData.winner;
            }
            this.deadwoodcards =
              typeof this.publicData.deadwood == "undefined"
                ? []
                : this.publicData.deadwood.map((i) => {
                    return Card.parseCard(i);
                  });
          });
        firebase
          .database()
          .ref(api + "private/")
          .on("value", (snapshot) => {
            this.cards =
              typeof snapshot.val().playerHand[this.playername] == "undefined"
                ? []
                : snapshot.val().playerHand[this.playername];
            this.cardParse = this.cards.map((i) => {
              return Card.parseCard(i);
            });
            this.chosecards = [];
            this.role = snapshot.val().playerState[this.playername].role;
          });
        firebase.database().ref("messages/" + this.$route.params.time + "/").on("value",(snapshot)=>{
          var data =snapshot.val()
          this.chatroomMessages=data.reverse()
        })
      });
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
          if (this.chosecards[0].rank + this.publicData.point <= 99) {
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
      return this.publicData.player.map((i) => {
        return {
          name: i,
          disabled:
            (i == this.playername) | !this.publicData.playerState[i].alive,
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
                disabled: this.publicData.point + 10 > 99,
              },
              {
                name: "-10",
                disabled: this.publicData.point - 10 < 0,
              },
            ],
          };
        case 12:
          return {
            ability: "將點數+20或-20",
            selections: [
              {
                name: "+20",
                disabled: this.publicData.point + 20 > 99,
              },
              {
                name: "-20",
                disabled: this.publicData.point - 20 < 0,
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
    changeChatroom(){
      if (document.getElementsByClassName("chatroom")[0].className.indexOf("active")!=-1){
        document.getElementsByClassName("chatroom")[0].className="chatroom"
      }else{
        document.getElementsByClassName("chatroom")[0].className="chatroom active"
      }
      
    },
    getTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      return `${hours}:${minutes}`;
    },
    sendMessage(){
      var num
      var message
      if (this.chatroomMessages==null){
        num=0
      }else{
        num=this.chatroomMessages.length
      }
      if (this.text!=""){
        if (this.watcher){
          message={
            user:"觀戰者",
            text:this.text,
            timestamp:this.getTime()
          }
        }else{
          message={
            user:this.playername,
            text:this.text,
            timestamp:this.getTime()
          }
        }
        this.text=""
        firebase.database().ref("messages/" + this.$route.params.time + "/"+num+"/").update(message);

      }
      return false
    },
    restart() {
      var time = this.$route.params.time;
      var game = new Card.Game(time);
      var Ref = game.newGame(this.publicData.player);
      firebase.database().ref("data").update(Ref);
    },
    giveup() {
      async function connectDb(time) {
        var game = new Card.Game(time);
        await Promise.all([game.connectDb() , game.connectMsgDb()]);
        return game;
      }
      connectDb(this.$route.params.time).then((game) => {
        game.giveup(this.playername);
      });
    },
    play(selection) {
      async function connectDb(time) {
        var game = new Card.Game(time);
        await Promise.all([game.connectDb() , game.connectMsgDb()])
        return game;
      }
      connectDb(this.$route.params.time).then((game) => {
        var message = game.play(this.playername, this.chosecards, selection);
        this.chosecards = [];
        this.message += message;
      });
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
.layout {
   height: calc(100vh - 90px);
   overflow-y:scroll;
   position: relative;
   width: calc(100vw - 300px);
   
}
.chatroom {
  width: 300px;
  height: calc(100vh - 75px);
  overflow-y: scroll;
}

@media (max-width: 992px) {
  .chatroom {
    display: none;
  }
  .layout {
    
    width: 100vw;
  }
  .playerState {
    max-width: 150px;
  }
  .chatroom.active {
  display: block;
  position: absolute;
  background-color:rgb(69, 161, 115) ;
  z-index: 800;
  top:70px;
  left: 0;
  width: 300px;
}
}


.card.chose {
  margin-top: -0.65rem;
}

.btn {
  margin: 3px;
}

.counterclockwise.active img {
  -moz-transform: scaleY(-1);
  -webkit-transform: scaleY(-1);
  -o-transform: scaleY(-1);
  transform: scaleY(-1);
}

.playerActive {
  background-color: #ddff9d;
}
</style>
