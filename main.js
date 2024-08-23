let board = [];
let currentTurn = 1;
let winner = false;

document.getElementById("startGame").addEventListener('click', () => {
	netplay.connect();
	createBoard();
});

class SimpleGame extends netplayjs.Game({
	gameId: 'connect4',
	numPlayers: 2,
	onConnect: (player) => {
		console.log(`Player ${player.id} connected`);
		if (player.id !== netplay.localPlayerId) {
			netplay.send({ type: 'sync', board, currentTurn, winner });
		}
	},
	onDisconnect: (player) => {
		console.log(`Player ${player.id} disconnected`);
	}
});

function createBoard() {
	board = [];
	winner = false;
	document.getElementById("board").innerHTML = '';
	for (let i = 0; i < 6; i++) {
		board.push([]);
		for (let j = 0; j < 7; j++) {
			board[i].push(0);
			const element = document.createElement("div");
			element.id = "cell" + i + j;
			element.classList.add('cell');
			element.dataset.row = i;
			element.dataset.column = j;
			element.addEventListener('click', move);
			document.getElementById("board").appendChild(element);
		}
	}
	netplay.start();
}

function move(event) {
	if (!winner && netplay.isCurrentPlayer()) {
		const column = event.target.dataset.column;
		for (let i = 5; i > -1; i--) {
			if (board[i][column] === 0) {
				board[i][column] = currentTurn;
				document.getElementById("cell" + i + column).classList.add(currentTurn === 1 ? "red" : "yellow");
				netplay.send({ type: 'move', column: column, row: i, player: currentTurn });
				if (checkWin()) {
					currentTurn === 1 ? document.getElementById("win").innerText = "Red Wins!" : document.getElementById("win").innerText = "Yellow Wins!";
					winner = true;
				}
				currentTurn = currentTurn === 1 ? 2 : 1;
				return;
			}
		}
	}
}

netplay.on('message', (message) => {
	if (message.type === 'move') {
		board[message.row][message.column] = message.player;
		document.getElementById("cell" + message.row + message.column).classList.add(message.player === 1 ? "red" : "yellow");
		if (checkWin()) {
			message.player === 1 ? document.getElementById("win").innerText = "Red Wins!" : document.getElementById("win").innerText = "Yellow Wins!";
			winner = true;
		}
		currentTurn = message.player === 1 ? 2 : 1;
	} else if (message.type === 'sync') {
		board = message.board;
		currentTurn = message.currentTurn;
		winner = message.winner;
		updateBoard();
	}
});

function updateBoard() {
	for (let i = 0; i < 6; i++) {
		for (let j = 0; j < 7; j++) {
			const cell = document.getElementById("cell" + i + j);
			cell.classList.remove('red', 'yellow');
			if (board[i][j] === 1) {
				cell.classList.add('red');
			} else if (board[i][j] === 2) {
				cell.classList.add('yellow');
			}
		}
	}
}

function checkWin() {
	for (let i = 5; i > -1; i--) {
		for (let j = 0; j < 7; j++) {
			if (board[i][j] === currentTurn) {
				if (j < 4 && board[i][j + 1] === currentTurn && board[i][j + 2] === currentTurn && board[i][j + 3] === currentTurn) {
					return true;
				}
				if (i > 2 && board[i - 1][j] === currentTurn && board[i - 2][j] === currentTurn && board[i - 3][j] === currentTurn) {
					return true;
				}
				if (j < 4 && i > 2 && board[i - 1][j + 1] === currentTurn && board[i - 2][j + 2] === currentTurn && board[i - 3][j + 3] === currentTurn) {
					return true;
				}
				if (j > 2 && i > 2 && board[i - 1][j - 1] === currentTurn && board[i - 2][j - 2] === currentTurn && board[i - 3][j - 3] === currentTurn) {
					return true;
				}
			}
		}
	}
	return false;
}
