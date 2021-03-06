/*
 * Copyright (C) 2019-2020 Eliastik (eliastiksofts.com)
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
import GameConstants from "./constants";
import GameController from "./gameController";
import GameControllerWorker from "./gameControllerWorker";
import GameUI from "./gameUI";
import GameEngine from "./gameEngine";

// Polyfills
if(typeof(window) !== "undefined") {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;
  window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || window.oCancelAnimationFrame || window.mozCancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame;
}

if(typeof(document) !== "undefined" && typeof(document.fullscreenElement) === "undefined") {
  Object.defineProperty(document, "fullscreenElement", {
    get: function() {
      return document.mozFullScreenElement || document.msFullscreenElement || document.webkitFullscreenElement || document.oFullscreenElement;
    }
  });
}

if(typeof(document) !== "undefined") {
  document.exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
}

/*if(typeof(screen) !== "undefined") {
  screen.orientation = screen.msOrientation || screen.mozOrientation || screen.orientation;
}*/

if(!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

// Test if Workerd are supported
function WorkersAvailable(callback) {
  try {
    if(!window.Worker) throw "Workers not supported";
    var testWorker = new Worker("dist/GameEngineWorker.js");

    if(testWorker) {
      testWorker.postMessage("ping");

      testWorker.onmessage = function(e) {
        if(e.data == "pong") {
          testWorker.terminate();
          return callback(true);
        }
      };
    }
  } catch(e) {
    return callback(false);
  }
}

var workersAvailable = false;

WorkersAvailable(function(result) {
  workersAvailable = result; 
});

// Old game API
function Game(grid, snake, speed, appendTo, enablePause, enableRetry, progressiveSpeed, canvasWidth, canvasHeight, displayFPS, outputType, settings, ui) {
  var controller;

  var engine = new GameEngine(grid, snake, speed, enablePause, enableRetry, progressiveSpeed);
  engine.init();
  
  if(workersAvailable && settings.enableMultithreading) {
    controller = new GameControllerWorker(engine);
  } else {
    controller = new GameController(engine);
  }
  
  if(ui) {
    controller.gameUI = ui;
  } else {
    controller.gameUI = new GameUI(controller, appendTo, canvasWidth, canvasHeight, displayFPS, outputType, settings);
  }
  
  controller.init();
  
  return controller;
}

// Constants shim
// Player type
window.PLAYER_AI = GameConstants.PlayerType.AI;
window.PLAYER_HUMAN = GameConstants.PlayerType.HUMAN;
window.PLAYER_HYBRID_HUMAN_AI = GameConstants.PlayerType.HYBRID_HUMAN_AI;
// AI level
window.AI_LEVEL_RANDOM = GameConstants.AiLevel.RANDOM;
window.AI_LEVEL_LOW = GameConstants.AiLevel.LOW;
window.AI_LEVEL_DEFAULT = GameConstants.AiLevel.DEFAULT;
window.AI_LEVEL_HIGH = GameConstants.AiLevel.HIGH;
window.AI_LEVEL_ULTRA = GameConstants.AiLevel.ULTRA;
// Directions
window.UP = GameConstants.Direction.UP;
window.RIGHT = GameConstants.Direction.RIGHT;
window.BOTTOM = GameConstants.Direction.BOTTOM;
window.LEFT = GameConstants.Direction.LEFT;
window.ANGLE_1 = GameConstants.Direction.ANGLE_1;
window.ANGLE_2 = GameConstants.Direction.ANGLE_2;
window.ANGLE_3 = GameConstants.Direction.ANGLE_3;
window.ANGLE_4 = GameConstants.Direction.ANGLE_4;
// Infos
window.APP_VERSION = GameConstants.Setting.APP_VERSION;
window.DATE_VERSION = GameConstants.Setting.DATE_VERSION;

export { Game, WorkersAvailable }