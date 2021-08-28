<template>
  <div class="Index">
    <div class="container">
      <button
        class="btn btn-primary"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#newgameModal"
      >
        新遊戲
      </button>

      <!-- Modal -->

      <table class="table">
        <thead>
          <th></th>
          <th>現有遊戲列表</th>
          <th>狀態</th>
          <th>玩家</th>
        </thead>
        <tbody>
          <tr v-for="(item, index) in list" :key="item">
            <td>
              <router-link to="#" @click="deleteGame(item)">刪除</router-link>
            </td>
            <td>
              <router-link :to="{ name: 'game', params: { time: item}}" target="_blank">
                {{ item }}
              </router-link>
            </td>
            <td v-if="!state[index]">進行中</td>
            <td v-else>已結束</td>
            <td>
              <router-link
                :to="{ name: 'gameUser', params: { time: item,user:index}}"
                :key="player"
                v-for="(player, index) in players[index]"
                target="_blank"
                >{{ player }}</router-link
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div
    class="modal fade"
    id="newgameModal"
    tabindex="-1"
    aria-labelledby="newgameModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">新遊戲</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <form @submit="newGame(newPlayerList)">
          <div class="modal-body">
            <label for="playerName" class="form-label mb3">輸入玩家名稱</label>
            <input
              type="text"
              class="form-control playerName"
              v-for="i in 10"
              :key="i"
              v-model="newPlayerList[i - 1]"
              :placeholder="i + '號玩家'"
            />
            <p>{{errormessage}}</p>
          </div>
          <div class="modal-footer justify-content-between">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              取消
            </button>
            <button
              type="submit"
              class="btn btn-primary"

            >
              送出
            </button>
          </div>
        </form>
      </div>
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
      game: null,
      list: [],
      state: [],
      players: [],
      newPlayerList: [],
      errormessage:null
    };
  },
  created() {
    var api = "data/";
    firebase
      .database()
      .ref(api)
      .on("value", (snapshot) => {
        var data = snapshot.val();
        this.list = Object.keys(snapshot.val());
        this.state = Object.keys(snapshot.val()).map((i) => {
          return data[i].public.gameover;
        });
        this.players = Object.keys(snapshot.val()).map((i) => {
          return data[i].public.player;
        });
      });
  },
  methods: {
    newGame(newPlayerList) {
      if (Object.values(newPlayerList).length <= 2) {
        this.errormessage="至少需要三名玩家"
        return false
      } else {
        this.game=new Card.Game()
        var Ref = this.game.newGame(Object.values(newPlayerList));
        firebase.database().ref("data").update(Ref);
        return true
      }
    },
    deleteGame(time) {
      firebase
        .database()
        .ref("data/" + time)
        .remove();
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
.btn {
  margin: 3px;
}
table a {
  margin: 3px;
}

table td:nth-child(2) a {
  display: inline-block;
  vertical-align: middle;
  width: 6rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.playerName {
  line-height: 1.1rem;
  margin-bottom: 0.5rem;
}
</style>
