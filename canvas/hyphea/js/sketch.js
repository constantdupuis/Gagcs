
/**
 * Global Variables
 */
let branche;

/**
 *
 */
function setup() {
 branche = new Branche(createVector( windowWidth/2.0, windowHeight/2.0), random() * TWO_PI, 10.0);
 branche.log();
}

/**
 *
 */
function draw() {
  let newBud = branche.newBud();
  newBud.log();
  branche.grow(newBud);
}
