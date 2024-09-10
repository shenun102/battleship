import { Ship } from "./ship";

export class Gameboard {
  constructor() {
    this.board = []; // Storing ships and their positions
    this.missedShots = []; // To store coordinates of missed attacks
    this.ships = []; // Keep track of ships on board
  }

  // Method to place ships at a specific coordiantes
  placeShip(ship, coordinates) {
    // Store ship with its coordinates
    this.ships.push({ ship, coordinates });
  }

  // Method to receive an attack at specific
  receiveAttack(coordinate) {
    // Check if the attack hits the ship
    let hit = false;

    this.ships.forEach(({ ship, coordinates }) => {
      coordinates.forEach((coord) => {
        if (coord[0] === coordinate[0] && coord[1] === coordinate[1]) {
          ship.hit(); // Register hit on the ship
          hit = true;
        }
      });
    });

    // record missed shots
    if (!hit) this.missedShots.push(coordinate);
  }

  // Method to check if all ships are sunk
  areAllShipsSunk() {
    return this.ships.every(({ ship }) => ship.isSunk());
  }
}

module.exports = Gameboard;
