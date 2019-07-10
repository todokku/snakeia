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
// Modes :
SOLO_AI = "SOLO_AI";
SOLO_PLAYER = "SOLO_PLAYER";
PLAYER_VS_AI = "PLAYER_VS_AI";
AI_VS_AI = "AI_VS_AI";
BATTLE_ROYALE = "BATTLE_ROYALE";
// Others settings :
UPDATER_URI = "https://www.eliastiksofts.com/snakeia/update.php";
// Levels types :
LEVEL_REACH_SCORE = "LEVEL_REACH_SCORE";
LEVEL_REACH_MAX_SCORE = "LEVEL_REACH_MAX_SCORE";
LEVEL_MULTI_BEST_SCORE = "LEVEL_MULTI_BEST_SCORE";
LEVEL_REACH_SCORE_ON_TIME = "LEVEL_REACH_SCORE_ON_TIME";
DEFAULT_LEVEL = "DEFAULT_LEVEL";
DOWNLOADED_LEVEL = "DOWNLOADED_LEVEL";
// Default levels :
// Level model : { settings: [heightGrid, widthGrid, borderWalls, generateWalls, sameGrid, speed, progressiveSpeed, aiLevel, numberIA], type: levelType(see below), typeValue: levelTypeValue(score, time, ...), version: (version min to play the level) }
DEFAULT_LEVELS_SOLO_PLAYER = {
  1: { settings: [20, 20, false, false, true, null, false, null, 0], type: LEVEL_REACH_SCORE, typeValue: 20, version: APP_VERSION },
  2: { settings: [20, 20, true, false, true, null, false, null, 0], type: LEVEL_REACH_SCORE, typeValue: 20, version: APP_VERSION },
  3: { settings: [20, 20, true, true, true, 15, false, null, 0], type: LEVEL_REACH_SCORE, typeValue: 20, version: APP_VERSION },
  4: { settings: [20, 20, false, false, true, null, false, null, 0], type: LEVEL_REACH_SCORE_ON_TIME, typeValue: [20, 60], version: APP_VERSION },
  5: { settings: [5, 5, true, false, true, 25, false, null, 0], type: LEVEL_REACH_MAX_SCORE, typeValue: null, version: APP_VERSION },
  6: { settings: [5, 5, false, true, true, 25, false, null, 0], type: LEVEL_REACH_MAX_SCORE, typeValue: null, version: APP_VERSION },
  7: { settings: [20, 20, true, false, true, 15, false, null, 2], type: LEVEL_MULTI_BEST_SCORE, typeValue: null, version: APP_VERSION }
};
SOLO_PLAYER_SAVE = "snakeia_solo_player_";
DEFAULT_LEVELS_SOLO_AI = DEFAULT_LEVELS_SOLO_PLAYER;
SOLO_AI_SAVE = "snakeia_solo_ai_";
// Downloadable levels :
DOWNLOAD_DEFAULT_URI = "https://www.eliastiksofts.com/snakeia/downloadLevels.php?player={{player}}&ver={{appVersion}}";
SOLO_PLAYER_DOWNLOAD_LEVELS_TO = "snakeia_solo_player_downloadedLevels";
SOLO_AI_DOWNLOAD_LEVELS_TO = "snakeia_solo_ai_downloadedLevels";

var selectedMode = SOLO_AI;
var showDebugInfo = false;

document.getElementById("versionTxt").innerHTML = APP_VERSION;
document.getElementById("appVersion").innerHTML = APP_VERSION;
document.getElementById("dateTxt").innerHTML = DATE_VERSION;
document.getElementById("appUpdateDate").innerHTML = DATE_VERSION;

String.prototype.strcmp = function(str) {
  return ((this == str) ? 0 : ((this > str) ? 1 : -1));
};

function enableDebugMode() {
  showDebugInfo = true;
  console.log(window.i18next.t("debugModeEnabled"));
}

// Updates
function checkUpdate() {
  var script = document.createElement("script");
  script.src = UPDATER_URI;

  document.getElementsByTagName('head')[0].appendChild(script);
}

function updateCallback(data) {
  if(typeof(data) !== "undefined" && data !== null && typeof(data.version) !== "undefined" && data.version !== null) {
    var newVersionTest = APP_VERSION.strcmp(data.version);

    if(newVersionTest < 0) {
      document.getElementById("updateAvailable").style.display = "block";
      document.getElementById("appUpdateVersion").textContent = data.version;

      var appUpdateDate = DATE_VERSION;

      if(typeof(data.date) !== "undefined" && data.date !== null) {
          var appUpdateDate = data.date;
      }

      document.getElementById("appUpdateDate").textContent = appUpdateDate;

      var downloadURL = "http://eliastiksofts.com/snakeia/downloads/index.php";

      if(typeof(data.url) !== "undefined" && data.url !== null) {
          var downloadURL = data.url;
      }

      document.getElementById("appDownloadLink").onclick = function() {
          window.open(downloadURL, '_blank');
      };

      document.getElementById("appDownloadURLGet").onclick = function() {
          prompt(window.i18next.t("update.URLToDownload"), downloadURL);
      };

      var changes = window.i18next.t("update.noChanges");

      if(typeof(data.changes) !== "undefined" && data.changes !== null) {
          var changes = data.changes;
      }

      document.getElementById("appUpdateChanges").onclick = function() {
          alert(window.i18next.t("update.changes") + "\n" + changes);
      };

      translateContent();
    }
  }
}

