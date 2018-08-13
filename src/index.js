import React, {Component} from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Square extends Component {
	render() {
		let classes = "square";
		if (this.props.wonSquare) {
			classes += " won-square";
		} else if (this.props.value) {
			classes += ` ${this.props.value.toLowerCase()}`;
		}

		return (
			<button 
				className={classes}
				onClick={() => this.props.onClick()}
			>
				{this.props.value}
			</button>
		);
	}
}

class Board extends Component {
	renderSquare = (i) => {
		const winner = this.props.winner;
		return (
			<Square
				key = {i}
				value={this.props.squares[i]} 
				onClick={() => this.props.onClick(i)}
				wonSquare={winner && winner.includes(i)}
			/>
		);
	}

	render() {
		let rows = [];
		for (let i = 0; i < 3; i++) {
			let cols = [];
			for (let j = 0; j < 3; j++) {
				cols.push(this.renderSquare(i * 3 + j));
			}
			rows.push(
				<div key={i} className="board-row">
					{cols}
				</div>
			);
		}
		return (
			<div>
				{rows}
			</div>
		);
	}
}

class Game extends Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null),
					lastSquare: null
				}
			],
			stepNumber: 0,
			xIsNext: true,
			moveDirectOrder: true
		};
	}

	handleClick = (i) => {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (squares[i] || calculateWinner(squares)) {
			return;
		}
		squares[i] = this.state.xIsNext ? "X" : "O";
		this.setState({
			history: history.concat([{
				squares: squares,
				lastSquare: i
			}]),
			xIsNext: !this.state.xIsNext,
			stepNumber: history.length
		});
	}

	jumpTo = (step) => {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0
		});
	}

	toggleOrder = (event) => {
		this.setState({moveDirectOrder:!this.state.moveDirectOrder});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		let moves = history.map((step, move) => {
			let desc = move ? `Go to move #${move}` : "Go to start";
			if (move) {
				const col = step.lastSquare % 3 + 1;
				const row = Math.floor(step.lastSquare / 3) + 1;
				desc += ` (${col}, ${row})`;
			}
			if (step === current)
			{
				desc = <strong>{desc}</strong>;
			}
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>
						{desc}
					</button>
				</li>
			);
		});
		if (!this.state.moveDirectOrder) moves.reverse();

		let status;
		if (winner) {
			status = `Winner: ${current.squares[winner[0]]}!`;
		} else if (current.squares.every(i => i)) {
			status = "No one wins";
		} else {
			status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
						winner={winner}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<button onClick={(event) => this.toggleOrder(event)}>
						{`Order: ${this.state.moveDirectOrder ? "direct" : "reversed"}`}
					</button>
					<ol reversed={!this.state.moveDirectOrder}>{moves}</ol>
				</div>
			</div>
		);
	}
}

const calculateWinner = (squares) => {
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
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return lines[i];
		}
	}
	return null;
}

ReactDOM.render(<Game />, document.getElementById("root"));

