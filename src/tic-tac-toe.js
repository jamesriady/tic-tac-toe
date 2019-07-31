import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className="square" onClick={props.clickSquare}>
    {props.value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square value={this.props.squares[i]} clickSquare={() => this.props.onclick(i)}/>;
  }

  render() {
    return (
      <div>
        {/*<div className="status">{status}</div>*/}
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      squares: [
        Array(9).fill(null)
      ],
      xIsNext: true,
      stepNumber:0
    }
  }

  handleClick(i) {
    let histories = this.state.squares.slice(0, this.state.stepNumber + 1);
    let current = histories[histories.length - 1];
    let squares = current.slice();
    if(calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: histories.concat([squares]),
      stepNumber: histories.length,
      xIsNext: !this.state.xIsNext
    })
  }

  jumpTo(i) { 
    this.setState({
      stepNumber: i,
      xIsNext: (i % 2 === 0)
    })
  }

  render() {
    const histories = this.state.squares;
    const current = histories[this.state.stepNumber];
    const winner = calculateWinner(current);
    let status;
    if(winner)
      status = "Winner: " + winner;
  else
    status = "Next player: " + (this.state.xIsNext ? 'X' : 'O')
  const moves = histories.map((step, move) => {
    let text = "Go to move #" + move;
    if (move === 0) text = "Go to game start";
    return (<li key={move}><button onClick={() => this.jumpTo(move)}>{text}</button></li>);
  })
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current} onclick={i => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
