let shared;

function preload() {
	partyConnect("wss://demoserver.p5party.org", "hello_party");
	shared = partyLoadShared("shared");
}

function setup() {
	// set defaults on shared data
	shared.board = [];
	shared.currentTurn = 1;
	shared.winner = false;
	createBoard();
}


function draw() {
	myColour = partyIsHost() + 1;

	if (shared.board.length == 6) {
		updateBoard();

		if (checkWin(1)) {
			document.getElementById("win").innerText = "Red Wins!";
			shared.winner = true;
		}
		if (checkWin(2)) {
			document.getElementById("win").innerText = "Yellow Wins!";
			shared.winner = true;
		}
		if (!shared.winner) {
			document.getElementById("win").innerText = "";
		}
	}
}

// 1=RED
// 2=YELLOW
// 0=NONE

//     0 1 2 3 4 5 6
//   _________________
// 0 | 0 0 0 0 0 0 0 |
// 1 | 0 0 0 0 0 0 0 |
// 2 | 0 0 0 0 0 0 0 |
// 3 | 0 0 0 0 0 0 0 |
// 4 | 0 0 0 0 0 0 0 |
// 5 | 0 0 0 0 0 0 0 |
//   -----------------

let myColour;

function createBoard() {
	for (let i = 0; i < 6; i++) {
		shared.board.push([]);
		for (let j = 0; j < 7; j++) {
			shared.board[i].push(0);
			element = document.createElement("div");
			element.id = "cell" + i + j;
			element.classList.add('cell');
			element.dataset.row = i;
			element.dataset.column = j;
			element.addEventListener("click", move);
			document.getElementById("board").appendChild(element);
		}
	}
}

function move(event) {
	if (!shared.winner) {
		column = event.target.dataset.column;
		if (shared.currentTurn == myColour) {
			for (let i = 5; i > -1; i--) {
				if (shared.board[i][column] == 0) {
					shared.board[i][column] = myColour;
					shared.currentTurn == 1 ? shared.currentTurn = 2 : shared.currentTurn = 1;
					return;
				}
			}
		}
	}
}


function checkWin(player) {
	for (let i = 5; i > -1; i--) {
		for (let j = 0; j < 7; j++) {
			if (shared.board[i][j] == player) {
				if (j < 4) {
					if (shared.board[i][j + 1] == player && shared.board[i][j + 2] == player && shared.board[i][j + 3] == player) {
						return true;
					}
				}
				if (i > 2) {
					if (shared.board[i - 1][j] == player && shared.board[i - 2][j] == player && shared.board[i - 3][j] == player) {
						return true;
					}
				}
				if (j < 4 && i > 2) {
					if (shared.board[i - 1][j + 1] == player && shared.board[i - 2][j + 2] == player && shared.board[i - 3][j + 3] == player) {
						return true;
					}
				}
				if (j > 2 && i > 2) {
					if (shared.board[i - 1][j - 1] == player && shared.board[i - 2][j - 2] == player && shared.board[i - 3][j - 3] == player) {
						return true;
					}
				}
			}

		}
	}
	return false;
}


function updateBoard() {
	//RESIZE
	if ((window.innerHeight * (7 / 6)) < window.innerWidth) {
		document.getElementById("board").style.width = (window.innerHeight * 0.75) * (7 / 6) + "px";
		for (let i = 0; i < 42; i++) {
			document.getElementById("board").children[i].style.width = (window.innerHeight * 0.125) - 4 + "px";
			document.getElementById("board").children[i].style.height = (window.innerHeight * 0.125) - 4 + "px";
		}
	} else {
		document.getElementById("board").style.width = (window.innerWidth * 0.75) + "px";
		for (let i = 0; i < 42; i++) {
			document.getElementById("board").children[i].style.width = (window.innerWidth * 0.75) / 7 - 4 + "px";
			document.getElementById("board").children[i].style.height = (window.innerWidth * 0.75) / 7 - 4 + "px";
		}
	}

	//UPDATE COLOURS
	for (let i = 0; i < 42; i++) {
		let row = parseInt(document.getElementById("board").children[i].dataset.row);
		let col = parseInt(document.getElementById("board").children[i].dataset.column);
		if (shared.board[row][col] != 0) {
			if (!document.getElementById("cell" + row + col).classList.contains(shared.board[row][col] == 1 ? "red" : "yellow")) {
				document.getElementById("cell" + row + col).classList.add(shared.board[row][col] == 1 ? "red" : "yellow");
			}
		} else if (shared.board[row][col] == 0 && (document.getElementById("cell" + row + col).classList.contains("red") || document.getElementById("cell" + row + col).classList.contains("yellow"))) {
			document.getElementById("cell" + row + col).classList.remove(document.getElementById("cell" + row + col).classList[1]);
		}
	}
}