checkUpdate();

// Simple modes
function selectMode(mode) {
  selectedMode = mode;

  if(selectedMode == SOLO_PLAYER) {
    document.getElementById("iaSettings").style.display = "none";
  } else {
    document.getElementById("iaSettings").style.display = "block";
  }

  if(selectedMode == SOLO_AI) {
    document.getElementById("autoRetrySettings").style.display = "block";
  } else {
    document.getElementById("autoRetrySettings").style.display = "none";
  }

  if(selectedMode == BATTLE_ROYALE) {
    document.getElementById("numberIASettings").style.display = "block";
  } else {
    document.getElementById("numberIASettings").style.display = "none";
  }

  if(selectedMode == PLAYER_VS_AI || selectedMode == AI_VS_AI || selectedMode == BATTLE_ROYALE) {
    document.getElementById("sameGridDiv").style.display = "block";
  } else {
    document.getElementById("sameGridDiv").style.display = "none";
  }

  displaySettings();
}

document.getElementById("soloAi").onclick = function() {
  selectMode(SOLO_AI);
};

document.getElementById("soloPlayer").onclick = function() {
  selectMode(SOLO_PLAYER);
};

document.getElementById("playerVsAi").onclick = function() {
  selectMode(PLAYER_VS_AI);
};

document.getElementById("aiVsAi").onclick = function() {
  selectMode(AI_VS_AI);
};

document.getElementById("battleRoyale").onclick = function() {
  selectMode(BATTLE_ROYALE);
};

function displaySettings() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("levelContainer").style.display = "none";
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("settings").style.display = "block";
  checkSameGrid();
  checkGameSpeed();
  checkFailSettings();
}

function displayMenu() {
  document.getElementById("settings").style.display = "none";
  document.getElementById("levelContainer").style.display = "none";
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("menu").style.display = "block";
}

document.getElementById("backToMenu").onclick = function() {
  displayMenu();
};

document.getElementById("backToMenuLevelList").onclick = function() {
  displayMenu();
};

function displayLevelList(player) {
  document.getElementById("settings").style.display = "none";
  document.getElementById("levelContainer").style.display = "block";
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("menu").style.display = "none";

  if(player == PLAYER_HUMAN) {
    document.getElementById("titleLevelList").innerHTML = window.i18next.t("levels.titlePlayer");
    document.getElementById("levelListDefault").innerHTML = getListLevel(PLAYER_HUMAN, DEFAULT_LEVEL);
  } else if(player == PLAYER_AI) {
    document.getElementById("titleLevelList").innerHTML = window.i18next.t("levels.titleAI");
    document.getElementById("levelListDefault").innerHTML = getListLevel(PLAYER_AI, DEFAULT_LEVEL);
  }
}

document.getElementById("levelsSoloPlayer").onclick = function() {
  displayLevelList(PLAYER_HUMAN);
};

document.getElementById("levelsSoloAI").onclick = function() {
  displayLevelList(PLAYER_AI);
};

function checkSameGrid() {
  if(document.getElementById("sameGrid").checked && (selectedMode == PLAYER_VS_AI || selectedMode == AI_VS_AI || selectedMode == BATTLE_ROYALE)) {
    document.getElementById("progressiveSpeed").checked = false;
    document.getElementById("progressiveSpeed").disabled = true;
    document.getElementById("autoRetry").checked = false;
    document.getElementById("autoRetry").disabled = true;
  } else {
    document.getElementById("progressiveSpeed").disabled = false;
    document.getElementById("autoRetry").disabled = false;
  }
}

document.getElementById("sameGrid").onchange = function() {
  checkSameGrid();
};

function checkGameSpeed() {
  if(document.getElementById("gameSpeed").value == "custom") {
    document.getElementById("customSpeedSettings").style.display = "block";
  } else {
    document.getElementById("customSpeedSettings").style.display = "none";
  }
}

function gameCanFailToInit(heightGrid, widthGrid, borderWalls, generateWalls, numberPlayers) {
  var heightGrid = parseInt(heightGrid);
  var widthGrid = parseInt(widthGrid);

  var numberEmptyCases = heightGrid * widthGrid;

  if(borderWalls) {
    numberEmptyCases -= (((widthGrid + heightGrid) * 2) - 4);
  }

  if(generateWalls) {
    if(borderWalls) {
      numberEmptyCases -= ((heightGrid * widthGrid) * 0.1);
    } else {
      numberEmptyCases -= ((heightGrid * widthGrid) * 0.1675);
    }
  }

  var neededCases = numberPlayers * 3;

  if(numberEmptyCases >= neededCases) {
    return false;
  } else {
    return true;
  }
}

