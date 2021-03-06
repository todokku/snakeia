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
import GameUtils from "./gameUtils";
import GameConstants from "./constants";
import Reactor from "./reactor";
import Grid from "./grid";
import Snake from "./snake";
import seedrandom from "seedrandom";

export default class GameEngine {
  constructor(grid, snake, speed, enablePause, enableRetry, progressiveSpeed) {
    // Game settings
    this.grid = grid;
    this.snakes = snake;
    this.speed = speed == null ? 8 : speed;
    this.initialSpeed = speed == null ? 8 : speed;
    this.initialSpeedUntouched = speed == null ? 8 : speed;
    this.enablePause = enablePause == null ? true : enablePause;
    this.enableRetry = enableRetry == null ? true : enableRetry;
    this.progressiveSpeed = progressiveSpeed == null ? false : progressiveSpeed;
    this.countBeforePlay = 3;
    // Game variables
    this.lastKey = -1;
    this.numFruit = 1;
    this.ticks = 0;
    // Game state variables
    this.firstStart = true;
    this.starting = false;
    this.paused = true;
    this.exited = false;
    this.killed = false;
    this.isReseted = true;
    this.gameOver = false;
    this.gameFinished = false; // only used if 2 and more snakes
    this.gameMazeWin = false; // used in maze mode
    this.scoreMax = false;
    this.errorOccurred = false;
    this.clientSidePredictionsMode = false; // Enable client-side predictions mode for the online game (disable some functions)
    // Intervals, timeouts, frames
    this.intervalPlay;
    // Events
    this.reactor = new Reactor();
    this.reactor.registerEvent("onStart");
    this.reactor.registerEvent("onPause");
    this.reactor.registerEvent("onContinue");
    this.reactor.registerEvent("onReset");
    this.reactor.registerEvent("onStop");
    this.reactor.registerEvent("onExit");
    this.reactor.registerEvent("onKill");
    this.reactor.registerEvent("onScoreIncreased");
    this.reactor.registerEvent("onUpdate");
    this.reactor.registerEvent("onUpdateCounter");
  }

  init() {
    if(!this.clientSidePredictionsMode) {
      if(this.snakes == null) {
        this.errorOccurred = true;
        this.snakes = [];
      } else if(!Array.isArray(this.snakes)) {
        this.snakes = [this.snakes];
      } else if((Array.isArray(this.snakes) && this.snakes.length <= 0) || (this.grid.maze && this.snakes.length > 1)) {
        this.errorOccurred = true;
      }

      var startHue = GameUtils.randRange(0, 360, this.grid ? this.grid.rngGame : null);

      for(var i = 0; i < this.snakes.length; i++) {
        if(this.snakes[i] instanceof Snake == false) {
          this.errorOccurred = true;
        } else {
          startHue = GameUtils.addHue(startHue, Math.round(360 / (this.snakes.length)));
          this.snakes[i].color = startHue;
        }
      }

      if(this.grid instanceof Grid == false) {
        this.errorOccurred = true;
      } else if(!this.errorOccurred) {
        this.grid.setFruit(this.snakes.length);
      }
    }
  }

  reset() {
    this.paused = true;
    this.isReseted = true;
    this.exited = false;
    this.clearIntervalPlay();

    if(this.grid.seedGrid) this.grid.seedGrid++;
    if(this.grid.seedGame) this.grid.seedGame++;
    if(this.grid.rngGrid) this.grid.rngGrid = seedrandom(this.grid.seedGrid);
    if(this.grid.rngGame) this.grid.rngGame = seedrandom(this.grid.seedGame);
    this.grid.init();

    if(this.snakes != null) {
      for(var i = 0; i < this.snakes.length; i++) {
        this.snakes[i].reset();
      }
    }

    this.numFruit = 1;
    this.ticks = 0;
    this.lastKey = -1;
    this.scoreMax = false;
    this.errorOccurred = false;
    this.gameOver = false;
    this.gameFinished = false;
    this.gameMazeWin = false;
    this.starting = false;
    this.initialSpeed = this.initialSpeedUntouched;
    this.speed = this.initialSpeedUntouched;
    this.grid.setFruit(this.snakes.length);
    this.reactor.dispatchEvent("onReset");
    this.start();
  }

