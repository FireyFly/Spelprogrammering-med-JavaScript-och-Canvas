function RoboroKeyboard()
{
  var env = this;
  
  this.names =
  {
    38: "up",
    40: "down",
    37: "left",
    39: "right",
    32: "space",
    16: "shift",
    18: "alt",
    17: "ctrl",
    13: "enter",
    48: "zero",
    49: "one",
    50: "two",
    51: "three",
    52: "four",
    53: "five",
    54: "six",
    55: "seven",
    56: "eight",
    57: "nine"
  };
  
  for (var code in this.names)
    this[this.names[code]] = false;
  
  document.onkeydown = function(event)
  {
    if (env.names[event.keyCode] !== undefined)
      env[env.names[event.keyCode]] = true;
    env[event.keyCode] = true;
  };
  
  document.onkeyup = function(event)
  {
    if (env.names[event.keyCode] !== undefined)
      env[env.names[event.keyCode]] = false;
    env[event.keyCode] = false;
  };
}

function RoboroSound()
{
  var sounds = {};

  this.addSound = function(name, urls)
  {
    var element = document.createElement('audio');
    element.preload = 'auto';
    
    urls.forEach(
      function(url)
      {
        var source = document.createElement('source');
        source.src = url;
        element.appendChild(source);
      }
    );
    
    sounds[name] = element;
  };

  this.playSound = function(name)
  {
    sounds[name].currentTime = 0;
    sounds[name].play();
  };
}

