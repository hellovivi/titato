import React from 'react';
import './App.css';


function Square(props){
    let className = "square";
    if(props.win.indexOf(props.index) > -1){
        className = "square_win";
    }
    return <button className={className} onClick={props.onClick}>
        {props.value}
    </button>
}

class Board extends React.Component {

    renderSquare(i) {
        return <Square key={i} index={i} win={this.props.win} value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>;
    }

    render() {
        const l = this.props.l;
        return (
            <div>
                {
                    Array(l).fill(null).map((v,k) => {
                        return (
                            <div key={k} className="board-row">
                                {
                                    Array(l).fill(null).map((y,x) => {
                                        return (
                                            this.renderSquare(x + k * l)
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    lat : Array(2).fill(0)
                },
            ],
            xIsNext: true,
            stepNumber: 0,
            rowNum: 3,
            winLat: Array(3).fill(null)
        };
    }

    jumpTo(stepNumber){

        this.setState({
            stepNumber: stepNumber,
            xIsNext : (stepNumber % 2) === 0,
        });

    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        if(this.calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
                history: history.concat([{
                    squares: squares,
                    lat: this.convertIntToLat(i),
                }]),
                xIsNext: !this.state.xIsNext,
                stepNumber: history.length,
            }
        );
    }

    convertIntToLat(i){
        let row = Math.floor(i / this.state.rowNum);
        let col = i % this.state.rowNum;
        return [row,col];
    }

    generaButton(step,move){
        const desc = move ? "Go to move # " + move : "Go to game start";
        const moveinfo = "[ " + step.lat[0] +", " + step.lat[1] + "]";
        if (move === this.state.stepNumber){
            return (
                <button onClick={() => this.jumpTo(move)}><b>{desc},{moveinfo}</b></button>
            )
        }
        return (
            <button onClick={() => this.jumpTo(move)}>{desc},{moveinfo}</button>
        )
    }

    revertHistory(){
        this.setState(
            {
                history: this.state.history.reverse()
            }
        );
    }

    gartherWinner(squares){
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
        let r = [];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                r = [a,b,c]
            }
        }
        return r;
    }

    calculateWinner(squares) {
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
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    render() {
        //const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const history = this.state.history;

        const current = history[this.state.stepNumber];
        const winner = this.calculateWinner(current.squares);
        let win = this.gartherWinner(current.squares);
        console.log(this.state.stepNumber, history.length);
        const isFinished = this.state.stepNumber === history.length - 1 ? true : false;

        let status;
        if(winner){
            status = "Winner is :" + winner;
        }else{
            if(!isFinished){
                status = 'Next player: ' + (this.state.xIsNext ? "X" : "O");
            }else{
                status = "No One win!";
            }
        }

        const moves = history.map((step,move) => {
            return (
                <li key={move}>
                    {this.generaButton(step,move)}
                </li>
            );
        });

        const revert = <button onClick={() => this.revertHistory()}>Reserve History</button>

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} l={this.state.rowNum} win={win} onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status} {revert}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}



export default Game;
