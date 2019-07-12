/*
 * Copyright (C) 2019 Eliastik (eliastiksofts.com)
 *
 * This file is part of "SnakeIA".
 *
 * "SnakeIA" is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * "SnakeIA" is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with "SnakeIA".  If not, see <http://www.gnu.org/licenses/>.
 */
// Constants
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
document.fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
document.onfullscreenchange = document.onfullscreenchange || document.onwebkitfullscreenchange || document.onwebkitfullscreenchange || document.MSFullscreenChange;
document.exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
screen.orientation = screen.msOrientation || screen.mozOrientation || screen.orientation;
// Case type
EMPTY_VAL = 0;
SNAKE_VAL = 1;
FRUIT_VAL = 2;
WALL_VAL = 3;
// Player type
PLAYER_AI = "PLAYER_AI";
PLAYER_HUMAN = "PLAYER_HUMAN";
// AI level
AI_LEVEL_RANDOM = "AI_LEVEL_RANDOM";
AI_LEVEL_LOW = "AI_LEVEL_LOW";
AI_LEVEL_DEFAULT = "AI_LEVEL_DEFAULT";
AI_LEVEL_HIGH = "AI_LEVEL_HIGH";
AI_LEVEL_ULTRA = "AI_LEVEL_ULTRA";
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
KEY_ENTER = 13;
// UI
FONT_FAMILY = "Delius";
FONT_SIZE = 32;
TARGET_FPS = 60;
IMAGE_SNAKE_HUE = 75;
IMAGE_SNAKE_SATURATION = 50;
IMAGE_SNAKE_VALUE = 77;
// Infos
APP_VERSION = "1.3";
DATE_VERSION = "2019-07-12";

// Return an integer between min (inclusive) and max (inclusive)
function randRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Color functions
function addHue(hue, add) {
  var res = hue + add;

  if(res > 360) {
    res = (res - 360);
  } else if(res < 0) {
    res = (360 + res);
  }

  return res;
}

