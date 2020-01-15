var G = 1;
var zSlider, tSlider, mSlider, zInput, fSlider, fsSlider;
var mouseClick = false;
var mouseToggle = true;
var left, right, up, down, space, t;
var objectSelected = false;
var particles = [];
var trails = [];
var frameX;
var frameY;
var zoom = 1;
var currentStat = 0;
var introComplete = true;

var launchX = 0;
var launchY = 0;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  zInput = createInput(1, int);
  zInput.position(20, 20);
  //zSlider = createSlider(1, 100000, 1);
  //zSlider.position(20, 20);
  tSlider = createSlider(1, 1000, 1);
  tSlider.position(20, 40);
  mSlider = createSlider(1, 50000, 1);
  mSlider.position(20, 60);
  fSlider = createSlider(1, 1000000, 1);
  fSlider.position(20, 80);
  fsSlider = createSlider(1, 5000, 1);
  fsSlider.position(20, 100);
  particles[particles.length] = new particle(width/2, height/2, 0, 0, 0, 0, 20000, 1000000);
  particles[particles.length - 1].stationary = true;
  frameX = width/2;
  frameY = height/2;
}

function draw() {
  background(0);
  fill(255);
  text("Zoom: " + zInput.value() + "%", 160, 35);
  text("Time-Step: " + tSlider.value(), 160, 55);
  text("Mass-of-Launch: " + mSlider.value() + " kg", 160, 75);
  text("Mass-Prediction-Depth: " + fSlider.value() + " time-steps", 160, 95);
  text("Mass-Prediction-Skip: " + fsSlider.value() + " step-values", 160, 115);
  selectObject();
  calculations();
  if(t) {
    frameX = particles[currentStat].xpos;
    frameY = particles[currentStat].ypos;
  }
  var boundY = 140;
  var boundX = 180;
  if((mouseX > boundX && mouseY > boundY) || (mouseX > boundX && mouseY < boundY) || (mouseX < boundX && mouseY > boundY) && objectSelected == false) {  
    launchParticle();
  }
  if(up) { frameY -= 20/zoom; }
  if(down) { frameY += 20/zoom; }
  if(left) { frameX -= 20/zoom; }
  if(right) { frameX += 20/zoom; }
  zoom = zInput.value()/100000;
  statsTab();
  if(introComplete) {
    introBox();
    introComplete = false;
  }
}

function introBox() {
  alert("Welcome to solar system simulator ver 0.1! Here are the following methods to interact with the environment: \n \n 1. Click wherever you wanna place mass and pull back the mouse to release said mass. \n 2. Change mass, time-step, and other variables with the sliders above. \n 3. Change your zoom percentage by typing in the value of zoom. \n 4. Press space while hovering over an object to get its stats and hold t to track it. \n 5. Move around the open space with the arrow keys. \n \n Have fun and may your solar system prosper and ever grow!");
}

function selectObject() {
  objectSelected = false;
  for(var i = 0; i < particles.length; i++) {
    var newX = ((particles[i].xpos - frameX)) * zoom + width/2;
    var newY = ((particles[i].ypos - frameY)) * zoom + height/2;
    if(abs(mouseX - newX) < particles[i].size/2 * zoom) {
      objectSelected = true;
      if(space) {
        currentStat = i;
      }
    }
  }
}

function statsTab() {
  noStroke();
  fill(255, 255, 255, 50);
  rect(width * 0.8, 0, width * 0.2, height);
  fill(255);
  textAlign(CENTER);
  text("Current Object Statistics:", width * 0.9, height * 0.05);
  if(currentStat != -1) {
    fill(255);
    ellipse(width * 0.9, height * 0.115, 20, 20);
    stroke(255, 100, 0);
    line(width * 0.9, height * 0.115, width * 0.9 + 2 * particles[currentStat].xvel, height * 0.115 + 2 * particles[currentStat].yvel)
    stroke(255, 0, 100);
    line(width * 0.9, height * 0.115, width * 0.9 + 2 * particles[currentStat].ax, height * 0.115 + 2 * particles[currentStat].ay);
    stroke(255, 0, 0);
    var newX = ((particles[currentStat].xpos - frameX)) * zoom + width/2;
    var newY = ((particles[currentStat].ypos - frameY)) * zoom + height/2;
    noFill();
    rect(newX - particles[currentStat].size * zoom / 2, newY - particles[currentStat].size * zoom / 2, particles[currentStat].size * zoom, particles[currentStat].size * zoom);
    noStroke();
    fill(255);
    textAlign(LEFT);
    text("Name: " + particles[currentStat].name, width * 0.85, height * 0.17);
    text("Mass: " + particles[currentStat].mass + " kg", width * 0.85, height * 0.2);
    text("X-Pos: " + particles[currentStat].xpos + " m", width * 0.85, height * 0.23);
    text("Y-Pos: " + particles[currentStat].ypos + " m", width * 0.85, height * 0.26);
    text("X-Vel: " + particles[currentStat].xvel + " m/s", width * 0.85, height * 0.29);
    text("Y-Vel: " + particles[currentStat].yvel + " m/s", width * 0.85, height * 0.32);
    text("X-Acc: " + particles[currentStat].ax + " m/s^2", width * 0.85, height * 0.35);
    text("Y-Acc: " + particles[currentStat].ay + " m/s^2", width * 0.85, height * 0.38);
  }
}

