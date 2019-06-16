// Constants
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
document.fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
document.onfullscreenchange = document.onfullscreenchange || document.onwebkitfullscreenchange || document.onwebkitfullscreenchange || document.MSFullscreenChange;
// Case type
EMPTY_VAL = 0;
SNAKE_VAL = 1;
FRUIT_VAL = 2;
WALL_VAL = 3;
// Player type
PLAYER_IA = "PLAYER_IA";
PLAYER_HUMAN = "PLAYER_HUMAN";
// IA level
IA_LEVEL_LOW = "IA_LEVEL_LOW";
IA_LEVEL_DEFAULT = "IA_LEVEL_DEFAULT";
IA_LEVEL_HIGH = "IA_LEVEL_HIGH";
// Output type
OUTPUT_TEXT = "OUTPUT_TEXT";
OUTPUT_GRAPHICAL = "OUTPUT_GRAPHICAL";
// Canvas size
CANVAS_WIDTH = 800;
CANVAS_HEIGHT = 600;
// Directions
UP = 0;
RIGHT = 1;
BOTTOM = 2;
LEFT = 3;
// Keys
KEY_UP = 38;
KEY_RIGHT = 39;
KEY_BOTTOM = 40;
KEY_LEFT = 37;
// UI
FONT_FAMILY = "sans-serif";
TARGET_FPS = 60;

// return an integer between min (inclusive) and max (inclusive)
function randRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function valToChar(value) {
  switch(value) {
    case EMPTY_VAL:
      return "-";
      break;
    case SNAKE_VAL:
      return "o";
      break;
    case FRUIT_VAL:
      return "x";
      break;
    case WALL_VAL:
      return "#";
      break;
  }
}

function Position(x, y, direction) {
  this.x = x;
  this.y = y;
  this.direction = direction;
}

Position.prototype.equals = function(otherPosition) {
  return this.x == otherPosition.x && this.y == otherPosition.y;
};

function Grid(width, height, generateWalls, borderWalls) {
  this.width = width;
  this.height = height;
  this.grid;
  this.fruitPos;

  this.init = function() {
    this.grid = new Array(this.height);

    for(i = 0; i < this.height; i++) {
      this.grid[i] = new Array(this.width);
      this.grid[i] = [];
      for(j = 0; j < this.width; j++) {
        if((borderWalls && (i == 0 || i == this.height - 1 || j == 0 || j == this.width - 1)) || (generateWalls && Math.random() > 0.90)) {
          this.grid[i][j] = WALL_VAL;
        } else {
          this.grid[i][j] = EMPTY_VAL;
        }
      }
    }
  };

  this.set = function(value, position) {
    this.grid[position.y][position.x] = value;
  };

  this.get = function(position) {
    return this.grid[position.y][position.x];
  };

  this.getGraph = function(snakePos) {
    var res = [];

    for(i = 0; i < this.height; i++) {
      res.push([]);
      for(j = 0; j < this.width; j++) {
        var currentVal = this.get(new Position(j, i));

        if(!snakePos.equals(new Position(j, i)) && (currentVal == SNAKE_VAL || currentVal == WALL_VAL)) {
          res[i].push(1);
        } else {
          res[i].push(0);
        }
      }
    }

    return res;
  };

  this.getRandomPosition = function() {
    return new Position(randRange(0, this.width - 1), randRange(0, this.height - 1));
  };

  this.setFruit = function() {
    if(this.fruitPos != null && this.get(this.fruitPos) == FRUIT_VAL) {
      this.set(EMPTY_VAL, this.fruitPos);
    }

    var randomPos = this.getRandomPosition();

    while(this.get(randomPos) != EMPTY_VAL) {
      randomPos = this.getRandomPosition();
    }

    this.fruitPos = randomPos;
    this.set(FRUIT_VAL, randomPos);
  };

  this.init();
}

Grid.prototype.toString = function() {
  res = "";

  for(i = 0; i < this.height; i++) {
    for(j = 0; j < this.width; j++) {
      res += valToChar(this.get(new Position(j, i))) + " ";
    }

    res += "\n";
  }

  return res;
};

