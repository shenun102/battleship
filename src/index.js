import "./style.css";

import { createPlayerGrid, renderShot } from "./modules/dom";
import { ComputerPlayer, Player } from "./modules/player";
import { Gameboard } from "./modules/gameboard";
import { Ship } from "./modules/ship";
import { placeShips, autoPlaceShips } from "./modules/place-ships";

// Create players
const playerOne = new Player();
const playerTwo = new ComputerPlayer();

// Start game btn
let isPlacingShip = false;

const placeShipContainer = document.querySelector(".place-ship-container-js");
placeShipContainer.addEventListener("click", function (e) {
  if (!e.target.classList.contains("submit-btn-js")) return;

  // Get the number of ships input
  const shipAmountInput = document.querySelector("#ship-amount");
  let numOfShips = parseInt(shipAmountInput.value, 10);
  if (!numOfShips || numOfShips <= 0) return;

  // Hide number of ships input
  document.querySelector(".submit-btn-js").style.display = "none";
  shipAmountInput.style.display = "none";
  // Show ship length input
  const submitLengthBtn = document.querySelector(".length-btn-js");
  submitLengthBtn.style.display = "inline";
  const shipLengthInput = document.querySelector("#ship-length");
  shipLengthInput.style.display = "inline";

  console.log(numOfShips, "Ships to place");

  // Track number of ships placed
  let shipsPlaced = 0;
  let currentShipCoords = [];
  let clickCounter = 0;
  let shipLength = 0;

  // Listen for ship length submission
  submitLengthBtn.addEventListener("click", function (e) {
    // Check if all ships have been placed
    if (shipsPlaced >= numOfShips) {
      console.log("All ships have been placed!");
      return;
    }

    // Get the ship length
    shipLength = parseInt(shipLengthInput.value, 10);
    if (!shipLength || shipLength <= 0) return;
    console.log(`Placing ship of length ${shipLength}`);

    // Reset state for placing the new ship
    currentShipCoords = [];
    clickCounter = 0;
    isPlacingShip = true;
  });

  // Listen for player grid selections
  const player1GridContainer = document.querySelector(".player-1-grid-js");

  function gridClickHandler(e) {
    if (!isPlacingShip || shipsPlaced >= numOfShips) return;
    if (!e.target.classList.contains("grid-cell")) return;

    // Get clicked cell's coordinates
    const shipCoords = e.target.dataset.coordinates
      .split("")
      .map((num) => parseInt(num, 10));

    // Prevent selecting the same cell multiple times
    if (
      currentShipCoords.some(
        (coord) => coord[0] === shipCoords[0] && coord[1] === shipCoords[1]
      )
    ) {
      console.log("This cell is already selected!");
      return;
    }

    // Check if the ship placement is valid (overlaps or alignment)
    if (!isValidShipPlacement(currentShipCoords, shipCoords, shipLength)) {
      console.log(
        "Invalid placement: Overlaps existing ships or incorrect alignment!"
      );
      return;
    }

    // Add coordinates to ship placement
    clickCounter++;
    currentShipCoords.push(shipCoords);
    e.target.style.backgroundColor = "blue"; // Visual cue

    // Check if enough cells have been selected
    if (clickCounter >= shipLength) {
      console.log("Finished placing the ship!");

      // Place ship using the placeShips function
      placeShips(playerOne, shipLength, currentShipCoords);
      shipsPlaced++;
      console.log(`Ships placed: ${shipsPlaced}/${numOfShips}`);

      // Reset the state for the next ship
      isPlacingShip = false;
      clickCounter = 0;
      currentShipCoords = [];

      // If all ships have been placed, disable further input
      if (shipsPlaced >= numOfShips) {
        console.log("All ships placed successfully!");
        shipLengthInput.style.display = "none";
        submitLengthBtn.style.display = "none";
        return;
      }

      // Allow the user to input the length for the next ship
      shipLengthInput.value = "";
    }
  }

  player1GridContainer.addEventListener("click", gridClickHandler);
});

