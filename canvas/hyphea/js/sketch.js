
/**
 * Global Variables
 */
const dots = [];
const seeds = [];
let seed, lastSeed;
let maxNewPosTries;
let maxDirectionDeviationAngle;
let seedInitialRadius;
let dotMinimalRadius;
let dotMoveFactor;

/**
 *
 */
function setup() {
  // define algo params
  maxNewPosTries = 10;
  maxDirectionDeviationAngle = QUARTER_PI / 8.0;
  seedInitialRadius = 6.0;
  dotMinimalRadius = 4.0;
  dotMoveFactor = 2.0;

  // setup canavs
  createCanvas(windowWidth, windowHeight);
  background(255);

  
  // create few values
  let horizShift = (windowWidth/2)*0.25;
  let verticalShift = (windowHeight/2)*0.25;
  let newSeedDot = new Dot(
    windowWidth / 2 + horizShift,
    windowHeight / 2,
    seedInitialRadius
  );
  newSeedDot.dir = random() * TWO_PI;
  dots.push(newSeedDot);
  newSeedDot.draw();
  let newSeed = new Seed(newSeedDot);
  seeds.push(newSeed);

  newSeedDot = new Dot(
    windowWidth / 2 - horizShift,
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
    windowHeight / 2 - verticalShift,
    seedInitialRadius
  );
  newSeedDot.dir = random() * TWO_PI;
   dots.push(newSeedDot);
  newSeedDot.draw();
  newSeed = new Seed(newSeedDot);
  seeds.push(newSeed);

  newSeedDot = new Dot(
    windowWidth / 2,
    windowHeight / 2 + verticalShift,
    seedInitialRadius
  );
  newSeedDot.dir = random() * TWO_PI;
  dots.push(newSeedDot);
  newSeedDot.draw();
  newSeed = new Seed(newSeedDot);
  seeds.push(newSeed);

  // debug log each seed
  // seeds.forEach((s, i) => {
  //   console.log(s);
  // });

}

/**
 *
 */
function draw() {
  let newLocationFound = false;

  seeds.forEach((s, i) => {
    if( !s.alive) return;
    let d = s.dot;
    for (let t = 0; t < maxNewPosTries; t++) {
      
      // make it a vector of lenght 2
      let newPosDiff = p5.Vector.fromAngle(d.dir, dotMoveFactor);
      //console.log(newPosDiff, " fom ", d.dir);

      let newPosX = d.posx + newPosDiff.x;
      let newPosY = d.posy + newPosDiff.y;

      if (isPosFree(newPosX, newPosY, d.radius)) {
        // limit minimum radius
        let newRadius = d.radius;
        if (newRadius > dotMinimalRadius) {
          newRadius -= 0.05;
        }

        // create a new dot
        let newDot = new Dot(newPosX, newPosY, newRadius);
        newDot.dir = d.dir + randomGaussian(0, maxDirectionDeviationAngle);
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

  // if all seeds are dead stop loop
  let leftAlives = seeds.reduce((acc, e) =>{ 
    //console.log(acc, e);
    if( e.alive ) acc++;
    return acc;
  }, 0);
  //console.log(`${alives} seed alive`);
  if( leftAlives == 0)
  {
    console.log("All seeds dead, stop drawing");
    noLoop();
  }

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