function checkFailSettings() {
  document.getElementById("possibleFailInitGame").style.display = "none";

  if(validateSettings(true)) {
    var heightGrid = document.getElementById("heightGrid").value;
    var widthGrid = document.getElementById("widthGrid").value;
    var borderWalls = document.getElementById("borderWalls").checked;
    var generateWalls = document.getElementById("generateWalls").checked;
    var sameGrid = document.getElementById("sameGrid").checked;
    var numberIA = document.getElementById("numberIA").value;
    var battleAgainstAIs = document.getElementById("battleAgainstAIs").checked;

    var numberPlayers = 1;

    if(selectedMode == PLAYER_VS_AI || selectedMode == AI_VS_AI) {
      if(sameGrid) {
        numberPlayers = 2;
      }
    } else if(selectedMode == BATTLE_ROYALE) {
      if(sameGrid) {
        if(battleAgainstAIs) {
          numberPlayers = parseInt(numberIA) + 1;
        } else {
          numberPlayers = numberIA;
        }
      }
    }

    if(gameCanFailToInit(heightGrid, widthGrid, borderWalls, generateWalls, numberPlayers)) {
      document.getElementById("possibleFailInitGame").style.display = "block";
    }
  }
}

document.getElementById("heightGrid").onchange = function() {
  checkFailSettings();
};

document.getElementById("widthGrid").onchange = function() {
  checkFailSettings();
};

document.getElementById("borderWalls").onchange = function() {
  checkFailSettings();
};

document.getElementById("generateWalls").onchange = function() {
  checkFailSettings();
};

document.getElementById("sameGrid").onchange = function() {
  checkGameSpeed();
  checkFailSettings();
};

document.getElementById("numberIA").onchange = function() {
  checkFailSettings();
};

document.getElementById("battleAgainstAIs").onchange = function() {
  checkFailSettings();
};

function resetForm(resetValues) {
  document.getElementById("invalidHeight").style.display = "none";
  document.getElementById("invalidWidth").style.display = "none";
  document.getElementById("heightGrid").classList.remove("is-invalid");
  document.getElementById("widthGrid").classList.remove("is-invalid");
  document.getElementById("gameSpeed").classList.remove("is-invalid");
  document.getElementById("invalidSpeed").style.display = "none";
  document.getElementById("customSpeed").classList.remove("is-invalid");
  document.getElementById("invalidCustomSpeed").style.display = "none";
  document.getElementById("aiLevel").classList.remove("is-invalid");
  document.getElementById("invalidaiLevel").style.display = "none";
  document.getElementById("numberIA").classList.remove("is-invalid");
  document.getElementById("invalidIANumber").style.display = "none";
  document.getElementById("gameStatus").innerHTML = "";
  document.getElementById("gameOrder").innerHTML = "";
  document.getElementById("gameStatusError").innerHTML = "";

  if(resetValues) {
    document.getElementById("heightGrid").value = 20;
    document.getElementById("widthGrid").value = 20;
    document.getElementById("borderWalls").checked = false;
    document.getElementById("generateWalls").checked = false;
    document.getElementById("sameGrid").checked = true;
    document.getElementById("gameSpeed").value = 8;
    document.getElementById("progressiveSpeed").checked = false;
    document.getElementById("customSpeed").value = 8;
    document.getElementById("customSpeedSettings").style.display = "none";
    document.getElementById("aiLevel").value = "normal";
    document.getElementById("autoRetry").checked = false;
    document.getElementById("numberIA").value = 20;
    document.getElementById("battleAgainstAIs").checked = false;
  }

  checkSameGrid();
  checkGameSpeed();
  checkFailSettings();
}

document.getElementById("resetSettings").onclick = function() {
  resetForm(true);
};

