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
importScripts("../libs/lowlight.astar.min.js");
importScripts("gameUtils.js");
importScripts("constants.js");
importScripts("event.js");
importScripts("reactor.js");
importScripts("position.js");
importScripts("grid.js");
importScripts("snake.js");
importScripts("gameEngine.js");

var game;

onmessage = function(e) {
  var data = e.data;

  if(data.length > 1 && data[0] == "init") {
    var grid = data[1]["grid"];
    var snakes = data[1]["snakes"];

    grid = Object.assign(new Grid(), grid);

    for(var i = 0; i < snakes.length; i++) {
      snakes[i].grid = grid;
      snakes[i] = Object.assign(new Snake(), snakes[i]);

      for(var j = 0; j < snakes[i].queue.length; j++) {
        snakes[i].queue[j] = Object.assign(new Position(), snakes[i].queue[j]);
      }
    }

    game = new GameEngine(grid, snakes, data[1]["speed"], data[1]["enablePause"], data[1]["enableRetry"], data[1]["progressiveSpeed"]);

    this.postMessage(["init", {
      "snakes": JSON.parse(JSON.stringify(game.snakes)),
      "grid": JSON.parse(JSON.stringify(game.grid)),
      "enablePause": game.enablePause,
      "enableRetry": game.enableRetry,
      "progressiveSpeed": game.progressiveSpeed,
      "offsetFrame": game.speed * GameConstants.Setting.TIME_MULTIPLIER,
      "errorOccurred": game.errorOccurred
    }]);

    game.onReset(function() {
      self.postMessage(["reset", {
        "paused": game.paused,
        "isReseted": game.isReseted,
        "exited": game.exited,
        "grid": JSON.parse(JSON.stringify(game.grid)),
        "numFruit": game.numFruit,
        "ticks": game.ticks,
        "scoreMax": game.scoreMax,
        "gameOver": game.gameOver,
        "gameFinished": game.gameFinished,
        "gameMazeWin": game.gameMazeWin,
        "starting": game.starting,
        "initialSpeed": game.initialSpeed,
        "speed": game.speed,
        "snakes": JSON.parse(JSON.stringify(game.snakes)),
        "offsetFrame": game.speed * GameConstants.Setting.TIME_MULTIPLIER,
        "confirmReset": false,
        "confirmExit": false,
        "getInfos": false,
        "getInfosGame": false,
        "errorOccurred": game.errorOccurred
      }]);
    });

    game.onStart(function() {
      self.postMessage(["start", {
        "snakes": JSON.parse(JSON.stringify(game.snakes)),
        "grid": JSON.parse(JSON.stringify(game.grid)),
        "starting": game.starting,
        "countBeforePlay": game.countBeforePlay,
        "paused": game.paused,
        "isReseted": game.isReseted,
        "confirmReset": false,
        "confirmExit": false,
        "getInfos": false,
        "getInfosGame": false,
        "errorOccurred": game.errorOccurred
      }]);
    });

    game.onPause(function() {
      self.postMessage(["pause", {
        "paused": game.paused,
        "confirmReset": false,
        "confirmExit": false,
        "getInfos": false,
        "getInfosGame": false,
        "errorOccurred": game.errorOccurred
      }]);
    });

    game.onContinue(function() {
      self.postMessage(["continue", {
        "confirmReset": false,
        "confirmExit": false,
        "getInfos": false,
        "getInfosGame": false,
        "errorOccurred": game.errorOccurred
      }]);
    });

    game.onStop(function() {
      self.postMessage(["stop", {
        "paused": game.paused,
        "scoreMax": game.scoreMax,
        "gameOver": game.gameOver,
        "gameFinished": game.gameFinished,
        "confirmReset": false,
        "confirmExit": false,
        "getInfos": false,
        "getInfosGame": false,
        "errorOccurred": game.errorOccurred
      }]);
    });

    game.onExit(function() {
      self.postMessage(["exit", {
        "paused": game.paused,
        "gameOver": game.gameOver,
        "gameFinished": game.gameFinished,
        "exited": game.exited,
        "confirmReset": false,
        "confirmExit": false,
        "getInfos": false,
        "getInfosGame": false,
        "errorOccurred": game.errorOccurred
      }]);
    });

    game.onKill(function() {
      self.postMessage(["kill", {
        "paused": game.paused,
        "gameOver": game.gameOver,
        "killed": game.killed,
        "snakes": JSON.parse(JSON.stringify(game.snakes)),
        "gameFinished": game.gameFinished,
        "grid": JSON.parse(JSON.stringify(game.grid)),
        "confirmReset": false,
        "confirmExit": false,
        "getInfos": false,
        "getInfosGame": false,
        "errorOccurred": game.errorOccurred
      }]);
    });

    game.onScoreIncreased(function() {
      self.postMessage(["scoreIncreased", {
        "snakes": JSON.parse(JSON.stringify(game.snakes)),
        "grid": JSON.parse(JSON.stringify(game.grid)),
        "scoreMax": game.scoreMax,
        "gameFinished": game.gameFinished,
        "errorOccurred": game.errorOccurred
      }]);
    });
    
    game.onUpdate(function() {
      self.postMessage(["update", {
        "paused": game.paused,
        "isReseted": game.isReseted,
        "exited": game.exited,
        "grid": JSON.parse(JSON.stringify(game.grid)),
        "numFruit": game.numFruit,
        "ticks": game.ticks,
        "scoreMax": game.scoreMax,
        "gameOver": game.gameOver,
        "gameFinished": game.gameFinished,
        "gameMazeWin": game.gameMazeWin,
        "starting": game.starting,
        "initialSpeed": game.initialSpeed,
        "speed": game.speed,
        "snakes": JSON.parse(JSON.stringify(game.snakes)),
        "countBeforePlay": game.countBeforePlay,
        "numFruit": game.numFruit,
        "offsetFrame": 0,
        "errorOccurred": game.errorOccurred
      }]);
    });

    game.onUpdateCounter(function() {
      self.postMessage(["updateCounter", {
        "paused": game.paused,
        "isReseted": game.isReseted,
        "exited": game.exited,
        "grid": JSON.parse(JSON.stringify(game.grid)),
        "numFruit": game.numFruit,
        "ticks": game.ticks,
        "scoreMax": game.scoreMax,
        "gameOver": game.gameOver,
        "gameFinished": game.gameFinished,
        "gameMazeWin": game.gameMazeWin,
        "starting": game.starting,
        "initialSpeed": game.initialSpeed,
        "speed": game.speed,
        "snakes": JSON.parse(JSON.stringify(game.snakes)),
        "countBeforePlay": game.countBeforePlay,
        "numFruit": game.numFruit,
        "errorOccurred": game.errorOccurred
      }]);
    });
} else if(game != null) {
    var message = data[0];

    switch(message) {
      case "reset":
        game.reset();
        break;
      case "start":
        game.start();
        break;
      case "stop":
        game.stop();
        break;
      case "finish":
        game.stop(true);
        break;
      case "stop":
        game.stop(false);
        break;
      case "pause":
        game.pause();
        break;
      case "kill":
        game.kill();
        break;
      case "tick":
        game.tick();
        break;
      case "exit":
        game.exit();
        break;
      case "key":
        if(data.length > 1) game.lastKey = data[1];
        break;
    }
  }
};