function RoboroCanvas(id)
{
  var env = this;
  
  this.id = id;
  
  var canvas = document.getElementById(id);
  
  this.context2D = canvas.getContext('2d');
  
  this.width = canvas.width;
  this.height = canvas.height;
  
  this.mouse = 
  {
    x: -10000,
    y: -10000,
    left: false,
    right: false,
    middle: false
  };
  
  this.touchScreen =
  {
    points: [],
    currentlyTouched: false
  };
  
  window.addEventListener('mousedown', function(event)
  {
    if (event.button == 0)
      env.mouse.left = true;
    else if (event.button == 1)
      env.mouse.middle = true;
    else if (event.button == 2)
      env.mouse.right = true;
  }, true);
  
  window.addEventListener('mouseup', function(event)
  {
    if (event.button == 0)
      env.mouse.left = false;
    else if (event.button == 1)
      env.mouse.middle = false;
    else if (event.button == 2)
      env.mouse.right = false;
  }, true);
  
  canvas.onmousemove = function(event)
  {
    env.mouse.x = event.pageX - canvas.offsetLeft;
    env.mouse.y = event.pageY - canvas.offsetTop;
  };

  canvas.onmouseout = function(event)
  {
    env.mouse.x = env.mouse.y = - 10000;
  };
  
  document.addEventListener('touchstart', function(event)
  {
    env.mouse.left = true;
    env.touchScreen.currentlyTouched = true;
  });
  
  document.addEventListener('touchend', function(event)
  {
    if (event.touches.length == 0)
    {
      env.mouse.left = false;
      env.touchScreen.currentlyTouched = false;
    }
  });
  
  canvas.ontouchstart = function(event)
  {
    env.touchScreen.points = event.touches;
  };
  
  canvas.ontouchend = function(event)
  {
    for (var u = 0; u < event.touches.length; u++)
    {
      for (var i = 0; i < event.changedTouches.length; i++)
      {
        if (event.changedTouches[i].identifier == event.touches[u].identifier)
        {
          event.touches[u].clientX = -100000;
          event.touches[u].clientY = -100000;
        }
      }
    }
    
    env.touchScreen.points = event.touches;
  }
  
  canvas.ontouchmove = function(e)
  {
    event.preventDefault();
    
    env.mouse.x = event.touches[0].clientX - canvas.offsetLeft;
    env.mouse.y = event.touches[0].clientY - canvas.offsetTop;
    env.touchScreen.points = event.touches;
  };
  
  this.FPS = 30;
  this.running = true;
  
  this.canvas = canvas;
  
  this.update = function() {};
  this.lastUpdate = new Date().getTime();
  this.deltaT = this.FPS;
  
  this.runUpdate = function()
  {
    if (env.running)
    {
      var interval = 1000/env.FPS;
      var t = new Date().getTime();
      var toNext = interval - (t % interval);

      env.deltaT = t - env.lastUpdate;
      env.lastUpdate = t;
      
      env.update();
      env.updateTimer = setTimeout(env.runUpdate, toNext);
    }
  };
  
  this.updateTimer = setTimeout(this.runUpdate, 1000/this.FPS);
  
  this.stopUpdate = function()
  {
    env.running = false;
  };
  
  this.circle = function(x, y, radius, color) 
  {
    this.context2D.fillStyle = color;
    this.context2D.beginPath();
    this.context2D.arc(x, y, radius, 0, Math.PI * 2, true);
    this.context2D.closePath();
    this.context2D.fill();
  };

  this.rectangle = function(x, y, width, height, color) 
  {
    this.context2D.fillStyle = color;
    this.context2D.fillRect(x, y, width, height);
  };
  
  this.triangle = function(x1, y1, x2, y2, x3, y3, color) 
  {
    this.context2D.fillStyle = color;
    this.context2D.beginPath();
    this.context2D.moveTo(x1, y1);
    this.context2D.lineTo(x2, y2);
    this.context2D.lineTo(x3, y3);
    this.context2D.fill();
  };
  
  this.ring = function(x, y, radius, lineWidth, color)
  {
    this.context2D.beginPath();
    this.context2D.arc(x, y, radius, 0, Math.PI * 2, true);
    this.context2D.closePath();
    this.context2D.lineWidth = lineWidth;
    this.context2D.strokeStyle = color;
    this.context2D.stroke();
  };
  
  this.arc = function(x, y, radius, angle, lineWidth, color)
  {
    this.context2D.beginPath();
    this.context2D.arc(x, y, radius, 0, -angle * Math.PI / 180, true);
    this.context2D.lineWidth = lineWidth;
    this.context2D.strokeStyle = color;
    this.context2D.stroke();
  };
  
  this.text = function(x, y, size, text, color)
  {
    this.context2D.font = size + "pt monospace";
    this.context2D.fillStyle = color;
    this.context2D.fillText(text, x, y);
  };
  
  this.random = function(max)
  {
    return Math.floor(Math.random() * max);
  };
  
  this.randomAlternative = function(list)
  {
    return list[env.random(list.length)];
  };
  
  this.picture = function(x, y, file, width, height)
  {
    var img = new Image();
    img.src = file;
    if ((typeof(width) != 'undefined') && (typeof(height) != 'undefined'))
      this.context2D.drawImage(img, x, y, width, height);
    else
      this.context2D.drawImage(img, x, y);
  };
  
  this.clearScreen = function()
  {
    this.context2D.clearRect(0, 0, this.width, this.height);
  };

  this.fill = function(color)
  {
    this.rectangle(0, 0, this.width, this.height, color);
  };

  this.color = function(red, green, blue)
  {
    return "rgb(" + red + "," + green + "," + blue + ")";
  };

  this.distance = function(x1, y1, x2, y2)
  {
    var dx = x1 - x2;
    var dy = y1 - y2;
  
    return Math.sqrt(dx * dx + dy * dy);
  };

  this.save = function()
  {
    this.context2D.save();
  };

  this.restore = function()
  {
    this.context2D.restore();
  };

  this.translate = function(x, y)
  {
    this.context2D.translate(x, y);
  };
  
  this.scale = function(x, y)
  {
    this.context2D.scale(x, y);
  };
  
  this.rotate = function(degrees)
  {
    this.context2D.rotate(degrees * Math.PI / 180);
  };

  this.rotateRadians = function(radians)
  {
    this.context2D.rotate(radians);
  };

  this.line = function(x1, y1, x2, y2, width, color)
  {
    this.context2D.strokeStyle = color;
    this.context2D.lineWidth = width;
    this.context2D.beginPath();
    this.context2D.moveTo(x1, y1);
    this.context2D.lineTo(x2, y2);
    this.context2D.stroke();
    this.context2D.closePath();
  };
}

