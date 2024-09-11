import { Ship } from "./ship";

// Helper function to place ships
export function placeShips(player, shipLength, shipCoords) {
  const ship = new Ship(shipLength);
  player.gameboard.placeShip(ship, shipCoords); // Add ship and coordinates to the gameboard
}

// Automatically places ships randomly for the player (used for Computer player)
export function autoPlaceShips(player, numOfShips) {
  const shipLengths = [5, 4, 3, 3, 2]; // Example ship lengths (like in Battleship)
  let shipsPlaced = 0;

  while (shipsPlaced < numOfShips) {
    const shipLength = shipLengths[shipsPlaced]; // Get the current ship length
    const orientation = Math.random() > 0.5 ? "horizontal" : "vertical"; // Randomly choose orientation
    const coordinates = generateValidCoordinates(
      player,
      shipLength,
      orientation
    ); // Generate valid coordinates

    if (coordinates) {
      // If valid coordinates are found, place the ship
      placeShips(player, shipLength, coordinates);
      shipsPlaced++;
    }
  }
}

// Function to generate valid coordinates for ship placement
function generateValidCoordinates(player, shipLength, orientation) {
  const maxCoord = 9; // Assuming a 10x10 grid
  let shipCoords = [];
  let isValidPlacement = false;

  while (!isValidPlacement) {
    shipCoords = []; // Reset ship coordinates

    // Generate random starting coordinate
    const startRow = Math.floor(Math.random() * (maxCoord + 1));
    const startCol = Math.floor(Math.random() * (maxCoord + 1));

    if (orientation === "horizontal") {
      // Check if the ship fits horizontally within the board
      if (startCol + shipLength <= maxCoord + 1) {
        for (let i = 0; i < shipLength; i++) {
          shipCoords.push([startRow, startCol + i]);
        }
      }
    } else {
      // Check if the ship fits vertically within the board
      if (startRow + shipLength <= maxCoord + 1) {
        for (let i = 0; i < shipLength; i++) {
          shipCoords.push([startRow + i, startCol]);
        }
      }
    }

    // Validate that the generated coordinates don't overlap with existing ships
    if (isValidShipPlacement(player, shipCoords)) {
      isValidPlacement = true; // If valid, use these coordinates
    }
  }

  return shipCoords;
}

// Function to check if the generated coordinates are valid (i.e., no overlap with existing ships)
function isValidShipPlacement(player, shipCoords) {
  const existingShips = player.gameboard.ships;

  for (let coord of shipCoords) {
    const [row, col] = coord;

    // Check if any existing ship occupies these coordinates
    for (let { coordinates: shipCoordinates } of existingShips) {
      if (
        shipCoordinates.some(
          ([shipRow, shipCol]) => shipRow === row && shipCol === col
        )
      ) {
        return false; // Overlap found
      }
    }
  }

  return true; // No overlap, valid placement
}
