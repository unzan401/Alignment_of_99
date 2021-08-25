// 這個檔案來處理所有玩家的行為

import { firebase } from "../model/FirebaseModel";
class Game {
	constructor(time = "") {
		if (time!=""){
			var api = "data/" + time + "/";
			firebase
				.database()
				.ref(api)
				.once("value", (snapshot) => {
					var data = snapshot.val();
					this.player={}
					this.playername=data.playername;
					this.deck=data.deck
					this.point=data.point
					this.order=data.order
					this.playername.forEach((i) => {
						this.player[i] = new Player(i, data.player[i].role,data.player[i].cards,data.player[i].gameover,data.player[i].myturn);
					})
				});
		}

	}
	newGame(players = ["Alice", "Bob", "Cat", "Dobby", "Elise"]) {
		this.time = Date.now();
		this.player = {};
		this.playername = players;
		var roles = shuffle(["black", "black", "red", "red", "Joker"]);
		this.deck = setDeck(2);
		this.point = 99;
		this.order = true;
		this.start = true;
		var ref = {};
		ref[this.time] = {
			playername: this.playername,
			point: this.point,
			order: this.order,
			deck: this.deck,
			player: {},
		};
		this.playername.forEach((i) => {
			this.player[i] = new Player(i, roles.pop());
			this.player[i].draw(this.deck, 5);
			ref[this.time]["player"][i] = {
				cards: this.player[i].cards,
				gameover: this.player[i].gameover,
				myturn: this.player[i].myturn,
				role: this.player[i].role,
			};
		});
		this.player[this.playername[0]].myturn=true;
		ref[this.time]["player"][this.playername[0]].myturn=true;
		return ref;
	}
}
class Player {
	constructor(name, role,cards=Array(),gameover=false,myturn = false) {
		this.name = name;
		this.cards =cards;
		this.gameover = gameover;
		this.myturn = myturn;
		this.role = role;
	}

	draw(deck, num = 1) {
		for (var i = 0; i < num; i++) {
			this.cards.push(deck.cards.pop());
			if (deck.cards.length == 0) {
				deck.cards = deck.deadwood;
				deck.deadwood = [];
			}
		}
	}

	play(card, deck, totalPoint, selection = NaN) {
		// 複合使用卡
		// 加入棄牌堆
		if (card.length == 2) {
			Array.prototype.push.apply(deck.deadwood, card);
			card.forEach((i) => {
				this.cards.splice(this.cards.indexOf(i), 1);
			});
		} else {
			deck.deadwood.push(card[0]);
			this.cards.splice(this.cards.indexOf(card[0]), 1);
		}

		// 結算卡片效果
		var parse = card.map((i) => {
			return parseCard(i);
		});
		var value = chosePoint(parse);

		switch (value) {
			case "joker":
				this.draw(deck);
				break;
			case 4:
				this.draw(deck);
				break;
			case 5:
				this.draw(deck);
				break;
			case 7:
				break;
			case 9:
				break;
			case 10:
				if (selection == "+10") {
					totalPoint += 10;
				} else {
					totalPoint -= 10;
				}
				this.draw(deck);
				break;
			case 11:
				this.draw(deck);
				this.draw(deck);
				break;
			case 12:
				if (selection == "+20") {
					totalPoint += 20;
				} else {
					totalPoint -= 20;
				}
				this.draw(deck);
				break;
			case 13:
				totalPoint = 99;
				this.draw(deck);
				break;
			default:
				totalPoint += value;
				this.draw(deck);
				break;
		}
		
		// 抽牌 ()
		return [totalPoint,value];
	}
}

// function init() {}
function setDeck(joker = 1, randomShuffle = true) {
	var deck = new Object();
	deck.cards = randomShuffle
		? shuffle(Array.from(Array(52 + joker).keys()))
		: Array.from(Array(52 + joker).keys());
	deck.deadwood = [];
	return deck;
}

function shuffle(arr) {
	var random;
	var newArr = [];
	while (arr.length) {
		random = Math.floor(Math.random() * arr.length);
		newArr.push(arr[random]);
		arr.splice(random, 1);
	}
	return newArr;
}

function parseCard(cardNum, reverse = false) {
	var suitDict = ["spades", "hearts", "clubs", "diamonds", "joker"];
	return reverse
		? cardNum.rank + suitDict.indexOf(cardNum.suit) * 13 - 1
		: { rank: (cardNum % 13) + 1, suit: suitDict[parseInt(cardNum / 13)] };
}

function chosePoint(cards) {
	var point = 0;
	if (cards.length == 1) {
		point = cards[0].suit == "joker" ? "joker" : cards[0].rank;
	} else if (cards.length == 2) {
		point = Math.abs(cards[0].rank - cards[1].rank);
	}
	return point;
}

export { parseCard, chosePoint, shuffle, setDeck, Player, Game };
