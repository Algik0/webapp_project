import React, { useState } from "react";

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const handleClick = (index: number) => {
    if (board[index] || calculateWinner(board)) return;

    const newBoard = board.slice();
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const calculateWinner = (squares: string[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${isXNext ? "X" : "O"}`;

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Tic-Tac-Toe</h1>
      <div style={{ marginBottom: "20px" }}>{status}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 100px)", gap: "5px", justifyContent: "center" }}>
        {board.map((value, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            style={{
              width: "100px",
              height: "100px",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            {value}
          </button>
        ))}
      </div>
      <button onClick={resetGame} style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}>
        Reset Game
      </button>
    </div>
  );
};

export default TicTacToe;