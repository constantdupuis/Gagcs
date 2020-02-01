/**
 * Grouns class
 * 
 * You can plant branche in it
 */
class Ground
{
  branches = [];
  constructor()
  {}

  /**
   * Plant a new branche in the ground
   * 
   * @param {p5.Vector} pos - pos of the seed in the ground  
   * @param {number} dir - direction of the new seed
   * @param {number} radius - start radius of the seed
   */
  plantSeed(pos, dir, radius, shrinkRate, minRadius)
  {
   let b = new Branche(pos, dir, radius, shrinkRate, minRadius );
   b.ground = this;
   this.branches.push(b);
   return b;
  }

  /**
   * Grow all seeds/branches planted in the ground
   */
  grow()
  {
     this.branches.forEach(element => {
       if( element.growing)
       {
         let freshBud = element.sprout();
         // check if bud if not to close another banche
         for(let bi = 0; bi < this.branches.length; bi++)
         {
           let b = this.branches[bi];
           if( b.toClose(freshBud))
           {
             element.growing = false;
           }
         }

         if( element.growing )
         {
           // grow branche with freshBud
           element.grow(freshBud);

           // out of canvas, stop growing
           if( freshBud.pos.x > windowWidth-10 || freshBud.pos.x < 10 ||
            freshBud.pos.y > windowHeight-10 || freshBud.pos.y < 10)
            {
              element.growing = false;
            }
         }
       }
     });
  }
}