function validateSettings(returnValidation) {
  if(!returnValidation) {
    resetForm(false);
  }

  var heightGrid = document.getElementById("heightGrid").value;
  var widthGrid = document.getElementById("widthGrid").value;
  var borderWalls = document.getElementById("borderWalls").checked;
  var generateWalls = document.getElementById("generateWalls").checked;
  var sameGrid = document.getElementById("sameGrid").checked;
  var speed = document.getElementById("gameSpeed").value;
  var progressiveSpeed = document.getElementById("progressiveSpeed").checked;
  var customSpeed = document.getElementById("customSpeed").value;
  var aiLevel = document.getElementById("aiLevel").value;
  var autoRetry = document.getElementById("autoRetry").checked;
  var numberIA = document.getElementById("numberIA").value;
  var battleAgainstAIs = document.getElementById("battleAgainstAIs").checked;

  var formValidated = true;

  if(heightGrid.trim() == "" || isNaN(heightGrid) || heightGrid < 5 || heightGrid > 100) {
    formValidated = false;

    if(!returnValidation) {
      document.getElementById("heightGrid").classList.add("is-invalid");
      document.getElementById("invalidHeight").style.display = "block";
    }
  } else {
    heightGrid = parseInt(heightGrid);
  }

  if(widthGrid.trim() == "" || isNaN(widthGrid) || widthGrid < 5 || widthGrid > 100) {
    formValidated = false;

    if(!returnValidation) {
      document.getElementById("widthGrid").classList.add("is-invalid");
      document.getElementById("invalidWidth").style.display = "block";
    }
  } else {
    widthGrid = parseInt(widthGrid);
  }

  if(speed != "custom" && (speed.trim() == "" || isNaN(speed) || speed < 1 || speed > 100)) {
    formValidated = false;

    if(!returnValidation) {
      document.getElementById("gameSpeed").classList.add("is-invalid");
      document.getElementById("invalidSpeed").style.display = "block";
    }
  } else if(speed != "custom") {
    speed = parseInt(speed);
  }

  if(speed == "custom" && (customSpeed.trim() == "" || isNaN(customSpeed) || customSpeed < 1 || customSpeed > 100)) {
    formValidated = false;

    if(!returnValidation) {
      document.getElementById("customSpeed").classList.add("is-invalid");
      document.getElementById("invalidCustomSpeed").style.display = "block";
    }
  } else if(speed == "custom") {
    speed = parseInt(customSpeed);
  }

  if(selectedMode != SOLO_PLAYER && (aiLevel != "low" && aiLevel != "normal" && aiLevel != "high" && aiLevel != "random")) {
    formValidated = false;

    if(!returnValidation) {
      document.getElementById("aiLevel").classList.add("is-invalid");
      document.getElementById("invalidaiLevel").style.display = "block";
    }
  } else if(selectedMode != SOLO_PLAYER) {
    switch(aiLevel) {
      case "random":
        aiLevel = AI_LEVEL_RANDOM;
        break;
      case "low":
        aiLevel = AI_LEVEL_LOW;
        break;
      case "normal":
        aiLevel = AI_LEVEL_DEFAULT;
        break;
      case "high":
        aiLevel = AI_LEVEL_HIGH;
        break;
      case "ultra":
        aiLevel = AI_LEVEL_ULTRA;
        break;
      default:
        aiLevel = AI_LEVEL_DEFAULT;
        break;
    }
  }

  if(selectedMode == BATTLE_ROYALE && (numberIA.trim() == "" || isNaN(numberIA) || numberIA < 2 || numberIA > 100)) {
    formValidated = false;

    if(!returnValidation) {
      document.getElementById("numberIA").classList.add("is-invalid");
      document.getElementById("invalidIANumber").style.display = "block";
    }
  } else if(selectedMode == BATTLE_ROYALE) {
    numberIA = parseInt(numberIA);
  }

  if(selectedMode != SOLO_AI) {
    autoRetry = false;
  }

  if(returnValidation) {
    return formValidated;
  }

  if(formValidated) {
    document.getElementById("settings").style.display = "none";
    document.getElementById("menu").style.display = "none";
    document.getElementById("levelContainer").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";

    var titleGame = "";

    switch(selectedMode) {
      case SOLO_AI:
        titleGame = window.i18next.t("menu.soloAi");
        break;
      case SOLO_PLAYER:
        titleGame = window.i18next.t("menu.soloPlayer");
        break;
      case PLAYER_VS_AI:
        titleGame = window.i18next.t("menu.playerVsAi");
        break;
      case AI_VS_AI:
        titleGame = window.i18next.t("menu.aiVsAi");
        break;
      case BATTLE_ROYALE:
        titleGame = window.i18next.t("menu.battleRoyale");
        break;
    }

    document.getElementById("titleGame").innerHTML = window.i18next.t("game.currentMode") + " " + titleGame;

    var games = [];

    if(selectedMode == SOLO_AI) {
      var grid = new Grid(widthGrid, heightGrid, generateWalls, borderWalls);
      var snake = new Snake(RIGHT, 3, grid, PLAYER_AI, aiLevel, autoRetry);

      games.push(new Game(grid, snake, speed, document.getElementById("gameContainer"), true, true, progressiveSpeed));
    } else if(selectedMode == SOLO_PLAYER) {
      var grid = new Grid(widthGrid, heightGrid, generateWalls, borderWalls);
      var snake = new Snake(RIGHT, 3, grid, PLAYER_HUMAN);

      games.push(new Game(grid, snake, speed, document.getElementById("gameContainer"), true, true, progressiveSpeed));
    } else if(selectedMode == PLAYER_VS_AI) {
      var grid = new Grid(widthGrid, heightGrid, generateWalls, borderWalls);
      var snake = new Snake(RIGHT, 3, grid, PLAYER_HUMAN);

      if(sameGrid) {
        var snake2 = new Snake(RIGHT, 3, grid, PLAYER_AI, aiLevel, autoRetry);
        games.push(new Game(grid, [snake, snake2], speed, document.getElementById("gameContainer"), true, true, progressiveSpeed));
      } else {
        var grid2 = new Grid(widthGrid, heightGrid, generateWalls, borderWalls);
        var snake2 = new Snake(RIGHT, 3, grid2, PLAYER_AI, aiLevel, autoRetry);

        games.push(new Game(grid, snake, speed, document.getElementById("gameContainer"), true, false, progressiveSpeed));
        games.push(new Game(grid2, snake2, speed, document.getElementById("gameContainer"), false, false, progressiveSpeed));
      }
    } else if(selectedMode == AI_VS_AI) {
      var grid = new Grid(widthGrid, heightGrid, generateWalls, borderWalls);
      var snake = new Snake(RIGHT, 3, grid, PLAYER_AI, aiLevel, autoRetry);

      if(sameGrid) {
        var snake2 = new Snake(RIGHT, 3, grid, PLAYER_AI, aiLevel, autoRetry);
        games.push(new Game(grid, [snake, snake2], speed, document.getElementById("gameContainer"), true, true, progressiveSpeed));
      } else {
        var grid2 = new Grid(widthGrid, heightGrid, generateWalls, borderWalls);
        var snake2 = new Snake(RIGHT, 3, grid2, PLAYER_AI, aiLevel, autoRetry);

        games.push(new Game(grid, snake, speed, document.getElementById("gameContainer"), true, true, progressiveSpeed));
        games.push(new Game(grid2, snake2, speed, document.getElementById("gameContainer"), true, true, progressiveSpeed));
      }
    } else if(selectedMode == BATTLE_ROYALE) {
      if(sameGrid) {
        var grid = new Grid(widthGrid, heightGrid, generateWalls, borderWalls);
        var snakes = [];

        if(battleAgainstAIs) {
          snakes.push(new Snake(RIGHT, 3, grid, PLAYER_HUMAN, aiLevel, autoRetry));
        }

        for(var i = 0; i < numberIA; i++) {
          snakes.push(new Snake(RIGHT, 3, grid, PLAYER_AI, aiLevel, autoRetry));
        }

        games.push(new Game(grid, snakes, speed, document.getElementById("gameContainer"), true, true, progressiveSpeed));
      } else {
        if(battleAgainstAIs) {
          var grid = new Grid(widthGrid, heightGrid, generateWalls, borderWalls);
          var snake = new Snake(RIGHT, 3, grid, PLAYER_HUMAN, aiLevel, autoRetry);

          games.push(new Game(grid, snake, speed, document.getElementById("gameContainer"), true, false, progressiveSpeed, 350, 250));
        }

        for(var i = 0; i < numberIA; i++) {
          var grid = new Grid(widthGrid, heightGrid, generateWalls, borderWalls);
          var snake = new Snake(RIGHT, 3, grid, PLAYER_AI, aiLevel, autoRetry);

          games.push(new Game(grid, snake, speed, document.getElementById("gameContainer"), true, false, progressiveSpeed, 350, 250));
        }
      }
    }

    var group = new GameGroup(games);
    group.setDisplayFPS(showDebugInfo ? true : false);
    group.start();

    document.getElementById("backToMenuGame").onclick = function() {
      if(confirm(window.i18next.t("game.confirmQuit"))) {
        group.killAll();
        displayMenu();
        group = null;
      }
    };

    group.onStop(function() {
      if(selectedMode == PLAYER_VS_AI || selectedMode == AI_VS_AI || selectedMode == BATTLE_ROYALE) {
        var winners = group.getWinners();

        if(selectedMode == PLAYER_VS_AI) {
          if(winners.index.length == 2) {
            document.getElementById("gameStatus").innerHTML = window.i18next.t("game.equalityPlayerVSAI");
          } else if(winners.index[0] == 0) {
            document.getElementById("gameStatus").innerHTML = window.i18next.t("game.winPlayerVSAI");
          } else if(winners.index[0] == 1) {
            document.getElementById("gameStatus").innerHTML = window.i18next.t("game.losePlayerVSAI");
          }
        } else if(selectedMode == AI_VS_AI) {
          if(winners.index.length == 1) {
            document.getElementById("gameStatus").innerHTML = window.i18next.t("game.oneWinnerAIVSAI", { numWinner: winners.index[0] + 1 });
          } else if(winners.index.length == 2) {
            document.getElementById("gameStatus").innerHTML = window.i18next.t("game.equalityAIVSAI");
          }
        } else if(selectedMode == BATTLE_ROYALE) {
          if(winners.index.length == 1) {
            document.getElementById("gameStatus").innerHTML = window.i18next.t("game.oneWinnerBattleRoyale", { numWinner: winners.index[0] + 1, score: winners.score });
          } else if(winners.index.length > 1) {
            document.getElementById("gameStatus").innerHTML = window.i18next.t("game.winnersBattleRoyale") + " ";

            for(var i = 0; i < winners.index.length; i++) {
              document.getElementById("gameStatus").innerHTML = document.getElementById("gameStatus").innerHTML + " " + window.i18next.t("game.winnersNumBattleRoyale", { numWinner: winners.index[i] + 1 });

              if((i + 1) < winners.index.length - 1) {
                document.getElementById("gameStatus").innerHTML = document.getElementById("gameStatus").innerHTML + ", ";
              } else if((i + 1) == winners.index.length - 1) {
                document.getElementById("gameStatus").innerHTML = document.getElementById("gameStatus").innerHTML + " " + window.i18next.t("game.andWinnersBattleRoyale") + " ";
              }
            }

            document.getElementById("gameStatus").innerHTML = document.getElementById("gameStatus").innerHTML + " " + window.i18next.t("game.winScoreBattleRoyale", { score: winners.score });
          }
        }
      }
    });

    group.onExit(function() {
      if(selectedMode == SOLO_AI || selectedMode == SOLO_PLAYER || selectedMode == AI_VS_AI || (selectedMode == PLAYER_VS_AI && sameGrid) || (selectedMode == BATTLE_ROYALE && sameGrid)) {
        group.killAll();
        displayMenu();
      }
    });

    group.onReset(function() {
      document.getElementById("gameStatus").innerHTML = "";
      document.getElementById("gameOrder").innerHTML = "";
      document.getElementById("gameStatusError").innerHTML = "";
    });
  }
}

