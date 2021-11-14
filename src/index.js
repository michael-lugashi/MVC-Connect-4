'use strict';
class Event {
  constructor() {
    this.listeners = []; //Empty array of listeners
  }

  addListener(listener) {
    this.listeners.push(listener); //Method of the event obj, pushes a new listener () to the listeners array
  }

  trigger(params) {
    this.listeners.forEach((listener) => {
      listener(params);
    }); //Method of the event obj, for each listener () it activates a function ()
  }
}

class Connect {
  //The model
  constructor() {
    this.board = Array(42).fill(); //Generates new array with the length of 42 and each cell is empty field --> [undefined, undefined, etc...
    this.currentPlayer = '🔴'; //Current player's value in initilaization is '🔴'
    this.finished = false; //Flag for finished game (Boolean), initial with flase;

    this.updateCellEvent = new Event();
    this.victoryEvent = new Event();
    this.drawEvent = new Event();
  }

  play(move) {
    if (this.finished) {
      return false;
    }
    move = this.addToBottom(move);
    if (move < 0 || move > 42 || this.board[move]) {
      return false; // checks to see if you can place a piece where you decided to place it
    }
    this.board[move] = this.currentPlayer;
    this.updateCellEvent.trigger({ move, player: this.currentPlayer });
    this.finished = this.victory() || this.draw();
    if (!this.finished) {
      this.switchPlayer();
    }
    return true;
  }

  addToBottom(move) {
    // returns the bottom empty cell value of each column
    //Checks the value of the cell bottom - up until it's undefined
    move = (move % 7) + 35;
    while (this.board[move] && move > 0) {
      move = move - 7;
    }
    return move;
  }

  victory() {
    //Function with victory possibilites (l = line cell out of the lines array)
    const lines = [
      [0, 1, 2, 3],
      [41, 40, 39, 38],
      [7, 8, 9, 10],
      [34, 33, 32, 31],
      [14, 15, 16, 17],
      [27, 26, 25, 24],
      [21, 22, 23, 24],
      [20, 19, 18, 17],
      [28, 29, 30, 31],
      [13, 12, 11, 10],
      [35, 36, 37, 38],
      [6, 5, 4, 3],
      [0, 7, 14, 21],
      [41, 34, 27, 20],
      [1, 8, 15, 22],
      [40, 33, 26, 19],
      [2, 9, 16, 23],
      [39, 32, 25, 18],
      [3, 10, 17, 24],
      [38, 31, 24, 17],
      [4, 11, 18, 25],
      [37, 30, 23, 16],
      [5, 12, 19, 26],
      [36, 29, 22, 15],
      [6, 13, 20, 27],
      [35, 28, 21, 14],
      [0, 8, 16, 24],
      [41, 33, 25, 17],
      [7, 15, 23, 31],
      [34, 26, 18, 10],
      [14, 22, 30, 38],
      [27, 19, 11, 3],
      [35, 29, 23, 17],
      [6, 12, 18, 24],
      [28, 22, 16, 10],
      [13, 19, 25, 31],
      [21, 15, 9, 3],
      [20, 26, 32, 38],
      [36, 30, 24, 18],
      [5, 11, 17, 23],
      [37, 31, 25, 19],
      [4, 10, 16, 22],
      [2, 10, 18, 26],
      [39, 31, 23, 15],
      [1, 9, 17, 25],
      [40, 32, 24, 16],
      [9, 17, 25, 33],
      [8, 16, 24, 32],
      [11, 17, 23, 29],
      [12, 18, 24, 30],
      [1, 2, 3, 4],
      [5, 4, 3, 2],
      [8, 9, 10, 11],
      [12, 11, 10, 9],
      [15, 16, 17, 18],
      [19, 18, 17, 16],
      [22, 23, 24, 25],
      [26, 25, 24, 23],
      [29, 30, 31, 32],
      [33, 32, 31, 30],
      [36, 37, 38, 39],
      [40, 39, 38, 37],
      [7, 14, 21, 28],
      [8, 15, 22, 29],
      [9, 16, 23, 30],
      [10, 17, 24, 31],
      [11, 18, 25, 32],
      [12, 19, 26, 33],
      [13, 20, 27, 34],
    ];
    const victory = lines.some(
      (l) =>
        this.board[l[0]] && // Inserts a boolean value to victory variable
        this.board[l[0]] === this.board[l[1]] && // true : if the first cell of the line equals the second and the third
        this.board[l[1]] === this.board[l[2]] &&
        this.board[l[2]] === this.board[l[3]]
    );

    if (victory) {
      //If the victory value is true then triggers a victory event with the winner(X/O)
      this.victoryEvent.trigger(this.currentPlayer);
    }

    return victory; //Returns the boolean value of victory variable
  }

  draw() {
    const draw = this.board.every((i) => i); //checks if every cell in the board has a value (not undefined)

    if (draw) {
      this.drawEvent.trigger(); //trigers draw event
    }

    return draw; //returns the boolean value
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === '🔴' ? '🔵' : '🔴'; //puts the opposite value of the current player to currentplayer
  }
}

class View {
  constructor() {
    this.playEvent = new Event();
  }

  render() {
    //updates the DOM
    const board = document.createElement('div');
    board.className = 'board';
    this.cells = Array(42)
      .fill()
      .map((_, i) => {
        //For each cell in the array create a sub element and insert it in array of elements called this.cells
        const cell = document.createElement('div');
        cell.className = 'cell';

        cell.addEventListener('click', () => {
          //adds a click listener to each cell element
          this.playEvent.trigger(i); //on click it triggers the play event with the i number argument
        });

        board.appendChild(cell); // appends the cell element to the board

        return cell;
      });

    this.message = document.createElement('div'); //creates a div element for a messege and appends it to the body
    this.message.className = 'message';

    root.appendChild(board); // appends elements to html root
    root.appendChild(this.message);
  }

  updateCell(data) {
    //recieves a data object with move index key(number) and player key(🔴/🔵) and inserts the player to to this.cells[index]
    this.cells[data.move].textContent = data.player;
  }

  victory(winner) {
    this.message.textContent = `${winner} wins!`; //annonce the winer when there's a victory from the model
  }

  draw() {
    this.message.textContent = "It's a draw!"; //annonces a draw when there's a draw from the model
  }
}

class Controller {
  constructor() {
    this.model = new Connect(); //creates the model
    this.view = new View(); //creates the viewer

    this.view.playEvent.addListener((move) => {
      this.model.play(move);
    }); //adds a "move" listener from the viewer to a play event that triggers the model to play the move(number)

    this.model.updateCellEvent.addListener((data) => {
      this.view.updateCell(data);
    }); //updates the cell element in the viewer that listens to chage in data
    this.model.victoryEvent.addListener((winner) => {
      this.view.victory(winner);
    }); //updates the DOM with the winner messege on case of a win event
    this.model.drawEvent.addListener(() => {
      this.view.draw();
    }); //updates the DOM with the draw messege on case of a draw event
  }

  run() {
    this.view.render(); //initializes the DOM with the render setup
  }
}

const app = new Controller(); //creates the new controller

app.run(); // runs the render to setup the initial DOM
