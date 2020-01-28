/**
 * Classe definitions
 */

/**
 * Dot : a dot to draw with main direction of next dot
 */
class Dot {
  posx = 0.0; // dot pos x
  posy = 0.0; // dot pos Y
  radius = 0.0; // dot radius
  dir = 0.0; // dot direction

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