  start() {
    this.reactor.dispatchEvent("onUpdateCounter");
    var self = this;
    if(!this.errorOccurred) {
      if(this.snakes != null) {
        for(var i = 0; i < this.snakes.length; i++) {
          if(this.snakes[i].errorInit) {
            this.errorOccurred = true;
            this.stop();
          }
        }
      }

      if(this.paused && !this.gameOver && !this.killed && !this.scoreMax && !this.starting) {
        this.starting = true;

        if(!this.firstStart) {
          this.reactor.dispatchEvent("onContinue");
        }

        this.countBeforePlay = 3;
        this.clearIntervalPlay();
        this.reactor.dispatchEvent("onUpdateCounter");

        this.intervalPlay = setInterval(function() {
          self.countBeforePlay--;
          self.reactor.dispatchEvent("onUpdateCounter");
          if(self.countBeforePlay < 0) {
            self.forceStart();
          }
        }, 1000);
      }
    }
  }

  forceStart() {
    this.clearIntervalPlay();
    this.countBeforePlay = -1;
    this.paused = false;
    this.isReseted = false;
    this.firstStart = false;
    this.starting = false;
    this.reactor.dispatchEvent("onStart");
    this.tick();
  }

  clearIntervalPlay() {
    clearInterval(this.intervalPlay);
  }

  continue() {
    if(!this.clientSidePredictionsMode) {
      this.start();
      this.reactor.dispatchEvent("onContinue");
    }
  }

  stop(finish) {
    if(!this.gameOver && !this.clientSidePredictionsMode) {
      this.paused = true;
      this.gameOver = true;
      if(finish) this.gameFinished = true;
      this.clearIntervalPlay();
      this.reactor.dispatchEvent("onStop");
    }
  }

  pause() {
    if(!this.paused && !this.clientSidePredictionsMode) {
      this.paused = true;
      this.clearIntervalPlay();
      this.reactor.dispatchEvent("onPause");
    }
  }

  kill() {
    if(!this.killed) {
      this.paused = true;
      this.gameOver = true;
      this.killed = true;

      if(this.snakes != null) {
        for(var i = 0; i < this.snakes.length; i++) {
          this.snakes[i].kill();
          this.snakes[i] = null;
        }
      }

      this.clearIntervalPlay();
      this.grid = null;
      this.snakes = null;
      this.reactor.dispatchEvent("onKill");
    }
  }

  exit() {
    if(!this.exited) {
      this.stop();
      this.exited = true;
      this.reactor.dispatchEvent("onExit");
    }
  }

  getNBPlayer(type) {
    var numPlayer = 0;

    if(this.snakes != null) {
      for(var i = 0; i < this.snakes.length; i++) {
        if(this.snakes[i].player == type) {
          numPlayer++;
        }
      }
    }

    return numPlayer;
  }

  getPlayer(num, type) {
    var numPlayer = 0;

    if(this.snakes != null) {
      for(var i = 0; i < this.snakes.length; i++) {
        if(this.snakes[i].player == type) {
          numPlayer++;
        }

        if(numPlayer == num) {
          return this.snakes[i];
        }
      }
    }

    return null;
  }

