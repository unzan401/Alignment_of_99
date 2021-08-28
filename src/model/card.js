// 這個檔案來處理所有遊戲邏輯
import { firebase } from "../model/FirebaseModel";
class Game {
	constructor(time = Date.now()) {
		this.time = time;
	}
	connectDb() {
		var api = "data/" + this.time + "/";
		return firebase
			.database()
			.ref(api)
			.once("value", (snapshot) => {
				this.data = snapshot.val();
				this.data.public.deadwood =
					typeof this.data.public.deadwood == "undefined"
						? []
						: this.data.public.deadwood;
				this.data.public.player.forEach((player) => {
					this.data.private.playerHand[player] =
						typeof this.data.private.playerHand[player] ==
						"undefined"
							? []
							: this.data.private.playerHand[player];
				});
			});
	}

	newGame(player = ["Alice", "Bob","Cat","Dobby","Elise","Fox","Gary","Hank"]) {
		var numJoker = 2;
		this.data = {
			public: {
				player: player,
				playerState: {},
				point: 99,
				order: true,
				number: Math.floor(Math.random() * player.length),
				deadwood: [],
				deckLength: 52 + numJoker - 5 * player.length,
				gameover: false,
			},
			private: {
				playerHand: {},
				deck: this.setDeck(numJoker),
				playerState: {},
			},
		};
		var roles = this.roleGenerate();
		this.data.public.player.forEach((player) => {
			this.data.private.playerHand[player] = [];
			this.draw(player, 5);

			this.data.private.playerState[player] = {
				role: roles.pop(),
			};
			this.data.public.playerState[player] = {
				handLength: 5,
				role: "unknown",
				alive: true,
			};
		});
		var Ref = {};
		Ref[this.time] = this.data;
		return Ref;
	}

	update(api, data) {
		data.public.deckLength = data.private.deck.length;
		data.public.player.forEach((i) => {
			data.public.playerState[i].handLength =
				data.private.playerHand[i].length;
			data.public.playerState[i].role = data.public.playerState[i].alive
				? "unknown"
				: data.private.playerState[i].role;
		});
		//確認是否遊戲結束
		this.checkGameover();
		firebase
			.database()
			.ref(api)
			.update(data);
	}
	checkGameover() {
		var alivelist = this.data.public.player
			.map((i) => {
				return this.data.private.playerState[i].role;
			})
			.filter((i, index) => {
				return this.data.public.playerState[
					this.data.public.player[index]
				].alive;
			});
			console.log(alivelist)
			console.log(alivelist.indexOf("Red"))
			console.log(alivelist.indexOf(""))
		if (
			(alivelist.indexOf("Red") == -1) |
			(alivelist.indexOf("Black") == -1)
		) {
			this.data.public.gameover = true;
			this.data.public.player.forEach((i) => {
				this.data.public.playerState[
					i
				].handLength = this.data.private.playerHand[i].length;
				this.data.public.playerState[i].role = this.data.private.playerState[i].role;
			});
			if (alivelist.indexOf("Joker") == -1) {
				if (alivelist.indexOf("Red") == -1) {
					if (alivelist.indexOf("Black") == -1) {
						this.data.public.winner = "None";
					} else {
						this.data.public.winner = "Black";
					}
				} else {
					this.data.public.winner = "Red";
				}
			} else {
				this.data.public.winner = "Joker";
			}
		}
	}

	roleGenerate() {
		var roles = [];
		var length = this.data.public.player.length;
		roles.push("Joker");
		for (var i = 0; i < (length - 1) / 2; i++) {
			roles.push("Red");
			roles.push("Black");
		}
		return shuffle(roles);
	}

	draw(player, num = 1) {
		for (var i = 0; i < num; i++) {
			this.data.private.playerHand[player].push(
				this.data.private.deck.pop()
			);
			if (this.data.private.deck.length == 0) {
				this.data.private.deck = this.data.public.deadwood;
				this.data.public.deadwood = [];
			}
		}
	}

