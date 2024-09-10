export class Ship {
  constructor(length, numOfHits = 0) {
    this.length = length;
    this.numOfHits = numOfHits;
  }

  hit() {
    if (this.numOfHits === this.length) {
      console.log("Ship has already been destroyed!");
      return;
    }
    this.numOfHits++;
  }

  isSunk() {
    if (this.length - this.numOfHits === 0) {
      return true;
    } else return false;
  }
}

// module.exports = Ship;
