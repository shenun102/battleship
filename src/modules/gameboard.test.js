const Gameboard = require("./gameboard");
const Ship = require("./ship");

describe("Gameboard class", () => {
  let gameboard;
  let ship1, ship2;

  beforeEach(() => {
    gameboard = new Gameboard();
    ship1 = new Ship(3);
    ship2 = new Ship(2);
  });

  // Test cases
  test("Should be able to place ships at specific coordiantes", () => {
    gameboard.placeShip(ship1, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(gameboard.ships.length).toBe(1); // Ship was placed
    expect(gameboard.ships[0].coordinates).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });

  test("Should record hits correctly when an attack hits a ship", () => {
    gameboard.placeShip(ship1, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    gameboard.receiveAttack([0, 0]);
    expect(ship1.numOfHits).toBe(1);
  });

  test("Should record missed attacks", () => {
    gameboard.placeShip(ship1, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    gameboard.receiveAttack([0, 3]);
    expect(gameboard.missedShots.length).toBe(1);
    expect(gameboard.missedShots).toContainEqual([0, 3]);
  });

  test("Should report when all ships have been sunk", () => {
    // Add two ships
    gameboard.placeShip(ship1, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    gameboard.placeShip(ship2, [
      [1, 0],
      [1, 1],
    ]);

    // Sinking both ships
    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([0, 1]);
    gameboard.receiveAttack([0, 2]);

    gameboard.receiveAttack([1, 0]);
    gameboard.receiveAttack([1, 1]);

    expect(gameboard.areAllShipsSunk()).toBe(true);
  });

  test("Should not report all ships sunk if some ships are still afloat", () => {
    // Add two ships
    gameboard.placeShip(ship1, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    gameboard.placeShip(ship2, [
      [1, 0],
      [1, 1],
    ]);
    // Sinking one ship
    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([0, 1]);
    gameboard.receiveAttack([0, 2]);

    expect(gameboard.areAllShipsSunk()).toBe(false);
  });
});
