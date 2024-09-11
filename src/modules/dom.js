export function createPlayerGrid(player, playerId) {
  const mainContainer = document.querySelector("#main-container");
  const contentTop = document.querySelector(".content-top");
  const contentBot = document.querySelector(".content-bot");
  // Create grid
  const gridContainer = createElement("div", [
    "grid-container",
    `player-${playerId}-grid-js`,
  ]);

  // Player heading
  const playerHeading = createElement(
    "div",
    ["player-heading", "player-heading-js"],
    `Player ${playerId}`
  );
  playerHeading.style.fontSize = "2rem";
  playerHeading.style.fontWeight = "bold";

  // Create grid cells for 10x10 grid
  const gridCellsContainer = createElement("div", [
    "grid-cells-container",
    `grid-cells-container-${playerId}-js`,
  ]);

  // Create grid labels row and column
  const gridRowLabel = createElement("div", [
    "grid-row-label",
    "grid-row-label-js",
  ]);

  const gridColumnLabel = createElement("div", [
    "grid-column-label",
    "grid-column-label-js",
  ]);

  // Create labels content
  const label = "0 1 2 3 4 5 6 7 8 9".split(" ");

  for (let i = 0; i < 10; i++) {
    gridRowLabel.appendChild(
      createElement("div", ["grid-label-cell"], label[i])
    );

    gridColumnLabel.appendChild(
      createElement("div", ["grid-label-cell"], label[i])
    );
  }

  gridCellsContainer.append(gridRowLabel, gridColumnLabel);

  // Create grid cells

  for (let i = 0; i < 100; i++) {
    const cellElement = createElement("div", [
      "grid-cell",
      `player-${playerId}-grid-cell-js`,
    ]);
    const row = String(Math.floor(i / 10));
    const col = String(i % 10);
    cellElement.dataset.coordinates = `${row}${col}`;
    gridCellsContainer.appendChild(cellElement);
  }

  // Render the ships
  // For each ship
  player.gameboard.ships.forEach((ship) => {
    // For all the coordinates of each ship
    ship.coordinates.forEach((coord) => {
      const coordinate = coord.join("");
      const shipCell = gridCellsContainer.querySelector(
        `[data-coordinates="${coordinate}"]`
      );
      if (playerId == 1) shipCell.style.backgroundColor = "red";
    });
  });

  gridContainer.append(playerHeading, gridCellsContainer);
  contentBot.append(gridContainer);
}

// Function to rendershots, misses and hits

export function renderShot(playerId, targetShot, player) {
  const gridContainer = document.querySelector(`.player-${playerId}-grid-js`);

  // Handle missed shots by graying out the cells
  player.gameboard.missedShots.forEach((missCoord) => {
    const targetCell = gridContainer.querySelector(
      `[data-coordinates="${missCoord.join("")}"]`
    );
    if (targetCell) {
      targetCell.style.backgroundColor = "grey";
    }
  });

  // Handle hit shots
  const targetCoord = targetShot.dataset.coordinates
    .split("")
    .map((num) => parseInt(num));

  player.gameboard.ships.forEach((ship) => {
    ship.coordinates.forEach((shipCoord) => {
      if (shipCoord[0] === targetCoord[0] && shipCoord[1] === targetCoord[1]) {
        targetShot.textContent = "X";
        targetShot.style.backgroundColor = "red";
        targetShot.classList.add("hit");
      }
    });
  });
}

// Helper function to create elements

function createElement(tag = "div", classNames = [""], content = "") {
  const newElement = document.createElement(tag);
  classNames.forEach((className) => newElement.classList.add(className));
  newElement.textContent = content;
  return newElement;
}