document.getElementById("validateSettings").onclick = function() {
  validateSettings();
};

// Levels
function getTitleSave(player, type) {
  if(type == DEFAULT_LEVEL) {
    if(player == PLAYER_HUMAN) {
      var save = SOLO_PLAYER_SAVE + "defautLevelsSave";
    } else if(player == PLAYER_AI) {
      var save = SOLO_AI_SAVE + "defautLevelsSave";
    }
  } else if(type == DOWNLOADED_LEVEL) {
    if(player == PLAYER_HUMAN) {
      var save = SOLO_PLAYER_SAVE + "downloadedLevelsSave";
    } else if(player == PLAYER_AI) {
      var save = SOLO_AI_SAVE + "downloadedLevelsSave";
    }
  }

  return save;
}

function getSave(player, type) {
  if(localStorage.getItem(getTitleSave(player, type)) == null) {
    initSaveLevel(player, type);
  }

  return JSON.parse(localStorage.getItem(getTitleSave(player, type)));
}

function getLevel(level, player, type) {
  var save = getSave(player, type);

  return getSave(player, type)[level];
}

function setLevel(value, level, player, type) {
    var save = getTitleSave(player, type);
    var item = getSave(player, type);

    if(item != null) {
      item[level] = value;
      localStorage.setItem(save, JSON.stringify(item));

      return true;
    }

    return false;
}

