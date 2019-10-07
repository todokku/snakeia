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
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;
window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || window.oCancelAnimationFrame || window.mozCancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame;

if(typeof(document.fullscreenElement) === "undefined") {
  Object.defineProperty(document, "fullscreenElement", {
    get: function() {
      return document.mozFullScreenElement || document.msFullscreenElement || document.webkitFullscreenElement || document.oFullscreenElement;
    }
  });
}

document.exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
screen.orientation = screen.msOrientation || screen.mozOrientation || screen.orientation;

if(!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}
// Case type
EMPTY_VAL = 0;
SNAKE_VAL = 1;
FRUIT_VAL = 2;
WALL_VAL = 3;
SNAKE_DEAD_VAL = 4;
SURROUNDED_VAL = 5;
// Player type
PLAYER_AI = "PLAYER_AI";
PLAYER_HUMAN = "PLAYER_HUMAN";
PLAYER_HYBRID_HUMAN_AI = "PLAYER_HYBRID_HUMAN_AI";
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
ANGLE_1 = 4;
ANGLE_2 = 5;
ANGLE_3 = 6;
ANGLE_4 = 7;
// Keys
KEY_UP = 38;
KEY_RIGHT = 39;
KEY_BOTTOM = 40;
KEY_LEFT = 37;
KEY_ENTER = 13;
// UI
FONT_FAMILY = "Delius";
FONT_SIZE = 32;
HEADER_HEIGHT_DEFAULT = 75;
TARGET_FPS = 60;
IMAGE_SNAKE_HUE = 75;
IMAGE_SNAKE_SATURATION = 50;
IMAGE_SNAKE_VALUE = 77;
CAR_TO_PRERENDER = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "×"];
// Infos
APP_VERSION = "1.4.1";
DATE_VERSION = "09/29/2019";

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
  } else if((s <= 10 && l <= 70) || s == 0) {
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

function isFilterHueAvailable() {
  var canvas = document.createElement("canvas");
  canvas.width = 5;
  canvas.height = 5;
  var ctx = canvas.getContext("2d");

  ctx.fillStyle = "#FF0000";
  ctx.filter = "hue-rotate(90deg)";
  ctx.fillRect(0, 0, 5, 5);
  var color = ctx.getImageData(0, 0, 1, 1).data;

  if(color[0] == 255 && color[1] == 0 && color[2] == 0) {
    return false;
  }

  return true;
}

// Shuffle array
function shuffle(a) {
    var j, x;

    for(var i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }

    return a;
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
  var callbacks = this.events[eventName].callbacks;

  for(var i = 0, l = callbacks.length; i < l; i++) {
    callbacks[i](eventArgs);
  }
};

Reactor.prototype.addEventListener = function(eventName, callback) {
  this.events[eventName].registerCallback(callback);
};

function Position(x, y, direction) {
  this.x = x;
  this.y = y;
  this.direction = direction;

  this.copy = function() {
    return new Position(this.x, this.y, this.direction);
  };

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
  if(otherPosition != null) {
    return this.x == otherPosition.x && this.y == otherPosition.y;
  } else {
    return false;
  }
};

Position.prototype.indexIn = function(array) {
  for(var i = 0; i < array.length; i++) {
    if(this.equals(array[i])) {
      return i;
    }
  }

  return -1;
}

function Grid(width, height, generateWalls, borderWalls, maze, customGrid) {
  this.width = width == undefined ? 20 : width;
  this.height = height == undefined ? 20 : height;
  this.generateWalls = generateWalls == undefined ? false : generateWalls;
  this.borderWalls = borderWalls == undefined ? false : borderWalls;
  this.maze = maze == undefined ? false : maze;
  this.mazeFirstPosition;
  this.grid;
  this.initialGrid;
  this.fruitPos;

  this.init = function() {
    if(customGrid != undefined || this.initialGrid != undefined) {
      var gridToCopy;

      if(this.initialGrid != undefined) {
        gridToCopy = this.initialGrid;
      } else {
        gridToCopy = customGrid;
      }

      this.height = gridToCopy.length;
      this.width = gridToCopy[0].length;

      this.initialGrid = new Array(this.height);
      this.grid = new Array(this.height);

      for(var i = 0; i < this.height; i++) {
        this.initialGrid[i] = gridToCopy[i].slice();
        this.grid[i] = gridToCopy[i].slice();
      }
    } else {
      this.grid = new Array(this.height);

      for(var i = 0; i < this.height; i++) {
        this.grid[i] = new Array(this.width);

        for(var j = 0; j < this.width; j++) {
          if((this.borderWalls && (i == 0 || i == this.height - 1 || j == 0 || j == this.width - 1)) || (this.generateWalls && Math.random() > 0.65) || this.maze) {
            this.grid[i][j] = WALL_VAL;
          } else {
            this.grid[i][j] = EMPTY_VAL;
          }
        }
      }

      if(this.maze) {
        this.generateMaze();
      } else if(this.generateWalls) {
        this.fixWalls(this.borderWalls);
      }
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

  this.maze_recursion = function(r, c) {
    var directions = shuffle([UP, RIGHT, BOTTOM, LEFT]);

    for(var i = 0; i < directions.length; i++) {
      switch(directions[i]) {
        case UP:
          if(r - 2 <= 0) continue;

          if(this.get(new Position(c, r - 2)) != EMPTY_VAL) {
            this.set(EMPTY_VAL, new Position(c, r - 2));
            this.set(EMPTY_VAL, new Position(c, r - 1));
            this.maze_recursion(r - 2, c);
          }

          break;
        case RIGHT:
          if(c + 2 >= this.width - 1) continue;

          if(this.get(new Position(c + 2, r)) != EMPTY_VAL) {
            this.set(EMPTY_VAL, new Position(c + 2, r));
            this.set(EMPTY_VAL, new Position(c + 1, r));
            this.maze_recursion(r, c + 2);
          }

          break;
        case BOTTOM:
          if(r + 2 >= this.height - 1) continue;

          if(this.get(new Position(c, r + 2)) != EMPTY_VAL) {
            this.set(EMPTY_VAL, new Position(c, r + 2));
            this.set(EMPTY_VAL, new Position(c, r + 1));
            this.maze_recursion(r + 2, c);
          }

          break;
        case LEFT:
          if(c - 2 <= 0) continue;

          if(this.get(new Position(c - 2, r)) != EMPTY_VAL) {
            this.set(EMPTY_VAL, new Position(c - 2, r));
            this.set(EMPTY_VAL, new Position(c - 1, r));
            this.maze_recursion(r, c - 2);
          }

          break;
      }
    }
  };

  this.generateMaze = function() {
    this.mazeFirstPosition = new Position(1, 1, RIGHT);
    this.set(EMPTY_VAL, this.mazeFirstPosition);
    this.maze_recursion(1, 1);
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
      case SNAKE_DEAD_VAL:
        return "O";
        break;
      case FRUIT_VAL:
        return "x";
        break;
      case WALL_VAL:
        return "#";
        break;
      case SURROUNDED_VAL:
        return "/";
        break;
    }
  };

  this.getImageCase = function(position) {
    var imageRes = "";

    switch(this.get(position)) {
        case WALL_VAL:
          imageRes = "assets/images/wall.png";
          break;
        case FRUIT_VAL:
          imageRes = "assets/images/fruit.png";
          break;
    }

    return imageRes;
  };

  this.getGraph = function(ignoreSnakePos) {
    var res = new Array(this.height);

    for(var i = 0; i < this.height; i++) {
      res[i] = new Array(this.width);

      for(var j = 0; j < this.width; j++) {
        var currentPos = new Position(j, i);

        if(ignoreSnakePos && this.get(currentPos) == SNAKE_VAL) {
          res[i][j] = 0;
        } else if(this.isDeadPosition(currentPos)) {
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
    var tried = [1];

    if(this.fruitPos != null && this.get(this.fruitPos) == FRUIT_VAL) {
      this.set(EMPTY_VAL, this.fruitPos);
    }

    if(this.getTotal(EMPTY_VAL) > 0) {
      var randomPos = this.getRandomPosition();

      while(this.get(randomPos) != EMPTY_VAL || this.isFruitSurrounded(randomPos, true) || (this.maze && !this.testFruitMaze(randomPos, tried))) {
        if(this.getTotal(EMPTY_VAL) <= 0) {
          return false;
        }

        randomPos = this.getRandomPosition();
      }

      this.fruitPos = randomPos;
      this.set(FRUIT_VAL, randomPos);
    } else {
      return false;
    }

    return true;
  };

  this.testFruitMaze = function(position, tried) { // Maze mode: avoid putting the fruit too close to the Snake
    var grid = this.getGraph(true);
    var graph = new Lowlight.Astar.Configuration(grid, {
      order: "yx",
      torus: false,
      diagonals: false,
      cutting: false,
      cost(a, b) { return b == 1 ? null : 1 }
    });
    var path = graph.path({x: this.mazeFirstPosition.x, y: this.mazeFirstPosition.y}, {x: position.x, y: position.y});

    if(path.length < Math.ceil(this.getTotal(EMPTY_VAL) / (1 * Math.ceil(tried[0] / 4)))) {
      tried[0]++;
      return false;
    } else {
      tried[0]++;
      return true;
    }
  };

  this.isCaseSurrounded = function(position, fill, foundVals, forbiddenVals) {
    if(position == null || position == undefined) {
      return false;
    }

    var fill = fill == undefined ? false : fill;

    var checkList = [position];
    var complete = [];

    while(checkList.length > 0) {
      var currentPosition = checkList[0];
      checkList.shift();

      var directions = [this.getNextPosition(currentPosition, UP), this.getNextPosition(currentPosition, BOTTOM), this.getNextPosition(currentPosition, LEFT), this.getNextPosition(currentPosition, RIGHT)]; // UP, DOWN, LEFT, RIGHT

      for(var i = 0; i < directions.length; i++) {
        var alreadyCompleted = false;

        if(directions[i].indexIn(complete) > -1 || directions[i].indexIn(checkList) > -1) {
          alreadyCompleted = true;
        }

        if(!alreadyCompleted && (forbiddenVals.indexOf(this.get(directions[i])) > -1)) {
          checkList.push(directions[i]);

          if(foundVals.indexOf(this.get(directions[i])) > -1) {
            return false;
          }

          if(fill && this.get(directions[i]) == EMPTY_VAL) {
            this.set(SURROUNDED_VAL, directions[i]);
          }
        }
      }

      complete.push(currentPosition);
    }

    if(fill && (this.get(position) == EMPTY_VAL || this.get(position) == FRUIT_VAL)) {
      this.set(SURROUNDED_VAL, position);
    }

    return true;
  };

  this.isFruitSurrounded = function(position, fill) {
    var surrounded = this.isCaseSurrounded(position, false, [SNAKE_VAL], [EMPTY_VAL, SNAKE_VAL]);

    if(surrounded && fill) {
      this.isCaseSurrounded(position, true, [SNAKE_VAL], [EMPTY_VAL, SNAKE_VAL]);
    }

    return surrounded;
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
    return this.get(position) == SNAKE_VAL || this.get(position) == WALL_VAL || this.get(position) == SNAKE_DEAD_VAL;
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
  this.direction = direction == undefined ? RIGHT : direction;
  this.initialDirection = direction == undefined ? RIGHT : direction;
  this.initialLength = length == undefined ? 3 : length;
  this.initTriedDirections = [];
  this.errorInit = false;
  this.grid = grid;
  this.queue = [];
  this.lastTail;
  this.lastTailMoved;
  this.player = player == undefined ? PLAYER_HUMAN : player;
  this.aiLevel = aiLevel == undefined ? AI_LEVEL_DEFAULT : aiLevel;
  this.autoRetry = autoRetry == undefined ? false : autoRetry;
  this.score = 0;
  this.gameOver = false;
  this.scoreMax = false;
  this.color;

  this.init = function() {
    if(this.initialLength <= 0) {
      this.errorInit = true;
      return false;
    }

    if(this.grid.maze && this.initTriedDirections.length <= 0) {
      this.initialDirection = this.grid.mazeFirstPosition.direction;
      this.direction = this.initialDirection;
    }

    var spaceLineAvailable = 0;
    var spaceColAvailable = 0;

    if((this.initialDirection == RIGHT && this.initTriedDirections.indexOf(RIGHT) == -1) || (this.initialDirection == LEFT && this.initTriedDirections.indexOf(LEFT) == -1)) {
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
    } else if((this.initialDirection == UP && this.initTriedDirections.indexOf(UP) == -1) || (this.initialDirection == BOTTOM && this.initTriedDirections.indexOf(BOTTOM) == -1)) {
      for(var i = 0; i < this.grid.width; i++) {
        var emptyOnCol = 0;

        for(var j = 0; j < this.grid.height; j++) {
          if(this.grid.get(new Position(i, j)) == EMPTY_VAL) {
            emptyOnCol++;
          } else {
            emptyOnCol = 0;
          }

          if(emptyOnCol >= this.initialLength) {
            spaceColAvailable++;
            break;
          }
        }
      }
    }

    this.initTriedDirections.push(this.initialDirection);

    if((spaceLineAvailable <= 0 && (this.initialDirection == RIGHT || this.initialDirection == LEFT)) || (spaceColAvailable <= 0 && (this.initialDirection == UP || this.initialDirection == BOTTOM))) {
      if(this.initTriedDirections.indexOf(RIGHT) == -1) {
        this.initialDirection = RIGHT;
        this.direction = RIGHT;
        return this.init();
      } else if(this.initTriedDirections.indexOf(LEFT) == -1) {
        this.initialDirection = LEFT;
        this.direction = LEFT;
        return this.init();
      } else if(this.initTriedDirections.indexOf(UP) == -1) {
       this.initialDirection = UP;
       this.direction = UP;
       return this.init();
      } else if(this.initTriedDirections.indexOf(BOTTOM) == -1) {
       this.initialDirection = BOTTOM;
       this.direction = BOTTOM;
       return this.init();
      }

      this.errorInit = true;
      return false;
    }

    var posNotValidated = true;
    var positionsToAdd = [];
    var startPos, currentPos;

    while(posNotValidated) {
      posNotValidated = false;

      if(this.grid.maze) {
        startPos = this.grid.mazeFirstPosition;
      } else {
        startPos = this.grid.getRandomPosition();
      }

      currentPos = new Position(startPos.x, startPos.y, this.initialDirection);
      positionsToAdd = [];

      for(var i = this.initialLength - 1; i >= 0; i--) {
        if(i < this.initialLength - 1) {
          if(this.initialDirection == RIGHT) {
            currentPos = this.grid.getNextPosition(new Position(currentPos.x, currentPos.y, this.initialDirection), RIGHT);
          } else if(this.initialDirection == LEFT) {
            currentPos = this.grid.getNextPosition(new Position(currentPos.x, currentPos.y, this.initialDirection), LEFT);
          } else if(this.initialDirection == BOTTOM) {
            currentPos = this.grid.getNextPosition(new Position(currentPos.x, currentPos.y, this.initialDirection), BOTTOM);
          } else if(this.initialDirection == UP) {
            currentPos = this.grid.getNextPosition(new Position(currentPos.x, currentPos.y, this.initialDirection), UP);
          }
        }

        if(this.grid.get(currentPos) != EMPTY_VAL) {
          posNotValidated = true;
        } else {
          positionsToAdd.push(new Position(currentPos.x, currentPos.y, currentPos.direction));
        }
      }

      if(this.grid.maze && posNotValidated) {
        return this.init();
      }
    }

    for(var i = 0; i < positionsToAdd.length; i++) {
      this.insert(positionsToAdd[i]);
    }

    if(this.grid.maze && this.player == PLAYER_HYBRID_HUMAN_AI) {
      this.player = PLAYER_HUMAN;
    }

    if(this.player == PLAYER_HYBRID_HUMAN_AI) {
      this.aiLevel = AI_LEVEL_HIGH;
    }

    this.lastTail = this.get(this.queue.length - 1);
    return true;
  };

  this.reset = function() {
    this.direction = this.initialDirection;
    this.initTriedDirections = [];
    this.queue = [];
    this.score = 0;
    this.gameOver = false;
    this.scoreMax = false;
    this.lastTailMoved = true;
    this.init();
  };

  this.insert = function(position) {
    this.queue.unshift(position);
    this.grid.set(SNAKE_VAL, position);
  };

  this.remove = function() {
    var last = this.queue.pop();
    this.grid.set(EMPTY_VAL, last);
    this.lastTail = last;
  };

  this.length = function() {
    return this.queue.length;
  };

  this.get = function(index) {
    if(this.queue[index] != null) {
      return this.queue[index].copy();
    } else {
      return null;
    }
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

  this.setGameOver = function() {
    this.gameOver = true;

    for(var i = 0; i < this.length(); i++) {
      this.grid.set(SNAKE_DEAD_VAL, this.get(i));
    }
  };

  this.kill = function() {
    this.autoRetry = false;
    this.grid = null;
    this.queue = null;
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

  this.getGraphicDirectionFor = function(current, next, prec) {
    if(next == undefined || prec == undefined) return current.direction;

    var directionToPrec = this.getDirectionTo(current, prec);
    var directionToNext = this.getDirectionTo(current, next);

    var direction = UP;

    if(directionToPrec == LEFT && directionToNext == BOTTOM || directionToPrec == BOTTOM && directionToNext == LEFT) {
      direction = ANGLE_1;
    } else if(directionToPrec == RIGHT && directionToNext == BOTTOM || directionToPrec == BOTTOM && directionToNext == RIGHT) {
      direction = ANGLE_2;
    } else if(directionToPrec == UP && directionToNext == RIGHT || directionToPrec == RIGHT && directionToNext == UP) {
      direction = ANGLE_3;
    } else if(directionToPrec == UP && directionToNext == LEFT || directionToPrec == LEFT && directionToNext == UP) {
      direction = ANGLE_4;
    } else {
      direction = current.direction;
    }

    return direction;
  };

  this.getGraphicDirection = function(index) {
    return this.getGraphicDirectionFor(this.get(index), this.get(index - 1), this.get(index + 1))
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
      snake.queue.push(elem.copy());
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
      var fruitPos = this.grid.fruitPos.copy();
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
    var bestFind = bestFind == undefined ? false : bestFind;
    var res = KEY_RIGHT;

    if(this.aiLevel == AI_LEVEL_RANDOM) {
      res = this.randomAI();
    } else if(this.aiLevel == AI_LEVEL_LOW) {
        res = this.simpleAI();
    } else {
      if(this.grid.fruitPos != null) {
        var currentPosition = this.getHeadPosition();
        var fruitPos = this.grid.fruitPos.copy();

        var grid = this.grid.getGraph(false);
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

        grid, graph, path = null;
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
  this.nbImagesToLoad = 1;
  this.firstImage = true;

  var self = this;

  this.load = function(img, func, game) {
    if(this.firstImage) {
      this.nbImagesToLoad = img.length;
      this.firstImage = false;
    }

    if(img.length > 0) {
      this.loadImage(img[0], function(result) {
        if(result == true) {
          img.shift();
          self.load(img, func, game);
        } else {
          self.hasError = true;
          return func();
        }
      });
    } else {
      return func();
    }

    if(game != undefined && game != null && game instanceof Game) {
      game.updateUI();
    }
  };

  this.loadImage = function(src, func) {
    this.triedLoading++;

    var image = new Image();
    image.src = src;

    image.onload = function() {
      if(self.images != null) {
        self.images[src] = image;
      } else {
        return func(false);
      }

      self.triedLoading = 0;
      return func(true);
    };

    image.onerror = function() {
      if(self.triedLoading >= 5) {
        if(self.images != null) {
          self.images[src] = image;
        }

        self.triedLoading = 0;
        return func(false);
      }

      setTimeout(function() {
        self.loadImage(src, func);
      }, 250);
    }
  };

  this.get = function(src) {
    if(this.images != null) {
      return this.images[src];
    } else {
      return null;
    }
  };

  this.clear = function() {
    this.images = null;
  };
}

function Game(grid, snake, speed, appendTo, enablePause, enableRetry, progressiveSpeed, canvasWidth, canvasHeight, displayFPS, outputType, disableAnimation) {
  // Assets loader
  this.imageLoader;
  this.assetsLoaded = false;
  // Game settings
  this.grid = grid;
  this.snakes = snake;
  this.speed = speed == undefined ? 8 : speed;
  this.initialSpeed = speed == undefined ? 8 : speed;
  this.initialSpeedUntouched = speed == undefined ? 8 : speed;
  this.appendTo = appendTo;
  this.enablePause = enablePause == undefined ? true : enablePause;
  this.enableRetry = enableRetry == undefined ? true : enableRetry;
  this.progressiveSpeed = progressiveSpeed == undefined ? false : progressiveSpeed;
  this.displayFPS = displayFPS == undefined ? false : displayFPS;
  this.outputType = outputType == undefined ? OUTPUT_GRAPHICAL : outputType;
  this.disableAnimation = disableAnimation == undefined ? false : disableAnimation;
  this.countBeforePlay = 3;
  // Game variables
  this.lastKey = -1;
  this.numFruit = 1;
  this.frame = 0;
  this.offsetFrame = this.speed;
  this.lastFrame = 0;
  this.currentFPS = 0;
  // Game state variables
  this.paused = true;
  this.exited = false;
  this.killed = false;
  this.isReseted = true;
  this.gameOver = false;
  this.gameFinished = false; // only used if 2 and more snakes
  this.gameMazeWin = false; // used in maze mode
  this.scoreMax = false;
  this.errorOccured = false;
  this.fullscreen = false;
  // Menus state variables
  this.enableKeyMenu = false;
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
  this.canvasWidth = canvasWidth == undefined ? CANVAS_WIDTH : canvasWidth;
  this.canvasHeight = canvasHeight == undefined ? CANVAS_HEIGHT : canvasHeight;
  this.fontSize = FONT_SIZE;
  this.headerHeight = HEADER_HEIGHT_DEFAULT;
  this.timerToDisplay;
  this.bestScoreToDisplay;
  this.preRenderedFont;
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
  this.btnExitFullScreen;
  this.btnEnterFullScreen;
  // Notification
  this.notificationMessage;
  // Events
  this.reactor = new Reactor();
  this.reactor.registerEvent("onStart");
  this.reactor.registerEvent("onPause");
  this.reactor.registerEvent("onContinue");
  this.reactor.registerEvent("onReset");
  this.reactor.registerEvent("onStop");
  this.reactor.registerEvent("onExit");
  this.reactor.registerEvent("onScoreIncreased");

  var self = this;

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
      this.btnPause = new ButtonImage("assets/images/pause.png", null, 5, null, null, 64, 64);
      this.btnContinue = new Button(window.i18next.t("engine.continue"), null, null, "center", "#3498db", "#246A99");
      this.btnRetry = new Button(window.i18next.t("engine.reset"), null, null, "center", "#3498db", "#246A99");
      this.btnQuit = new Button(window.i18next.t("engine.exit"), null, null, "center", "#3498db", "#246A99");
      this.btnYes = new Button(window.i18next.t("engine.yes"), null, null, "center", "#3498db", "#246A99");
      this.btnNo = new Button(window.i18next.t("engine.no"), null, null, "center", "#3498db", "#246A99");
      this.btnOK = new Button(window.i18next.t("engine.ok"), null, null, "center", "#3498db", "#246A99");
      this.btnAbout = new Button(window.i18next.t("engine.about"), null, null, "center", "#3498db", "#246A99");
      this.btnInfosGame = new Button(window.i18next.t("engine.infosGame"), null, null, "center", "#3498db", "#246A99");
      this.btnTopArrow = new ButtonImage("assets/images/up.png", 64, 92, "right", "bottom", 64, 64, "rgba(255, 255, 255, 0.25)", "rgba(149, 165, 166, 0.25)");
      this.btnRightArrow = new ButtonImage("assets/images/right.png", 0, 46, "right", "bottom", 64, 64, "rgba(255, 255, 255, 0.25)", "rgba(149, 165, 166, 0.25)");
      this.btnLeftArrow = new ButtonImage("assets/images/left.png", 128, 46, "right", "bottom", 64, 64, "rgba(255, 255, 255, 0.25)", "rgba(149, 165, 166, 0.25)");
      this.btnBottomArrow = new ButtonImage("assets/images/bottom.png", 64, 0, "right", "bottom", 64, 64, "rgba(255, 255, 255, 0.25)", "rgba(149, 165, 166, 0.25)");
      this.btnExitFullScreen = new Button(window.i18next.t("engine.exitFullScreen"), null, null, "center", "#3498db", "#246A99");
      this.btnEnterFullScreen = new Button(window.i18next.t("engine.enterFullScreen"), null, null, "center", "#3498db", "#246A99");

      this.btnFullScreen.addClickAction(this.canvas, function() {
        self.toggleFullscreen();
        self.pause();
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

    if(this.snakes == null || this.snakes == undefined) {
      this.errorOccured = true;
      this.snakes = [];
    } else if(!Array.isArray(this.snakes)) {
      this.snakes = [this.snakes];
    } else if((Array.isArray(this.snakes) && this.snakes.length <= 0) || (this.grid.maze && this.snakes.length > 1)) {
      this.errorOccured = true;
    }

    var startHue = randRange(0, 360);

    for(var i = 0; i < this.snakes.length; i++) {
      if(this.snakes[i] instanceof Snake == false) {
        this.errorOccured = true;
      } else {
        startHue = addHue(startHue, Math.round(360 / (this.snakes.length)));
        this.snakes[i].color = startHue;
      }
    }

    if(this.grid instanceof Grid == false) {
      this.errorOccured = true;
    } else if(!this.errorOccured) {
      this.grid.setFruit();
    }

    document.addEventListener("keydown", function(evt) {
      if(!self.killed) {
        var keyCode = evt.keyCode;

        if(keyCode == 90 || keyCode == 87) keyCode = KEY_UP; // W or Z
        if(keyCode == 65 || keyCode == 81) keyCode = KEY_LEFT; // A or Q
        if(keyCode == 83) keyCode = KEY_BOTTOM; // S
        if(keyCode == 68) keyCode = KEY_RIGHT; // D

        if(!self.paused) {
          if(evt.keyCode == KEY_ENTER && self.outputType == OUTPUT_GRAPHICAL) {
            self.pause();
          } else {
            self.lastKey = keyCode;
          }
        } else if(self.countBeforePlay <= -1 && self.enableKeyMenu) {
          self.lastKeyMenu = keyCode;
          self.updateUI();
        }

        evt.preventDefault();
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
      } else if(document.fullscreenElement == this.canvas) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      }

      this.updateUI();
    }
  };

  this.setIntervalCountFPS = function() {
    this.clearIntervalCountFPS();

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
    this.gameMazeWin = false;
    this.initialSpeed = this.initialSpeedUntouched;
    this.speed = this.initialSpeedUntouched;
    this.offsetFrame = this.speed;
    this.grid.setFruit();
    this.start();
  };

  this.onReset = function(callback) {
    this.reactor.addEventListener("onReset", callback);
  };

  this.start = function() {
    if(!this.errorOccured) {
      for(var i = 0; i < this.snakes.length; i++) {
        if(this.snakes[i].errorInit) {
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

        this.intervalPlay = setInterval(function() {
          self.countBeforePlay--;

          if(self.countBeforePlay <= 0) {
            if(self.countBeforePlay <= -1) {
              self.clearIntervalPlay();
              self.paused = false;
              self.isReseted = false;
              self.reactor.dispatchEvent("onStart");
              self.tick();
            } else if(self.countBeforePlay >= 0) {
              self.lastFrame = self.frame > 0 ? self.frame : 1;
              self.testFrameRate();
              self.setIntervalCountFPS();
            }
          } else {
            self.updateUI();
          }
        }, 1000);
      }
    } else {
      this.updateUI();
    }

    if(!this.assetsLoaded) {
      this.loadAssets();
      this.updateUI();
    }
  };

  this.testFrameRate = function() {
    if(this.countBeforePlay >= 0) {
      this.updateUI();

      this.frameGlobal = window.requestAnimationFrame(function() {
        self.frame++;
        self.testFrameRate();
      });
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
      this.snakes[i].kill();
      this.snakes[i] = null;
    }

    this.clearIntervalCountFPS();
    this.clearIntervalPlay();
    window.cancelAnimationFrame(this.frameGlobal);
    window.cancelAnimationFrame(this.frameDisplayMenu);
    this.frameGlobal, this.frameDisplayMenu = null;

    this.grid = null;
    this.snakes = null;
    this.preRenderedFont = null;

    if(this.outputType == OUTPUT_TEXT) {
      this.appendTo.removeChild(this.textarea);
      this.textarea = null;
    } else if(this.outputType == OUTPUT_GRAPHICAL) {
      this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.appendTo.removeChild(this.canvas);
      this.canvas = null;
      this.canvasCtx = null;
      this.imageLoader.clear();
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
    if(!document.hasFocus() && !this.paused) {
      this.pause();
    }

    this.updateUI();

    this.frameGlobal = window.requestAnimationFrame(function() {
      if(!self.paused && !self.killed) {
        self.frame++;
        self.offsetFrame++;

        if((self.frame % self.speed == 0 && (!self.grid.maze || (self.grid.maze && (self.getNBPlayer(PLAYER_HUMAN) <= 0 && self.getNBPlayer(PLAYER_HYBRID_HUMAN_AI) <= 0)))) || (self.grid.maze && ((self.getNBPlayer(PLAYER_HUMAN) > 0 || self.getNBPlayer(PLAYER_HYBRID_HUMAN_AI) > 0) && self.lastKey != -1))) {
          for(var i = 0; i < self.snakes.length; i++) {
            var initialDirection = self.snakes[i].direction;
            var setFruit = false;
            var setFruitError = false;
            self.snakes[i].lastTailMoved = false;

            if(!self.snakes[i].gameOver && !self.snakes[i].scoreMax) {
              if(self.snakes[i].player == PLAYER_HUMAN || self.snakes[i].player == PLAYER_HYBRID_HUMAN_AI) {
                self.snakes[i].moveTo(self.lastKey);
                self.lastKey = -1;
              } else if(self.snakes[i].player == PLAYER_AI) {
                self.snakes[i].moveTo(self.snakes[i].ai(true));
              }

              var headSnakePos = self.snakes[i].getHeadPosition();

              if(self.snakes[i].player == PLAYER_HYBRID_HUMAN_AI && self.grid.isDeadPosition(self.snakes[i].getNextPosition(headSnakePos, self.snakes[i].direction))) {
                self.snakes[i].direction = initialDirection;
                self.snakes[i].moveTo(self.snakes[i].ai(true));
                self.lastKey = -1;
              }

              headSnakePos = self.snakes[i].getNextPosition(headSnakePos, self.snakes[i].direction);

              if(self.grid.isDeadPosition(headSnakePos)) {
                self.snakes[i].setGameOver();
              } else {
                if(self.grid.get(headSnakePos) == FRUIT_VAL) {
                  self.snakes[i].score++;
                  self.reactor.dispatchEvent("onScoreIncreased");
                  self.snakes[i].insert(headSnakePos);

                  if(self.grid.maze) {
                    self.stop();
                    self.gameMazeWin = true;
                    self.gameFinished = true;
                  } else if(self.snakes[i].hasMaxScore() && self.snakes.length <= 1) {
                    self.scoreMax = true;
                    self.snakes[i].scoreMax = true;
                  } else {
                    self.numFruit++;
                    var setFruit = true;
                  }

                  if(self.snakes.length <= 1 && self.progressiveSpeed && self.snakes[i].score > 0 && self.initialSpeed > 1) {
                    self.initialSpeed = Math.ceil(((-self.initialSpeedUntouched / 100) * self.snakes[i].score) + self.initialSpeedUntouched);
                    self.initialSpeed = self.initialSpeed < 1 ? 1 : self.initialSpeed;
                  }
                } else {
                  self.snakes[i].insert(headSnakePos);

                  if(!self.grid.maze) {
                    self.snakes[i].remove();
                    self.snakes[i].lastTailMoved = true;
                  }
                }
              }
            }

            if(!self.scoreMax && setFruit) {
              var setFruitError = !self.grid.setFruit();
            }
          }

          if(!self.scoreMax && !setFruitError && self.grid.isFruitSurrounded(self.grid.fruitPos, true)) {
            var setFruitError = !self.grid.setFruit();
          }

          var nbOver = 0;

          for(var j = 0; j < self.snakes.length; j++) {
            (self.snakes[j].gameOver || self.snakes[j].scoreMax) && nbOver++;
          }

          if(nbOver >= self.snakes.length || setFruitError) {
            self.stop();

            if(self.snakes.length > 1) {
              self.gameFinished = true;
            }
          }

          self.offsetFrame = 0;
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
      if(!document.fullscreenElement) {
        if(this.canvas.requestFullscreen) {
          this.canvas.requestFullscreen();
        } else if(this.canvas.mozRequestFullScreen) {
          this.canvas.mozRequestFullScreen();
        } else if(this.canvas.webkitRequestFullscreen) {
          this.canvas.webkitRequestFullscreen();
        } else if(this.canvas.msRequestFullscreen) {
          this.canvas.msRequestFullscreen();
        } else if(this.canvas.oRequestFullscreen) {
          this.canvas.oRequestFullscreen();
        }
      } else {
        if(document.exitFullscreen) {
          document.exitFullscreen();
        }
      }

      var onfullscreenchange = function(event) {
        if(self.outputType == OUTPUT_GRAPHICAL && !self.killed) {
          if(document.fullscreenElement == self.canvas) {
            self.fullscreen = true;
          } else {
            self.fullscreen = false;
          }

          self.autoResizeCanvas();

          if(document.fullscreenElement == self.canvas && typeof(screen.orientation) !== "undefined" && typeof(screen.orientation.lock) !== "undefined") {
            screen.orientation.lock("landscape");
          }
        }
      };

      if(typeof(document.onfullscreenchange) !== "undefined") {
        document.onfullscreenchange = onfullscreenchange;
      } else if(typeof(document.onmsfullscreenchange) !== "undefined") {
        document.onmsfullscreenchange = onfullscreenchange;
      } else if(typeof(document.onmozfullscreenchange) !== "undefined") {
        document.onmozfullscreenchange = onfullscreenchange;
      } else if(typeof(document.onwebkitfullscreenchange) !== "undefined") {
        document.onwebkitfullscreenchange = onfullscreenchange;
      } else if(typeof(document.onokitfullscreenchange) !== "undefined") {
        document.onofullscreenchange = onfullscreenchange;
      }

      onfullscreenchange();
    }
  };

  this.loadAssets = function() {
    if(!this.errorOccured) {
      this.imageLoader.load(["assets/images/snake_4.png", "assets/images/snake_3.png", "assets/images/snake_2.png", "assets/images/snake.png", "assets/images/body_4_end.png", "assets/images/body_3_end.png", "assets/images/body_2_end.png", "assets/images/body_end.png", "assets/images/body_2.png", "assets/images/body.png", "assets/images/wall.png", "assets/images/fruit.png", "assets/images/body_angle_1.png", "assets/images/body_angle_2.png", "assets/images/body_angle_3.png", "assets/images/body_angle_4.png", "assets/images/pause.png", "assets/images/fullscreen.png", "assets/images/snake_dead_4.png", "assets/images/snake_dead_3.png", "assets/images/snake_dead_2.png", "assets/images/snake_dead.png", "assets/images/up.png", "assets/images/left.png", "assets/images/right.png", "assets/images/bottom.png", "assets/images/close.png", "assets/images/trophy.png", "assets/images/clock.png"], function() {
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
      }, this);
    } else {
      this.updateUI();
    }
  };

  this.updateUI = function(renderBlur) {
    if(this.outputType == OUTPUT_TEXT && !this.killed) {
      this.textarea.innerHTML = this.toString();
    } else if(this.outputType == OUTPUT_GRAPHICAL && !this.killed) {
      var ctx = this.canvasCtx;
      var displayBestScore = false;
      var renderBlur = renderBlur == undefined ? false : renderBlur;
      this.fontSize = FONT_SIZE;
      this.headerHeight = HEADER_HEIGHT_DEFAULT;

      if(this.canvas.width <= CANVAS_WIDTH / 1.25) {
        this.fontSize /= 1.25;
        this.headerHeight = HEADER_HEIGHT_DEFAULT / 1.25;
      } else if(this.canvas.width >= CANVAS_WIDTH * 1.5) {
        this.fontSize *= 1.25;
        this.headerHeight = HEADER_HEIGHT_DEFAULT * 1.25;
      }

      this.btnPause.width = this.headerHeight * 0.85;
      this.btnPause.height = this.btnPause.width;
      this.btnPause.y = (this.headerHeight / 2) - (this.btnPause.height / 2);
      this.btnFullScreen.width = this.headerHeight * 0.85;
      this.btnFullScreen.height = this.btnFullScreen.width;
      this.btnFullScreen.y = (this.headerHeight / 2) - (this.btnFullScreen.height / 2);

      if(renderBlur) {
        ctx.filter = "blur(5px)";
      }

      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = "rgba(204, 207, 211, 1)";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = "#27AE60";
      ctx.fillRect(0, 0, this.canvas.width, this.headerHeight);
      ctx.font = this.fontSize + "px " + FONT_FAMILY;
      ctx.fillStyle = "black";

      this.btnFullScreen.draw(this);

      if(this.enablePause) {
        this.btnPause.x = this.btnFullScreen.x - this.btnPause.width - 10;
        this.btnPause.draw(this);
      }

      if(this.assetsLoaded && !this.errorOccured) {
        var caseHeight = Math.floor((this.canvas.height - this.headerHeight) / this.grid.height);
        var caseWidth = Math.floor(this.canvas.width / this.grid.width);
        caseHeight = caseHeight > caseWidth ? caseWidth : caseHeight;
        caseWidth = caseWidth > caseHeight ? caseHeight : caseWidth;

        if(this.bestScoreToDisplay != undefined && this.bestScoreToDisplay != null) {
          displayBestScore = true;
        }

        this.drawImage(ctx, "assets/images/fruit.png", 5, 5, this.headerHeight * 0.85 * (displayBestScore ? 0.5 : 1), this.headerHeight * 0.85 * (displayBestScore ? 0.5 : 1));

        if(this.snakes.length <= 1) {
          this.drawText(ctx, "× " + this.snakes[0].score, "black", this.headerHeight * 0.43 * (displayBestScore ? 0.75 : 1), FONT_FAMILY, "default", "default", this.headerHeight * 0.9 * (displayBestScore ? 0.58 : 1), this.headerHeight * 0.67 * (displayBestScore ? 0.63 : 1));
        } else {
          this.drawText(ctx, window.i18next.t("engine.num") + this.numFruit, "black", this.headerHeight * 0.43 * (displayBestScore ? 0.75 : 1), FONT_FAMILY, "default", "default", this.headerHeight * 0.9 * (displayBestScore ? 0.58 : 1), this.headerHeight * 0.67 * (displayBestScore ? 0.63 : 1));
        }

        if(displayBestScore) {
          this.drawImage(ctx, "assets/images/trophy.png", 5, 8 + this.headerHeight * 0.425, this.headerHeight * 0.425, this.headerHeight * 0.425);
          this.drawText(ctx, this.bestScoreToDisplay, "black", this.headerHeight * 0.43 * (displayBestScore ? 0.75 : 1), FONT_FAMILY, "default", "default", this.headerHeight * 0.9 * (displayBestScore ? 0.58 : 1), this.headerHeight * 0.425 + this.headerHeight * 0.67 * (displayBestScore ? 0.63 : 1));
        }

        var totalWidth = caseWidth * this.grid.width;

        if(!this.grid.maze || (this.grid.maze && (!this.paused || this.gameOver || this.gameFinished))) {
          for(var i = 0; i < this.grid.height; i++) {
            for(var j = 0; j < this.grid.width; j++) {
              var caseX = Math.floor(j * caseWidth + ((this.canvas.width - totalWidth) / 2));
              var caseY = this.headerHeight + i * caseHeight;

              if((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1)) {
                ctx.fillStyle = "rgba(127, 140, 141, 0.75)";
              } else {
                ctx.fillStyle = "rgba(44, 62, 80, 0.75)";
              }

              ctx.fillRect(caseX, caseY, caseWidth, caseHeight);
              this.drawImage(ctx, this.grid.getImageCase(new Position(j, i)), caseX, caseY, caseWidth, caseHeight);
            }
          }

          this.drawSnake(ctx, caseWidth, caseHeight, totalWidth, renderBlur);
        }

        if(this.timerToDisplay != undefined && this.timerToDisplay != null && this.timerToDisplay >= 0) {
          this.drawImage(ctx, "assets/images/clock.png", this.headerHeight * 0.24, this.headerHeight + 15, this.headerHeight * 0.64, this.headerHeight * 0.64);
          this.drawText(ctx, "" + this.timerToDisplay, "rgba(0, 0, 0, 0.5)", FONT_SIZE, FONT_FAMILY, "default", "default", this.headerHeight, this.headerHeight + 15 + this.headerHeight * 0.475);
        }
      } else if(!this.assetsLoaded && !renderBlur) {
        var percentLoaded = Math.floor((100 * Object.keys(this.imageLoader.images).length) / this.imageLoader.nbImagesToLoad);
        this.drawMenu(ctx, [], window.i18next.t("engine.loading") + "\n" + percentLoaded + "%", "white", this.fontSize, FONT_FAMILY, "center", null, true);
      }

      if(this.notificationMessage != undefined && this.notificationMessage != null && this.notificationMessage instanceof NotificationMessage && !this.notificationMessage.foreGround) {
        this.notificationMessage.draw(this);
      }

      for(var i = 0; i < this.snakes.length; i++) {
        if(this.snakes[i].player == PLAYER_HUMAN || this.snakes[i].player == PLAYER_HYBRID_HUMAN_AI) {
          this.btnTopArrow.draw(this);
          this.btnBottomArrow.draw(this);
          this.btnRightArrow.draw(this);
          this.btnLeftArrow.draw(this);
          break;
        }
      }

      this.disableAllButtons();

      if(!renderBlur) {
        if(this.exited) {
          this.drawMenu(ctx, this.fullscreen ? [this.btnExitFullScreen] : [], window.i18next.t("engine.exited"), "white", this.fontSize, FONT_FAMILY, "center", null, true, function() {
            self.btnExitFullScreen.addClickAction(self.canvas, function() {
              self.toggleFullscreen();
            });
          });
        } else if(this.errorOccured) {
         this.drawMenu(ctx, [this.btnQuit], this.imageLoader.hasError ? window.i18next.t("engine.errorLoading") : window.i18next.t("engine.error"), "red", this.fontSize, FONT_FAMILY, "center", null, true, function() {
           self.btnQuit.addClickAction(self.canvas, function() {
             self.confirmExit = false;
             self.selectedButton = 0;
             self.exit();
           });
         });
       } else if(this.getInfosGame) {
          this.drawMenu(ctx, [this.btnOK], (this.snakes.length <= 1 ? window.i18next.t("engine.player") + " " + ((this.snakes[0].player == PLAYER_HUMAN  || this.snakes[0].player == PLAYER_HYBRID_HUMAN_AI) ? window.i18next.t("engine.playerHuman") : window.i18next.t("engine.playerAI")) : "") + (this.getNBPlayer(PLAYER_AI) > 0 ? "\n" +  window.i18next.t("engine.aiLevel") + " " + this.getPlayer(1, PLAYER_AI).getAILevelText() : "") + "\n" + window.i18next.t("engine.sizeGrid") + " " + this.grid.width + "×" + this.grid.height + "\n" + window.i18next.t("engine.currentSpeed") + " " + this.initialSpeed + (this.snakes.length <= 1 && this.progressiveSpeed ? "\n" + window.i18next.t("engine.progressiveSpeed") : "") + (!this.grid.maze && this.snakes[0].player == PLAYER_HYBRID_HUMAN_AI ? "\n" + window.i18next.t("engine.assistAI") : "") + (this.grid.maze ? "\n" + window.i18next.t("engine.mazeModeMin") : ""), "white", this.fontSize, FONT_FAMILY, "center", null, false, function() {
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
        } else if(this.assetsLoaded && this.countBeforePlay >= 0) {
          if((this.snakes.length > 1 && this.getNBPlayer(PLAYER_HUMAN) <= 1 && this.getPlayer(1, PLAYER_HUMAN) != null) || (this.snakes.length > 1 && this.getNBPlayer(PLAYER_HYBRID_HUMAN_AI) <= 1 && this.getPlayer(1, PLAYER_HYBRID_HUMAN_AI) != null)) {
            if(this.getPlayer(1, PLAYER_HUMAN) != null) {
              var playerHuman = this.getPlayer(1, PLAYER_HUMAN);
            } else {
              var playerHuman = this.getPlayer(1, PLAYER_HYBRID_HUMAN_AI);
            }

            var colorName = hslToName(addHue(IMAGE_SNAKE_HUE, playerHuman.color), IMAGE_SNAKE_SATURATION, IMAGE_SNAKE_VALUE);
            var colorRgb = hsvToRgb(addHue(IMAGE_SNAKE_HUE, playerHuman.color) / 360, IMAGE_SNAKE_SATURATION / 100, IMAGE_SNAKE_VALUE / 100);

            if(this.countBeforePlay > 0) {
              this.drawMenu(ctx, !this.fullscreen ? [this.btnEnterFullScreen] : [], "" + this.countBeforePlay + "\n" + (isFilterHueAvailable() ? window.i18next.t("engine.colorPlayer", { color: colorName }) : window.i18next.t("engine.arrowPlayer")), (isFilterHueAvailable() ? ["white", "rgb(" + colorRgb[0] + ", " + colorRgb[1] + ", " + colorRgb[2] + ")"] : ["white", "#3498db"]), this.fontSize, FONT_FAMILY, "center", null, false, function() {
                self.btnEnterFullScreen.addClickAction(self.canvas, function() {
                  self.toggleFullscreen();
                });
              });
            } else {
              this.drawMenu(ctx, !this.fullscreen ? [this.btnEnterFullScreen] : [], window.i18next.t("engine.ready") + "\n" + (isFilterHueAvailable() ? window.i18next.t("engine.colorPlayer", { color: colorName }) : window.i18next.t("engine.arrowPlayer")), (isFilterHueAvailable() ? ["white", "rgb(" + colorRgb[0] + ", " + colorRgb[1] + ", " + colorRgb[2] + ")"] : ["white", "#3498db"]), this.fontSize, FONT_FAMILY, "center", null, false, function() {
                self.btnEnterFullScreen.addClickAction(self.canvas, function() {
                  self.toggleFullscreen();
                });
              }, true);
            }
          } else {
            if(this.countBeforePlay > 0) {
              this.drawMenu(ctx, !this.fullscreen ? [this.btnEnterFullScreen] : [], "" + this.countBeforePlay, "white", this.fontSize, FONT_FAMILY, "center", null, false, function() {
                self.btnEnterFullScreen.addClickAction(self.canvas, function() {
                  self.toggleFullscreen();
                });
              });
            } else {
              this.drawMenu(ctx, !this.fullscreen ? [this.btnEnterFullScreen] : [], window.i18next.t("engine.ready"), "white", this.fontSize, FONT_FAMILY, "center", null, false, function() {
                self.btnEnterFullScreen.addClickAction(self.canvas, function() {
                  self.toggleFullscreen();
                });
              }, true);
            }
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
          this.drawMenu(ctx, this.enableRetry ? [this.btnRetry, this.btnQuit] : [this.btnQuit], (this.grid.maze && this.gameMazeWin) ? window.i18next.t("engine.mazeWin") : window.i18next.t("engine.gameFinished"), (this.grid.maze && this.gameMazeWin) ? "#2ecc71" : "white", this.fontSize, FONT_FAMILY, "center", null, true, function() {
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
          this.drawMenu(ctx, this.enableRetry ? [this.btnRetry, this.btnQuit] : (this.fullscreen ? [this.btnExitFullScreen] : []), window.i18next.t("engine.scoreMax"), "#2ecc71", this.fontSize, FONT_FAMILY, "center", null, true, function() {
            self.btnRetry.addClickAction(self.canvas, function() {
              self.selectedButton = 0;
              self.reset();
            });

            self.btnQuit.addClickAction(self.canvas, function() {
              self.confirmExit = true;
              self.selectedButton = 0;
              self.updateUI();
            });

            self.btnExitFullScreen.addClickAction(self.canvas, function() {
              self.toggleFullscreen();
            });
          });
        } else if(this.gameOver && this.snakes.length <= 1) {
          this.drawMenu(ctx, this.enableRetry && !this.snakes[0].autoRetry ? [this.btnRetry, this.btnQuit] : (this.fullscreen ? [this.btnExitFullScreen] : []), window.i18next.t("engine.gameOver"), "#E74C3C", this.fontSize, FONT_FAMILY, "center", null, false, function() {
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

              self.btnExitFullScreen.addClickAction(self.canvas, function() {
                self.toggleFullscreen();
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
            if(this.snakes[i].player == PLAYER_HUMAN || this.snakes[i].player == PLAYER_HYBRID_HUMAN_AI) {
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

          if(this.notificationMessage != undefined && this.notificationMessage != null && this.notificationMessage instanceof NotificationMessage && !this.notificationMessage.foreGround) {
            this.notificationMessage.enableCloseButton();
          }

          if(this.notificationMessage != undefined && this.notificationMessage != null && this.notificationMessage instanceof NotificationMessage && this.notificationMessage.foreGround) {
            this.notificationMessage.draw(this);
          }
        }
      }

      if(this.displayFPS) {
        this.drawText(ctx, this.getDebugText(), "rgba(255, 255, 255, 0.5)", this.fontSize / 1.5, FONT_FAMILY, "right", "bottom", null, null, true);
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
      this.btnExitFullScreen.disable();
      this.btnEnterFullScreen.disable();

      if(this.notificationMessage != undefined && this.notificationMessage != null && this.notificationMessage instanceof NotificationMessage && !this.notificationMessage.foreGround) {
        this.notificationMessage.disableCloseButton();
      }

      this.btnTopArrow.disable();
      this.btnBottomArrow.disable();
      this.btnRightArrow.disable();
      this.btnLeftArrow.disable();
    }
  };

  this.setNotification = function(notification) {
    if(this.notificationMessage != undefined && this.notificationMessage != null && this.notificationMessage instanceof NotificationMessage) {
      this.notificationMessage.close();
    }

    this.notificationMessage = notification;
    this.updateUI();
  };

  this.setTimeToDisplay = function(time) {
    this.timerToDisplay = time;
  };

  this.setBestScore = function(score) {
    if(score != undefined && score != null && score.trim() != "") {
      this.bestScoreToDisplay = score;
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

Game.prototype.preRenderFont = function(cars, size, color, fontFamily) {
  cars.push("?"); cars.push(" "); cars.push("A");

  for(var i = 0; i < cars.length; i++) {
    var canvasTmp = document.createElement("canvas");
    var ctxTmp = canvasTmp.getContext("2d");
    ctxTmp.font = size + "px " + fontFamily;
    var width = ctxTmp.measureText(cars[i]).width;

    canvasTmp.width = width;
    canvasTmp.height = size + (size / 6);

    ctxTmp.font = size + "px " + fontFamily;
    ctxTmp.fillStyle = color;
    ctxTmp.textBaseline = "top";
    ctxTmp.fillText(cars[i], 0, 0);

    this.preRenderedFont[cars[i]] = canvasTmp;
  }
};

Game.prototype.drawImage = function(ctx, imgSrc, x, y, width, height, sx, sy, sWidth, sHeight, eraseBelow, degrees) {
  this.drawImageWrapper(ctx, this.imageLoader.get(imgSrc), x, y, width, height, sx, sy, sWidth, sHeight, eraseBelow, degrees);
};

Game.prototype.drawImageData = function(ctx, imageData, x, y, width, height, sx, sy, sWidth, sHeight, eraseBelow, degrees) {
  this.drawImageWrapper(ctx, imageData, x, y, width, height, sx, sy, sWidth, sHeight, eraseBelow, degrees);
};

Game.prototype.drawImageWrapper = function(ctx, image, x, y, width, height, sx, sy, sWidth, sHeight, eraseBelow, degrees) {
  var x = (x == undefined || isNaN(x)) ? null : Math.round(x);
  var y = (y == undefined || isNaN(y)) ? null : Math.round(y);
  var width = (width == undefined || isNaN(width)) ? null : Math.round(width);
  var height = (height == undefined || isNaN(height)) ? null : Math.round(height);
  var sx = (sx == undefined || isNaN(sx)) ? null : Math.round(sx);
  var sy = (sy == undefined || isNaN(sy)) ? null : Math.round(sy);
  var sWidth = (sWidth == undefined || isNaN(sWidth)) ? null : Math.round(sWidth);
  var sHeight = (sHeight == undefined || isNaN(sHeight)) ? null : Math.round(sHeight);
  var eraseBelow = eraseBelow == undefined ? false : eraseBelow;
  var degrees = (degrees == undefined || isNaN(degrees)) ? null : degrees;

  if(degrees != undefined) {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(degrees * Math.PI / 180);
    x = -(width / 2);
    y = -(height / 2);
  }

  if(eraseBelow) {
    ctx.clearRect(x, y, width, height);
  }

  if(ctx != undefined && image != undefined) {
    if(sx != undefined && sy != undefined && sWidth != undefined && sHeight != undefined) {
      ctx.drawImage(image, sx, sy, sWidth, sHeight, x, y, width, height);
    } else {
      ctx.drawImage(image, x, y, width, height);
    }
  }

  if(degrees != undefined) {
    ctx.restore();
  }
};

Game.prototype.drawText = function(ctx, text, color, size, fontFamily, alignement, verticalAlignement, x, y, wrap, bold) {
  var precFillStyle = ctx.fillStyle;
  var precFont = ctx.font;
  var precFilter = ctx.filter;

  if(!Array.isArray(color)) {
    ctx.fillStyle = color;
  }

  ctx.font = (bold ? "bold " : "") + size + "px " + fontFamily;
  ctx.filter = "none";

  if(wrap) {
    text = this.wrapTextLines(ctx, text)["text"];
  }

  var lines = text.split('\n');

  if(verticalAlignement == "center") {
    y = (this.canvas.height / 2) - (size * lines.length / 2);
  } else if(verticalAlignement == "top") {
    y = 5;
  } else if(verticalAlignement == "bottom") {
    y = (this.canvas.height) - (size * lines.length) / 2 - size / 5;
  }

  for(var i = 0; i < lines.length; i++) {
    var currentText = lines[i];

    if(Array.isArray(color)) {
      var colorIndex = i;

      if(colorIndex > color.length - 1) {
        colorIndex = color.length - 1;
      }

      ctx.fillStyle = color[colorIndex];
    }

    if(alignement == "center") {
      ctx.fillText(currentText, Math.round((this.canvas.width / 2) - (ctx.measureText(currentText).width / 2)), Math.round(y + (size * i)));
    } else if(alignement == "right") {
      ctx.fillText(currentText, Math.round((this.canvas.width) - (ctx.measureText(currentText).width) - 15), Math.round(y + (size * i)));
    } else if(alignement == "left") {
      ctx.fillText(currentText, 5, Math.round(y + (size * i)));
    } else {
      ctx.fillText(currentText, Math.round(x), Math.round(y + (size * i)));
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

Game.prototype.drawTextBitmap = function(ctx, bitmapFontSet, text, size, x, y, wrap) {
  if(bitmapFontSet == undefined || bitmapFontSet == null) {
    this.preRenderedFont = {};
    this.preRenderFont(CAR_TO_PRERENDER, FONT_SIZE * 2, "white", FONT_FAMILY);
    bitmapFontSet = this.preRenderedFont;
  }

  if(wrap) {
    var testCar = bitmapFontSet["A"];
    text = this.wrapTextLines(ctx, text, testCar.width * (size / testCar.height), size)["text"];
  }

  var lines = text.split('\n');
  var currentY = y;

  for(var i = 0; i < lines.length; i++) {
    var currentText = lines[i];
    var currentX = x;

    for(var j = 0; j < currentText.length; j++) {
      var currentCar = currentText.charAt(j);

      if(bitmapFontSet[currentCar] == undefined || bitmapFontSet[currentCar] == null) {
        var currentCarBitmap = bitmapFontSet["?"];
      } else {
        var currentCarBitmap = bitmapFontSet[currentCar];
      }

      var widthBitmap = currentCarBitmap.width * (size / currentCarBitmap.height);
      this.drawImageData(ctx, currentCarBitmap, currentX, currentY, widthBitmap, size, 0, 0, currentCarBitmap.width, currentCarBitmap.height);
      currentX += widthBitmap;
    }

    if(currentText.length > 0) {
      currentY += size;
    }
  }
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

Game.prototype.wrapTextLines = function(ctx, text, width, fontSize) {
  var lines = text.split("\n");
  var newText = "";
  var widthCar = width || ctx.measureText("A").width;
  var nbCarLine = Math.round(this.canvas.width / widthCar);
  var heightTotal = 0;

  for(var i = 0; i < lines.length; i++) {
    var lineWrap = this.wrapText(lines[i], nbCarLine);
    newText += lineWrap;

    if(i < lines.length - 1) {
      newText += "\n";
    }

    for(var j = 0; j < lineWrap.split("\n").length; j++) {
      heightTotal += parseFloat(fontSize);
    }
  }

  return {
    text: newText,
    height: heightTotal
  };
};

Game.prototype.drawMenu = function(ctx, buttons, text, color, size, fontFamily, alignement, x, wrap, func, disableAnimationFrame) {
  var self = this;
  var disableAnimationFrame = disableAnimationFrame == undefined ? false : disableAnimationFrame;

  if(!disableAnimationFrame) {
    window.cancelAnimationFrame(this.frameDisplayMenu);
  }

  var displayMenu = function() {
    ctx.fillStyle = "rgba(44, 62, 80, 0.75)";
    ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);

    var heightText = self.wrapTextLines(ctx, text, null, size)["height"];
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
          heightButtons += self.wrapTextLines(ctx, buttons[i].text, null, buttons[i].getFontSize(ctx))["height"] + 8;
        } else {
          heightButtons += buttons[i].height + 5;
        }
      }
    }

    var totalHeight = heightText + heightButtons;
    var startY = self.canvas.height / 2 - totalHeight / 2 + 16;
    var currentY = startY + heightText;

    self.drawText(ctx, text, color, size, fontFamily, alignement, "default", x, startY, true);

    var buttonEntered = false;

    if(buttons != null) {
      for(var i = 0; i < buttons.length; i++) {
        buttons[i].y = currentY;

        if(self.selectedButton == i) {
          buttons[i].selected = true;
        } else {
          buttons[i].selected = false;
        }

        buttons[i].enable();
        buttons[i].draw(self);

        if(self.selectedButton == i && self.lastKeyMenu == KEY_ENTER && buttons[i].triggerClick != null && !buttons[i].disabled) {
          buttonEntered = true;
          buttons[i].triggerClick();
          break;
        }

        currentY += buttons[i].height + 8;
      }
    }

    if(self.notificationMessage != undefined && self.notificationMessage != null && self.notificationMessage instanceof NotificationMessage && self.notificationMessage.foreGround && !buttonEntered) {
      self.notificationMessage.draw(self);
    }

    if(func != null) {
      func(true);
    }

    self.lastKeyMenu = -1;
  };

  if(disableAnimationFrame) {
    displayMenu();
  } else {
    this.frameDisplayMenu = window.requestAnimationFrame(displayMenu);
  }
};

Game.prototype.drawSnake = function(ctx, caseWidth, caseHeight, totalWidth, blur) {
  var canvasTmp = document.createElement("canvas");
  canvasTmp.width = this.canvas.width;
  canvasTmp.height = this.canvas.height;
  var ctxTmp = canvasTmp.getContext("2d");

  for(var j = 0; j < this.snakes.length; j++) {
    ctxTmp.clearRect(0, 0, canvasTmp.width, canvasTmp.height);

    if(this.snakes[j].color != undefined) {
      ctxTmp.filter = "hue-rotate(" + this.snakes[j].color + "deg)";
    }

    if(blur) {
      ctxTmp.filter = ctxTmp.filter + " blur(5px)";
    }

    for(var i = this.snakes[j].length() - 1; (i >= -1 && this.snakes[j].length() > 1) || i >= 0; i--) { // -1 == tail
      if(i == -1) {
        var position = this.snakes[j].get(this.snakes[j].length() - 1);
      } else {
        var position = this.snakes[j].get(i);
      }

      var caseX = 0;
      var caseY = 0;
      var direction = position.direction;
      var angle = 0;
      var imageLoc = "";
      var eraseBelow = true;

      if(i == 0) {
        direction = this.snakes[j].getHeadPosition().direction;
      } else if(i == -1) {
        if(!this.disableAnimation && !this.snakes[j].gameOver && !this.snakes[j].scoreMax && !this.gameFinished && this.snakes[j].lastTailMoved) {
          direction = this.snakes[j].getTailPosition().direction;
        } else {
          direction = this.snakes[j].get(this.snakes[j].length() - 2).direction;
        }
      } else {
        direction = this.snakes[j].getGraphicDirection(i);
      }

      // Animation
      if(!this.disableAnimation && (i == 0 || (i == -1 && this.snakes[j].lastTailMoved)) && !this.snakes[j].gameOver && !this.snakes[j].scoreMax && !this.gameFinished) {
        var offset = this.offsetFrame / this.speed; // percentage of the animation
        var offset = (offset > 1 ? 1 : offset);
        var offsetX = (caseWidth * offset) - caseWidth;
        var offsetY = (caseHeight * offset) - caseHeight;

        var currentPosition = position;

        if(i == 0) {
          if(this.snakes[j].length() > 1) {
            var graphicDirection = this.snakes[j].getGraphicDirection(1);
          } else {
            var graphicDirection = this.snakes[j].getGraphicDirection(0);
          }
        } else if(i == -1) {
          var graphicDirection = this.snakes[j].getGraphicDirectionFor(this.snakes[j].getTailPosition(), this.snakes[j].lastTail, this.snakes[j].get(this.snakes[j].length() - 2));
        }

        if(i == -1 && this.snakes[j].length() > 1) {
          currentPosition = this.snakes[j].get(this.snakes[j].length() - 1);
        }

        if((i == 0 || i == -1) && (graphicDirection == ANGLE_1 || graphicDirection == ANGLE_2 || graphicDirection == ANGLE_3 || graphicDirection == ANGLE_4)) {
          if(i == 0) {
            angle = -90;
          }

          if(i == 0) {
            angle += -128.073 * Math.pow(offset, 2) + 222.332 * offset - 5.47066;
          } else if(i == -1) {
            angle += 126.896 * Math.pow(offset, 2) + -33.6471 * offset + 1.65942;
          }

          if(i == 0 && ((graphicDirection == ANGLE_4 && direction == UP) || (graphicDirection == ANGLE_1 && direction == LEFT) || (graphicDirection == ANGLE_2 && direction == BOTTOM) || (graphicDirection == ANGLE_3 && direction == RIGHT))) {
            angle = -angle;
          } else if(i == -1 && ((graphicDirection == ANGLE_4 && direction == RIGHT) || (graphicDirection == ANGLE_3 && direction == BOTTOM) || (graphicDirection == ANGLE_1 && direction == UP) || (graphicDirection == ANGLE_2 && direction == LEFT))) {
            angle = - angle;
          }

          eraseBelow = false;
        }

        switch(currentPosition.direction) {
          case UP:
            caseY -= offsetY;
            break;
          case BOTTOM:
            caseY += offsetY;
            break;
          case RIGHT:
            caseX += offsetX;
            break;
          case LEFT:
            caseX -= offsetX;
            break;
        }
      }

      if(i == this.snakes[j].length() - 1) {
        direction = this.snakes[j].getGraphicDirectionFor(position, this.snakes[j].get(i - 1), this.snakes[j].lastTail);
      }

      var posX = position.x;
      var posY = position.y;
      caseX += Math.floor(posX * caseWidth + ((this.canvas.width - totalWidth) / 2));
      caseY += this.headerHeight + posY * caseHeight;

      if(i == 0) {
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
      } else if(i == -1) {
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
        switch(direction) {
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
          case ANGLE_1:
            imageLoc = "assets/images/body_angle_1.png";
            break;
          case ANGLE_2:
            imageLoc = "assets/images/body_angle_2.png";
            break;
          case ANGLE_3:
            imageLoc = "assets/images/body_angle_3.png";
            break;
          case ANGLE_4:
            imageLoc = "assets/images/body_angle_4.png";
            break;
        }
      }

      this.drawImage(ctxTmp, imageLoc, caseX, caseY, caseWidth, caseHeight, null, null, null, null, eraseBelow, angle);
    }

    this.drawImageData(ctx, canvasTmp, Math.floor((this.canvas.width - totalWidth) / 2), this.headerHeight, totalWidth, caseHeight * this.grid.height, Math.floor((this.canvas.width - totalWidth) / 2), this.headerHeight, totalWidth, caseHeight * this.grid.height);
    ctxTmp.filter = "none";
  }

  if(this.snakes.length > 1) {
    this.drawSnakeInfos(ctx, totalWidth, caseWidth, caseHeight);
  }
};

Game.prototype.drawArrow = function(ctx, fromx, fromy, tox, toy) {
  var lineCap = ctx.lineCap;
  var lineWidth = ctx.lineWidth;
  var strokeStyle = ctx.strokeStyle;
  var filter = ctx.filter;
  ctx.lineCap = 'round';
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#FF0000";
  ctx.filter = "";

  ctx.beginPath();
  var headlen = 20;
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.moveTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
  ctx.stroke();

  ctx.lineCap = lineCap;
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.filter = filter;
};

Game.prototype.drawSnakeInfos = function(ctx, totalWidth, caseWidth, caseHeight) {
  var numPlayer = 0;
  var numAI = 0;

  for(var i = 0; i < this.snakes.length; i++) {
    if(this.snakes[i].player == PLAYER_HUMAN || this.snakes[i].player == PLAYER_HYBRID_HUMAN_AI) {
      numPlayer++;
    } else {
      numAI++;
    }

    var position = this.snakes[i].get(0);
    var posX = position.x;
    var posY = position.y;
    var caseX = Math.floor(posX * caseWidth + ((this.canvas.width - totalWidth) / 2));
    var caseY = this.headerHeight + posY * caseHeight;

    if(!this.snakes[i].gameOver) {
      var offset = this.offsetFrame / this.speed;
      var offset = (offset > 1 ? 1 : offset);
      var offsetX = (caseWidth * offset) - caseWidth;
      var offsetY = (caseHeight * offset) - caseHeight;

      switch(position.direction) {
        case UP:
          caseY -= offsetY;
          break;
        case BOTTOM:
          caseY += offsetY;
          break;
        case RIGHT:
          caseX += offsetX;
          break;
        case LEFT:
          caseX -= offsetX;
          break;
      }
    }

    this.drawText(ctx, ((this.snakes[i].player == PLAYER_HUMAN || this.snakes[i].player == PLAYER_HYBRID_HUMAN_AI) ? window.i18next.t("engine.playerMin") + numPlayer : window.i18next.t("engine.aiMin") + numAI) + "\n× " + this.snakes[i].score, "rgb(255, 255, 255)", Math.round(caseHeight / 2), FONT_FAMILY, null, null, caseX, caseY - Math.round(caseHeight / 1.75), false, true);

    if((this.snakes[i].player == PLAYER_HUMAN || this.snakes[i].player == PLAYER_HYBRID_HUMAN_AI) && this.countBeforePlay >= 0 && ((isFilterHueAvailable() && this.snakes.length > 2) || (!isFilterHueAvailable() && this.snakes.length > 1))) {
      this.drawArrow(ctx, caseX + (caseWidth / 2), caseY - caseHeight * 2, caseX + (caseWidth / 2), caseY - 5);
    }
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

  var self = this;

  this.draw = function(game) {
    var canvas = game.canvas;
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
      var textWrapped = game.wrapTextLines(ctx, text, null, this.fontSize);
      var heightText = textWrapped["height"];

      if(this.autoWidth) {
        this.width = textSize.width + 25;
      }

      if(this.autoHeight) {
        this.height = heightText + this.fontSize / 1.5;
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
      var textY = this.y + this.fontSize + this.fontSize / 5;

      game.drawText(ctx, this.text, this.fontColor, this.fontSize, this.fontFamily, (this.alignement == "center" ? "center" : "default"), "default", Math.round(textX), Math.round(textY), true);
    }

    ctx.fillStyle = precFillStyle;
    ctx.font = precFont;

    if(!this.init) {
      this.addMouseOverAction(game, null);
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

      function clickFunction(evt) {
        if(!self.disabled) {
          if(self.isInside(self.getMousePos(canvas, evt))) {
            if(self.triggerClick != null) {
              self.triggerClick();
            }

            self.hovered = false;
            self.clicked = true;
          } else {
            self.clicked = false;
          }
        }
      };

      canvas.addEventListener("click", clickFunction, false);
    }
  };

  this.removeClickAction = function() {
    if(self.triggerClick != null)  {
      self.triggerClick = null;
    }
  };

  this.addMouseOverAction = function(game, trigger) {
    if(!this.disabled) {
      this.triggerHover = trigger;

      function mouseOverFunction(evt) {
        if(!self.disabled) {
          if(self.isInside(self.getMousePos(game.canvas, evt))) {
            if(self.triggerHover != null && !self.disabled) {
              self.triggerHover();
            }

            self.hovered = true;
            self.clicked = false;
          } else {
            self.hovered = false;
          }

          self.draw(game);
        }
      };

      game.canvas.addEventListener("mousemove", mouseOverFunction, false);
    }
  };

  this.removeHoverAction = function() {
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

function NotificationMessage(text, textColor, backgroundColor, delayBeforeClosing, animationDelay, fontSize, fontFamily, foreGround) {
  this.text = text;
  this.textColor = textColor == undefined ? "rgba(255, 255, 255, 0.75)" : textColor;
  this.backgroundColor = backgroundColor == undefined ? "rgba(46, 204, 113, 0.5)" : backgroundColor;
  this.delayBeforeClosing = delayBeforeClosing == undefined ? 5 : delayBeforeClosing; // second
  this.fontSize = fontSize == undefined ? Math.floor(FONT_SIZE / 1.25) : fontSize;
  this.fontFamily = fontFamily == undefined ? FONT_FAMILY : fontFamily;
  this.animationDelay = animationDelay == undefined ? 500 : animationDelay;
  this.foreGround = foreGround == undefined ? false : foreGround;
  this.timeLastFrame = 0;
  this.animationTime = 0;
  this.init = false;
  this.closed = false;
  this.closing = false;
  this.closeButton;

  var self = this;

  this.draw = function(game) {
    if(this.text != null) {
      var canvas = game.canvas;

      if(!this.init) {
        this.timeLastFrame = Date.now();

        this.closeButton = new ButtonImage("assets/images/close.png", null, 5, "right", null, 32, 32, null, null, game.imageLoader);
        this.closeButton.addClickAction(canvas, function() {
          self.close();
        });
      }

      var offsetTime = Date.now() - this.timeLastFrame;
      this.timeLastFrame = Date.now();

      if(this.animationTime >= this.delayBeforeClosing * 1000 && !this.closing && !this.closed) {
        this.close();
      }

      var ctx = canvas.getContext("2d");
      this.fontSize = this.getFontSize(ctx) * 1.25;

      var heightText = game.wrapTextLines(ctx, text, null, this.fontSize)["height"];

      var height = heightText + this.fontSize / 2;
      var width = canvas.width;

      var offsetY = this.animationTime / this.animationDelay;

      if(!this.closing) {
        this.animationTime += offsetTime;
      } else {
        this.animationTime -= offsetTime;
      }

      if(this.animationTime < 0) {
        this.closed = true;
        this.closing = false;
      }

      if(!this.closed) {
        var offsetY = this.animationTime / this.animationDelay;
        var y = canvas.height - (height * (offsetY <= 1 ? offsetY : 1));

        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, y, width, height);

        game.drawText(ctx, this.text, this.textColor, this.fontSize, this.fontFamily, "center", "default", null, y + this.fontSize, true);

        this.closeButton.y = y + 5;

        if(!this.foreGround) {
          this.closeButton.draw(game);
        }

        this.disableCloseButton();
      } else {
        this.disableCloseButton();
      }

      this.init = true;
    }
  };

  this.close = function() {
    this.disableCloseButton();

    if(!this.closing) {
      this.closing = true;
      this.animationTime = this.animationDelay;
    }
  };

  this.open = function() {
    this.timeLastFrame = 0;
    this.animationTime = 0;
    this.init = false;
    this.closed = false;
    this.closing = false;
  };

  this.disableCloseButton = function() {
    if(this.closeButton != undefined && this.closeButton != null && this.closeButton instanceof Button) {
      this.closeButton.disable();
    }
  };

  this.enableCloseButton = function() {
    if(this.closeButton != undefined && this.closeButton != null && this.closeButton instanceof Button) {
      this.closeButton.enable();
    }
  };

  this.copy = function() {
    return new NotificationMessage(this.text, this.textColor, this.backgroundColor, this.delayBeforeClosing, this.animationDelay, this.fontSize, this.fontFamily, this.foreGround);
  };

  this.getFontSize = function(ctx) {
    return Math.floor(parseInt(ctx.font.match(/\d+/), 10) / 1.25);
  };
}

function GameGroup(games) {
  this.games = games == undefined ? [] : games;
  this.reactor = new Reactor();
  this.reactor.registerEvent("onStart");
  this.reactor.registerEvent("onPause");
  this.reactor.registerEvent("onContinue");
  this.reactor.registerEvent("onStop");
  this.reactor.registerEvent("onReset");
  this.reactor.registerEvent("onExit");
  this.reactor.registerEvent("onScoreIncreased");

  var self = this;

  this.init = function() {
    for(var i = 0; i < this.games.length; i++) {
      if(i == 0) {
        self.games[i].enableKeyMenu = true;
      }

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

  this.checkStop = function() {
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

  this.setNotification = function(notification) {
    for(var i = 0; i < this.games.length; i++) {
      this.games[i].setNotification(notification.copy());
    }
  };

  this.closeNotification = function() {
    for(var i = 0; i < this.games.length; i++) {
      this.games[i].setNotification(null);
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

    if(maxScore >= 0) {
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
