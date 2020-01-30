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


/**
 * Branche, that sprout buds to grow, but two branches cannot collide
 * @class
 */
class Branche{
  rootPos = createVector(0,0);
  startDir = random(0.0, TWO_PI);
  startRadius = 10.0;
  lastBud = null;
  lastBuds = [];
  buds = [];

  lastBudsCount = 4;

  dirDeviation = QUARTER_PI / 8.0;
  newBudMaxGrowDist = 2.0;
  budMinRadius = 5.0;
  budShrinkRate = 0.995;

  constructor( rootPos, startDir, startRadius)
  {
    this.rootPos = rootPos;
    this.startDir = startDir;
    this.startRadius = startRadius;
  }

  log(){
    console.log(`Branche pos[${this.rootPos}] dir[${this.startDir}] radius[${this.startRadius}]`);
  }

  /**
   * create a new bud, but don't add it to the branch yet
   * we have to check it wont collide with another branches
   */
  sprout()
  {
    let ret;

    // this the first bud
    // start at root pos, direction and radius
    if( this.lastBud == null)
    {
      // set new params based on root
      let newDir = this.startDir + randomGaussian(0, this.dirDeviation);
      let newPos = p5.Vector.add( this.rootPos, p5.Vector.fromAngle(newDir, this.newBudMaxGrowDist) );

      ret = new Bud(newPos, newDir, this.startRadius);
    }
    else // this not first bud
    {
      // set new params base on previous bud
      let newDir = this.lastBud.dir + randomGaussian(0, this.dirDeviation);
      let newPos = p5.Vector.add(  this.lastBud.pos, p5.Vector.fromAngle(newDir, this.newBudMaxGrowDist) );

      // shrink radius but not bellow minimum
      let newRadius = this.lastBud.radius*this.budShrinkRate;
      if( newRadius < this.budMinRadius) newRadius = this.budMinRadius;

      ret = new Bud(newPos, newDir, newRadius);
    }
    // set this branche as parent of the bud
    ret.branche = this;

    return ret;
  }

  /**
   * Grow the branch with a bud created earlier (from the same branche) using newBud
   * @param {Bud} bud Bud to add to grow the branch, the Bud should have been created from this branche 
   */
  grow( bud )
  {
    if( bud.branche !== this)
    {
      console.log("Try to add a bud from another branch !");
      return;
    }
    bud.draw();

    if( this.lastBud == null)
    { 
      this.lastBud = bud;
      this.lastBuds.push(bud);
      if( this.lastBuds.length > this.lastBudsCount)
      {
        let tmp = this.lastBuds.shift();
        this.buds.push(tmp);
      }
    }
    else
    {
      this.lastBuds.push(this.lastBud);
      this.lastBud = bud;
      if( this.lastBuds.length > this.lastBudsCount)
      {
        let tmp = this.lastBuds.shift();
        this.buds.push(tmp);
      }
    }
  }

  
}
/**
 * Dub, spouted out a branche, and ready to gro the branch
 * @class
 */
class Bud{
  branche = null;
  pos = createVector(0,0);
  dir = 0.0;
  radius = 0.0;

  constructor(pos, dir, radius)
  {
    this.pos = pos;
    this.dir = dir;
    this.radius = radius;
  }

  log()
  {
    console.log(`Bud pos[${this.pos}] dir[${this.dir}] radius[${this.radius}]`);
  }

  draw()
  {
    fill(0);
    noStroke();
    circle(this.pos.x, this.pos.y, this.radius * 2);
  }
}