function initSaveLevel(player, type) {
  if(typeof(Storage) !== "undefined") {
    var save = getTitleSave(player, type);
    var item = localStorage.getItem(save);

    if(item == null) {
      localStorage.setItem(save, JSON.stringify({ version: APP_VERSION }));
      setLevel([false, 0], 1, player, type);
    }

    return false;
  } else {
    return false;
  }
}

function canPlay(level, player, type) {
  var res = true;

  for(var i = 1; i < level; i++) {
    var save = getLevel(i, player, type);

    if(save == null || !save[0]) {
      res = false;
    }
  }

  return res;
}

function levelCompatible(levelType, version) {
  if((levelType != LEVEL_REACH_SCORE && levelType != LEVEL_REACH_MAX_SCORE && levelType != LEVEL_MULTI_BEST_SCORE && levelType != LEVEL_REACH_SCORE_ON_TIME) || version.strcmp(APP_VERSION) > 0) {
    return false;
  }

  return true;
}

function playLevel(level, player, type) {
  if(type == DEFAULT_LEVEL) {
    if(player == PLAYER_HUMAN) {
      var levels = DEFAULT_LEVELS_SOLO_PLAYER;
    } else if(player == PLAYER_AI) {
      var levels = DEFAULT_LEVELS_SOLO_AI;
    } else {
      return false;
    }
  }

  if(levels[level] != null) {
    var levelSelected = levels[level];
    var levelSettings = levelSelected["settings"];
    var levelType = levelSelected["type"];
    var levelTypeValue = levelSelected["typeValue"];
    var levelVersion = levelSelected["version"];

    if(!levelCompatible(levelType, levelVersion)) {
      alert("Ce niveau n'est pas compatible avec cette version du jeu. Mettez-le à jour.");
      return false;
    }

    if(!canPlay(level, player, type)) {
      return false;
    }

    var heightGrid = levelSettings[0];
    var widthGrid = levelSettings[1];
    var borderWalls = levelSettings[2];
    var generateWalls = levelSettings[3];
    var sameGrid = levelSettings[4];
    var speed = levelSettings[5];
    var progressiveSpeed = levelSettings[6];
    var aiLevel = levelSettings[7];
    var numberIA = levelSettings[8];

    var games = [];

    var grid = new Grid(widthGrid, heightGrid, generateWalls, borderWalls);

    if(player == PLAYER_AI) {
      var playerSnake = new Snake(RIGHT, 3, grid, player, AI_LEVEL_HIGH);
    } else if(player == PLAYER_HUMAN) {
      var playerSnake = new Snake(RIGHT, 3, grid, player);
    }

    if(sameGrid) {
      var snakes = [playerSnake];

      for(var i = 0; i < numberIA; i++) {
        snakes.push(new Snake(RIGHT, 3, grid, PLAYER_AI, aiLevel));
      }

      var playerGame = new Game(grid, snakes, speed, document.getElementById("gameContainer"), true, true, progressiveSpeed);
      games.push(playerGame);
    } else {
      var playerGame = new Game(grid, playerSnake, speed, document.getElementById("gameContainer"), true, false, progressiveSpeed, 350, 250);
      games.push(playerGame);

      for(var i = 0; i < numberIA; i++) {
        var grid = new Grid(widthGrid, heightGrid, generateWalls, borderWalls);
        var snake = new Snake(RIGHT, 3, grid, PLAYER_AI, aiLevel, autoRetry);

        games.push(new Game(grid, snake, speed, document.getElementById("gameContainer"), true, false, progressiveSpeed, 350, 250));
      }
    }

    document.getElementById("settings").style.display = "none";
    document.getElementById("menu").style.display = "none";
    document.getElementById("levelContainer").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";

    document.getElementById("gameStatus").innerHTML = "";
    document.getElementById("gameOrder").innerHTML = "";
    document.getElementById("gameStatusError").innerHTML = "";

    document.getElementById("titleGame").innerHTML = window.i18next.t("levels.level") + " " + level;

    var group = new GameGroup(games);
    group.setDisplayFPS(showDebugInfo ? true : false);
    group.start();

    var timeout;

    document.getElementById("backToMenuGame").onclick = function() {
      if(confirm(window.i18next.t("game.confirmQuit"))) {
        clearTimeout(timeout);
        group.killAll();
        displayLevelList(player);
        group = null;
      }
    };

    function initGoal() {
      if(levelType == LEVEL_REACH_SCORE) {
        document.getElementById("gameOrder").innerHTML = window.i18next.t("levels.reachScore", { value: levelTypeValue });

        playerGame.onScoreIncreased(function() {
          if(playerSnake.score >= levelTypeValue) {
            setLevel([true, playerSnake.score], level, player, type);
            document.getElementById("gameStatus").innerHTML = window.i18next.t("levels.goalAchieved");
          }
        });

        playerGame.onStop(function() {
          if(playerSnake.score < levelTypeValue) {
            document.getElementById("gameStatusError").innerHTML = window.i18next.t("levels.goalNotAchieved");
          }
        });
      } else if(levelType == LEVEL_REACH_SCORE_ON_TIME) {
        document.getElementById("gameOrder").innerHTML = window.i18next.t("levels.reachScoreTime", { value: levelTypeValue[0], time: levelTypeValue[1] });
        var start = new Date().getTime();

        playerGame.onStart(function() {
          clearTimeout(timeout);
          timeOut = setTimeout(function() {
            group.stopAll(false);
            document.getElementById("gameStatusError").innerHTML = window.i18next.t("levels.goalNotAchieved");
          }, levelTypeValue[1] * 1000 - 1);
        });

        playerGame.onStop(function() {
          clearTimeout(timeout);
        });

        playerGame.onScoreIncreased(function() {
          if(playerSnake.score >= levelTypeValue[0]) {
            clearTimeout(timeout);
            var stop = new Date().getTime();
            group.stopAll(true);
            setLevel([true, (stop - start) / 1000], level, player, type);
            document.getElementById("gameStatus").innerHTML = window.i18next.t("levels.goalAchieved");
          }
        });
      } else if(levelType == LEVEL_REACH_MAX_SCORE) {
        document.getElementById("gameOrder").innerHTML = window.i18next.t("levels.reachMaxScore");

        playerGame.onStop(function() {
          if(playerGame.scoreMax) {
            setLevel([true, playerSnake.score], level, player, type);
            document.getElementById("gameStatus").innerHTML = window.i18next.t("levels.goalAchieved");
          } else {
            document.getElementById("gameStatusError").innerHTML = window.i18next.t("levels.goalNotAchieved");
          }
        });
      } else if(levelType == LEVEL_MULTI_BEST_SCORE) {
        document.getElementById("gameOrder").innerHTML = window.i18next.t("levels.multiBestScore");

        group.onStop(function() {
          var winners = group.getWinners();
          var won = false;

          for(var i = 0; i < winners.index.length; i++) {
            if(winners.index == 0) {
              setLevel([true, playerSnake.score], level, player, type);
              document.getElementById("gameStatus").innerHTML = window.i18next.t("levels.goalAchieved");
              won = true;
            }
          }

          if(!won) {
            document.getElementById("gameStatusError").innerHTML = window.i18next.t("levels.goalNotAchieved");
          }
        });
      }
    }

    initGoal();

    group.onExit(function() {
      if(selectedMode == SOLO_AI || selectedMode == SOLO_PLAYER || selectedMode == AI_VS_AI || (selectedMode == PLAYER_VS_AI && sameGrid) || (selectedMode == BATTLE_ROYALE && sameGrid)) {
        clearTimeout(timeout);
        group.killAll();
        displayLevelList(player);
      }
    });

    group.onReset(function() {
      document.getElementById("gameStatus").innerHTML = "";
      document.getElementById("gameOrder").innerHTML = "";
      document.getElementById("gameStatusError").innerHTML = "";
      initGoal();
    });
  } else {
    return false;
  }
}

