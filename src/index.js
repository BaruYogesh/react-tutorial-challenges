//imports. add this at the top of every file.
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const winStyle = {
  color: 'blue'
};

//functional class declaration. used when the only method of the class is render()
//props are properties of a component.
function Square(props) {
  return (
    
    <button className="square" onClick={props.onClick} style={props.style}>
      {props.value}
    </button>
  );
}

//typical component. each component is written as:
//class x extends Component {}
class Board extends React.Component {
  
  //this function is called in render() to render each square
  renderSquare(i) {
    console.log(this.props.winner);
    if(this.props.winner != null){
      if(this.props.winner.includes(i)){
        return (
          <Square //tag refers to the square class ^
            //value is either X or O. onClick() is an internal function. in this case it points to handleClick
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            style={winStyle}
          />
        );
      }
    }
    
    return (
      <Square //tag refers to the square class ^
        //value is either X or O. onClick() is an internal function. in this case it points to handleClick
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );  
  }

  createBoard = () => {

    let board = []

      for(let i = 0;i<3;i++){
        let j = i * 3;
        board.push(
        <div className="board-row">
          {this.renderSquare(j)}
          {this.renderSquare(j+1)}
          {this.renderSquare(j+2)}
        </div>
        )       
      }
      return board
  }

  render() {
    //each square rendered separately

    return(
      <div>
        {this.createBoard()}
      </div>
    )
    
    
  }
}
//this class is used to manage the entire game
class Game extends React.Component {
  constructor(props) { //all react component classes should start with super(props);
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0, //step count
      xIsNext: true, //used to decide to place X or O
      historyOrder: true //used for deciding which way to show history buttons
    };
  }
  //function is called every click. 
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); //
    const current = history[history.length - 1]; //current step's board value
    const squares = current.squares.slice(); //individual squares from the board
    if (calculateWinner(squares) || squares[i]) { //if the game is won or the square has already been filled.
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O"; //sets either X or O on the board.
    //last part means set X if true, else O but in one line.
    this.setState({
      //add the board to history
      history: history.concat([
        {
          squares: squares
        }
      ]),
      
      stepNumber: history.length, //change stepnumber
      xIsNext: !this.state.xIsNext //flip X to O or vice versa
      
    });
  }
  //used to move through the steps of the game
  jumpTo(step) {
    this.setState({
      stepNumber: step, //step is set to passed value
      xIsNext: (step % 2) === 0 //X or O chosen based on step count
    });
  }

  flipHistory() {
    this.setState({
      historyOrder: !this.state.historyOrder
    });
  }

  render() {
    const history = this.state.history; //history
    const current = history[this.state.stepNumber]; //current board obtained by getting the last index of history
    const winner = calculateWinner(current.squares); //pass the array of squares to winner, winner is boolean value.
    
    const moves = history.map((step, move) => {//function is called for count of move
      const desc = move ?
        'Go to move #' + move : //used if move != 0
        'Go to game start'; //first move.
      return ( //returns button that jumps to the corresponding spot in the game. move is used to fill the button as well as jump to the right spot.
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) { //show next player unless the game is won.
      status = "Winner: " + (this.state.xIsNext ? "O" : "X"); 
    }
    else if(winner == null & history.length> 9){
      status = "No winner"
    }
    else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    if(!this.state.historyOrder){
      moves.reverse();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winner={winner}
            squares={current.squares}
            onClick={i => this.handleClick(i)} //bind onClick to handleClick, pass i.
          />
        </div>
        <div className="game-info">
          <button onClick={this.flipHistory.bind(this)}>flip</button>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

//this function is called on every click to determine if there is a winner
function calculateWinner(squares) {
  const lines = [ //possible winning combinations
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) { //loop through combinations
    const [a, b, c] = lines[i]; //a b c = winning indexes from combinations
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