function RoboroMath(origoX, origoY, step, canvas)
{
  this.origoX = origoX;
  this.origoY = origoY;
  this.step   = step;
  this.c      = canvas;

  var env = this;

  this.point = function(x, y, color, label, size)
  {
    var label = typeof(label) != 'undefined' ? label : "";
    var size = typeof(size) != 'undefined' ? size : 20;
    env.c.save();
    env.c.translate(this.origoX, this.origoY);
    env.c.circle(x*this.step, -y*this.step, size, color);
    
    var xOffset = x > 0 ? -4 : label.length*12+12;
    var yOffset = y > 0 ? 0 : 24;
    
    env.c.text(x*this.step+3-xOffset, -y*this.step-3+yOffset, size, label, color);
    
    env.c.restore();
  }

  this.polarPoint = function(v, r, color, label, size)
  {
    var label = typeof(label) != 'undefined' ? label : "";
    var size = typeof(size) != 'undefined' ? size : 20;
    var x = r*Math.cos(v); 
    var y = r*Math.sin(v); 
    this.point(x, y, color, label, size);
  }

  this.polarLine = function(v1, r1, v2, r2, color)
  {
    var x1 = r1*Math.cos(v1); 
    var y1 = r1*Math.sin(v1); 
    var x2 = r2*Math.cos(v2); 
    var y2 = r2*Math.sin(v2); 
    
    this.cartesianLine(x1, y1, x2, y2, color);
  }

  this.cartesianLabel = function(x, y, size, label, color)
  {
    env.c.save();
    env.c.translate(this.origoX, this.origoY);
    env.c.text(x*this.step, -y*this.step, size, label, color);
    env.c.restore();
  }
 
  this.cartesianLine = function(x1, y1, x2, y2, color)
  {
    env.c.save();
    env.c.translate(this.origoX, this.origoY);
    env.c.line(x1*this.step, -y1*this.step, x2*this.step, -y2*this.step, 2, color);
    env.c.restore();    
  }

  this.line3D = function(point1, point2, color)
  {
    point1.lineTo(point2, color);
  }
  
  this.Point3D = function(x, y, z, color)
  {
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = color;

    this.draw = function()
    {
      env.c.save();
      env.c.translate(env.origoX, env.origoY);
      var zmax = 10;
      var zdiff = (zmax+this.z)/zmax;      
      var size = this.z+4 > 0 ? this.z+4+2 : 2;
      
      env.c.circle(this.x*env.step*zdiff, -this.y*env.step*zdiff, size, this.color);
      env.c.restore();
    }
    
    this.rotate = function(dvx, dvy, dvz)
    {
      // rotate about x
      var oldY = this.y;
      var oldZ = this.z;
      this.y = oldY*Math.cos(dvx)-oldZ*Math.sin(dvx);
      this.z = oldY*Math.sin(dvx)+oldZ*Math.cos(dvx);
      
      // rotate about y
      var oldX = this.x;
      oldZ = this.z;
      this.x = oldZ*Math.sin(dvy)+oldX*Math.cos(dvy);
      this.z = oldZ*Math.cos(dvy)-oldX*Math.sin(dvy);
      
      // rotate about z
      oldX = this.x;
      oldY = this.y;
      this.x = oldX*Math.cos(dvz)-oldY*Math.sin(dvz);
      this.y = oldX*Math.sin(dvz)+oldY*Math.cos(dvz);    
    }
    
    this.lineTo = function(point2, color)
    {
      env.c.save();
      env.c.translate(env.origoX, env.origoY);
      var zmax = 10;
      var zdiff1 = (zmax+this.z)/zmax;
      var zdiff2 = (zmax+point2.z)/zmax;
      env.c.line(this.x*env.step*zdiff1, -this.y*env.step*zdiff1, point2.x*env.step*zdiff2, -point2.y*env.step*zdiff2, 1, color);
      env.c.restore();    
    }
  }
  
  this.axes = function()
  {
    this.c.line(this.origoX, 0, this.origoX, this.c.height, 2, "black");
    this.c.line(0, this.origoY, this.c.width, this.origoY, 2, "black");

    for (var i = this.origoX; i <= (this.c.width - this.step); i+=this.step)
      this.c.line(i, this.origoY-10, i, this.origoY+10, 1, "black");
    for (var i = this.origoX; i >= this.step; i-=this.step)
      this.c.line(i, this.origoY-10, i, this.origoY+10, 1, "black");

    for (var i = this.origoY; i <= (this.c.height - this.step); i+=this.step)
      this.c.line(this.origoX-10, i, this.origoX+10, i, 1, "black");
    for (var i = this.origoY; i >= this.step; i-=this.step)
      this.c.line(this.origoX-10, i, this.origoX+10, i, 1, "black");
    
    this.c.triangle(this.origoX-10, 10, this.origoX+10, 10, this.origoX, 0, "black");
    this.c.text(this.origoX-20, 30, 20, "y", "black");
    this.c.triangle(this.c.width-10, this.origoY-10, this.c.width-10, this.origoY+10, this.c.width, this.origoY, "black");
    this.c.text(this.c.width-30, this.origoY+22, 20, "x", "black");
  }
  
  this.unitCircle = function()
  {
    this.c.ring(this.origoX, this.origoY, 100, 1, "#333333");
  }

  this.arcDegrees = function(r, angle, width, color)
  {
    this.c.arc(this.origoX, this.origoY, r*this.step, angle, width, color);
  }

  this.angleDegrees = function(angle)
  {
    var radius = 30;
    this.arcDegrees(radius, angle, 2, "#553333");
  }

  this.angleRadians = function(angle)
  {
    var radius = 30;
    this.arcDegrees(radius, angle*(180/Math.PI), 2, "#553333");
  }
}
