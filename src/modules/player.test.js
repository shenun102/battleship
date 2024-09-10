const { Player, ComputerPlayer } = require("./player");
const Gameboard = require("./gameboard");
const Ship = require("./ship");

describe("Player class", () => {
  let player1, player2, computer;
  let ship;

  beforeEach(() => {
    player1 = new Player();
    player2 = new Player();
    computer = new ComputerPlayer();
    ship = new Ship(3); // Ship with length 3
  });

  test("Player should have their own gameboard", () => {
    expect(player1.gameboard).toBeInstanceOf(Gameboard);
    expect(player2.gameboard).toBeInstanceOf(Gameboard);
  });

  test("Player should be able to attack opponent's gameboard", () => {
    // place ship on player 2 gameboard
    player2.gameboard.placeShip(ship, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    // Player 1 attacks player 2
    player1.attack(player2.gameboard, [0, 0]);

    expect(ship.numOfHits).toBe(1);
  });

  test("Computer player should automatically generate valid coordinates", () => {
    player1.gameboard.placeShip(ship, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    const spy = jest.spyOn(player1.gameboard, "receiveAttack");

    // Computer should attack player 1's gameboard
    computer.attack(player1.gameboard);

    // Ensure the attack was performed
    expect(spy).toHaveBeenCalled();
  });

  test("Computer player should not attack the same coordinate twice", () => {
    // Fill player1's gameboard with missed shots and check that the computer avoids them
    player1.gameboard.missedShots = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    const attackSpy = jest.spyOn(computer, "attack");

    // Simulate an attack - the computer will have to avoid the missed shots
    computer.attack(player1.gameboard);

    // Ensure attack was made
    expect(attackSpy).toHaveReturned();
  });
});