function Snake(direction, length, grid, player, iaLevel, autoRetry) {
  this.direction = direction || RIGHT;
  this.initialDirection = direction || RIGHT;
  this.grid = grid;
  this.queue = [];
  this.player = player || PLAYER_HUMAN;
  this.iaLevel = iaLevel || IA_LEVEL_DEFAULT;
  this.autoRetry = autoRetry || false;

  this.init = function() {
    var posValidated = false;
    var startPos;

    while(!posValidated) {
      posValidated = true;
      startPos = grid.getRandomPosition();

      for(i = length - 1; i >= 0; i--) {
        var posX = startPos.x - i;

        if(posX < 0) {
          posX = this.grid.width - -posX;
        }

        if(grid.get(new Position(posX, startPos.y)) == WALL_VAL) {
          posValidated = false;
        }
      }
    }

    for(i = length - 1; i >= 0; i--) {
        var posX = startPos.x - i;

        if(posX < 0) {
          posX = this.grid.width - -posX;
        }

        this.insert(new Position(posX, startPos.y, this.direction));
    }
  };

  this.reset = function() {
    this.direction = this.initialDirection;
    this.queue = [];
    this.init();
  }

  this.insert = function(position) {
    this.queue.unshift(position);
    this.grid.set(SNAKE_VAL, position);
  };

  this.remove = function() {
    var last = this.queue.pop();
    this.grid.set(EMPTY_VAL, last);
  };

  this.length = function() {
    return this.queue.length;
  };

  this.get = function(index) {
    return new Position(this.queue[index].x, this.queue[index].y, this.queue[index].direction);
  };

  this.set = function(index, position) {
    if(index >= 0 && index < this.length()) {
      this.queue[index] = position;
    }
  };

  this.getHeadPosition = function() {
    return this.get(0);
  };

  this.getTailPosition = function() {
    return this.get(this.length() - 1);
  };

  this.moveTo = function(direction) {
      if(direction == KEY_LEFT && this.direction != RIGHT && this.direction != LEFT) {
        this.direction = LEFT;
      }

      if(direction == KEY_UP && this.direction != BOTTOM && this.direction != UP) {
        this.direction = UP;
      }

      if(direction == KEY_RIGHT && this.direction != LEFT && this.direction != RIGHT) {
        this.direction = RIGHT;
      }

      if(direction == KEY_BOTTOM && this.direction != UP && this.direction != BOTTOM) {
        this.direction = BOTTOM;
      }
  };

  this.getNextPosition = function(oldPos, newDirection) {
    var position = new Position(oldPos.x, oldPos.y, newDirection);

    switch(newDirection) {
      case LEFT:
        position.x--;
        position.direction = LEFT;
        break;
      case UP:
        position.y--;
        position.direction = UP;
        break;
      case RIGHT:
        position.x++;
        position.direction = RIGHT;
        break;
      case BOTTOM:
        position.y++;
        position.direction = BOTTOM;
        break;
      case KEY_LEFT:
        position.x--;
        position.direction = LEFT;
        break;
      case KEY_UP:
        position.y--;
        position.direction = UP;
        break;
      case KEY_RIGHT:
        position.x++;
        position.direction = RIGHT;
        break;
      case KEY_BOTTOM:
        position.y++;
        position.direction = BOTTOM;
        break;
    }

    if(position.x < 0) {
      position.x = this.grid.width - 1;
    } else if(position.x >= this.grid.width) {
      position.x = 0;
    }

    if(position.y < 0) {
      position.y = this.grid.height - 1;
    } else if(position.y >= this.grid.height) {
      position.y = 0;
    }

    return position;
  };

  this.simpleIA = function() {
    if(this.grid.fruitPos != null) {
      var currentPosition = this.getHeadPosition();
      var fruitPos = new Position(this.grid.fruitPos.x, this.grid.fruitPos.y);
      var directionNext = KEY_RIGHT;

      if(fruitPos.x > currentPosition.x) {
        if(fruitPos.x - currentPosition.x > this.grid.width / 2) {
          directionNext = KEY_LEFT;
        } else {
          directionNext = KEY_RIGHT;
        }
      } else if(fruitPos.x < currentPosition.x) {
        if(currentPosition.x - fruitPos.x > this.grid.width / 2) {
          directionNext = KEY_RIGHT;
        } else {
          directionNext = KEY_LEFT;
        }
      } else if(fruitPos.y < currentPosition.y) {
        if(currentPosition.y - fruitPos.y > this.grid.height / 2) {
          directionNext = KEY_BOTTOM;
        } else {
          directionNext = KEY_UP;
        }
      } else if(fruitPos.y > currentPosition.y) {
        if(fruitPos.y - currentPosition.y > this.grid.height / 2) {
          directionNext = KEY_UP;
        } else {
          directionNext = KEY_BOTTOM;
        }
      }

      var nextPosition = this.getNextPosition(currentPosition, directionNext);

      if(this.grid.get(nextPosition) != EMPTY_VAL && this.grid.get(nextPosition) != FRUIT_VAL) {
        if(this.grid.get(this.getNextPosition(currentPosition, KEY_UP)) == EMPTY_VAL || this.grid.get(this.getNextPosition(currentPosition, KEY_UP)) == FRUIT_VAL) {
          directionNext = KEY_UP;
        } else if(this.grid.get(this.getNextPosition(currentPosition, KEY_RIGHT)) == EMPTY_VAL || this.grid.get(this.getNextPosition(currentPosition, KEY_RIGHT)) == FRUIT_VAL) {
          directionNext = KEY_RIGHT;
        } else if(this.grid.get(this.getNextPosition(currentPosition, KEY_BOTTOM)) == EMPTY_VAL || this.grid.get(this.getNextPosition(currentPosition, KEY_BOTTOM)) == FRUIT_VAL) {
          directionNext = KEY_BOTTOM;
        } else if(this.grid.get(this.getNextPosition(currentPosition, KEY_LEFT)) == EMPTY_VAL || this.grid.get(this.getNextPosition(currentPosition, KEY_LEFT)) == FRUIT_VAL) {
          directionNext = KEY_LEFT;
        }
      }

      return directionNext;
    }
  };

  this.ia = function() {
    if(this.iaLevel == IA_LEVEL_LOW) {
        return this.simpleIA();
    }

    if(this.grid.fruitPos != null) {
      var currentPosition = this.getHeadPosition();
      var fruitPos = new Position(this.grid.fruitPos.x, this.grid.fruitPos.y);

      var grid = new PF.Grid(this.grid.getGraph(currentPosition));
      var finder = new PF.AStarFinder();
      var path = finder.findPath(currentPosition.x, currentPosition.y, fruitPos.x, fruitPos.y, grid);

      if(path.length > 1) {
        var nextPosition = new Position(path[1][0], path[1][1]);

        if(nextPosition.x > currentPosition.x) {
          return KEY_RIGHT;
        } else if(nextPosition.x < currentPosition.x) {
          return KEY_LEFT;
        } else if(nextPosition.y < currentPosition.y) {
          return KEY_UP;
        } else if(nextPosition.y > currentPosition.y) {
          return KEY_BOTTOM;
        }
      } else if(this.iaLevel == IA_LEVEL_HIGH) {
        return this.simpleIA();
      }
    }
  };

  this.init();
}

