import { Ship } from "./ship";

export class Gameboard {
  constructor() {
    this.board = []; // Storing ships and their positions
    this.missedShots = []; // To store coordinates of missed attacks
    this.ships = []; // Keep track of ships on board
    this.hitShots = []; // To store coordinates of successful hits
  }

  // Method to place ships at specific coordinates
  placeShip(ship, coordinates) {
    // Store ship with its coordinates
    this.ships.push({ ship, coordinates });
  }

  // Method to receive an attack at a specific coordinate
  receiveAttack(coordinate) {
    // Check if the attack hits the ship
    let hit = false;

    // Check if the coordinate has already been hit before
    if (this.hitShots.some(hitCoord => hitCoord[0] === coordinate[0] && hitCoord[1] === coordinate[1])) {
      return; // If already hit, don't increment the hit counter or log this coordinate again
    }

    this.ships.forEach(({ ship, coordinates }) => {
      coordinates.forEach((coord) => {
        if (coord[0] === coordinate[0] && coord[1] === coordinate[1]) {
          ship.hit(); // Register hit on the ship
          hit = true;
          this.hitShots.push(coordinate); // Store the successful hit coordinate
        }
      });
    });

    // Record missed shots
    if (!hit) {
      this.missedShots.push(coordinate);
    }
  }

  // Method to check if all ships are sunk
  areAllShipsSunk() {
    return this.ships.every(({ ship }) => ship.isSunk());
  }
}
