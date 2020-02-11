var Branch = (function () {
    function Branch(qtree, fences, posx, posy, dir, life, branchingFreq, branchingLifeFactor) {
        this.parentBranch = null;
        this.rootParticle = null;
        this.lastParticle = null;
        this.qtree = null;
        this.fences = null;
        this.buds = [];
        this.childBranches = [];
        this.timeToLive = 100;
        this.currentLife = 0;
        this.growing = true;
        this.branchingFreq = 0;
        this.branchingLifeFactor = 0.5;
        this.qtree = qtree;
        this.fences = fences;
        this.timeToLive = life;
        this.currentLife = 0;
        this.branchingFreq = branchingFreq;
        this.branchingLifeFactor = branchingLifeFactor;
        this.rootParticle = new Bud(posx, posy, dir, this);
        this.lastParticle = null;
        this.qtree.insert(this.rootParticle);
        this.buds.push(this.rootParticle);
        drawParticle(this.rootParticle);
    }
    Branch.prototype.grow = function () {
        var _this = this;
        this.childBranches.forEach(function (b) { return b.grow(); });
        if (this.currentLife > this.timeToLive) {
            this.growing = false;
        }
        if (!this.growing) {
            return false;
        }
        var newPos;
        var reference;
        if (this.lastParticle == null) {
            reference = this.rootParticle;
        }
        else {
            reference = this.lastParticle;
        }
        newPos = p5.Vector.fromAngle(reference.dir + randomGaussian(0.0, QUARTER_PI / 4.0), 3.0);
        newPos = createVector(reference.x, reference.y).add(newPos);
        var near = this.qtree.query(new BoundaryRectangle(newPos.x - 15, newPos.y - 15, 30, 30));
        near = near.filter(function (p) {
            if (p.branch === _this)
                return false;
            for (var i = 0; i < _this.childBranches.length; i++) {
                var cb = _this.childBranches[i];
                if (p.branch === cb)
                    return false;
            }
            if (_this.parentBranch != null) {
                if (p.branch === _this.parentBranch)
                    return false;
            }
            return true;
        });
        var toClose = false;
        for (var i = 0; i < near.length; i++) {
            var p = near[i];
            if (p5.Vector.dist(createVector(p.x, p.y), createVector(newPos.x, newPos.y)) < 10.0) {
                toClose = true;
                break;
            }
        }
        if (toClose) {
            this.growing = false;
            return false;
        }
        var newParticle = new Bud(newPos.x, newPos.y, reference.dir, this);
        this.lastParticle = newParticle;
        this.qtree.insert(newParticle);
        this.buds.push(newParticle);
        drawParticle(newParticle);
        if (!this.fences.contains(newParticle)) {
            this.growing = false;
            return false;
        }
        if (this.currentLife >= this.branchingFreq && this.currentLife % this.branchingFreq == 0) {
            var dir = (random(6) < 3.0 ? -1.0 : 1.0);
            dir *= PI * 1 / 4;
            var newBranche = new Branch(this.qtree, this.fences, newParticle.x, newParticle.y, newParticle.dir + dir, this.timeToLive * this.branchingLifeFactor, this.branchingFreq, this.branchingLifeFactor);
            this.childBranches.push(newBranche);
            newBranche.parentBranch = this;
        }
        this.currentLife++;
        return true;
    };
    return Branch;
}());
var Bud = (function () {
    function Bud(x, y, dir, parent) {
        this.x = 0.0;
        this.y = 0.0;
        this.branch = null;
        this.radius = 3;
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.branch = parent;
    }
    return Bud;
}());
var qtree;
var roots = [];
function setup() {
    createCanvas(windowWidth, windowHeight);
    background("#2D142C");
    qtree = new QuadTree(new BoundaryRectangle(0, 0, windowWidth, windowHeight), 8);
    var fences = new BoundaryCircle(windowWidth / 2.0, windowHeight / 2.0, 400);
    var life = 1000;
    var branchingFreq = 10;
    var branchingFActor = 1.0;
    roots[0] = new Branch(qtree, fences, windowWidth * 0.45, windowHeight * 0.45, (-PI * 3) / 4, life, branchingFreq, branchingFActor);
    roots[1] = new Branch(qtree, fences, windowWidth * 0.55, windowHeight * 0.45, (-PI * 1) / 4, life, branchingFreq, branchingFActor);
    roots[2] = new Branch(qtree, fences, windowWidth * 0.45, windowHeight * 0.55, (PI * 3) / 4, life, branchingFreq, branchingFActor);
    roots[3] = new Branch(qtree, fences, windowWidth * 0.55, windowHeight * 0.55, (PI * 1) / 4, life, branchingFreq, branchingFActor);
}
function draw() {
    roots.forEach(function (root) {
        root.grow();
    });
}
function drawParticle(p) {
    noStroke();
    fill("white");
    circle(p.x, p.y, p.radius * 2.0);
}
var BoundaryCircle = (function () {
    function BoundaryCircle(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
    BoundaryCircle.prototype.contains = function (p) {
        if (p5.Vector.dist(createVector(p.x, p.y), createVector(this.x, this.y)) < this.r) {
            return true;
        }
        return false;
    };
    BoundaryCircle.prototype.intersects = function (r) {
        return true;
    };
    return BoundaryCircle;
}());
var BoundaryRectangle = (function () {
    function BoundaryRectangle(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    BoundaryRectangle.prototype.contains = function (p) {
        if (p.x >= this.x &&
            p.x <= this.x + this.w &&
            p.y >= this.y &&
            p.y <= this.y + this.h) {
            return true;
        }
        return false;
    };
    BoundaryRectangle.prototype.intersects = function (r) {
        if (r.x > this.x + this.w ||
            r.y > this.y + this.h ||
            r.x + r.w < this.x ||
            r.y + r.h < this.y) {
            return false;
        }
        return true;
    };
    return BoundaryRectangle;
}());
var QuadTree = (function () {
    function QuadTree(boundary, capacity) {
        this.points = [];
        this.capacity = 4;
        this.subdivided = false;
        this.topLeft = null;
        this.topRight = null;
        this.bottomLeft = null;
        this.bottomRight = null;
        this.boundary = boundary;
        this.capacity = capacity;
    }
    QuadTree.prototype.insert = function (p) {
        if (!this.boundary.contains(p)) {
            return false;
        }
        if (this.points.length < this.capacity) {
            this.points.push(p);
            return true;
        }
        else {
            this.subdivide();
            if (this.topLeft.insert(p)) {
                return true;
            }
            else if (this.topRight.insert(p)) {
                return true;
            }
            else if (this.bottomLeft.insert(p)) {
                return true;
            }
            else if (this.bottomRight.insert(p)) {
                return true;
            }
            else {
                throw "Should never get here!";
            }
        }
        return false;
    };
    QuadTree.prototype.query = function (range) {
        var found = [];
        return this.innerQuery(range, found);
    };
    QuadTree.prototype.innerQuery = function (range, found) {
        if (found == null) {
            found = [];
        }
        if (!this.boundary.intersects(range))
            return found;
        this.points.forEach(function (p) {
            if (range.contains(p)) {
                found.push(p);
            }
        });
        if (this.subdivided) {
            this.topLeft.innerQuery(range, found);
            this.topRight.innerQuery(range, found);
            this.bottomLeft.innerQuery(range, found);
            this.bottomRight.innerQuery(range, found);
        }
        return found;
    };
    QuadTree.prototype.subdivide = function () {
        if (!this.subdivided) {
            this.subdivided = true;
            var x = this.boundary.x;
            var y = this.boundary.y;
            var newWidth = this.boundary.w / 2.0;
            var newHeight = this.boundary.h / 2.0;
            this.topLeft = new QuadTree(new BoundaryRectangle(x, y, newWidth, newHeight), this.capacity);
            this.topRight = new QuadTree(new BoundaryRectangle(x + newWidth, y, newWidth, newHeight), this.capacity);
            this.bottomLeft = new QuadTree(new BoundaryRectangle(x, y + newHeight, newWidth, newHeight), this.capacity);
            this.bottomRight = new QuadTree(new BoundaryRectangle(x + newWidth, y + newHeight, newWidth, newHeight), this.capacity);
        }
    };
    QuadTree.prototype.forEach = function (callback) {
        this.visiteALlQuadTree(this, callback);
    };
    QuadTree.prototype.forEachPoints = function (callback) {
        this.visiteAllPoints(this, callback);
    };
    QuadTree.prototype.forEachBoundaries = function (callback) {
        this.visiteAllBoundaries(this, callback);
    };
    QuadTree.prototype.visiteALlQuadTree = function (qtree, callback) {
        if (qtree == null)
            return;
        callback(qtree);
        this.visiteALlQuadTree(qtree.topLeft, callback);
        this.visiteALlQuadTree(qtree.topRight, callback);
        this.visiteALlQuadTree(qtree.bottomLeft, callback);
        this.visiteALlQuadTree(qtree.bottomRight, callback);
    };
    QuadTree.prototype.visiteAllPoints = function (qtree, callback) {
        if (qtree == null)
            return;
        qtree.points.forEach(function (point) {
            callback(point);
        });
        this.visiteAllPoints(qtree.topLeft, callback);
        this.visiteAllPoints(qtree.topRight, callback);
        this.visiteAllPoints(qtree.bottomLeft, callback);
        this.visiteAllPoints(qtree.bottomRight, callback);
    };
    QuadTree.prototype.visiteAllBoundaries = function (qtree, callback) {
        if (qtree == null)
            return;
        callback(qtree.boundary);
        this.visiteAllBoundaries(qtree.topLeft, callback);
        this.visiteAllBoundaries(qtree.topRight, callback);
        this.visiteAllBoundaries(qtree.bottomLeft, callback);
        this.visiteAllBoundaries(qtree.bottomRight, callback);
    };
    return QuadTree;
}());
//# sourceMappingURL=build.js.map