function hsvToRgb(h, s, v) {
  var r, g, b, i, f, p, q, t;

  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);

  switch(i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hslToName(h, s, l) {
  if(s <= 10 && l >= 90) {
    return window.i18next.t("engine.colors.white");
  } else if((s <= 10 && l <= 70) || s === 0) {
    return window.i18next.t("engine.colors.gray");
  } else if(l <= 15) {
    return window.i18next.t("engine.colors.black");
  } else if((h >= 0 && h <= 6) || h >= 350) {
    return window.i18next.t("engine.colors.red");
  } else if(h >= 7 && h <= 42) {
    return window.i18next.t("engine.colors.orange");
  } else if(h >= 43 && h <= 70) {
    return window.i18next.t("engine.colors.yellow");
  } else if(h >= 71 && h <= 156) {
    return window.i18next.t("engine.colors.green");
  } else if(h >= 157 && h <= 221) {
    return window.i18next.t("engine.colors.blue");
  } else if(h >= 222 && h <= 290) {
    return window.i18next.t("engine.colors.purple");
  } else if(h >= 291 && h <= 349) {
    return window.i18next.t("engine.colors.pink");
  }
}

// Event handlers objects type
function Event(name) {
  this.name = name;
  this.callbacks = [];
}

Event.prototype.registerCallback = function(callback) {
  this.callbacks.push(callback);
};

function Reactor() {
  this.events = {};
}

Reactor.prototype.registerEvent = function(eventName) {
  var event = new Event(eventName);
  this.events[eventName] = event;
};

Reactor.prototype.dispatchEvent = function(eventName, eventArgs) {
  this.events[eventName].callbacks.forEach(function(callback) {
    callback(eventArgs);
  });
};

Reactor.prototype.addEventListener = function(eventName, callback) {
  this.events[eventName].registerCallback(callback);
};

function Position(x, y, direction) {
  this.x = x;
  this.y = y;
  this.direction = direction;

  this.convertToKeyDirection = function() {
    switch(this.direction) {
      case UP:
        return KEY_UP;
      case RIGHT:
        return KEY_RIGHT;
      case LEFT:
        return KEY_LEFT;
      case BOTTOM:
        return KEY_BOTTOM;
      default:
        return this.direction;
    }
  };

  this.convertToSimpleDirection = function() {
    switch(this.direction) {
      case KEY_UP:
        return UP;
      case KEY_RIGHT:
        return RIGHT;
      case KEY_LEFT:
        return LEFT;
      case KEY_BOTTOM:
        return BOTTOM;
      default:
        return this.direction;
    }
  };
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

    for(var i = 0; i < this.height; i++) {
      this.grid[i] = new Array(this.width);

      for(var j = 0; j < this.width; j++) {
        if((borderWalls && (i == 0 || i == this.height - 1 || j == 0 || j == this.width - 1)) || (generateWalls && Math.random() > 0.65)) {
          this.grid[i][j] = WALL_VAL;
        } else {
          this.grid[i][j] = EMPTY_VAL;
        }
      }
    }

    if(generateWalls) {
      this.fixWalls(borderWalls);
    }
  };

  this.fixWalls = function(borderWalls) {
    if(borderWalls) {
      var startY = 1; var endY = this.height - 1;
      var startX = 1; var endX = this.width - 1;
    } else {
      var startY = 0; var endY = this.height;
      var startX = 0; var endX = this.width;
    }

    for(var i = startY; i < endY; i++) {
      for(var j = startX; j < endX; j++) {
        var currentPos = new Position(j, i);
        var upperCase = this.getNextPosition(currentPos, UP);
        var upperLeftCase = this.getNextPosition(upperCase, LEFT);
        var upperRightCase = this.getNextPosition(upperCase, RIGHT);
        var downCase = this.getNextPosition(currentPos, BOTTOM);
        var downLeftCase = this.getNextPosition(downCase, LEFT);
        var downRightCase = this.getNextPosition(downCase, RIGHT);

        if(this.get(upperLeftCase) == WALL_VAL || this.get(upperRightCase) == WALL_VAL || this.get(downLeftCase) == WALL_VAL || this.get(downRightCase) == WALL_VAL) {
          this.set(EMPTY_VAL, currentPos);
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

  this.valToChar = function(value) {
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
  };

  this.getGraph = function(snakePos) {
    var res = new Array(this.height);

    for(var i = 0; i < this.height; i++) {
      res[i] = new Array(this.width);

      for(var j = 0; j < this.width; j++) {
        var currentPos = new Position(j, i);

        if(this.isDeadPosition(currentPos)) {
          res[i][j] = 1;
        } else {
          res[i][j] = 0;
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

    if(this.getTotal(EMPTY_VAL) > 0) {
      var randomPos = this.getRandomPosition();

      while(this.get(randomPos) != EMPTY_VAL) {
        randomPos = this.getRandomPosition();
      }

      this.fruitPos = randomPos;
      this.set(FRUIT_VAL, randomPos);
    } else {
      return false;
    }

    return true;
  };

  this.getOnLine = function(type, line) {
    var tot = 0;

    for(var j = 0; j < this.width; j++) {
      if(this.get(new Position(j, line)) == type) {
        tot++;
      }
    }

    return tot;
  };

  this.getTotal = function(type) {
    var tot = 0;

    for(var i = 0; i < this.height; i++) {
      tot += this.getOnLine(type, i);
    }

    return tot;
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
      position.x = this.width - 1;
    } else if(position.x >= this.width) {
      position.x = 0;
    }

    if(position.y < 0) {
      position.y = this.height - 1;
    } else if(position.y >= this.height) {
      position.y = 0;
    }

    return position;
  };

  this.getDirectionTo = function(position, otherPosition) {
    if(this.getNextPosition(position, UP).equals(otherPosition)) {
      return UP;
    } else if(this.getNextPosition(position, BOTTOM).equals(otherPosition)) {
      return BOTTOM;
    } else if(this.getNextPosition(position, RIGHT).equals(otherPosition)) {
      return RIGHT;
    } else if(this.getNextPosition(position, LEFT).equals(otherPosition)) {
      return LEFT;
    }

    return -1;
  };

  this.isDeadPosition = function(position) {
    return this.get(position) == SNAKE_VAL || this.get(position) == WALL_VAL;
  };

  this.init();
}

Grid.prototype.toString = function() {
  res = "";

  for(var i = 0; i < this.height; i++) {
    for(var j = 0; j < this.width; j++) {
      res += this.valToChar(this.get(new Position(j, i))) + " ";
    }

    res += "\n";
  }

  return res;
};

function Snake(direction, length, grid, player, aiLevel, autoRetry) {
  this.direction = direction || RIGHT;
  this.initialDirection = direction || RIGHT;
  this.initialLength = length;
  this.errorInit = false;
  this.grid = grid;
  this.queue = [];
  this.player = player || PLAYER_HUMAN;
  this.aiLevel = aiLevel || AI_LEVEL_DEFAULT;
  this.autoRetry = autoRetry === undefined ? false : autoRetry;
  this.score = 0;
  this.gameOver = false;
  this.scoreMax = false;
  this.color;

  this.init = function() {
    var spaceLineAvailable = 0;

    for(var i = 0; i < this.grid.height; i++) {
      var emptyOnLine = 0;

      for(var j = 0; j < this.grid.width; j++) {
        if(this.grid.get(new Position(j, i)) == EMPTY_VAL) {
          emptyOnLine++;
        } else {
          emptyOnLine = 0;
        }

        if(emptyOnLine >= this.initialLength) {
          spaceLineAvailable++;
          break;
        }
      }
    }

    if(spaceLineAvailable <= 0) {
      this.errorInit = true;
      return;
    }

    var posValidated = false;
    var startPos;

    while(!posValidated) {
      posValidated = true;
      startPos = this.grid.getRandomPosition();

      for(var i = this.initialLength - 1; i >= 0; i--) {
        var posX = startPos.x - i;

        if(posX < 0) {
          posX = this.grid.width - -posX;
        }

        if(this.grid.get(new Position(posX, startPos.y)) != EMPTY_VAL) {
          posValidated = false;
        }
      }
    }

    for(var i = this.initialLength - 1; i >= 0; i--) {
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
    this.score = 0;
    this.gameOver = false;
    this.scoreMax = false;
    this.init();
  };

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

  this.hasMaxScore = function() {
    return this.grid.getTotal(EMPTY_VAL) <= 0;
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
    return this.grid.getNextPosition(oldPos, newDirection);
  };

  this.getDirectionTo = function(position, otherPosition) {
    return this.grid.getDirectionTo(position, otherPosition);
  };

  this.simulateGameTick = function(snake, direction) {
    var direction = direction === undefined ? snake.ai(false) : direction;
    snake.moveTo(direction);

    var headSnakePos = snake.getHeadPosition();
    headSnakePos = snake.getNextPosition(headSnakePos, snake.direction);

    if(snake.grid.isDeadPosition(headSnakePos)) {
      return 0;
    } else {
      if(snake.grid.get(headSnakePos) == FRUIT_VAL) {
        snake.insert(headSnakePos);

        if(!snake.grid.setFruit()) {
          return 0;
        }

        return 2;
      } else {
        snake.insert(headSnakePos);
        snake.remove();
      }
    }

    return 1;
  };

  this.copy = function() {
    var snake = new Snake(direction, 3, new Grid(this.grid.width, this.grid.height, false, false), this.player, this.aiLevel, false);

    for(var i = 0; i < snake.grid.height; i++) {
      for(var j = 0; j < snake.grid.width; j++) {
        snake.grid.set(this.grid.get(new Position(j, i)), new Position(j, i));
      }
    }

    snake.queue = [];

    for(var i = 0; i < this.queue.length; i++) {
      var elem = this.queue[i];
      snake.queue.push(new Position(elem.x, elem.y, elem.direction));
    }

    return snake;
  };

  this.randomAI = function() {
    var currentPosition = this.getHeadPosition();
    var top = this.grid.isDeadPosition(this.getNextPosition(currentPosition, KEY_UP));
    var left = this.grid.isDeadPosition(this.getNextPosition(currentPosition, KEY_LEFT));
    var bottom = this.grid.isDeadPosition(this.getNextPosition(currentPosition, KEY_BOTTOM));
    var right = this.grid.isDeadPosition(this.getNextPosition(currentPosition, KEY_RIGHT));

    if(top && left && bottom && right) {
      return KEY_UP;
    } else {
      var direction = null;

      while(direction == null || this.grid.isDeadPosition(this.getNextPosition(currentPosition, direction))) {
        var r = randRange(1, 4);

        switch(r) {
          case 1:
            direction = KEY_UP;
            break;
          case 2:
            direction = KEY_LEFT;
            break;
          case 3:
            direction = KEY_BOTTOM;
            break;
          case 4:
            direction = KEY_RIGHT;
            break;
        }
      }

      return direction;
    }
  };

  this.simpleAI = function() {
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

      if(this.grid.isDeadPosition(nextPosition)) {
        var currentDirection = this.direction;
        var firstDifferentDirection = null;

        for(var i = 1; i < this.queue.length; i++) {
          if(this.get(i).direction != currentDirection) {
            firstDifferentDirection = this.get(i).direction;
            break;
          }
        }

        nextPosition = this.getNextPosition(currentPosition, firstDifferentDirection);

        if(this.grid.isDeadPosition(nextPosition)) {
          if(!this.grid.isDeadPosition(this.getNextPosition(currentPosition, KEY_UP))) {
            directionNext = KEY_UP;
          } else if(!this.grid.isDeadPosition(this.getNextPosition(currentPosition, KEY_RIGHT))) {
            directionNext = KEY_RIGHT;
          } else if(!this.grid.isDeadPosition(this.getNextPosition(currentPosition, KEY_BOTTOM))) {
            directionNext = KEY_BOTTOM;
          } else if(!this.grid.isDeadPosition(this.getNextPosition(currentPosition, KEY_LEFT))) {
            directionNext = KEY_LEFT;
          }
        } else {
          directionNext = nextPosition.convertToKeyDirection();
        }
      }

      return directionNext;
    }
  };

  this.ai = function(bestFind) {
    var bestFind = bestFind === undefined ? false : bestFind;
    var res = KEY_RIGHT;

    if(this.aiLevel == AI_LEVEL_RANDOM) {
      res = this.randomAI();
    } else if(this.aiLevel == AI_LEVEL_LOW) {
        res = this.simpleAI();
    } else {
      if(this.grid.fruitPos != null) {
        var currentPosition = this.getHeadPosition();
        var fruitPos = new Position(this.grid.fruitPos.x, this.grid.fruitPos.y);

        var grid = this.grid.getGraph(currentPosition);
        var graph = new Lowlight.Astar.Configuration(grid, {
          order: "yx",
          torus: (this.aiLevel == AI_LEVEL_HIGH || this.aiLevel == AI_LEVEL_ULTRA) ? true : false,
          diagonals: false,
          cutting: false,
          cost(a, b) { return b == 1 ? null : 1 }
        });
        var path = graph.path({x: currentPosition.x, y: currentPosition.y}, {x: fruitPos.x, y: fruitPos.y});

        if(path.length > 1) {
          var nextPosition = new Position(path[1].x, path[1].y);
          res = new Position(null, null, this.getDirectionTo(currentPosition, nextPosition)).convertToKeyDirection();
        } else if(this.aiLevel == AI_LEVEL_HIGH || this.aiLevel == AI_LEVEL_ULTRA) {
          res = this.simpleAI();
        }
      }
    }

    return res;
  };

  this.getAILevelText = function() {
    switch(this.aiLevel) {
      case AI_LEVEL_RANDOM:
        return window.i18next.t("engine.aiLevelList.random");
      case AI_LEVEL_LOW:
        return window.i18next.t("engine.aiLevelList.low");
      case AI_LEVEL_DEFAULT:
        return window.i18next.t("engine.aiLevelList.normal");
      case AI_LEVEL_HIGH:
        return window.i18next.t("engine.aiLevelList.high");
      case AI_LEVEL_ULTRA:
        return window.i18next.t("engine.aiLevelList.ultra");
      default:
        return window.i18next.t("engine.aiLevelList.normal");
    }
  };

  this.init();
}

function ImageLoader() {
  this.images = {};
  this.triedLoading = 0;
  this.hasError = false;

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
        self.hasError = true;

        return func(true);
      }

      self.loadImage(src, func);
    }
  };

  this.get = function(src) {
    return this.images[src];
  };
}

function Game(grid, snake, speed, appendTo, enablePause, enableRetry, progressiveSpeed, canvasWidth, canvasHeight, displayFPS, outputType) {
  // Assets loader
  this.imageLoader;
  this.assetsLoaded = false;
  // Game settings
  this.grid = grid;
  this.snakes = snake;
  this.speed = speed || 8;
  this.initialSpeed = speed || 8;
  this.initialSpeedUntouched = speed || 8;
  this.appendTo = appendTo;
  this.enablePause = enablePause === undefined ? true : enablePause;
  this.enableRetry = enableRetry === undefined ? true : enableRetry;
  this.progressiveSpeed = progressiveSpeed === undefined ? false : progressiveSpeed;
  this.displayFPS = displayFPS === undefined ? false : displayFPS;
  this.outputType = outputType || OUTPUT_GRAPHICAL;
  this.countBeforePlay = 3;
  // Game variables
  this.lastKey = -1;
  this.numFruit = 1;
  this.frame = 0;
  this.lastFrame = 0;
  this.currentFPS = 0;
  // Game state variables
  this.paused = true;
  this.exited = false;
  this.killed = false;
  this.isReseted = true;
  this.gameOver = false;
  this.gameFinished = false; // only used if 2 and more snakes
  this.scoreMax = false;
  this.errorOccured = false;
  // Menus state variables
  this.lastKeyMenu = -1;
  this.selectedButton = 0;
  this.confirmReset = false;
  this.confirmExit = false;
  this.getInfos = false;
  this.getInfosGame = false;
  // DOM elements and others settings
  this.textarea;
  this.canvas;
  this.canvasCtx;
  this.canvasWidth = canvasWidth || CANVAS_WIDTH;
  this.canvasHeight = canvasHeight || CANVAS_HEIGHT;
  this.fontSize = FONT_SIZE
  // Intervals, timeouts, frames
  this.intervalCountFPS;
  this.intervalPlay;
  this.frameGlobal;
  this.frameDisplayMenu;
  // Buttons
  this.btnFullScreen;
  this.btnPause;
  this.btnContinue;
  this.btnRetry;
  this.btnQuit;
  this.btnYes;
  this.btnNo;
  this.btnOK;
  this.btnAbout;
  this.btnInfosGame;
  this.btnTopArrow;
  this.btnRightArrow;
  this.btnLeftArrow;
  this.btnBottomArrow;
  // Events
  this.reactor = new Reactor();
  this.reactor.registerEvent("onStart");
  this.reactor.registerEvent("onPause");
  this.reactor.registerEvent("onContinue");
  this.reactor.registerEvent("onReset");
  this.reactor.registerEvent("onStop");
  this.reactor.registerEvent("onExit");
  this.reactor.registerEvent("onScoreIncreased");

  this.init = function() {
    this.imageLoader = new ImageLoader();

    if(this.outputType == OUTPUT_TEXT) {
      this.textarea = document.createElement("textarea");
      this.textarea.style.width = this.grid.width * 16.5 + "px";
      this.textarea.style.height = this.grid.height * 16 + 100 + "px";
      this.appendTo.appendChild(this.textarea);
      this.assetsLoaded = true;
    } else if(this.outputType == OUTPUT_GRAPHICAL) {
      this.canvas = document.createElement("canvas");
      this.canvas.width = this.canvasWidth;
      this.canvas.height = this.canvasHeight;
      this.canvasCtx = this.canvas.getContext("2d");
      this.appendTo.appendChild(this.canvas);
      this.btnFullScreen = new ButtonImage("assets/images/fullscreen.png", null, 5, "right", null, 64, 64);
      this.btnPause = new ButtonImage("assets/images/pause.png", 75, 5, "right", null, 64, 64);
      this.btnContinue = new Button(window.i18next.t("engine.continue"), null, null, "center", "#3498db", "#246A99");
      this.btnRetry = new Button(window.i18next.t("engine.reset"), null, null, "center", "#3498db", "#246A99");
      this.btnQuit = new Button(window.i18next.t("engine.exit"), null, null, "center", "#3498db", "#246A99");
      this.btnYes = new Button(window.i18next.t("engine.yes"), null, null, "center", "#3498db", "#246A99");
      this.btnNo = new Button(window.i18next.t("engine.no"), null, null, "center", "#3498db", "#246A99");
      this.btnOK = new Button(window.i18next.t("engine.ok"), null, null, "center", "#3498db", "#246A99");
      this.btnAbout = new Button(window.i18next.t("engine.about"), null, null, "center", "#3498db", "#246A99");
      this.btnInfosGame = new Button(window.i18next.t("engine.infosGame"), null, null, "center", "#3498db", "#246A99");
      this.btnTopArrow = new ButtonImage("assets/images/up.png", 56, 100, "right", "bottom", 64, 64);
      this.btnRightArrow = new ButtonImage("assets/images/right.png", 0, 46, "right", "bottom", 64, 64);
      this.btnLeftArrow = new ButtonImage("assets/images/left.png", 112, 46, "right", "bottom", 64, 64);
      this.btnBottomArrow = new ButtonImage("assets/images/bottom.png", 56, 0, "right", "bottom", 64, 64);

      this.btnFullScreen.addClickAction(this.canvas, function() {
        self.toggleFullscreen();
      });

      this.btnPause.addClickAction(this.canvas, function() {
        self.pause();
      });

      this.btnTopArrow.addClickAction(this.canvas, function() {
        self.lastKey = KEY_UP;
      });

      this.btnBottomArrow.addClickAction(this.canvas, function() {
        self.lastKey = KEY_BOTTOM;
      });

      this.btnLeftArrow.addClickAction(this.canvas, function() {
        self.lastKey = KEY_LEFT;
      });

      this.btnRightArrow.addClickAction(this.canvas, function() {
        self.lastKey = KEY_RIGHT;
      });
    }

    if(!Array.isArray(this.snakes)) {
      this.snakes = [this.snakes];
    }

    var startHue = randRange(0, 360);

    for(var i = 0; i < this.snakes.length; i++) {
      startHue = addHue(startHue, Math.round(360 / (this.snakes.length)));
      this.snakes[i].color = startHue;
    }

    this.grid.setFruit();

    var self = this;

    document.addEventListener("keydown", function(evt) {
      if(!self.paused) {
        if(evt.keyCode == KEY_ENTER && self.outputType == OUTPUT_GRAPHICAL) {
          self.pause();
        } else {
          self.lastKey = evt.keyCode;
        }
      } else {
        self.lastKeyMenu = evt.keyCode;
        self.updateUI();
      }
    });

    this.setIntervalCountFPS();

    window.addEventListener("blur", function() {
      if(!self.paused) {
        self.pause();
      }
    }, false);

    window.addEventListener("resize", function() {
      self.autoResizeCanvas();
    }, true);

    this.autoResizeCanvas();
  };

  this.autoResizeCanvas = function() {
    if(this.outputType == OUTPUT_GRAPHICAL && !this.killed) {
      if(!document.fullscreenElement) {
        if(this.canvasWidth >= document.documentElement.clientWidth * 0.85) {
          var ratio = this.canvasWidth / this.canvasHeight;
          this.canvas.width = document.documentElement.clientWidth * 0.85;
          this.canvas.height = this.canvas.width / ratio;
        } else {
          this.canvas.width = this.canvasWidth;
          this.canvas.height = this.canvasHeight;
        }

        this.updateUI();
      }
    }
  };

  this.setIntervalCountFPS = function() {
    this.clearIntervalCountFPS();

    var self = this;

    this.intervalCountFPS = window.setInterval(function() {
      self.countFPS();
    }, 1000);
  };

  this.countFPS = function() {
    if(this.lastFrame > 0 && !this.paused) {
      this.currentFPS = this.frame - this.lastFrame;
      this.lastFrame = this.frame;

      if(this.currentFPS < TARGET_FPS * 0.90 || this.currentFPS > TARGET_FPS * 1.10) {
        this.speed = Math.floor(this.initialSpeed * (this.currentFPS / TARGET_FPS));
        this.speed = this.speed < 1 ? 1 : this.speed;
      } else {
        this.speed = this.initialSpeed;
      }
    }
  };

  this.clearIntervalCountFPS = function() {
    clearInterval(this.intervalCountFPS);
  };

  this.getNBPlayer = function(type) {
    var numPlayer = 0;

    for(var i = 0; i < this.snakes.length; i++) {
      if(this.snakes[i].player == type) {
        numPlayer++;
      }
    }

    return numPlayer;
  };

  this.getPlayer = function(num, type) {
    var numPlayer = 0;

    for(var i = 0; i < this.snakes.length; i++) {
      if(this.snakes[i].player == type) {
        numPlayer++;
      }

      if(numPlayer == num) {
        return this.snakes[i];
      }
    }

    return null;
  };

  this.reset = function() {
    this.paused = true;
    this.isReseted = true;
    this.exited = false;
    this.reactor.dispatchEvent("onReset");
    this.clearIntervalCountFPS();
    this.clearIntervalPlay();
    this.grid.init();

    for(var i = 0; i < this.snakes.length; i++) {
      this.snakes[i].reset();
    }

    this.numFruit = 1;
    this.frame = 0;
    this.lastFrame = 0;
    this.currentFPS = TARGET_FPS;
    this.scoreMax = false;
    this.errorOccured = false;
    this.lastKey = -1;
    this.gameOver = false;
    this.gameFinished = false;
    this.initialSpeed = this.initialSpeedUntouched;
    this.speed = this.initialSpeedUntouched;
    this.grid.setFruit();
    this.start();
  };

  this.onReset = function(callback) {
    this.reactor.addEventListener("onReset", callback);
  };

  this.start = function() {
    for(var i = 0; i < this.snakes.length; i++) {
      if(this.snakes[i].errorInit) {
        console.error(window.i18next.t("engine.initFailed"));
        this.errorOccured = true;
        this.stop();
      }
    }

    if(this.paused && !this.gameOver && !this.killed && this.assetsLoaded && !this.scoreMax) {
      this.disableAllButtons();
      this.getInfos = false;
      this.getInfosGame = false;
      this.confirmExit = false;
      this.confirmReset = false;
      this.countBeforePlay = 3;
      this.updateUI();
      this.clearIntervalPlay();
      var self = this;

      this.intervalPlay = setInterval(function() {
        self.countBeforePlay--;

        if(self.countBeforePlay <= 0) {
          self.clearIntervalPlay();
          self.paused = false;
          self.isReseted = false;
          self.lastFrame = self.frame > 0 ? self.frame : 1;
          self.currentFPS = TARGET_FPS;
          self.setIntervalCountFPS();
          self.tick();
          self.reactor.dispatchEvent("onStart");
        } else {
          self.updateUI();
        }
      }, 1000);
    }

    if(!this.assetsLoaded) {
      this.loadAssets();
      this.updateUI();
    }
  };

  this.clearIntervalPlay = function() {
    clearInterval(this.intervalPlay);
  };

  this.onStart = function(callback) {
    this.reactor.addEventListener("onStart", callback);
  };

  this.onContinue = function(callback) {
    this.reactor.addEventListener("onContinue", callback);
  };

  this.stop = function() {
    this.paused = true;
    this.gameOver = true;
    this.clearIntervalCountFPS();
    this.clearIntervalPlay();
    this.reactor.dispatchEvent("onStop");
  };

  this.onStop = function(callback) {
    this.reactor.addEventListener("onStop", callback);
  };

  this.pause = function() {
    this.paused = true;
    this.clearIntervalCountFPS();
    this.clearIntervalPlay();
    this.updateUI();
    this.reactor.dispatchEvent("onPause");
  };

  this.onPause = function(callback) {
    this.reactor.addEventListener("onPause", callback);
  };

  this.kill = function() {
    this.paused = true;
    this.gameOver = true;
    this.killed = true;

    for(var i = 0; i < this.snakes.length; i++) {
      this.snakes[i].autoRetry = false;
    }

    this.clearIntervalCountFPS();
    this.clearIntervalPlay();
    window.cancelAnimationFrame(this.frameGlobal);
    window.cancelAnimationFrame(this.frameDisplayMenu);

    if(this.outputType == OUTPUT_TEXT) {
      this.appendTo.removeChild(this.textarea);
      this.textarea = null;
    } else if(this.outputType == OUTPUT_GRAPHICAL) {
      this.appendTo.removeChild(this.canvas);
      this.canvas = null;
      this.canvasCtx = null;
    }
  };

  this.exit = function() {
    this.stop();
    this.exited = true;
    this.updateUI();
    this.reactor.dispatchEvent("onExit");
  }

  this.onExit = function(callback) {
    this.reactor.addEventListener("onExit", callback);
  };

  this.tick = function() {
    this.updateUI();
    var self = this;

    this.frameGlobal = window.requestAnimationFrame(function() {
      if(!self.paused && !self.killed) {
        self.frame++;

        if(self.frame % self.speed == 0) {
          for(var i = 0; i < self.snakes.length; i++) {
            if(!self.snakes[i].gameOver && !self.snakes[i].scoreMax) {
              if(self.snakes[i].player == PLAYER_HUMAN) {
                self.snakes[i].moveTo(self.lastKey);
              } else if(self.snakes[i].player == PLAYER_AI) {
                self.snakes[i].moveTo(self.snakes[i].ai(true));
              }

              var headSnakePos = self.snakes[i].getHeadPosition();
              headSnakePos = self.snakes[i].getNextPosition(headSnakePos, self.snakes[i].direction);

              if(self.grid.isDeadPosition(headSnakePos)) {
                self.snakes[i].gameOver = true;
              } else {
                if(self.grid.get(headSnakePos) == FRUIT_VAL) {
                  self.snakes[i].score++;
                  self.reactor.dispatchEvent("onScoreIncreased");
                  self.snakes[i].insert(headSnakePos);

                  if(self.snakes[i].hasMaxScore()) {
                    self.scoreMax = true;
                    self.snakes[i].scoreMax = true;
                  } else {
                    self.numFruit++;
                    self.grid.setFruit();
                  }

                  if(self.snakes.length <= 1 && self.progressiveSpeed && self.snakes[i].score > 0 && self.initialSpeed > 1) {
                    self.initialSpeed = Math.ceil(((-self.initialSpeedUntouched / 100) * self.snakes[i].score) + self.initialSpeedUntouched);
                    self.initialSpeed = self.initialSpeed < 1 ? 1 : self.initialSpeed;
                  }
                } else {
                  self.snakes[i].insert(headSnakePos);
                  self.snakes[i].remove();
                }
              }
            }

            var nbOver = 0;

            for(var j = 0; j < self.snakes.length; j++) {
              (self.snakes[j].gameOver || self.snakes[j].scoreMax) && nbOver++;
            }

            if(nbOver >= self.snakes.length) {
              self.stop();

              if(self.snakes.length > 1) {
                self.gameFinished = true;
              }
            }
          }
        }

        self.tick();
      }
    });
  };

  this.onScoreIncreased = function(callback) {
    this.reactor.addEventListener("onScoreIncreased", callback);
  };

  this.toggleFullscreen = function() {
    if(this.outputType == OUTPUT_GRAPHICAL && !this.killed) {
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
        }
      }

      var self = this;

      document.onfullscreenchange = function(event) {
        if(self.outputType == OUTPUT_GRAPHICAL && !self.killed) {
          if(document.fullscreenElement == self.canvas) {
            self.canvas.width = window.innerWidth;
            self.canvas.height = window.innerHeight;

            window.addEventListener("resize", function() {
              if(self.outputType == OUTPUT_GRAPHICAL && !self.killed) {
                if(document.fullscreenElement == self.canvas) {
                  self.canvas.width = window.innerWidth;
                  self.canvas.height = window.innerHeight;

                  self.updateUI();
                }
              }
            }, true);

            if(screen.orientation.lock != undefined) {
              screen.orientation.lock("landscape");
            }
          } else {
            self.autoResizeCanvas();
          }

          self.updateUI();
        }
      };
    }
  };

  this.loadAssets = function() {
    var self = this;

    this.imageLoader.load(["assets/images/snake_4.png", "assets/images/snake_3.png", "assets/images/snake_2.png", "assets/images/snake.png", "assets/images/body_4_end.png", "assets/images/body_3_end.png", "assets/images/body_2_end.png", "assets/images/body_end.png", "assets/images/body_2.png", "assets/images/body.png", "assets/images/wall.png", "assets/images/fruit.png", "assets/images/body_angle_1.png", "assets/images/body_angle_2.png", "assets/images/body_angle_3.png", "assets/images/body_angle_4.png", "assets/images/pause.png", "assets/images/fullscreen.png", "assets/images/snake_dead_4.png", "assets/images/snake_dead_3.png", "assets/images/snake_dead_2.png", "assets/images/snake_dead.png", "assets/images/up.png", "assets/images/left.png", "assets/images/right.png", "assets/images/bottom.png"], function() {
      if(self.imageLoader.hasError == true) {
        self.errorOccured = true;
        self.updateUI();
      } else {
        self.assetsLoaded = true;
        self.btnFullScreen.loadImage(self.imageLoader);
        self.btnPause.loadImage(self.imageLoader);
        self.btnTopArrow.loadImage(self.imageLoader);
        self.btnBottomArrow.loadImage(self.imageLoader);
        self.btnLeftArrow.loadImage(self.imageLoader);
        self.btnRightArrow.loadImage(self.imageLoader);
        self.start();
      }
    });
  };

  this.updateUI = function(renderBlur) {
    if(this.outputType == OUTPUT_TEXT && !this.killed) {
      this.textarea.innerHTML = this.toString();
    } else if(this.outputType == OUTPUT_GRAPHICAL && !this.killed) {
      var self = this;
      var ctx = this.canvasCtx;
      var renderBlur = renderBlur === undefined ? false : renderBlur;
      var caseHeight = Math.floor((this.canvas.height - 75) / this.grid.height);
      var caseWidth = Math.floor(this.canvas.width / this.grid.width);
      caseHeight = caseHeight > caseWidth ? caseWidth : caseHeight;
      caseWidth = caseWidth > caseHeight ? caseHeight : caseWidth;
      this.fontSize = FONT_SIZE;

      if(this.canvas.width <= CANVAS_WIDTH / 2) {
        this.fontSize /= 1.5;
      } else if(this.canvas.width >= CANVAS_WIDTH * 1.5) {
        this.fontSize *= 1.25;
      }

      if(renderBlur) {
        ctx.filter = "blur(5px)";
      }

      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = "rgba(204, 207, 211, 1)";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = "#27AE60";
      ctx.fillRect(0, 0, this.canvas.width, 75);
      ctx.font = this.fontSize + "px " + FONT_FAMILY;
      ctx.fillStyle = "black";

      this.btnFullScreen.draw(this.canvas);

      if(this.enablePause) {
        this.btnPause.draw(this.canvas);
      }

      if(this.assetsLoaded && !this.errorOccured) {
        this.drawImage(ctx, "assets/images/fruit.png", 5, 5, 64, 64);

        if(this.snakes.length <= 1) {
          this.drawText(ctx, "× " + this.snakes[0].score, "black", FONT_SIZE, FONT_FAMILY, "default", "default", 68, 50);
        } else {
          this.drawText(ctx, window.i18next.t("engine.num") + this.numFruit, "black", FONT_SIZE, FONT_FAMILY, "default", "default", 68, 50);
        }

        var totalWidth = caseWidth * this.grid.width;

        for(var i = 0; i < this.grid.height; i++) {
          for(var j = 0; j < this.grid.width; j++) {
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

        this.drawSnake(ctx, caseWidth, caseHeight, totalWidth, renderBlur);
      } else if(!this.assetsLoaded && !renderBlur) {
        this.drawMenu(ctx, [], window.i18next.t("engine.loading"), "white", this.fontSize, FONT_FAMILY, "center", null, true);
      }

      for(var i = 0; i < this.snakes.length; i++) {
        if(this.snakes[i].player == PLAYER_HUMAN) {
          this.btnTopArrow.draw(this.canvas);
          this.btnBottomArrow.draw(this.canvas);
          this.btnRightArrow.draw(this.canvas);
          this.btnLeftArrow.draw(this.canvas);
          break;
        }
      }

      this.disableAllButtons();

      if(!renderBlur) {
        if(this.exited) {
          this.drawMenu(ctx, [], window.i18next.t("engine.exited"), "white", this.fontSize, FONT_FAMILY, "center", null, true);
        } else if(this.errorOccured) {
         this.drawMenu(ctx, [this.btnQuit], this.imageLoader.hasError ? window.i18next.t("engine.errorLoading") : window.i18next.t("engine.error"), "red", this.fontSize, FONT_FAMILY, "center", null, true, function() {
           self.btnQuit.addClickAction(self.canvas, function() {
             self.confirmExit = false;
             self.selectedButton = 0;
             self.exit();
           });
         });
       } else if(this.getInfosGame) {
          this.drawMenu(ctx, [this.btnOK], (this.snakes.length <= 1 ? window.i18next.t("engine.player") + " " + (this.snakes[0].player == PLAYER_HUMAN ? window.i18next.t("engine.playerHuman") : window.i18next.t("engine.playerAI")) : "") + (this.getNBPlayer(PLAYER_AI) > 0 ? "\n" +  window.i18next.t("engine.aiLevel") + " " + this.getPlayer(1, PLAYER_AI).getAILevelText() : "") + "\n" + window.i18next.t("engine.sizeGrid") + " " + this.grid.width + "×" + this.grid.height + "\n" + window.i18next.t("engine.currentSpeed") + " " + this.speed + (this.snakes.length <= 1 && this.progressiveSpeed ? "\n" + window.i18next.t("engine.progressiveSpeed") : ""), "white", this.fontSize, FONT_FAMILY, "center", null, false, function() {
            self.btnOK.addClickAction(self.canvas, function() {
              self.getInfosGame = false;
              self.selectedButton = 0;
              self.updateUI();
            });
          });
        }  else if(this.getInfos) {
          this.drawMenu(ctx, [this.btnInfosGame, this.btnOK], window.i18next.t("engine.aboutScreen.title") + "\nwww.eliastiksofts.com\n\n" + window.i18next.t("engine.aboutScreen.versionAndDate", { version: APP_VERSION, date: new Intl.DateTimeFormat(i18next.language).format(new Date(DATE_VERSION)), interpolation: { escapeValue: false } }), "white", this.fontSize, FONT_FAMILY, "center", null, false, function() {
            self.btnInfosGame.addClickAction(self.canvas, function() {
              self.getInfosGame = true;
              self.selectedButton = 0;
              self.updateUI();
            });

            self.btnOK.addClickAction(self.canvas, function() {
              self.getInfos = false;
              self.selectedButton = 0;
              self.updateUI();
            });
          });
        } else if(this.confirmExit) {
          this.drawMenu(ctx, [this.btnNo, this.btnYes], window.i18next.t("engine.exitConfirm"), "#E74C3C", this.fontSize, FONT_FAMILY, "center", null, true, function() {
            self.btnYes.addClickAction(self.canvas, function() {
              self.confirmExit = false;
              self.selectedButton = 0;
              self.exit();
            });

            self.btnNo.addClickAction(self.canvas, function() {
              self.confirmExit = false;
              self.selectedButton = 0;
              self.updateUI();
            });
          });
        } else if(this.assetsLoaded && this.countBeforePlay > 0) {
          if(this.snakes.length > 1 && this.getNBPlayer(PLAYER_HUMAN) <= 1 && this.getPlayer(1, PLAYER_HUMAN) != null) {
            var playerHuman = this.getPlayer(1, PLAYER_HUMAN);
            var colorName = hslToName(addHue(IMAGE_SNAKE_HUE, playerHuman.color), IMAGE_SNAKE_SATURATION, IMAGE_SNAKE_VALUE);
            var colorRgb = hsvToRgb(addHue(IMAGE_SNAKE_HUE, playerHuman.color) / 360, IMAGE_SNAKE_SATURATION / 100, IMAGE_SNAKE_VALUE / 100);

            this.drawMenu(ctx, [], "" + this.countBeforePlay + "\n" + window.i18next.t("engine.colorPlayer", { color: colorName }), ["white", "rgb(" + colorRgb[0] + ", " + colorRgb[1] + ", " + colorRgb[2] + ")"], this.fontSize, FONT_FAMILY, "center", null, false);
          } else {
            this.drawMenu(ctx, [], "" + this.countBeforePlay, "white", this.fontSize, FONT_FAMILY, "center", null, false);
          }
        } else if(this.confirmReset && !this.gameOver) {
          this.drawMenu(ctx, [this.btnNo, this.btnYes], window.i18next.t("engine.resetConfirm"), "#E74C3C", this.fontSize, FONT_FAMILY, "center", null, true, function() {
            self.btnYes.addClickAction(self.canvas, function() {
              self.confirmReset = false;
              self.selectedButton = 0;
              self.reset();
            });

            self.btnNo.addClickAction(self.canvas, function() {
              self.confirmReset = false;
              self.selectedButton = 0;
              self.updateUI();
            });
          });
        } else if(this.gameFinished) {
          this.drawMenu(ctx, this.enableRetry ? [this.btnRetry, this.btnQuit] : [this.btnQuit], window.i18next.t("engine.gameFinished"), "white", this.fontSize, FONT_FAMILY, "center", null, true, function() {
            self.btnRetry.addClickAction(self.canvas, function() {
              self.selectedButton = 0;
              self.reset();
            });

            self.btnQuit.addClickAction(self.canvas, function() {
              self.confirmExit = true;
              self.selectedButton = 0;
              self.updateUI();
            });
          });
        } else if(this.scoreMax && this.snakes.length <= 1) {
          this.drawMenu(ctx, this.enableRetry ? [this.btnRetry, this.btnQuit] : [], window.i18next.t("engine.scoreMax"), "green", this.fontSize, FONT_FAMILY, "center", null, true, function() {
            self.btnRetry.addClickAction(self.canvas, function() {
              self.selectedButton = 0;
              self.reset();
            });

            self.btnQuit.addClickAction(self.canvas, function() {
              self.confirmExit = true;
              self.selectedButton = 0;
              self.updateUI();
            });
          });
        } else if(this.gameOver && this.snakes.length <= 1) {
          this.drawMenu(ctx, this.enableRetry && !this.snakes[0].autoRetry ? [this.btnRetry, this.btnQuit] : [], window.i18next.t("engine.gameOver"), "#E74C3C", this.fontSize, FONT_FAMILY, "center", null, false, function() {
            if(self.snakes[0].autoRetry) {
              setTimeout(function() {
                self.selectedButton = 0;
                self.reset();
              }, 500);
            } else {
              self.btnRetry.addClickAction(self.canvas, function() {
                self.selectedButton = 0;
                self.reset();
              });

              self.btnQuit.addClickAction(self.canvas, function() {
                self.confirmExit = true;
                self.selectedButton = 0;
                self.updateUI();
              });
            }
          });
        } else if(this.paused && !this.gameOver && this.assetsLoaded) {
          this.drawMenu(ctx, this.enablePause ? (this.enableRetry ? [this.btnContinue, this.btnRetry, this.btnAbout, this.btnQuit] : [this.btnContinue, this.btnAbout, this.btnQuit]) : [this.btnContinue, this.btnAbout], window.i18next.t("engine.pause"), "white", this.fontSize, FONT_FAMILY, "center", null, false, function() {
            self.btnContinue.addClickAction(self.canvas, function() {
              self.reactor.dispatchEvent("onContinue");
              self.selectedButton = 0;
              self.start();
            });

            self.btnRetry.addClickAction(self.canvas, function() {
              self.confirmReset = true;
              self.selectedButton = 0;
              self.updateUI();
            });

            self.btnQuit.addClickAction(self.canvas, function() {
              self.confirmExit = true;
              self.selectedButton = 0;
              self.updateUI();
            });

            self.btnAbout.addClickAction(self.canvas, function() {
              self.getInfos = true;
              self.selectedButton = 0;
              self.updateUI();
            });
          });
        } else if(this.assetsLoaded) {
          this.btnFullScreen.enable();

          for(var i = 0; i < this.snakes.length; i++) {
            if(this.snakes[i].player == PLAYER_HUMAN) {
              this.btnTopArrow.enable();
              this.btnBottomArrow.enable();
              this.btnLeftArrow.enable();
              this.btnRightArrow.enable();
              break;
            }
          }

          if(this.enablePause) {
            this.btnPause.enable();
          }
        }
      }

      if(this.displayFPS) {
        this.drawText(ctx, this.getDebugText(), "rgba(255, 255, 255, 0.5)", this.fontSize / 1.5, FONT_FAMILY, "right", "bottom");
      }

      if(renderBlur) {
        ctx.filter = "none";
      }
    }
  };

  this.disableAllButtons = function() {
    if(this.outputType == OUTPUT_GRAPHICAL) {
      this.btnContinue.disable();
      this.btnRetry.disable();
      this.btnQuit.disable();
      this.btnYes.disable();
      this.btnNo.disable();
      this.btnOK.disable();
      this.btnOK.disable();
      this.btnAbout.disable();
      this.btnInfosGame.disable();
      this.btnFullScreen.disable();
      this.btnPause.disable();

      this.btnTopArrow.disable();
      this.btnBottomArrow.disable();
      this.btnRightArrow.disable();
      this.btnLeftArrow.disable();
    }
  };

  this.getDebugText = function() {
    return window.i18next.t("engine.debug.fps") + " : " + this.currentFPS + " / " + window.i18next.t("engine.debug.frames") + " : " + this.frame + " / " + window.i18next.t("engine.debug.ticks") + " : " + Math.floor(this.frame / this.speed) + " / " + window.i18next.t("engine.debug.speed") + " : " + this.speed;
  };

  this.init();
}

Game.prototype.toString = function() {
  return this.grid.toString() + "\n" + (this.snakes.length <= 1 ? window.i18next.t("engine.score") + " : " + this.snakes[0].score : "") + (this.displayFPS ? "\n" + this.getDebugText() : "") + (this.gameOver && !this.scoreMax ? "\n" + window.i18next.t("engine.gameOver") : "") + (this.scoreMax ? "\n" + window.i18next.t("engine.scoreMax") : "") + (!this.gameOver && this.paused ? "\n" + window.i18next.t("engine.debug.paused") : "") + (this.countBeforePlay > 0 ? "\n" + this.countBeforePlay : "");
};

Game.prototype.getImageCase = function(position) {
  var imageRes = "";

  switch(this.grid.get(position)) {
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
    ctx.drawImage(imageCase, Math.round(x), Math.round(y), Math.round(width), Math.round(height));
  }
};

Game.prototype.drawText = function(ctx, text, color, size, fontFamily, alignement, verticalAlignement, x, y) {
  var precFillStyle = ctx.fillStyle;
  var precFont = ctx.font;
  var precFilter = ctx.filter;

  if(!Array.isArray(color)) {
    ctx.fillStyle = color;
  }

  ctx.font = size + "px " + fontFamily;
  ctx.filter = "none";

  var lines = text.split('\n');

  if(verticalAlignement == "center") {
    y = (this.canvas.height / 2) - (size * lines.length / 2);
  } else if(verticalAlignement == "top") {
    y = 5;
  } else if(verticalAlignement == "bottom") {
    y = (this.canvas.height) - (size * lines.length) / 2;
  }

  for (var i = 0; i < lines.length; i++) {
    var currentText = lines[i];

    if(Array.isArray(color)) {
      var colorIndex = i;

      if(colorIndex > color.length - 1) {
        colorIndex = color.length - 1;
      }

      ctx.fillStyle = color[colorIndex];
    }

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
  ctx.filter = precFilter;

  return {
    x: x,
    y: y,
    height: size * lines.length
  };
};

Game.prototype.wrapText = function(text, limit) {
  if(text.length > limit) {
    var p = limit;

    for(; p > 0 && text[p] != " "; p--);

    if(p > 0) {
      var left = text.substring(0, p);
      var right = text.substring(p + 1);
      return left + "\n" + this.wrapText(right, limit);
    }
  }

  return text;
};

Game.prototype.drawMenu = function(ctx, buttons, text, color, size, fontFamily, alignement, x, wrap, func) {
  var self = this;

  window.cancelAnimationFrame(this.frameDisplayMenu);

  this.frameDisplayMenu = window.requestAnimationFrame(function() {
    ctx.fillStyle = "rgba(44, 62, 80, 0.75)";
    ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);

    if(wrap) {
      var sizeCar = ctx.measureText("A").width;
      var nbCarLine = Math.round(self.canvas.width / sizeCar);
      text = self.wrapText(text, nbCarLine);
    }

    var lines = text.split('\n');
    var heightText = size * lines.length;
    var heightButtons = 0;

    if(buttons != null) {
      if(self.lastKeyMenu == KEY_UP) {
        self.selectedButton--;
      } else if(self.lastKeyMenu == KEY_BOTTOM) {
        self.selectedButton++;
      }

      if(self.selectedButton >= buttons.length) {
        self.selectedButton = 0;
      } else if(self.selectedButton < 0) {
        self.selectedButton = buttons.length - 1;
      }

      for(var i = 0; i < buttons.length; i++) {
        if(buttons[i].autoHeight) {
          heightButtons += buttons[i].getFontSize(ctx) * 1.75 + 5;
        } else {
          heightButtons += buttons[i].height + 5;
        }
      }
    }

    var totalHeight = heightText + heightButtons;
    var startY = self.canvas.height / 2 - totalHeight / 2 + 16;

    self.drawText(ctx, text, color, size, fontFamily, alignement, "default", x, startY);

    if(buttons != null) {
      for(var i = 0; i < buttons.length; i++) {
        buttons[i].y = startY + heightText + (heightButtons / buttons.length) * i + (i * 5);

        if(self.selectedButton == i) {
          buttons[i].selected = true;
        } else {
          buttons[i].selected = false;
        }

        buttons[i].enable();
        buttons[i].draw(self.canvas);

        if(self.selectedButton == i && self.lastKeyMenu == KEY_ENTER && buttons[i].triggerClick != null && !buttons[i].disabled) {
          buttons[i].triggerClick();
          break;
        }
      }
    }

    if(func != null) {
      func(true);
    }

    self.lastKeyMenu = -1;
  });
};

Game.prototype.drawSnake = function(ctx, caseWidth, caseHeight, totalWidth, blur) {
  for(var j = 0; j < this.snakes.length; j++) {
    if(this.snakes[j].color != undefined) {
      ctx.filter = "hue-rotate(" + this.snakes[j].color + "deg)";
    }

    if(blur) {
      ctx.filter = ctx.filter + " blur(5px)";
    }

    for(var i = 0; i < this.snakes[j].length(); i++) {
      var position = this.snakes[j].get(i);
      var posX = position.x;
      var posY = position.y;
      var caseX = Math.floor(posX * caseWidth + ((this.canvas.width - totalWidth) / 2));
      var caseY = 75 + posY * caseHeight;
      var imageLoc = "";

      if(i == 0) {
        var direction = this.snakes[j].getHeadPosition().direction;

        if(this.snakes[j].gameOver && !this.snakes[j].scoreMax) {
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
      } else if(i == this.snakes[j].length() - 1) {
        var direction = this.snakes[j].get(i - 1).direction;

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
        var prec = this.snakes[j].get(i - 1);
        var next = this.snakes[j].get(i + 1);
        var current = this.snakes[j].get(i);

        var directionToPrec = this.snakes[j].getDirectionTo(current, prec);
        var directionToNext = this.snakes[j].getDirectionTo(current, next);

        switch(current.direction) {
          case UP:
            imageLoc = "assets/images/body.png";
            break;
          case BOTTOM:
            imageLoc = "assets/images/body.png";
            break;
          case RIGHT:
            imageLoc = "assets/images/body_2.png";
            break;
          case LEFT:
            imageLoc = "assets/images/body_2.png";
            break;
        }

        if(directionToPrec == LEFT && directionToNext == BOTTOM || directionToPrec == BOTTOM && directionToNext == LEFT) {
          imageLoc = "assets/images/body_angle_1.png";
        } else if(directionToPrec == RIGHT && directionToNext == BOTTOM || directionToPrec == BOTTOM && directionToNext == RIGHT) {
          imageLoc = "assets/images/body_angle_2.png";
        } else if(directionToPrec == UP && directionToNext == RIGHT || directionToPrec == RIGHT && directionToNext == UP) {
          imageLoc = "assets/images/body_angle_3.png";
        } else if(directionToPrec == UP && directionToNext == LEFT || directionToPrec == LEFT && directionToNext == UP) {
          imageLoc = "assets/images/body_angle_4.png";
        }
      }

      this.drawImage(ctx, imageLoc, caseX, caseY, caseWidth, caseHeight);
    }

    if(this.snakes.length > 1) {
      this.drawSnakeInfos(ctx, totalWidth, caseWidth, caseHeight);
    }

    ctx.filter = "none";
  }
};

Game.prototype.drawSnakeInfos = function(ctx, totalWidth, caseWidth, caseHeight) {
  var numPlayer = 0;
  var numAI = 0;

  for(var i = 0; i < this.snakes.length; i++) {
    if(this.snakes[i].player == PLAYER_HUMAN) {
      numPlayer++;
    } else {
      numAI++;
    }

    var position = this.snakes[i].get(0);
    var posX = position.x;
    var posY = position.y;
    var caseX = Math.floor(posX * caseWidth + ((this.canvas.width - totalWidth) / 2));
    var caseY = 75 + posY * caseHeight;

    this.drawText(ctx, (this.snakes[i].player == PLAYER_HUMAN ? window.i18next.t("engine.playerMin") + numPlayer : window.i18next.t("engine.aiMin") + numAI) + "\n× " + this.snakes[i].score, "rgb(255, 255, 255)", Math.round(caseHeight / 2), FONT_FAMILY, null, null, caseX + 2, caseY - Math.round(caseHeight / 1.75));
  }
};

function Button(text, x, y, alignement, color, colorHover, width, height, fontSize, fontFamily, fontColor, imgSrc, imageLoader, verticalAlignement) {
  this.x = x || 0;
  this.y = y || 0;
  this.initialX = x;
  this.initialY = y;
  this.width = width || "auto";
  this.height = height || "auto";
  this.autoWidth = (this.width == "auto" ? true : false);
  this.autoHeight = (this.height == "auto" ? true : false);
  this.clicked = false;
  this.hovered = false;
  this.text = text;
  this.fontSize = fontSize || Math.floor(FONT_SIZE / 1.25);
  this.fontFamily = fontFamily || FONT_FAMILY;
  this.fontColor = fontColor || "white";
  this.color = color || "rgba(0, 0, 0, 0)";
  this.colorHover = colorHover || "#95a5a6";
  this.triggerClick;
  this.triggerHover;
  this.init = false;
  this.disabled = false;
  this.alignement = alignement || "default";
  this.image;
  this.imgSrc = imgSrc;
  this.verticalAlignement = verticalAlignement || "default";
  this.selected = false;

  this.draw = function(canvas) {
    var ctx = canvas.getContext("2d");
    var precFillStyle = ctx.fillStyle;
    var precFont = ctx.font;
    this.fontSize = this.getFontSize(ctx);

    ctx.font = this.fontSize + "px " + this.fontFamily;
    var textSize = ctx.measureText(this.text);

    if(this.imgSrc != null && imageLoader != null) {
      this.loadImage(imageLoader);
    }

    if(this.image != null) {
      var imgWidth = this.image.width;
      var imgHeight = this.image.height;

      if(this.autoWidth) {
        this.width = imgWidth * 1.25;
      }

      if(this.autoHeight) {
        this.height = imgHeight * 1.5;
      }
    } else if(this.text != null) {
      if(this.autoWidth) {
        this.width = textSize.width + 25;
      }

      if(this.autoHeight) {
        this.height = this.fontSize * 1.75;
      }
    }

    if(this.alignement == "center") {
      this.x =  (canvas.width / 2) - (this.width / 2) - this.initialX;
    } else if(this.alignement == "right") {
      this.x = (canvas.width) - (this.width) - 5 - this.initialX;
    } else if(this.alignement == "left") {
      this.x = 5;
    }

    if(this.verticalAlignement == "bottom") {
      this.y = (canvas.height) - (this.height) - 5 - this.initialY;
    } else if(this.verticalAlignement == "center") {
      this.y = (canvas.height / 2) - (this.height / 2) - this.initialY;
    } else if(this.verticalAlignement == "top") {
      this.y = 15;
    }

    if(this.hovered) {
      ctx.fillStyle = this.colorHover;
    } else {
      ctx.fillStyle = this.color;
    }

    ctx.fillRect(Math.round(this.x), Math.round(this.y), Math.round(this.width), Math.round(this.height));

    if(this.selected) {
      var initialStrokeStyle = ctx.strokeStyle;
      var initialLineWidth = ctx.lineWidth;

      ctx.strokeStyle = "#a2cdd8";
      ctx.lineWidth = 3;

      ctx.strokeRect(Math.round(this.x), Math.round(this.y), Math.round(this.width), Math.round(this.height));

      ctx.strokeStyle = initialStrokeStyle;
      ctx.lineWidth = initialLineWidth;
    }

    if(this.image != null) {
      if(this.image.width > this.width || this.image.height > this.height) {
        var aspectRatio = this.image.width / this.image.height;
        imgWidth = Math.floor(this.width / 1.25);
        imgHeight = Math.floor(imgWidth / aspectRatio);
      }

      var imgX = this.x + (this.width / 2) - (imgWidth / 2);
      var imgY = this.y + (this.height / 2) - (imgHeight / 2);

      ctx.drawImage(this.image, Math.round(imgX), Math.round(imgY), Math.round(imgWidth), Math.round(imgHeight));
    } else if(this.text != null) {
      ctx.fillStyle = this.fontColor;

      var textX = this.x + (this.width / 2) - (textSize.width / 2);
      var textY = this.y + (this.height) - (this.fontSize / 2);

      ctx.fillText(this.text, Math.round(textX), Math.round(textY));
    }

    ctx.fillStyle = precFillStyle;
    ctx.font = precFont;

    if(!this.init) {
      this.addMouseOverAction(canvas, null);
    }

    this.init = true;
  };

  this.getFontSize = function(ctx) {
    return Math.floor(parseInt(ctx.font.match(/\d+/), 10) / 1.25);
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

function ButtonImage(imgSrc, x, y, alignement, verticalAlignement, width, height, color, colorHover, imageLoader) {
  return new Button(null, x, y, alignement, color, colorHover, width, height, null, null, null, imgSrc, imageLoader, verticalAlignement);
}

function GameGroup(games) {
  this.games = games;
  this.reactor = new Reactor();
  this.reactor.registerEvent("onStart");
  this.reactor.registerEvent("onPause");
  this.reactor.registerEvent("onContinue");
  this.reactor.registerEvent("onStop");
  this.reactor.registerEvent("onReset");
  this.reactor.registerEvent("onExit");
  this.reactor.registerEvent("onScoreIncreased");

  this.init = function() {
    var self = this;

    for(var i = 0; i < this.games.length; i++) {
      this.games[i].onPause(function(v) {
        return function() {
          self.pauseAll(v);
        };
      }(i));

      this.games[i].onContinue(function(v) {
        return function() {
          self.startAll(v);
        };
      }(i));

      this.games[i].onExit(function(v) {
        return function() {
          self.checkExit(v);
        };
      }(i));

      this.games[i].onStop(function(v) {
        return function() {
          self.checkStop(v);
        };
      }(i));

      this.games[i].onReset(function(v) {
        return function() {
          self.resetAll(v);
        };
      }(i));

      this.games[i].onScoreIncreased(function(v) {
        return function() {
          self.checkOnScoreIncreased(v);
        };
      }(i));
    }
  };

  this.start = function() {
    this.startAll(null);
  };

  this.startAll = function(game) {
    for(var i = 0; i < this.games.length; i++) {
      if(this.games[i].paused && (game == null || i != game)) {
        this.games[i].start();
      }
    }

    this.reactor.dispatchEvent("onStart");
  };

  this.onStart = function(callback) {
    this.reactor.addEventListener("onStart", callback);
  };

  this.pauseAll = function(game) {
    for(var i = 0; i < this.games.length; i++) {
      if(!this.games[i].paused && (game == null || i != game)) {
        this.games[i].pause();
      }
    }

    this.reactor.dispatchEvent("onPause");
  };

  this.onPause = function(callback) {
    this.reactor.addEventListener("onPause", callback);
  };

  this.resetAll = function(game) {
    for(var i = 0; i < this.games.length; i++) {
      if(!this.games[i].isReseted && (game == null || i != game)) {
        this.games[i].reset();
      }
    }

    this.reactor.dispatchEvent("onReset");
  };

  this.onReset = function(callback) {
    this.reactor.addEventListener("onReset", callback);
  };

  this.checkExit = function(game) {
    allExited = true;

    for(var i = 0; i < this.games.length; i++) {
      if(!this.games[i].exited) {
        allExited = false;
      }
    }

    if(allExited) {
      this.reactor.dispatchEvent("onExit");
    } else {
      this.startAll(game);
    }
  };

  this.onExit = function(callback) {
    this.reactor.addEventListener("onExit", callback);
  };

  this.checkStop = function(game) {
    allStopped = true;

    for(var i = 0; i < this.games.length; i++) {
      if(!this.games[i].gameOver) {
        allStopped = false;
      }
    }

    if(allStopped) {
      this.reactor.dispatchEvent("onStop");
    }
  };

  this.onStop = function(callback) {
    this.reactor.addEventListener("onStop", callback);
  };

  this.stopAll = function(finished) {
    for(var i = 0; i < this.games.length; i++) {
      this.games[i].stop();

      if(finished) {
        this.games[i].gameFinished = true;
      }

      this.games[i].updateUI();
    }
  };

  this.killAll = function() {
    for(var i = 0; i < this.games.length; i++) {
      this.games[i].kill();
    }
  };

  this.checkOnScoreIncreased = function() {
    this.reactor.dispatchEvent("onScoreIncreased");
  };

  this.onScoreIncreased = function(callback) {
    this.reactor.addEventListener("onScoreIncreased", callback);
  };

  this.setDisplayFPS = function(value) {
    for(var i = 0; i < this.games.length; i++) {
      this.games[i].displayFPS = value;
    }
  };

  this.getWinners = function() {
    winners = [];
    index = [];
    maxScore = -1;

    for(var i = 0; i < this.games.length; i++) {
      for(var j = 0; j < this.games[i].snakes.length; j++) {
        if(this.games[i].snakes[j].score > maxScore) {
          maxScore = this.games[i].snakes[j].score;
        }
      }
    }

    if(maxScore > 0) {
      var idx = 0;

      for(var i = 0; i < this.games.length; i++) {
        for(var j = 0; j < this.games[i].snakes.length; j++) {
          if(this.games[i].snakes[j].score >= maxScore) {
            winners.push(this.games[i].snakes[j]);
            index.push(idx);
          }

          idx++;
        }
      }
    }

    return {
      winners: winners,
      score: maxScore,
      index: index
    }
  };

  this.init();
}