  tick() {
    var self = this;

    setTimeout(function() {
      if(!self.paused && !self.killed) {
        if(self.lastTime == 0) self.lastTime = time;
        self.ticks++;

        var scoreIncreased = false;

        if(self.grid && (!self.grid.maze || self.grid.mazeForceAuto || ((self.grid.maze && (self.getNBPlayer(GameConstants.PlayerType.HUMAN) <= 0 && self.getNBPlayer(GameConstants.PlayerType.HYBRID_HUMAN_AI) <= 0))) || (self.grid.maze && ((self.getNBPlayer(GameConstants.PlayerType.HUMAN) > 0 || self.getNBPlayer(GameConstants.PlayerType.HYBRID_HUMAN_AI) > 0) && (self.getPlayer(1, GameConstants.PlayerType.HYBRID_HUMAN_AI) || self.getPlayer(1, GameConstants.PlayerType.HUMAN)).lastKey != -1)))) {
          for(var i = 0; i < self.snakes.length; i++) {
            var initialDirection = self.snakes[i].direction;
            var setFruit = false;
            var setFruitError = false;
            var goldFruit = false;
            self.snakes[i].lastTailMoved = false;

            if(!self.snakes[i].gameOver && !self.snakes[i].scoreMax) {

              if(self.snakes[i].player == GameConstants.PlayerType.HUMAN || self.snakes[i].player == GameConstants.PlayerType.HYBRID_HUMAN_AI) {
                self.snakes[i].moveTo(self.snakes[i].lastKey);
                self.snakes[i].lastKey = -1;
              } else if(self.snakes[i].player == GameConstants.PlayerType.AI && (!self.clientSidePredictionsMode || (self.clientSidePredictionsMode && self.snakes[i].aiLevel != GameConstants.AiLevel.RANDOM))) {
                self.snakes[i].moveTo(self.snakes[i].ai());
              }

              var headSnakePos = self.snakes[i].getHeadPosition();

              if(self.snakes[i].player == GameConstants.PlayerType.HYBRID_HUMAN_AI && self.grid.isDeadPosition(self.snakes[i].getNextPosition(headSnakePos, self.snakes[i].direction))) {
                self.snakes[i].direction = initialDirection;
                self.snakes[i].moveTo(self.snakes[i].ai());
                self.snakes[i].lastKey = -1;
              }

              headSnakePos = self.snakes[i].getNextPosition(headSnakePos, self.snakes[i].direction);
              
              if(self.grid.isDeadPosition(headSnakePos)) {
                self.snakes[i].setGameOver();
              } else {
                if(self.grid.get(headSnakePos) == GameConstants.CaseType.FRUIT || self.grid.get(headSnakePos) == GameConstants.CaseType.FRUIT_GOLD) {
                  if(self.grid.get(headSnakePos) == GameConstants.CaseType.FRUIT) {
                    self.snakes[i].score++;
                    self.grid.set(GameConstants.CaseType.EMPTY, self.grid.fruitPos);
                    self.grid.fruitPos = null;
                  } else if(self.grid.get(headSnakePos) == GameConstants.CaseType.FRUIT_GOLD) {
                    self.snakes[i].score += 3;
                    self.grid.set(GameConstants.CaseType.EMPTY, self.grid.fruitPosGold);
                    self.grid.fruitPosGold = null;
                    goldFruit = true;
                  }

                  scoreIncreased = true;
                  self.snakes[i].insert(headSnakePos);

                  if(self.grid.maze) {
                    self.gameMazeWin = true;
                    self.gameFinished = true;
                    self.stop();
                  } else if(self.snakes[i].hasMaxScore() && self.snakes.length <= 1) {
                    self.scoreMax = true;
                    self.snakes[i].scoreMax = true;
                    self.stop();
                  } else {
                    self.numFruit++;
                    if(!goldFruit)
                      setFruit = true;
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

            if(!self.scoreMax && setFruit && !self.clientSidePredictionsMode) {
              setFruitError = !self.grid.setFruit(self.snakes.length);
            }
          }

          if(!self.scoreMax && !setFruitError && self.grid.isFruitSurrounded(self.grid.fruitPos, true) && !self.clientSidePredictionsMode) {
            setFruitError = !self.grid.setFruit(self.snakes.length);
          }

          if(!self.scoreMax && self.grid.fruitPosGold != null && self.grid.isFruitSurrounded(self.grid.fruitPosGold, true)) {
            self.grid.set(GameConstants.CaseType.EMPTY, self.grid.fruitPosGold);
            self.grid.fruitPosGold = null;
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

          self.reactor.dispatchEvent("onUpdate");

          if(scoreIncreased) {
            self.reactor.dispatchEvent("onScoreIncreased");
          }
        }

        self.tick();
      }
    }, this.initialSpeed * GameConstants.Setting.TIME_MULTIPLIER);
  }

  onReset(callback) {
    this.reactor.addEventListener("onReset", callback);
  }

  onStart(callback) {
    this.reactor.addEventListener("onStart", callback);
  }

  onContinue(callback) {
    this.reactor.addEventListener("onContinue", callback);
  }

  onStop(callback) {
    this.reactor.addEventListener("onStop", callback);
  }

  onPause(callback) {
    this.reactor.addEventListener("onPause", callback);
  }

  onExit(callback) {
    this.reactor.addEventListener("onExit", callback);
  }

  onKill(callback) {
    this.reactor.addEventListener("onKill", callback);
  }

  onScoreIncreased(callback) {
    this.reactor.addEventListener("onScoreIncreased", callback);
  }

  onUpdate(callback) {
    this.reactor.addEventListener("onUpdate", callback);
  }

  onUpdateCounter(callback) {
    this.reactor.addEventListener("onUpdateCounter", callback);
  }
}