function getListLevel(player, type) {
  if(type == DEFAULT_LEVEL) {
    if(player == PLAYER_HUMAN) {
      var levels = DEFAULT_LEVELS_SOLO_PLAYER;
    } else if(player == PLAYER_AI) {
      var levels = DEFAULT_LEVELS_SOLO_AI;
    } else {
      return false;
    }
  }

  var res = '<div class="row mb-2 mx-auto">';
  var index = 1;
  var empty = true;

  for(var key in levels) {
    if(levels.hasOwnProperty(key)) {
      if(levelCompatible(levels[key]["type"], levels[key]["version"]) && canPlay(key, player, type)) {
        var button = '<button class="btn btn-lg btn-primary btn-block-85" onclick="playLevel(' + key + ', ' + player  + ', ' + type + ');">' + window.i18next.t("levels.level") + ' ' + index + '</button>';
      } else {
        var button = '<button class="btn btn-lg btn-primary btn-block-85" disabled title="' + window.i18next.t("levels.disabledLevel") + '">' + window.i18next.t("levels.level") + ' ' + index + '</button>';
      }

      if(index % 2 == 0) {
        res += '<div class="col pl-0 justify-content-center">' + button + '</div></div><div class="row mb-2 mx-auto">';
      } else {
        res += '<div class="col pr-0 justify-content-center">' + button + '</div>';
      }

      empty = false;
    }

    index++;
  }

  if(empty) {
    return "<strong>" + window.i18next.t("levels.emptyList") + "</strong>";
  }

  if(index % 2 == 0) {
    res += '<div class="col pr-0 justify-content-center"></div>';
  }

  return res + "</div>";
}

