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
    fill(82, 86, 53);
    noStroke();
    circle(this.pos.x, this.pos.y, this.radius * 2);
  }
}