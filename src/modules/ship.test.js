const Ship = require("./ship");

describe("Ship Class", () => {
  let ship;
  // Before each test, initialise a new ship instance

  beforeEach(() => {
    ship = new Ship(3); // Create a ship with length 3
  });

  // test cases

  test("Initial ship should not be sunk", () => {
    expect(ship.isSunk()).toBe(false);
  });

  test("Ship should be sunk after being hit equal to its length", () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test("Ship should not be sunk before being hit the same number of times as its length", () => {
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  test("Ship records hits correctly", () => {
    ship.hit();
    ship.hit();
    expect(ship.numOfHits).toBe(2);
  });

  test("should call hit method the correct number of times", () => {
    const mockShip = new Ship(3);
    const hitSpy = jest.spyOn(mockShip, "hit"); // Spy on the hit method

    mockShip.hit();
    mockShip.hit();

    expect(hitSpy).toHaveBeenCalledTimes(2); // Expect hit to be called twice
  });
});
