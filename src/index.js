import "./style.css";

import { createPlayerGrid, renderShot } from "./modules/dom";
import { ComputerPlayer, Player } from "./modules/player";
import { Gameboard } from "./modules/gameboard";
import { Ship } from "./modules/ship";

// Create players

const playerOne = new Player();
// const playerTwo = new Player();
const playerTwo = new ComputerPlayer();

// populate each player’s Gameboard with predetermined coordinates.

// Helper function to place ships
function placeShips(player, shipLength, shipCoords) {
  const ship = new Ship(shipLength);
  player.gameboard.placeShip(ship, shipCoords);
}

placeShips(playerOne, 3, [
  [0, 0],
  [0, 1],
  [0, 2],
]);

placeShips(playerOne, 3, [
  [7, 5],
  [7, 6],
  [7, 7],
]);

placeShips(playerTwo, 3, [
  [2, 0],
  [2, 1],
  [2, 2],
]);

placeShips(playerTwo, 3, [
  [4, 0],
  [5, 0],
  [6, 0],
]);

console.log(playerOne, playerTwo);

// render each player’s Gameboard

createPlayerGrid(playerOne, 1);
createPlayerGrid(playerTwo, 2);

// Your event listeners should step through the game turn by turn using only methods from other objects. If at any point you are tempted to write a new function, step back and figure out which class or module that function should belong to.

// For attacks, let the user click on a coordinate in the enemy Gameboard. Send the user input to methods on your objects, and re-render the boards to display the new information.

const gridContainer1 = document.querySelector(".grid-cells-container-1-js");
const gridContainer2 = document.querySelector(".grid-cells-container-2-js");

// Start with player 1's turn
let player = 1;

function handleClick(e) {
  if (!e.target.classList.contains("grid-cell")) return;
  const targetCoord = e.target.dataset.coordinates
    .split("")
    .map((item) => parseInt(item, 10));

  if (player === 1) {
    // Check if Player 1 has sunk all ships
    const isGameOver = playerTwo.gameboard.areAllShipsSunk();
    if (isGameOver) {
      console.log("Player 1 wins! Game is over!");
      return;
    }

    // Player 1 attacks Player 2's grid
    playerOne.attack(playerTwo.gameboard, targetCoord);
    renderShot(2, e.target, playerTwo);

    // Change to Player 2's turn (computer)
    player = 2;
    toggleActiveGrid();

    // Computer player automatically attacks Player 1
    setTimeout(() => {
      const isGameOver = playerOne.gameboard.areAllShipsSunk();
      if (isGameOver) {
        console.log("Computer wins! Game is over!");
        return;
      }

      // Computer attacks

      const randomCoord = playerTwo.attack(playerOne.gameboard);
      console.log("I attacked this coordinate", randomCoord);

      const player1Grid = gridContainer1.querySelector(
        `[data-coordinates="${randomCoord.join("")}"]`
      );
      renderShot(1, player1Grid, playerOne);

      // Change to Player 1's turn
      player = 1;
      toggleActiveGrid();

      // Log for debugging
      // errorHandlingLogs(playerOne);
    }, 500); // Delay to simulate the computer thinking
  }
}

// Initially only Player 2's grid is clickable because it's Player 1's turn to attack Player 2
function toggleActiveGrid() {
  if (player === 1) {
    // Disable Player 2's grid, enable Player 1's grid
    gridContainer1.removeEventListener("click", handleClick);
    gridContainer2.addEventListener("click", handleClick);
  } else {
    // Disable Player 1's grid, enable Player 2's grid
    gridContainer2.removeEventListener("click", handleClick);
    gridContainer1.addEventListener("click", handleClick);
  }
}

// Initialize by setting the correct grid as clickable when game start button is clicked
toggleActiveGrid();

function errorHandlingLogs(player) {
  console.log("--", player);
  console.log(
    `Array of missed shots coordinates`,
    player.gameboard.missedShots
  );
  console.log(`object of ships,`, player.gameboard.ships);
  console.log(`Is ship sunk?`, player.gameboard.ships[0].ship.isSunk());
  console.log(`Are all ships sunk?`, player.gameboard.areAllShipsSunk());
}

// The game is played against the computer, so make the ‘computer’ players capable of making random plays. The computer does not have to be smart, but it should know whether or not a given move is legal (i.e. it shouldn’t shoot the same coordinate twice).
// Create conditions so that the game ends once one player’s ships have all been sunk. This function is also appropriate for this module.
// Finish it up by implementing a system that allows players to place their ships. For example, you can let them type coordinates for each ship or have a button to cycle through random placements.
