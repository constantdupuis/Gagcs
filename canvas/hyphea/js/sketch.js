
/**
 * Global Variables
 */
let ground;

/**
 *
 */
function setup() {

 createCanvas(windowWidth, windowHeight);
 background(255);
 ground = new Ground();
 let shift = windowHeight * 0.10;
 ground.plantSeed(createVector(windowWidth/2.0+shift, windowHeight/2.0), random() * TWO_PI, 5.0);
 ground.plantSeed(createVector(windowWidth/2.0-shift, windowHeight/2.0), random() * TWO_PI, 5.0);
 ground.plantSeed(createVector(windowWidth/2.0, windowHeight/2.0+shift), random() * TWO_PI, 5.0);
 ground.plantSeed(createVector(windowWidth/2.0, windowHeight/2.0-shift), random() * TWO_PI, 5.0);

}

/**
 *
 */
function draw() {

  ground.grow();

}
