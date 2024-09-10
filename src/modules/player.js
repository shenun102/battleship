import { Gameboard } from "./gameboard";

export class Player {
  constructor(isComputer = false) {
    // Each player will have their own gameboard
    this.gameboard = new Gameboard();
    this.isComputer = isComputer;
  }

  // Method to attack opponent's gameboard
  attack(opponentGameboard, coordinate) {
    opponentGameboard.receiveAttack(coordinate);
  }
}

export class ComputerPlayer extends Player {
  constructor() {
    // Set isComputer to true
    super(true);
  }

  // Generate random coordinates for the computer attack

  generateRanCoordinate() {
    // Assuming a 10x10 grid
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    return [x, y];
  }

  // Computer automatically attacks with a random move
  attack(opponentGameboard) {
    let coordinate;
    do {
      coordinate = this.generateRanCoordinate();
    } while (this.hasAlreadyAttacked(opponentGameboard, coordinate));

    super.attack(opponentGameboard, coordinate);
  }

  // Check if a coordinate has already been attacked, hit or missed.
  hasAlreadyAttacked(opponentGameboard, coordinate) {
    // store all coordinates, both hits and misses
    const attackedCoords = opponentGameboard.missedShots.concat(
      opponentGameboard.ships.flatMap((ship) => ship.coordinates)
    );

    // Checked if a coordinate has been attacked
    return attackedCoords.some(
      (attacked) =>
        attacked[0] === coordinate[0] && attacked[1] === coordinate[1]
    );
  }
}

// module.exports = { Player, ComputerPlayer };
