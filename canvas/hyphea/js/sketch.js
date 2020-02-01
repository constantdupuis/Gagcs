
/**
 * Global Variables
 */
let ground;

/**
 *
 */
function setup() {

 createCanvas(windowWidth, windowHeight);
 background(55, 36, 58);
 ground = new Ground();
 let shift = windowHeight * 0.10;
 ground.plantSeed(createVector(windowWidth/2.0+shift, windowHeight/2.0), random() * TWO_PI, 4.0, 0.995, 1.0 );
 ground.plantSeed(createVector(windowWidth/2.0-shift, windowHeight/2.0), random() * TWO_PI, 5.0, 0.995, 5.0 );
 ground.plantSeed(createVector(windowWidth/2.0, windowHeight/2.0+shift), random() * TWO_PI, 5.0, 0.995, 3.0 );
 ground.plantSeed(createVector(windowWidth/2.0, windowHeight/2.0-shift), random() * TWO_PI, 5.0, 0.995, 4.0 );

}

/**
 *
 */
function draw() {

  ground.grow();

}
