import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
	return (
		<button className={"square " + (props.active ? "active" : "")} onClick={props.clickSquare}>
		{props.value}
		</button>
	);
}

class Board extends React.Component {

  // renderSquare(i) {
  //   return <Square value={this.props.squares[i]} clickSquare={() => this.props.onclick(i)}/>;
  // }

  renderItem() {
  	// let html = [];
  	// for(let i = 1; i <= 3; i++) {
  	// 	let items = []
  	// 	for(let j = 3; j >= 1; j--) {
  	// 		let index = (3 * i) - j;
  	// 		items.push(<Square key={index} value={this.props.squares[index]} clickSquare={() => this.props.onclick(index)}/>);
  	// 	}
  	// 	html.push(<div key={i} className="board-row">{items}</div>)
  	// }
  	// return html;
  	let arr = Array(9).fill(null);
  	let totalRow = Math.ceil(arr.length / 3);
  	let html = [];
  	const winner = this.props.winner;
  	for (let i = 1; i <= totalRow; i++) {
  		let item = <div className="board-row" key={i}>{arr.slice((i - 1) * 3, i * 3).map((item, index) => {
  			index += (i * totalRow) - totalRow;
  			let active = false;
  			if (winner) {
  				active = winner['pattern'].indexOf(index) !== -1;
  			}
  			return <Square key={index} active={active} value={this.props.squares[index]} clickSquare={() => this.props.onclick(index)}/> }
  			)}</div>
  		html.push(item)
  	}
  	return html
  }

  render() {
    return (
      <div>
      	{this.renderItem()}
        {/*<div className="board-row">
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
        </div>*/}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
  	super(props)
  	this.state = {
  		histories: [
  			{ squares: Array(9).fill(null), position: null }
  		],
  		xIsNext: true,
  		stepNumber:0,
  		position: [
  			{ x: 1, y: 1 },
  			{ x: 1, y: 2 },
  			{ x: 1, y: 3 },
  			{ x: 2, y: 1 },
  			{ x: 2, y: 2 },
  			{ x: 2, y: 3 },
  			{ x: 3, y: 1 },
  			{ x: 3, y: 2 },
  			{ x: 3, y: 3 }
  		],
  		sortAsc: true
  	}
  }

  handleClick(i) {
  	let histories = this.state.sortAsc ? this.state.histories.slice(0, this.state.stepNumber + 1) : this.state.histories.slice(this.state.stepNumber);
  	let current = this.state.sortAsc ? histories[histories.length - 1] : histories[0];
  	let squares = current.squares.slice();
  	if(calculateWinner(squares) || squares[i]) return;
  	squares[i] = this.state.xIsNext ? 'X' : 'O';
  	if (this.state.sortAsc) histories.push({ squares: squares, position: this.state.position[i] });
  	else histories.unshift({ squares: squares, position: this.state.position[i] });
  	this.setState({
  		histories: histories,
  		stepNumber: this.state.sortAsc ? (histories.length - 1) : 0,
  		xIsNext: !this.state.xIsNext
  	})
  }

  jumpTo(i) {	
  	this.setState({
  		stepNumber: i,
  		xIsNext: this.state.sortAsc ? i % 2 === 0 : (this.state.histories.length - i + 1) % 2 === 0
  	})
  }

  changeSort() {
  	this.setState({
  		sortAsc: !this.state.sortAsc,
  		histories: this.state.histories.reverse(),
  		stepNumber: (this.state.histories.length - 1) - this.state.stepNumber 
  	})
  }

  render() {
  	const histories = this.state.histories;
  	const current = histories[this.state.stepNumber].squares;
  	const winner = calculateWinner(current);
  	let status;
  	if(winner) {
  		status = "Winner: " + winner['name'];
  	} else {
  		if(current.indexOf(null) !== -1)
			status = "Next player: " + (this.state.xIsNext ? 'X' : 'O')
		else
			status = "Draw"
  	}
	const moves = histories.map((step, move) => {
		let text = "Go to move #" + move;
		if (this.state.sortAsc) {
			if (move === 0) text = "Go to game start";
		} else {
			text = "Go to move #" + ((histories.length - 1) - move);
			if (move === (histories.length - 1)) text = "Go to game start";
		}
		if(step['position']) text = text.concat("(row: " + step['position']['x'] + " col: " + step['position']['y'] + ")");
		
		return (<li key={move} className={move === this.state.stepNumber ? 'active' : ''}><button onClick={() => this.jumpTo(move)}>{text}</button></li>);
	})
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current} onclick={i => this.handleClick(i)} winner={winner}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <label className="switch">
		  	<input type="checkbox" checked={this.state.sortAsc} onChange={() => this.changeSort()}/>
		  	<span className="slider round" />
		  </label>
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
			return { name: squares[a], pattern: [a, b, c] };
		}
	}
	return null;
}