// Function to check if the ship placement is valid
function isValidShipPlacement(currentCoords, newCoord, shipLength) {
  const [newRow, newCol] = newCoord;

  // Check if the ship overlaps with existing ships on the player's gameboard
  const existingShips = playerOne.gameboard.ships;
  for (let { coordinates: shipCoordinates } of existingShips) {
    if (
      shipCoordinates.some(([row, col]) => row === newRow && col === newCol)
    ) {
      return false; // Overlap found
    }
  }

  // Ensure ship placement fits the selected length and alignment
  if (currentCoords.length > 0) {
    // Calculate if the ship is aligned horizontally or vertically
    const [prevRow, prevCol] = currentCoords[currentCoords.length - 1];

    // Horizontal alignment: same row, consecutive columns
    if (prevRow === newRow && Math.abs(prevCol - newCol) === 1) {
      return true;
    }

    // Vertical alignment: same column, consecutive rows
    if (prevCol === newCol && Math.abs(prevRow - newRow) === 1) {
      return true;
    }

    return false; // Invalid alignment (non-contiguous or diagonal)
  }

  // For the first coordinate, it's always valid
  return true;
}

// Other game logic remains the same...

console.log(playerOne, playerTwo);

createPlayerGrid(playerOne, 1);
createPlayerGrid(playerTwo, 2);

// Game start logic
document.querySelector(".start-btn-js").addEventListener("click", function (e) {
  e.target.style.display = "none"; // Hide start button

  //
  autoPlaceShips(playerTwo, 5);

  // Clear and render each player’s Gameboard
  document.querySelector(".content-bot").innerHTML = "";
  createPlayerGrid(playerOne, 1);
  createPlayerGrid(playerTwo, 2);

  // Now that grids are rendered, select the correct containers
  const gridContainer1 = document.querySelector(".grid-cells-container-1-js");
  const gridContainer2 = document.querySelector(".grid-cells-container-2-js");

  // Start the game loop with player 1's turn
  toggleActiveGrid(gridContainer1, gridContainer2); // Activate Player 1's grid
});

// Function to handle player turn click events
function handleClick(e, gridContainer1, gridContainer2) {
  if (!e.target.classList.contains("grid-cell")) return;

  const targetCoord = e.target.dataset.coordinates
    .split("")
    .map((item) => parseInt(item, 10));

  if (player === 1) {
    // Player 1's turn - attack Player 2's grid
    const isGameOver = playerTwo.gameboard.areAllShipsSunk();
    if (isGameOver) {
      // console.log("Player 1 wins! Game is over!");
      return;
    }

    playerOne.attack(playerTwo.gameboard, targetCoord);
    renderShot(2, e.target, playerTwo);

    // Switch to Player 2's (computer) turn
    player = 2;
    toggleActiveGrid(gridContainer1, gridContainer2); // Switch to Player 2 grid

    setTimeout(() => {
      const isGameOver = playerOne.gameboard.areAllShipsSunk();
      if (isGameOver) {
        console.log("Computer wins! Game is over!");
        return;
      }

      // Computer attacks a random coordinate
      const randomCoord = playerTwo.attack(playerOne.gameboard);
      const player1Grid = gridContainer1.querySelector(
        `[data-coordinates="${randomCoord.join("")}"]`
      );
      renderShot(1, player1Grid, playerOne);

      // Switch back to Player 1's turn
      player = 1;
      toggleActiveGrid(gridContainer1, gridContainer2);
    }, 500); // Simulate delay for computer thinking
  }
}

// This function toggles which grid is active and clickable
function toggleActiveGrid(gridContainer1, gridContainer2) {
  if (player === 2) {
    gridContainer2.removeEventListener("click", handleClick); // Disable Player 2's grid
    gridContainer1.addEventListener("click", (e) =>
      handleClick(e, gridContainer1, gridContainer2)
    ); // Enable Player 1's grid
  } else {
    gridContainer1.removeEventListener("click", handleClick); // Disable Player 1's grid
    gridContainer2.addEventListener("click", (e) =>
      handleClick(e, gridContainer1, gridContainer2)
    ); // Enable Player 2's grid
  }
}

// Initially, start with player 1's turn
let player = 1;