function calculations() {
  for(var l = 0; l < tSlider.value(); l++) {  
    for(var i = 0; i < particles.length; i++) {
      var ax = 0;
      var ay = 0;
      for(var j = 0; j < particles.length; j++) {
        var array = gravity(G, particles[i], particles[j]);
        ax += array[0];
        ay += array[1];
      }
      particles[i].ax = ax;
      particles[i].ay = ay;
    }
    for(var i = 0; i < particles.length; i++) {
      particles[i].updatePosition();
    }
  }
    
    for(var k = 0; k < particles.length; k++) {
      var newX = ((particles[k].xpos - frameX)) * zoom + width/2;
      var newY = ((particles[k].ypos - frameY)) * zoom + height/2;
      if(newX > (-particles[k].size/2) && newX < (width + particles[k].size/2) && newY > (-particles[k].size/2) && newY < (height + particles[k].size/2)) {  
        particles[k].render();
        particles[k].showVector();
        //generateTrail(particles[k], 100);
      }
    }
}

function launchParticle() {
  if(mouseClick && mouseToggle) {
    launchX = (mouseX - width/2) / zoom + frameX;
    launchY = (mouseY - height/2) / zoom + frameY;
    mouseToggle = false;
  }
  if(!mouseClick && !mouseToggle) {
    mouseToggle = true;
    newX = (mouseX - width/2) / zoom + frameX;
    newY = (mouseY - height/2) / zoom + frameY;
    particles[particles.length] = new particle(launchX, launchY, zoom * 0.1 * (launchX - newX), zoom * 0.1 * (launchY - newY), 0, 0, mSlider.value() / 50, mSlider.value());
  }
  if(mouseClick) {  
    line(mouseX, mouseY, (launchX - frameX) * zoom + width/2, (launchY - frameY) * zoom + height/2);
    newX = (mouseX - width/2) / zoom + frameX;
    newY = (mouseY - height/2) / zoom + frameY;
    var trail = new particle(launchX, launchY, zoom * 0.1 * (launchX - newX), zoom * 0.1 * (launchY - newY), 0, 0, mSlider.value() / 50, mSlider.value());
    generateTrail(trail, fSlider.value());
  }
}

function generateTrail(obj1, depth) {
  var trail = new particle(obj1.xpos, obj1.ypos, obj1.xvel, obj1.yvel, obj1.ax, obj1.ay, obj1.size, obj1.mass);
  if(obj1.stationary === false) {  
    beginShape();
    for(var j = 0; j < depth; j++) {  
      var ax = 0;
      var ay = 0;
      for(var i = 0; i < particles.length; i++) {
        if(obj1 != particles[i]) { 
          var array = gravity(G, trail, particles[i]);
          ax += array[0];
          ay += array[1];
        }
      }
      trail.ax = ax;
      trail.ay = ay;
      trail.updatePosition();
      if(j%fsSlider.value() == 0) {  
        stroke(obj1.id * 10, 100 + obj1.id * 10, 255);
        noFill();
        ellipse((trail.xpos - frameX) * zoom + width/2, (trail.ypos - frameY) * zoom + height/2, 5 * zoom, 5 * zoom);
        vertex((trail.xpos - frameX) * zoom + width/2, (trail.ypos - frameY) * zoom + height/2);
      }
    }
    endShape();
  }
}

function gravity(G, obj1, obj2) {
  var d = dist(obj1.xpos, obj1.ypos, obj2.xpos, obj2.ypos);
  if(d > 1){ 
    // Use Newton's equation to return acceleration values
    var a = G * obj2.mass / pow(d ,3);
    var ax = a * (obj2.xpos - obj1.xpos);
    var ay = a * (obj2.ypos - obj1.ypos);
    return [ax, ay];
  } else {
    // Return no acceleration if distance value is too low
    return [0, 0];
  }
}

function particle(xpos, ypos, xv, yv, ax, ay, size, mass) {
  // Initalization of particle
  this.mass = mass;
  this.size = size;
  this.xpos = xpos;
  this.ypos = ypos;
  this.xvel = xv;
  this.yvel = yv;
  this.ax = ax;
  this.ay = ay;
  this.id = particles.length;
  this.stationary = false;
  this.name = "un-named";
  // Update position of the particle
  this.updatePosition = function() {
    if(!this.stationary) {  
      this.xvel += this.ax;
      this.yvel += this.ay;
      this.xpos += this.xvel;
      this.ypos += this.yvel;
    } else {
    }
  }  
  // Renders the velocity and acceleration vectors of the particle
  this.showVector = function() {
    var newX = ((this.xpos - frameX)) * zoom + width/2;
    var newY = ((this.ypos - frameY)) * zoom + height/2;
    stroke(255);
    line(newX, newY, newX + 2 * this.xvel * zoom, newY + 2 * this.yvel * zoom)
    stroke(255, 0, 100);
    line(newX, newY, newX + 2 * this.ax * zoom, newY + 2 * this.ay * zoom);
  }
  // Renders actual particle
  this.render = function() {
    var newX = ((this.xpos - frameX)) * zoom + width/2;
    var newY = ((this.ypos - frameY)) * zoom + height/2;
    stroke(255);
    fill(255);
    ellipse(newX, newY, this.size * zoom, this.size * zoom);
  }
}

function mousePressed() {
  mouseClick = true;
}

function mouseReleased() {
  mouseClick = false;
}

function keyPressed() {
  if(keyCode == 38) { up = true; }
  if(keyCode == 40) { down = true; }
  if(keyCode == 37) { left = true; }
  if(keyCode == 39) { right = true; }
  if(keyCode == 32) { space = true; }
  if(keyCode == 84) { t = true; }
}

function keyReleased() {
  if(keyCode == 38) { up = false; }
  if(keyCode == 40) { down = false; }
  if(keyCode == 37) { left = false; }
  if(keyCode == 39) { right = false; }
  if(keyCode == 32) { space = false; }
  if(keyCode == 84) {t = false; }
}