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

let board = [];
let currentTurn = 1;
let winner = false;

document.getElementById("main").style.width = window.outerWidth;
document.getElementById("main").style.height = window.outerHeight;

function createBoard() {
	document.getElementById("main").requestFullscreen();
	for(let i=0; i<6; i++) {
		board.push([]);
		for(let j=0; j<7; j++) {
			board[i].push(0);
			element = document.createElement("div");
			element.id = "cell" + i + j;
			element.classList.add('cell');
			element.dataset.row = i;
			element.dataset.column = j;
			element.addEventListener('click', move);
			document.getElementById("board").appendChild(element);
		}
	}
}

function move(event) {
	if(!winner) {
		column = event.target.dataset.column;
		for(let i=5; i>-1; i--) {
			if(board[i][column] === 0) {
				board[i][column] = currentTurn;
				document.getElementById("cell" + i + column).classList.add(currentTurn===1 ? "red" : "yellow");
				if(checkWin()) {
					currentTurn===1 ? document.getElementById("win").innerText = "Red Wins!" : document.getElementById("win").innerText = "Yellow Wins!";
					winner = true;
				}
				currentTurn===1 ? currentTurn=2 : currentTurn=1;
				return;
			}
		}
	}
}

function checkWin() {
	for(let i=5; i>-1; i--) {
		for(let j=0; j<7; j++) {
			if(board[i][j]===currentTurn) {
				if(j<4) {
					if(board[i][j+1] === currentTurn && board[i][j+2] === currentTurn && board[i][j+3] === currentTurn) {
						return true;
					}
				}
				if(i>2) {
					if(board[i-1][j] === currentTurn && board[i-2][j] === currentTurn && board[i-3][j] === currentTurn) {
						return true;
					}
				}
				if(j<4 && i>2) {
					if(board[i-1][j+1] === currentTurn && board[i-2][j+2] === currentTurn && board[i-3][j+3] === currentTurn) {
						return true;
					}
				}
				if(j>2 && i>2) {
					if(board[i-1][j-1] === currentTurn && board[i-2][j-2] === currentTurn && board[i-3][j-3] === currentTurn) {
						return true;
					}
				}
			}
		}
	}
	return false;
}
