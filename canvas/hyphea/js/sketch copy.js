
/**
 * Global Variables
 */
const dots = [];
const seeds = [];

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
  let shift = (windowHeight/2)*0.25;

  let newSeedDot = new Dot(
    createVector(windowWidth / 2 + shift, windowHeight / 2),
    seedInitialRadius,
    random() * TWO_PI
  );
  dots.push(newSeedDot);
  newSeedDot.draw();

  let newSeed = new Seed(newSeedDot);
  seeds.push(newSeed);

    
  newSeedDot = new Dot(
    createVector(windowWidth / 2 - shift, windowHeight / 2),
    seedInitialRadius,
    random() * TWO_PI
  );
  dots.push(newSeedDot);
  newSeedDot.draw();
  
  newSeed = new Seed(newSeedDot);
  seeds.push(newSeed);

  newSeedDot = new Dot(
    createVector(windowWidth / 2, windowHeight / 2 - shift),
    seedInitialRadius,
    random() * TWO_PI
  );
  dots.push(newSeedDot);
  newSeedDot.draw();
  
  newSeed = new Seed(newSeedDot);
  seeds.push(newSeed);

  newSeedDot = new Dot(
    createVector(windowWidth / 2, windowHeight / 2 + shift),
    seedInitialRadius,
    random() * TWO_PI
  );
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

    if( s.isDead()) return;
    
    let d = s.seedDot();

    // limit minimum radius
    let newRadius = d.radius;
    if (newRadius > dotMinimalRadius) {
      newRadius -= 0.01;
    }
      
    // create new pos
    let candidatePos = p5.Vector.add(d.pos, p5.Vector.fromAngle(d.dir, dotMoveFactor));
    //console.log(newPosDiff, " fom ", d.dir);
    // create candidate dot
    let candidateDot = new Dot( candidatePos, 
        newRadius, 
        d.dir + randomGaussian(0, maxDirectionDeviationAngle));

    // check if it fit-in
    if (isPosFree(s, candidateDot)) {
      
      candidateDot.draw();
      dots.push(candidateDot);
      s.add(candidateDot);
      // check if dots are leaving canvas
      if (
        candidateDot.posx > windowWidth ||
        candidateDot.posx < 0 ||
        candidateDot.posy > windowHeight ||
        candidateDot.posy < 0
      ) {
        s.alive = false;
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
 * Check if pos is free
 */
function isPosFree(currentSeed, candidateDot) {
  
  let free = true;
  let currentDot = currentSeed.seedDot();

  for (let d in dots) {
    if(!currentSeed.isNeighbour(d))
    {
      let delta = p5.Vector.sub(candidateDot.pos, currentDot.pos);
      let treshold = ((candidateDot.radius + currentDot.radius)*2) * ((candidateDot.radius + currentDot.radius)*2);

      if (delta.mag() < 3) {
        free = false;
        break;
      }
    }
  }
  return free;
}
