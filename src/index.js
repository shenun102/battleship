import "./style.css";

import { createPlayerGrid, renderShot } from "./modules/dom";
import { ComputerPlayer, Player } from "./modules/player";
import { Gameboard } from "./modules/gameboard";
import { Ship } from "./modules/ship";

// Create players

// Import your classes/factories into another file, and drive the game using event listeners to interact with your objects. Create a module that helps you manage actions that should happen in the DOM.

// At this point it is appropriate to begin crafting your User Interface.

// Set up a new game by creating Players.
const playerOne = new Player();
const playerTwo = new Player();
const computer = new ComputerPlayer();

// For now just populate each player’s Gameboard with predetermined coordinates. You are going to implement a system for allowing players to place their ships later.

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

console.log(playerOne, playerTwo);

// We’ll leave the HTML implementation up to you for now, but you should display both the player’s boards and render them using information from the Gameboard class/factory.
// You’ll need methods to render each player’s Gameboard, so put them in an appropriate module.

createPlayerGrid(playerOne, 1);
createPlayerGrid(playerTwo, 2);

// Your event listeners should step through the game turn by turn using only methods from other objects. If at any point you are tempted to write a new function, step back and figure out which class or module that function should belong to.

// For attacks, let the user click on a coordinate in the enemy Gameboard. Send the user input to methods on your objects, and re-render the boards to display the new information.

const gridContainer = document.querySelector(".grid-cells-container-1-js");
const gridContainer2 = document.querySelector(".grid-cells-container-2-js");

gridContainer2.addEventListener("click", handleClick);

function handleClick(e) {
  if (!e.target.classList.contains("grid-cell")) return;
  const targetCoord = e.target.dataset.coordinates
    .split("")
    .map((item) => parseInt(item, 10));
  console.log(targetCoord);
  playerOne.attack(playerTwo.gameboard, targetCoord);

  renderShot(2, e.target, playerTwo);

  // Logs for debugging
  console.log(
    `Array of missed shots coordinates`,
    playerTwo.gameboard.missedShots
  );
  console.log(`object of ships,`, playerTwo.gameboard.ships);
  console.log(`Is ship sunk?`, playerTwo.gameboard.ships[0].ship.isSunk());
  console.log(`Are all ships sunk?`, playerTwo.gameboard.areAllShipsSunk())
}

// Players should take turns playing the game by attacking the enemy Gameboard. If you feel the need to keep track of the current player’s turn, it’s appropriate to manage that in this module, instead of another mentioned object.
// The game is played against the computer, so make the ‘computer’ players capable of making random plays. The computer does not have to be smart, but it should know whether or not a given move is legal (i.e. it shouldn’t shoot the same coordinate twice).
// Create conditions so that the game ends once one player’s ships have all been sunk. This function is also appropriate for this module.
// Finish it up by implementing a system that allows players to place their ships. For example, you can let them type coordinates for each ship or have a button to cycle through random placements.