function ImageLoader() {
  this.images = {};
  this.triedLoading = 0;

  this.load = function(img, func) {
    var self = this;

    if(img.length > 0) {
      this.loadImage(img[0], function(result) {
        if(result == true) {
          img.shift();
          self.load(img, func);
        }
      });
    } else {
      return func();
    }
  };

  this.loadImage = function(src, func) {
    var self = this;
    this.triedLoading++;

    var image = new Image();
    image.src = src;

    image.onload = function() {
      self.images[src] = image;
      self.triedLoading = 0;

      return func(true);
    };

    image.onerror = function() {
      if(self.triedLoading >= 5) {
        self.triedLoading = 0;
        self.images[src] = image;

        return func(true);
      }

      self.loadImage(src, func);
    }
  };

  this.get = function(src) {
    return this.images[src];
  };
}

function Game(grid, snake, speed, appendTo, displayFPS, outputType) {
  this.imageLoader;
  this.grid = grid;
  this.snake = snake;
  this.speed = speed || 5;
  this.initialSpeed = speed || 5;
  this.outputType = outputType || OUTPUT_GRAPHICAL;
  this.score = 0;
  this.frame = 0;
  this.paused = true;
  this.gameOver = false;
  this.confirmReset = false;
  this.lastKey = -1;
  this.textarea;
  this.canvas;
  this.canvasCtx;
  this.assetsLoaded = false;
  this.appendTo = appendTo;
  this.scoreMax = false;
  this.errorOccured = false;
  this.displayFPS = displayFPS || false;
  this.lastFrame = 0;
  this.currentFPS = 0;
  this.intervalCountFPS;
  this.countBeforePlay = 3;
  // Buttons
  this.btnFullScreen;
  this.btnPause;
  this.btnContinue;
  this.btnRetry;
  this.btnQuit;
  this.btnYes;
  this.btnNo;

  this.init = function() {
    this.imageLoader = new ImageLoader();

    if(this.outputType == OUTPUT_TEXT) {
      this.textarea = document.createElement("textarea");
      this.textarea.style.width = this.grid.width * 16.5 + "px";
      this.textarea.style.height = this.grid.height * 19 + "px";
      this.appendTo.appendChild(this.textarea);
      this.assetsLoaded = true;
    } else if(this.outputType == OUTPUT_GRAPHICAL) {
      this.canvas = document.createElement("canvas");
      this.canvas.width = CANVAS_WIDTH;
      this.canvas.height = CANVAS_HEIGHT;
      this.canvasCtx = this.canvas.getContext("2d");
      this.appendTo.appendChild(this.canvas);
      this.btnFullScreen = new ButtonImage("assets/images/fullscreen.png", null, 5, "right", 64, 64);
      this.btnPause = new ButtonImage("assets/images/pause.png", 75, 5, "right", 64, 64);
      this.btnContinue = new Button("Reprendre", null, null, "center", "#3498db", "#246A99");
      this.btnRetry = new Button("Recommencer la partie", null, null, "center", "#3498db", "#246A99");
      this.btnQuit = new Button("Quitter", null, null, "center", "#3498db", "#246A99");
      this.btnYes = new Button("Oui", null, null, "center", "#3498db", "#246A99");
      this.btnNo = new Button("Non", null, null, "center", "#3498db", "#246A99");
    }

    if((this.grid.width * this.grid.height) <= this.snake.length() || (this.snake.length() > this.grid.width)) {
      console.error("Game init failed: the snake is bigger than the grid");
      this.errorOccured = true;
      this.stop();
    } else {
      this.grid.setFruit();
    }

    this.updateUI();

    // keyboard events
    var self = this;

    document.addEventListener("keydown", function(evt) {
      if(!self.paused) {
        self.lastKey = evt.keyCode;
      }
    });

    document.addEventListener("keyup", function(evt) {
      if(!self.paused) {
        self.lastKey = -1;
      }
    });

    window.addEventListener('blur', function() {
      self.pause();
    }, false);

    this.intervalCountFPS = window.setInterval(function() {
      if(self.lastFrame > 0 && !self.paused) {
        self.currentFPS = self.frame - self.lastFrame;
        self.lastFrame = self.frame;
        self.speed = Math.floor(self.initialSpeed * (self.currentFPS / TARGET_FPS));
        self.speed = self.speed < 1 ? 1 : self.speed;
      }
    }, 1000);
  };

  this.reset = function() {
    this.grid.init();
    this.snake.reset();
    this.score = 0;
    this.frame = 0;
    this.lastFrame = 0;
    this.currentFPS = TARGET_FPS;
    this.scoreMax = false;
    this.errorOccured = false;
    this.lastKey = -1;
    this.gameOver = false;
    this.grid.setFruit();
    this.start();
  };

  this.start = function() {
    if(this.paused && !this.gameOver && this.assetsLoaded) {
      this.countBeforePlay = 3;
      this.updateUI();
      var self = this;

      var intervalPlay = setInterval(function() {
        self.countBeforePlay--;

        if(self.countBeforePlay <= 0) {
          clearInterval(intervalPlay);
          self.paused = false;
          self.lastFrame = self.frame > 0 ? self.frame : 1;
          self.currentFPS = TARGET_FPS;
          self.tick();
        } else {
          self.updateUI();
        }
      }, 1000);
    }

    if(!this.assetsLoaded) {
      this.loadAssets();
    }
  };

  this.tick = function() {
    this.updateUI();
    var self = this;

    window.requestAnimationFrame(function() {
      if(!self.paused) {
        self.frame++;

        if(self.snake.player == PLAYER_HUMAN) {
          self.snake.moveTo(self.lastKey);
        } else if(self.snake.player == PLAYER_IA) {
          self.snake.moveTo(self.snake.ia());
        }

        if(self.frame % self.speed == 0) {
          var headSnakePos = self.snake.getHeadPosition();
          headSnakePos = self.snake.getNextPosition(headSnakePos, self.snake.direction);

          if(self.grid.get(headSnakePos) == SNAKE_VAL || self.grid.get(headSnakePos) == WALL_VAL) {
            self.stop();
          } else {
            if(self.grid.get(headSnakePos) == FRUIT_VAL) {
              self.score++;
              self.snake.insert(headSnakePos);

              if(self.snake.length() >= (self.grid.height * self.grid.width)) {
                self.scoreMax = true;
                self.stop();
              } else {
                self.grid.setFruit();
              }
            } else {
              self.snake.insert(headSnakePos);
              self.snake.remove();
            }
          }
        }

        self.tick();
      }
    });
  };

  this.stop = function() {
    this.paused = true;
    this.gameOver = true;
  };

  this.pause = function() {
    this.paused = true;
    this.updateUI();
  };

  this.kill = function() {
    this.stop();

    if(this.outputType == OUTPUT_TEXT) {
      this.appendTo.removeChild(this.textarea);
    } else if(this.outputType == OUTPUT_GRAPHICAL) {
      this.appendTo.removeChild(this.canvas);
    }
  };

  this.toggleFullscreen = function() {
    if(this.outputType == OUTPUT_GRAPHICAL) {
      var full = false;

      if(!document.fullscreenElement) {
        if(this.canvas.requestFullscreen) {
          this.canvas.requestFullscreen();
        } else if(this.canvas.mozRequestFullScreen) {
          this.canvas.mozRequestFullScreen();
        } else if(this.canvas.webkitRequestFullscreen) {
          this.canvas.webkitRequestFullscreen();
        } else if(this.canvas.msRequestFullscreen) {
          this.canvas.msRequestFullscreen();
        }
      } else {
        if(document.exitFullscreen) {
          document.exitFullscreen();
        } else if(document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if(document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }

      var self = this;

      document.onfullscreenchange = function(event) {
        if(document.fullscreenElement == self.canvas) {
          self.canvas.width = window.innerWidth;
          self.canvas.height = window.innerHeight;

          window.onresize = function() {
            if(document.fullscreenElement == self.canvas) {
              self.canvas.width = window.innerWidth;
              self.canvas.height = window.innerHeight;

              self.updateUI();
            }
          };
        } else {
          self.canvas.width = CANVAS_WIDTH;
          self.canvas.height = CANVAS_HEIGHT;
        }

        self.updateUI();
      };
    }
  };

  this.loadAssets = function() {
    var self = this;

    this.imageLoader.load(["assets/images/snake_4.png", "assets/images/snake_3.png", "assets/images/snake_2.png", "assets/images/snake.png", "assets/images/body_4_end.png", "assets/images/body_3_end.png", "assets/images/body_2_end.png", "assets/images/body_end.png", "assets/images/body_2.png", "assets/images/body.png", "assets/images/wall.png", "assets/images/fruit.png", "assets/images/body_angle_1.png", "assets/images/body_angle_2.png", "assets/images/body_angle_3.png", "assets/images/body_angle_4.png", "assets/images/pause.png", "assets/images/fullscreen.png", "assets/images/snake_dead_4.png", "assets/images/snake_dead_3.png", "assets/images/snake_dead_2.png", "assets/images/snake_dead.png"], function() {
      self.assetsLoaded = true;
      self.btnFullScreen.loadImage(self.imageLoader);
      self.btnPause.loadImage(self.imageLoader);
      self.start();
    });
  };

  this.updateUI = function() {
    if(this.outputType == OUTPUT_TEXT) {
      this.textarea.innerHTML = this.toString();
    } else if(this.outputType == OUTPUT_GRAPHICAL) {
      var self = this;
      var ctx = this.canvasCtx;
      var caseHeight = Math.floor((this.canvas.height - 75) / this.grid.height);
      var caseWidth = Math.floor(this.canvas.width / this.grid.width);
      caseHeight = caseHeight > caseWidth ? caseWidth : caseHeight;
      caseWidth = caseWidth > caseHeight ? caseHeight : caseWidth;

      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = "rgba(204, 207, 211, 1)";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = "#27AE60";
      ctx.fillRect(0, 0, this.canvas.width, 75);
      ctx.font = '32px ' + FONT_FAMILY;
      ctx.fillStyle = "black";

      this.btnFullScreen.draw(this.canvas);
      this.btnFullScreen.disable();

      this.btnPause.draw(this.canvas);
      this.btnPause.disable();

      if(this.assetsLoaded) {
        this.drawImage(ctx, "assets/images/fruit.png", 5, 5, 64, 64);
        this.drawText(ctx, "× " + this.score, "black", 32, FONT_FAMILY, "default", "default", 68, 50);

        var totalWidth = caseWidth * this.grid.width;

        for(i = 0; i < this.grid.height; i++) {
          for(j = 0; j < this.grid.width; j++) {
            var caseX = Math.floor(j * caseWidth + ((this.canvas.width - totalWidth) / 2));
            var caseY = 75 + i * caseHeight;

            if((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1)) {
              ctx.fillStyle = "rgba(127, 140, 141, 0.75)";
            } else {
              ctx.fillStyle = "rgba(44, 62, 80, 0.75)";
            }

            ctx.fillRect(caseX, caseY, caseWidth, caseHeight);
            this.drawImage(ctx, this.getImageCase(new Position(j, i)), caseX, caseY, caseWidth, caseHeight);
          }
        }

        this.drawSnake(ctx, caseWidth, caseHeight, totalWidth);
      } else {
        this.drawMenu(ctx, [], "Chargement des ressources…", "white", 32, FONT_FAMILY, "center", null, 0);
      }

      if(this.countBeforePlay > 0) {
        this.drawMenu(ctx, [], "" + this.countBeforePlay, "black", 32, FONT_FAMILY, "center", null, 0);
      } else if(this.errorOccured) {
        this.drawMenu(ctx, [], "Une erreur est survenue !", "red", 32, FONT_FAMILY, "center");
      } else if(this.confirmReset && !this.gameOver) {
        this.drawMenu(ctx, [this.btnYes, this.btnNo], "Êtes-vous sûr de vouloir\nrecommencer la partie ?", "#E74C3C", 32, FONT_FAMILY, "center", null, null, function() {
          self.btnYes.addClickAction(self.canvas, function() {
            self.btnYes.disable();
            self.btnNo.disable();
            self.confirmReset = false;
            self.reset();
          });

          self.btnNo.addClickAction(self.canvas, function() {
            self.btnNo.disable();
            self.btnYes.disable();
            self.confirmReset = false;
            self.updateUI();
          });
        });
      } else if(this.scoreMax) {
        this.drawMenu(ctx, [this.btnRetry, this.btnQuit], "Score maximal atteint !", "green", 32, FONT_FAMILY, "center", null, null, function() {
          self.btnRetry.addClickAction(self.canvas, function() {
            self.btnRetry.disable();
            self.reset();
          });
        });
      } else if(this.gameOver) {
        this.drawMenu(ctx, [this.btnRetry, this.btnQuit], "Game Over !", "#E74C3C", 32, FONT_FAMILY, "center", null, null, function() {
          self.btnRetry.addClickAction(self.canvas, function() {
            self.btnRetry.disable();
            self.reset();
          });

          if(self.snake.autoRetry) {
            setTimeout(function() {
              self.btnRetry.disable();
              self.reset();
            }, 500);
          }
        });
      } else if(this.paused && !this.gameOver && this.assetsLoaded) {
        this.drawMenu(ctx, [this.btnContinue, this.btnRetry, this.btnQuit], "Pause", "white", 32, FONT_FAMILY, "center", null, null, function() {
          self.btnContinue.addClickAction(self.canvas, function() {
            self.btnContinue.disable();
            self.btnRetry.disable();
            self.btnQuit.disable();
            self.start();
          });

          self.btnRetry.addClickAction(self.canvas, function() {
            self.btnRetry.disable();
            self.btnContinue.disable();
            self.btnQuit.disable();
            self.confirmReset = true;
            self.updateUI();
          });
        });
      } else if(this.assetsLoaded) {
        this.btnFullScreen.enable();
        this.btnPause.enable();

        this.btnFullScreen.addClickAction(this.canvas, function() {
          self.toggleFullscreen();
        });

        this.btnPause.addClickAction(this.canvas, function() {
          self.pause();
        });
      }

      if(this.displayFPS) {
        this.drawText(ctx, "FPS : " + this.currentFPS + " / Frames : " + this.frame + " / Ticks : " + Math.floor(this.frame / this.speed) + " / Speed : " + this.speed, "rgba(255, 255, 255, 0.5)", 24, FONT_FAMILY, "right", "bottom");
      }
    }
  };

  this.init();
}

Game.prototype.toString = function() {
  return this.grid.toString() + "\nScore : " + this.score + (this.displayFPS ? "\nFPS : " + this.currentFPS + " / Frames : " + this.frame + " / Ticks : " + Math.floor(this.frame / this.speed) : "") + (this.gameOver && !this.scoreMax ? "\nGame Over !" : "") + (this.scoreMax ? "\nScore maximal atteint !" : "") + (!this.gameOver && this.paused ? "\nEn pause" : "");
};

Game.prototype.getImageCase = function(position) {
  var imageRes = "";

  switch(this.grid.get(new Position(j, i))) {
      case WALL_VAL:
        imageRes = "assets/images/wall.png";
        break;
      case FRUIT_VAL:
        imageRes = "assets/images/fruit.png";
        break;
  }

  return imageRes;
};

Game.prototype.drawImage = function(ctx, imgSrc, x, y, width, height) {
  if(imgSrc != "") {
    var imageCase = this.imageLoader.get(imgSrc);
    ctx.drawImage(imageCase, x, y, width, height);
  }
};

Game.prototype.drawText = function(ctx, text, color, size, fontFamily, alignement, verticalAlignement, x, y) {
  var precFillStyle = ctx.fillStyle;
  var precFont = ctx.font;

  ctx.fillStyle = color;
  ctx.font = size + "px " + fontFamily;

  var lines = text.split('\n');

  if(verticalAlignement == "center") {
    y = (this.canvas.height / 2) - (size * lines.length) / 2;
  } else if(verticalAlignement == "top") {
    y = 5;
  } else if(verticalAlignement == "bottom") {
    y = (this.canvas.height) - (size * lines.length) / 2;
  }

  for (var i = 0; i < lines.length; i++) {
    var currentText = lines[i];

    if(alignement == "center") {
      ctx.fillText(currentText, (this.canvas.width / 2) - (ctx.measureText(currentText).width / 2), y + (size * i));
    } else if(alignement == "right") {
      ctx.fillText(currentText, (this.canvas.width) - (ctx.measureText(currentText).width) - 15, y + (size * i));
    } else if(alignement == "left") {
      ctx.fillText(currentText, 5, y + (size * i));
    } else {
      ctx.fillText(currentText, x, y + (size * i));
    }
  }

  ctx.fillStyle = precFillStyle;
  ctx.font = precFont;

  return {
    x: x,
    y: y,
    height: size * (lines.length - 1)
  };
};

Game.prototype.drawMenu = function(ctx, buttons, text, color, size, fontFamily, alignement, x, delay, func) {
  var self = this;

  setTimeout(function() {
    ctx.fillStyle = "rgba(44, 62, 80, 0.75)";
    ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);

    var lines = text.split('\n');
    var heightText = size * lines.length;
    var heightButtons = 0;

    for(i = 0; i < buttons.length; i++) {
      if(buttons[i].height == "auto") {
        heightButtons += buttons[i].fontSize * 1.75 + 5;
      } else {
        heightButtons += buttons[i].height + 5;
      }
    }

    var totalHeight = heightText + heightButtons;
    var startY = (self.canvas.height - totalHeight) / 2;

    self.drawText(ctx, text, color, size, fontFamily, alignement, "default", x, startY);

    for(i = 0; i < buttons.length; i++) {
      buttons[i].y = startY + heightText + (heightButtons / buttons.length) * i + (i * 5);
      buttons[i].enable();
      buttons[i].draw(self.canvas);
    }

    if(func != null) {
      func(true);
    }
  }, delay == null ? 100 : delay);
};

Game.prototype.drawSnake = function(ctx, caseWidth, caseHeight, totalWidth) {
  for(var i = 0; i < this.snake.length(); i++) {
    var position = this.snake.get(i);
    var posX = position.x;
    var posY = position.y;
    var caseX = Math.floor(posX * caseWidth + ((this.canvas.width - totalWidth) / 2));
    var caseY = 75 + posY * caseHeight;
    var nextX = Math.floor((posX + 1) * caseWidth + ((this.canvas.width - totalWidth) / 2));
    var nextY = 75 + (posY + 1) * caseHeight;
    var frame = (this.frame % this.speed == 0 ? 1 : this.frame % this.speed);
    var offsetX = Math.floor((nextX - caseX) / frame);
    var offsetY = Math.floor((nextY - caseY) / frame);
    var imageLoc = "";

    if(i == 0) {
      var direction = this.snake.getHeadPosition().direction;

      if(this.gameOver && !this.scoreMax) {
        switch(direction) {
          case BOTTOM:
            imageLoc = "assets/images/snake_dead.png";
            break;
          case RIGHT:
            imageLoc = "assets/images/snake_dead_2.png";
            break;
          case UP:
            imageLoc = "assets/images/snake_dead_3.png";
            break;
          case LEFT:
            imageLoc = "assets/images/snake_dead_4.png";
            break;
        }
      } else {
        switch(direction) {
          case BOTTOM:
            imageLoc = "assets/images/snake.png";
            break;
          case RIGHT:
            imageLoc = "assets/images/snake_2.png";
            break;
          case UP:
            imageLoc = "assets/images/snake_3.png";
            break;
          case LEFT:
            imageLoc = "assets/images/snake_4.png";
            break;
        }
      }
    } else if(i == this.snake.length() - 1) {
      var direction = this.snake.get(i - 1).direction;

      switch(direction) {
        case BOTTOM:
          imageLoc = "assets/images/body_end.png";
          break;
        case RIGHT:
          imageLoc = "assets/images/body_2_end.png";
          break;
        case UP:
          imageLoc = "assets/images/body_3_end.png";
          break;
        case LEFT:
          imageLoc = "assets/images/body_4_end.png";
          break;
      }
    } else {
      var prec = this.snake.get(i - 1);
      var next = this.snake.get(i + 1);
      var current = this.snake.get(i);

      /* if(prec.x < posX && next.x > posX || next.x < posX && prec.x > posX) {
        imageLoc = "assets/images/body_2.png";
      } else */ if((current.x == 0 && prec.x == this.grid.width - 1 && next.y > current.y) || (current.y == this.grid.height - 1 && prec.y == 0 && next.x < current.x) || ((prec.x > 0 || current.x < this.grid.width - 1) && (prec.x < posX && next.y > posY || next.x < posX && prec.y > posY))) {
        imageLoc = "assets/images/body_angle_1.png";
      } /* else if(prec.y < posY && next.y > posY || next.y < posY && prec.y > posY) {
        imageLoc = "assets/images/body.png";
      } */ else if((current.x == 0 && prec.x == this.grid.width - 1 && next.y < current.y) || (current.y == 0 && prec.y == this.grid.height - 1 && next.x < current.x) || ((prec.x > 0 || current.x < this.grid.width - 1) && (prec.y < posY && next.x < posX || next.y < posY && prec.x < posX))) {
        imageLoc = "assets/images/body_angle_4.png";
      } else if((current.x == this.grid.width - 1 && prec.x == 0 && next.y < current.y) || prec.x > posX && next.y < posY || next.x > posX && prec.y < posY) {
        imageLoc = "assets/images/body_angle_3.png";
      } else if((current.x == this.grid.width - 1 && prec.x == 0 && next.y > current.y) || (current.y == this.grid.height - 1 && prec.y == 0 && next.x > current.x) || prec.y > posY && next.x > posX || next.y > posY && prec.x > posX) {
        imageLoc = "assets/images/body_angle_2.png";
      } else if(prec.y == posY) {
        imageLoc = "assets/images/body_2.png";
      } else if(prec.x == posX) {
        imageLoc = "assets/images/body.png";
      }
    }

    this.drawImage(ctx, imageLoc, caseX, caseY, caseWidth, caseHeight);
  }
};

function Button(text, x, y, alignement, color, colorHover, width, height, fontSize, fontFamily, fontColor, imgSrc, imageLoader) {
  this.x = x || 0;
  this.y = y;
  this.initialX = x;
  this.width = width || "auto";
  this.height = height || "auto";
  this.clicked = false;
  this.hovered = false;
  this.text = text;
  this.fontSize = fontSize || 24;
  this.fontFamily = fontFamily || "sans-serif";
  this.fontColor = fontColor || "black";
  this.color = color || "rgba(0, 0, 0, 0)";
  this.colorHover = colorHover || "#95a5a6";
  this.triggerClick;
  this.triggerHover;
  this.init = false;
  this.disabled = false;
  this.alignement = alignement || "default";
  this.image;
  this.imgSrc = imgSrc;

  this.draw = function(canvas) {
    var ctx = canvas.getContext("2d");
    var precFillStyle = ctx.fillStyle;
    var precFont = ctx.font;

    ctx.font = this.fontSize + "px " + this.fontFamily;
    var textSize = ctx.measureText(this.text);

    if(this.imgSrc != null && imageLoader != null) {
      this.loadImage(imageLoader);
    }

    if(this.image != null) {
      var imgWidth = this.image.width;
      var imgHeight = this.image.height;

      if(this.width == "auto") {
        this.width = imgWidth * 1.25;
      }

      if(this.height == "auto") {
        this.height = imgHeight * 1.5;
      }
    } else if(this.text != null) {
      if(this.width == "auto") {
        this.width = textSize.width + 25;
      }

      if(this.height == "auto") {
        this.height = this.fontSize * 1.75;
      }
    }

    if(this.alignement == "center") {
      this.x =  (canvas.width / 2) - (this.width / 2) - this.initialX;
    } else if(this.alignement == "right") {
      this.x = (canvas.width) - (this.width) - 5 - this.initialX;
    }

    if(this.hovered) {
      ctx.fillStyle = this.colorHover;
    } else {
      ctx.fillStyle = this.color;
    }

    ctx.fillRect(this.x, this.y, this.width, this.height);

    if(this.image != null) {
      if(this.image.width > this.width || this.image.height > this.height) {
        var aspectRatio = this.image.width / this.image.height;
        imgWidth = Math.floor(this.width / 1.25);
        imgHeight = Math.floor(imgWidth / aspectRatio);
      }

      var imgX = this.x + (this.width / 2) - (imgWidth / 2);
      var imgY = this.y + (this.height / 2) - (imgHeight / 2);

      ctx.drawImage(this.image, imgX, imgY, imgWidth, imgHeight);
    } else if(this.text != null) {
      ctx.fillStyle = this.fontColor;

      var textX = this.x + (this.width / 2) - (textSize.width / 2);
      var textY = this.y + (this.height) - (this.fontSize / 2);

      ctx.fillText(this.text, textX, textY);
    }

    ctx.fillStyle = precFillStyle;
    ctx.font = precFont;

    if(!this.init) {
      this.addMouseOverAction(canvas, null);
    }

    this.init = true;
  };

  this.getMousePos = function(canvas, event) {
    var rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  this.isInside = function(pos) {
    return pos.x > this.x && pos.x < this.x + this.width && pos.y < this.y + this.height && pos.y > this.y;
  };

  this.addClickAction = function(canvas, trigger) {
    if(!this.disabled) {
      this.triggerClick = trigger;
  		var self = this;

      function clickFunction(evt){
        if(!self.disabled) {
          if(self.isInside(self.getMousePos(canvas, evt))) {
            if(self.triggerClick != null) {
              self.triggerClick();
            }

            self.hovered = false;
            self.clicked = true;
    			}
        }
      };

      canvas.addEventListener("click", clickFunction, false);
    }
	};

  this.removeClickAction = function(trigger) {
    if(self.triggerClick != null)  {
      self.triggerClick = null;
    }
  };

  this.addMouseOverAction = function(canvas, trigger) {
    if(!this.disabled) {
      this.triggerHover = trigger;

      var self = this;

  		function mouseOverFunction(evt) {
        if(!self.disabled) {
    			if(self.isInside(self.getMousePos(canvas, evt))) {
    				if(self.triggerHover != null && !self.disabled) {
              self.triggerHover();
            }

    				self.hovered = true;
            self.clicked = false;
    			} else {
            self.hovered = false;
    			}

          self.draw(canvas);
        }
  		};

      canvas.addEventListener("mousemove", mouseOverFunction, false);
    }
	};

  this.removeHoverAction = function(trigger) {
    if(self.triggerHover != null)  {
      self.triggerHover = null;
    }
  };

  this.disable = function() {
    this.disabled = true;
  };

  this.enable = function() {
    this.disabled = false;
  };

  this.loadImage = function(imageLoader) {
    this.image = imageLoader.get(this.imgSrc);
  };
}

function ButtonImage(imgSrc, x, y, alignement, width, height, color, colorHover, imageLoader) {
  return new Button(null, x, y, alignement, color, colorHover, width, height, null, null, null, imgSrc, imageLoader);
}

function gameTest() {
  var grid = new Grid(20, 20, false, false);
  var snake = new Snake(RIGHT, 1, grid, PLAYER_IA, IA_LEVEL_HIGH, true);
  game = new Game(grid, snake, 1, document.getElementById("gameDiv"), true);
  game.start();
}

gameTest();
