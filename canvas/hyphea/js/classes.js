/**
 * Classe definitions
 */

/**
 * Dot : a dot to draw with main direction of next dot
 */
class Dot {
  pos = createVector(0, 0);
  radius = 0.0; // dot radius
  dir = 0.0; // dot direction

  constructor( pos, radius, dir)
  {
    this.pos = pos;
    this.radius = radius;
    this.dir = dir;
  }

  draw() {
    fill(0, 128);
    noStroke();
    circle(this.pos.x, this.pos.y, this.radius * 2);
  }
}

/**
 * Seed : a seed, where to start drawing a dot
 */
class Seed {
  lastDot;
  dots = []; // used as a queue
  alive = true;
  maxSeedDots = 4;

  constructor(dot) {
    this.add(dot);
    this.alive = true;
  }

  seedDot()
  {
    return this.lastDot;
  }

  die()
  {
    this.alive = false;
  }

  isDead()
  {
    return !this.alive;
  }

  isAlive()
  {
    return this.alive;
  }

  add(dot)
  {
    // set dot as last seed pos
    this.lastDot = dot;
    this.dots.push(dot);
    if( this.dots.length > this.maxSeedDots)
    {
      this.dots.shift();
    }
  }

  // check if dot passed in parameters is one of the last dot add to seed (branch)
  isNeighbour( dot )
  {
    let ret = false;
    for( let i =0; i < this.dots.length; i++)
    {
      if( dot === this.dots[i])
      {
        ret = true;
        break;
      }
    }
    return ret;
  }
}