// Localization
function listTranslations(languages) {
  if(languages != null) {
    document.getElementById("languageSelect").disabled = true;
    document.getElementById("languageSelect").innerHTML = "";

    for(var i = 0; i < languages.length; i++) {
      document.getElementById("languageSelect").innerHTML = document.getElementById("languageSelect").innerHTML + '<option data-i18n="lang.' + languages[i] + '" value="'+ languages[i] +'"></option>';
    }

    document.getElementById("languageSelect").value = i18next.language.substr(0, 2);
    document.getElementById("languageSelect").disabled = false;
  }
}

function translateContent() {
  listTranslations(i18next.languages);

  var i18nList = document.querySelectorAll("[data-i18n]");
  i18nList.forEach(function(v) {
    v.innerHTML = window.i18next.t(v.dataset.i18n);
  });

  document.getElementById("dateTxt").innerHTML = window.i18next.t("menu.versionDate", { date: new Intl.DateTimeFormat(i18next.language).format(new Date(DATE_VERSION)) });

  document.getElementById("heightGrid").placeholder = window.i18next.t("settings.placeholderHeight");
  document.getElementById("widthGrid").placeholder = window.i18next.t("settings.placeholderWidth");
  document.getElementById("customSpeed").placeholder = window.i18next.t("settings.placeholderCustomSpeed");
  document.getElementById("numberIA").placeholder = window.i18next.t("settings.placeholderNumberIA");

  document.getElementById("appDownloadURLGet").title = window.i18next.t("update.getURL");
  document.getElementById("appUpdateChanges").title = window.i18next.t("update.getChanges");

  document.getElementById("appUpdateDateLocalized").innerHTML = window.i18next.t("update.versionDate", { date: new Intl.DateTimeFormat(i18next.language).format(new Date(document.getElementById("appUpdateDate").innerHTML)) });
}

document.getElementById("languageSelect").onchange = function() {
  i18next.changeLanguage(document.getElementById("languageSelect").value, function(err, t) {
    translateContent();
  });
};

window.addEventListener("load", function() {
  setTimeout(function() {
    translateContent();
  }, 250);
});