	play(player, card, selection = NaN) {
		if ((card.length > 0) & (card.length < 3)) {
			var playerHand = this.data.private.playerHand[player];
			var api = "data/" + this.time + "/";
			// 複合使用卡
			// 加入棄牌堆
			var parse = card.map((i) => {
				return parseCard(i, true);
			});
			if (parse.length == 2) {
				Array.prototype.push.apply(this.data.public.deadwood, parse);
				parse.forEach((i) => {
					playerHand.splice(playerHand.indexOf(i), 1);
				});
			} else {
				this.data.public.deadwood.push(parse[0]);
				playerHand.splice(playerHand.indexOf(parse[0]), 1);
			}

			// 結算卡片效果

			var value = this.chosePoint(card);
			var message = "";

			switch (value) {
				case "joker":
					message +=
						selection +
						"的陣營是" +
						this.data.private.playerState[selection].role +
						"；";
					this.draw(player);
					this.nextPlayer();
					break;
				case 4:
					this.data.public.order = !this.data.public.order;
					this.draw(player);
					this.nextPlayer();
					break;
				case 5:
					this.data.public.number = this.data.public.player.indexOf(
						selection
					);
					this.draw(player);

					break;
				case 7:
					var temp = this.data.private.playerHand[player];
					this.data.private.playerHand[
						player
					] = this.data.private.playerHand[selection];
					this.data.private.playerHand[selection] = temp;
					// 確認是否有人出局
					if (this.data.private.playerHand[selection].length == 0) {
						this.data.public.playerState[selection].alive = false;
					}
					this.nextPlayer();
					break;
				case 9:
					this.data.private.playerHand[player].push(
						this.data.private.playerHand[selection].pop()
					);
					if (this.data.private.playerHand[selection].length == 0) {
						this.data.public.playerState[selection].alive = false;
					}
					this.nextPlayer();
					break;
				case 10:
					if (selection == "+10") {
						this.data.public.point += 10;
					} else {
						this.data.public.point -= 10;
					}
					this.draw(player);
					this.nextPlayer();
					break;
				case 11:
					this.draw(player);
					this.draw(player);
					this.nextPlayer();
					break;
				case 12:
					if (selection == "+20") {
						this.data.public.point += 20;
					} else {
						this.data.public.point -= 20;
					}
					this.draw(player);
					this.nextPlayer();
					break;
				case 13:
					this.data.public.point = 99;
					this.draw(player);
					this.nextPlayer();
					break;
				default:
					this.data.public.point += value;
					this.draw(player);
					this.nextPlayer();
					break;
			}
			this.update(api, this.data);
			return message;
		}
	}
	giveup(player) {
		this.nextPlayer();
		this.data.public.playerState[player].alive = false;
		Array.prototype.push.apply(
			this.data.public.deadwood,
			this.data.private.playerHand[player]
		);
		this.data.private.playerHand[player] = [];

		var api = "data/" + this.time + "/";
		this.update(api, this.data);
	}
	nextPlayer() {
		var alivelist = Array.from(this.data.public.player.keys()).filter(
			(i) => {
				return this.data.public.playerState[this.data.public.player[i]]
					.alive;
			}
		);

		if (this.data.public.order) {
			this.data.public.number =
				alivelist.indexOf(this.data.public.number) ==
				alivelist.length - 1
					? alivelist[0]
					: alivelist[alivelist.indexOf(this.data.public.number) + 1];
		} else {
			this.data.public.number =
				alivelist.indexOf(this.data.public.number) == 0
					? alivelist[alivelist.length - 1]
					: alivelist[alivelist.indexOf(this.data.public.number) - 1];
		}
	}

	chosePoint(cards) {
		var point = 0;
		if (cards.length == 1) {
			point = cards[0].suit == "joker" ? "joker" : cards[0].rank;
		} else if (cards.length == 2) {
			point = Math.abs(cards[0].rank - cards[1].rank);
		}
		return point;
	}

	setDeck(joker = 1, randomShuffle = true) {
		var deck = randomShuffle
			? shuffle(Array.from(Array(52 + joker).keys()))
			: Array.from(Array(52 + joker).keys());
		return deck;
	}
}
// function init() {}

function chosePoint(cards) {
	var point = 0;
	if (cards.length == 1) {
		point = cards[0].suit == "joker" ? "joker" : cards[0].rank;
	} else if (cards.length == 2) {
		point = Math.abs(cards[0].rank - cards[1].rank);
	}
	return point;
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

export { chosePoint, parseCard, shuffle, Game };
