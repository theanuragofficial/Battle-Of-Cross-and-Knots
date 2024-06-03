document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const startButton = document.getElementById("startButton");
  const resetButton = document.getElementById("resetButton");
  const scoreX = document.getElementById("scoreX");
  const scoreO = document.getElementById("scoreO");
  const scoreTies = document.getElementById("scoreTies");
  const scoreboard = document.getElementById("scoreboard");

  let board = Array(9).fill(null);
  let currentPlayer = "X";
  let gameActive = false;
  let scores = { X: 0, O: 0, Ties: 0 };

  const drawBoard = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let i = 1; i < 3; i++) {
      ctx.moveTo(i * 100, 0);
      ctx.lineTo(i * 100, 300);
      ctx.moveTo(0, i * 100);
      ctx.lineTo(300, i * 100);
    }
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawMove = (index, player) => {
    const x = (index % 3) * 100 + 50;
    const y = Math.floor(index / 3) * 100 + 50;
    ctx.font = "48px Arial";
    ctx.fillStyle = player === "X" ? "red" : "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(player, x, y);
  };

  const handleClick = (event) => {
    if (!gameActive) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const index = Math.floor(x / 100) + Math.floor(y / 100) * 3;
    if (board[index]) return;
    board[index] = currentPlayer;
    drawMove(index, currentPlayer);
    if (checkWinner()) {
      gameActive = false;
      scores[currentPlayer]++;
      updateScoreboard();
      setTimeout(() => {
        alert(`${currentPlayer} wins!`);
        resetGame();
      }, 100);
    } else if (board.every((cell) => cell)) {
      gameActive = false;
      scores.Ties++;
      updateScoreboard();
      setTimeout(() => {
        alert(`It's a tie!`);
        resetGame();
      }, 100);
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
  };

  const checkWinner = () => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const condition of winConditions) {
      const [a, b, c] = condition;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return true;
      }
    }
    return false;
  };

  const updateScoreboard = () => {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
    scoreTies.textContent = scores.Ties;
  };

  const resetGame = () => {
    board = Array(9).fill(null);
    currentPlayer = "X";
    gameActive = true;
    drawBoard();
  };

  startButton.addEventListener("click", () => {
    gameActive = true;
    drawBoard();
    canvas.style.display = "block";
    startButton.disabled = true;
    resetButton.disabled = false;
    updateScoreboard();
  });

  resetButton.addEventListener("click", () => {
    resetGame();
    updateScoreboard();
  });

  canvas.addEventListener("click", handleClick);
});
