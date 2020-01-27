/**
 * Classe definitions
 */

/**
 * Dot : a dot to draw with main direction of next dot
 */
class Dot {
  posx = 0; // dot pos x
  posy = 0; // dot pos Y
  radius = 0; // dot radius
  dir = 0; // dot direction

  constructor(posx, posy, radius) {
    this.posx = posx;
    this.posy = posy;
    this.radius = radius;
  }

  draw() {
    fill(0);
    noStroke();
    circle(this.posx, this.posy, this.radius * 2);
  }
}

/**
 * Seed : a seed, where to start drawing a dot
 */
class Seed {
  dot;
  alive = true;

  constructor(dot) {
    this.dot = dot;
    this.alive = true;
  }
}
/**
 * Global Variables
 */
const dots = [];
const seeds = [];
let seed, lastSeed;
let maxNewPosTries;
let maxDirectionDeviationAngle;
let seedInitialRadius;

/**
 *
 */
function setup() {
  // define params constants
  maxNewPosTries = 10;
  maxDirectionDeviationAngle = QUARTER_PI / 4.0;
  seedInitialRadius = 5;

  // setup canavs
  createCanvas(windowWidth, windowHeight);
  background(255);

  // set initial seeds
  //randomSeed(1033987);

  let newSeedDot = new Dot(
    windowWidth / 2 + 50,
    windowHeight / 2,
    seedInitialRadius
  );
  newSeedDot.dir = random() * TWO_PI;
  dots.push(newSeedDot);
  newSeedDot.draw();
  let newSeed = new Seed(newSeedDot);
  seeds.push(newSeed);

  newSeedDot = new Dot(
    windowWidth / 2 - 50,
    windowHeight / 2,
    seedInitialRadius
  );
  newSeedDot.dir = random() * TWO_PI;
  dots.push(newSeedDot);
  newSeedDot.draw();
  newSeed = new Seed(newSeedDot);
  seeds.push(newSeed);

  newSeedDot = new Dot(
    windowWidth / 2,
    windowHeight / 2 - 50,
    seedInitialRadius
  );
  newSeedDot.dir = random() * TWO_PI;
  dots.push(newSeedDot);
  newSeedDot.draw();
  newSeed = new Seed(newSeedDot);
  seeds.push(newSeed);

  newSeedDot = new Dot(
    windowWidth / 2,
    windowHeight / 2 + 50,
    seedInitialRadius
  );
  newSeedDot.dir = random() * TWO_PI;
  dots.push(newSeedDot);
  newSeedDot.draw();
  newSeed = new Seed(newSeedDot);
  seeds.push(newSeed);
}

/**
 *
 */
function draw() {
  let newLocationFound = false;

  seeds.forEach((s, i) => {
    let d = s.dot;
    for (let t = 0; t < maxNewPosTries; t++) {
      // get a new dir based on previous one
      let newAngle = d.dir + randomGaussian(0, maxDirectionDeviationAngle);
      // make it a vector of lenght 2
      let newPosDiff = p5.Vector.fromAngle(newAngle, 2.0);

      let newPosX = d.posx + newPosDiff.x;
      let newPosY = d.posy + newPosDiff.y;

      if (isPosFree(newPosX, newPosY, d.radius)) {
        // limit minimum radius
        let newRadius = d.radius;
        if (newRadius > 1.5) {
          newRadius -= 0.05;
        }

        // create a new dot
        let newDot = new Dot(newPosX, newPosY, newRadius);
        newDot.draw();
        dots.push(newDot);
        s.dot = newDot;
        // check if dots are leaving canvas
        if (
          newDot.posx > windowWidth ||
          newDot.posx < 0 ||
          newDot.posy > windowHeight ||
          newDot.posy < 0
        ) {
          s.alive = false;
        }
        break;
      }
    }
  });

  // for (let t = 0; t < maxNewPosTries; t++) {
  //   // get a new dir based on previous one
  //   let newAngle =
  //     lastSeed.dot.dir + randomGaussian(0, maxDirectionDeviationAngle);
  //   // make it a vector of lenght 2
  //   let newPosDiff = p5.Vector.fromAngle(newAngle, 2.0);

  //   let newPosX = lastSeed.dot.posx + newPosDiff.x;
  //   let newPosY = lastSeed.dot.posy + newPosDiff.y;

  //   if (isPosFree(newPosX, newPosY, lastSeed.dot.radius)) {
  //     // limit minimum radius
  //     let newRadius = lastSeed.dot.radius;
  //     if (newRadius > 1.5) {
  //       newRadius -= 0.05;
  //     }

  //     // create a new dot
  //     let newDot = new Dot(newPosX, newPosY, newRadius);
  //     newDot.draw();
  //     dots.push(newDot);
  //     lastSeed.dot = newDot;
  //     // check if dots are leaving canvas
  //     if (
  //       newDot.posx > windowWidth ||
  //       newDot.posx < 0 ||
  //       newDot.posy > windowHeight ||
  //       newDot.posy < 0
  //     ) {
  //       lastSeed.alive = false;
  //     }
  //     break;
  //   }
  // }

  // If all seed are dead stop loop

  // while (!newLocationFound) {
  //   let newAngle = lastSeed.dir + randomGaussian(0, QUARTER_PI / 4.0);
  //   let newPosDiff = p5.Vector.fromAngle(newAngle, 2.0);
  //   let newPosX = lastSeed.posx + newPosDiff.x;
  //   let newPosY = lastSeed.posy + newPosDiff.y;
  //   if (isPosFree(newPosX, newPosY, lastSeed.radius)) {
  //     let newSeed = new Dot(newPosX, newPosY, lastSeed.radius - 0.05);
  //     newSeed.draw();
  //     branches.push(newSeed);
  //     lastSeed = newSeed;
  //     newLocationFound = true;
  //   } else {
  //     // check we dont loop to much
  //   }
  // }
}

/**
 *
 */
function windowResize() {
  resizeCanvas(windowWidth, windowHeight);
}

/**
 * Check is pos is free
 */
function isPosFree(x, y, radius) {
  let free = true;
  for (let d in dots) {
    let dx = x - d.posx;
    let dy = y - d.posy;
    let ns = createVector(dx, dy);
    if (ns.magSq() > radius * 2 * (radius * 2)) {
      free = false;
      break;
    }
  }
  return free;
}
