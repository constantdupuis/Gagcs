
/**
 * Global Variables
 */
let branche;

/**
 *
 */
function setup() {
 createCanvas(windowWidth, windowHeight);
 background(255);
 branche = new Branche(createVector( windowWidth/2.0, windowHeight/2.0), random() * TWO_PI, 10.0);
 //branche.log();
}

/**
 *
 */
function draw() {
  let freshBud = branche.sprout();
  //newBud.log();
  branche.grow(freshBud);
}
