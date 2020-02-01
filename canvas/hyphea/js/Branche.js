/**
 * Branche, that sprout buds to grow, but two branches cannot collide
 * @class
 */
class Branche{
  ground;
  parentBranch = null;
  rootPos = createVector(0,0);
  startDir = random(0.0, TWO_PI);
  startRadius = 10.0;
  lastBud = null;
  newBuds = [];
  oldBuds = [];

  growing = true;

  lastBudsCount = 20;

  dirDeviation = QUARTER_PI / 4.0;
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
      this.newBuds.push(bud);
      if( this.newBuds.length > this.lastBudsCount)
      {
        let tmp = this.newBuds.shift();
        this.oldBuds.push(tmp);
      }
    }
    else
    {
      this.newBuds.push(this.lastBud);
      this.lastBud = bud;
      if( this.newBuds.length > this.lastBudsCount)
      {
        let tmp = this.newBuds.shift();
        this.oldBuds.push(tmp);
      }
    }
  }

  /**
   * Check if a Bud is not to close from this branche
   * 
   * @param {Bud} bud Bud to check if it's not to close 
   */
  toClose( bud )
  {
    // if sprout is not from this branche compare distance from newBuds also
    // if sprout is from this branche, distance from new buds might be to short 
    // and avoid growing
    if( bud.branche !== this)
    {
      if( this.distanceTreshold(bud, this.newBuds, 20.0) )
      {
        console.log("bud to close to newBuds");
        return true;
      }  
    }

    // compare distance to oldBuds
    if( this.distanceTreshold(bud, this.oldBuds, 20.0) )
    {
      console.log("bud to close to oldBuds");
      return true;
    } 

    return false;
  }

  /**
   * Return true if the distance beteen bud and one of the bud in buds is bellow or equal to treshold
   * 
   * @param {Bud} bud 
   */
  distanceTreshold( bud, buds, treshold )
  {
    for( let bi = 0; bi < buds.length; bi++)
    {
      let d = p5.Vector.dist(bud.pos, buds[bi].pos);
      if( d <= treshold)
      {
        return true;
      }
    }

    return false;
  }
  
}