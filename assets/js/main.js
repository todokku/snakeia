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
IA_SOLO = "IA_SOLO";
JOUEUR_SOLO = "JOUEUR_SOLO";
JOUEUR_VS_IA = "JOUEUR_VS_IA";
IA_VS_IA = "IA_VS_IA";
IA_BATTLE_ROYALE = "IA_BATTLE_ROYALE";
UPDATER_URI = "https://www.eliastiksofts.com/snakeia/update.php";

var selectedMode = IA_SOLO;
var showDebugInfo = false;

document.getElementById("versionTxt").innerHTML = APP_VERSION;
document.getElementById("appVersion").innerHTML = APP_VERSION;
document.getElementById("dateTxt").innerHTML = DATE_VERSION;
document.getElementById("appUpdateDate").innerHTML = DATE_VERSION;

String.prototype.strcmp = function(str) {
  return ((this == str) ? 0 : ((this > str) ? 1 : -1));
};

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

function selectMode(mode) {
  selectedMode = mode;

  if(selectedMode == JOUEUR_SOLO) {
    document.getElementById("iaSettings").style.display = "none";
  } else {
    document.getElementById("iaSettings").style.display = "block";
  }

  if(selectedMode == IA_SOLO) {
    document.getElementById("autoRetrySettings").style.display = "block";
  } else {
    document.getElementById("autoRetrySettings").style.display = "none";
  }

  if(selectedMode == IA_BATTLE_ROYALE) {
    document.getElementById("numberIASettings").style.display = "block";
  } else {
    document.getElementById("numberIASettings").style.display = "none";
  }

  displaySettings();
}

document.getElementById("iaSoloBtn").onclick = function() {
  selectMode(IA_SOLO);
};

document.getElementById("joueurSolo").onclick = function() {
  selectMode(JOUEUR_SOLO);
};

document.getElementById("joueurVsIa").onclick = function() {
  selectMode(JOUEUR_VS_IA);
};

document.getElementById("iaVsIa").onclick = function() {
  selectMode(IA_VS_IA);
};

document.getElementById("iaBattleRoyale").onclick = function() {
  selectMode(IA_BATTLE_ROYALE);
};

function displaySettings() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("settings").style.display = "block";
}

function displayMenu() {
  document.getElementById("settings").style.display = "none";
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("menu").style.display = "block";
}

document.getElementById("backToMenu").onclick = function() {
  displayMenu();
};

document.getElementById("gameSpeed").onchange = function() {
  if(document.getElementById("gameSpeed").value == "custom") {
    document.getElementById("customSpeedSettings").style.display = "block";
  } else {
    document.getElementById("customSpeedSettings").style.display = "none";
  }
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

  if(resetValues) {
    document.getElementById("heightGrid").value = 20;
    document.getElementById("widthGrid").value = 20;
    document.getElementById("borderWalls").checked = false;
    document.getElementById("generateWalls").checked = false;
    document.getElementById("gameSpeed").value = 5;
    document.getElementById("progressiveSpeed").checked = false;
    document.getElementById("customSpeed").value = 5;
    document.getElementById("customSpeedSettings").style.display = "none";
    document.getElementById("aiLevel").value = "normal";
    document.getElementById("autoRetry").checked = false;
    document.getElementById("numberIA").value = 20;
  }
}

document.getElementById("resetSettings").onclick = function() {
  resetForm(true);
};

function validateSettings() {
  resetForm(false);

  var heightGrid = document.getElementById("heightGrid").value;
  var widthGrid = document.getElementById("widthGrid").value;
  var borderWalls = document.getElementById("borderWalls").checked;
  var generateWalls = document.getElementById("generateWalls").checked;
  var speed = document.getElementById("gameSpeed").value;
  var progressiveSpeed = document.getElementById("progressiveSpeed").checked;
  var customSpeed = document.getElementById("customSpeed").value;
  var aiLevel = document.getElementById("aiLevel").value;
  var autoRetry = document.getElementById("autoRetry").checked;
  var numberIA = document.getElementById("numberIA").value;

  var formValidated = true;

  if(heightGrid.trim() == "" || isNaN(heightGrid) || heightGrid < 5 || heightGrid > 100) {
    formValidated = false;
    document.getElementById("heightGrid").classList.add("is-invalid");
    document.getElementById("invalidHeight").style.display = "block";
  } else {
    heightGrid = parseInt(heightGrid);
  }

  if(widthGrid.trim() == "" || isNaN(widthGrid) || widthGrid < 5 || widthGrid > 100) {
    formValidated = false;
    document.getElementById("widthGrid").classList.add("is-invalid");
    document.getElementById("invalidWidth").style.display = "block";
  } else {
    widthGrid = parseInt(widthGrid);
  }

  if(speed != "custom" && (speed.trim() == "" || isNaN(speed) || speed < 1 || speed > 100)) {
    formValidated = false;
    document.getElementById("gameSpeed").classList.add("is-invalid");
    document.getElementById("invalidSpeed").style.display = "block";
  } else if(speed != "custom") {
    speed = parseInt(speed);
  }

  if(speed == "custom" && (customSpeed.trim() == "" || isNaN(customSpeed) || customSpeed < 1 || customSpeed > 100)) {
    formValidated = false;
    document.getElementById("customSpeed").classList.add("is-invalid");
    document.getElementById("invalidCustomSpeed").style.display = "block";
  } else if(speed == "custom") {
    speed = parseInt(customSpeed);
  }

  if(selectedMode != JOUEUR_SOLO && (aiLevel != "low" && aiLevel != "normal" && aiLevel != "high")) {
    formValidated = false;
    document.getElementById("aiLevel").classList.add("is-invalid");
    document.getElementById("invalidaiLevel").style.display = "block";
  } else if(selectedMode != JOUEUR_SOLO) {
    switch(aiLevel) {
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

  if(selectedMode == IA_BATTLE_ROYALE && (numberIA.trim() == "" || isNaN(numberIA) || numberIA < 2 || numberIA > 100)) {
    formValidated = false;
    document.getElementById("numberIA").classList.add("is-invalid");
    document.getElementById("invalidIANumber").style.display = "block";
  } else if(selectedMode == IA_BATTLE_ROYALE) {
    numberIA = parseInt(numberIA);
  }

  if(selectedMode != IA_SOLO) {
    autoRetry = false;
  }

  if(formValidated) {
    document.getElementById("settings").style.display = "none";
    document.getElementById("menu").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";

    var titleGame = "";

    switch(selectedMode) {
      case IA_SOLO:
        titleGame = window.i18next.t("menu.iaSoloBtn");
        break;
      case JOUEUR_SOLO:
        titleGame = window.i18next.t("menu.joueurSolo");
        break;
      case JOUEUR_VS_IA:
        titleGame = window.i18next.t("menu.joueurVsIa");
        break;
      case IA_VS_IA:
        titleGame = window.i18next.t("menu.iaVsIa");
        break;
      case IA_BATTLE_ROYALE:
        titleGame = window.i18next.t("menu.iaBattleRoyale");
        break;
    }

    document.getElementById("titleGame").innerHTML = window.i18next.t("game.currentMode") + " " + titleGame;

    var games = [];

    if(selectedMode == IA_SOLO) {
      var grid = new Grid(widthGrid, heightGrid, generateWalls, borderWalls);
      var snake = new Snake(RIGHT, 3, grid, PLAYER_AI, aiLevel, autoRetry);

      games.push(new Game(grid, snake, speed, document.getElementById("gameContainer"), true, true, progressiveSpeed));
    } else if(selectedMode == JOUEUR_SOLO) {
      var grid = new Grid(widthGrid, heightGrid, generateWalls, borderWalls);
      var snake = new Snake(RIGHT, 3, grid, PLAYER_HUMAN);

      games.push(new Game(grid, snake, speed, document.getElementById("gameContainer"), true, true, progressiveSpeed));
    } else if(selectedMode == JOUEUR_VS_IA) {
      var grid = new Grid(widthGrid, heightGrid, generateWalls, borderWalls);
      var snake = new Snake(RIGHT, 3, grid, PLAYER_HUMAN);

      var grid2 = new Grid(widthGrid, heightGrid, generateWalls, borderWalls);
      var snake2 = new Snake(RIGHT, 3, grid2, PLAYER_AI, aiLevel, autoRetry);

      games.push(new Game(grid, snake, speed, document.getElementById("gameContainer"), true, false, progressiveSpeed));
      games.push(new Game(grid2, snake2, speed, document.getElementById("gameContainer"), false, false, progressiveSpeed));
    } else if(selectedMode == IA_VS_IA) {
      var grid = new Grid(widthGrid, heightGrid, generateWalls, borderWalls);
      var snake = new Snake(RIGHT, 3, grid, PLAYER_AI, aiLevel, autoRetry);

      var grid2 = new Grid(widthGrid, heightGrid, generateWalls, borderWalls);
      var snake2 = new Snake(RIGHT, 3, grid2, PLAYER_AI, aiLevel, autoRetry);

      games.push(new Game(grid, snake, speed, document.getElementById("gameContainer"), true, true, progressiveSpeed));
      games.push(new Game(grid2, snake2, speed, document.getElementById("gameContainer"), true, true, progressiveSpeed));
    } else if(selectedMode == IA_BATTLE_ROYALE) {
      for(var i = 0; i < numberIA; i++) {
        var grid = new Grid(widthGrid, heightGrid, generateWalls, borderWalls);
        var snake = new Snake(RIGHT, 3, grid, PLAYER_AI, aiLevel, autoRetry);

        games.push(new Game(grid, snake, speed, document.getElementById("gameContainer"), true, false, progressiveSpeed, 350, 250));
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
      if(selectedMode == JOUEUR_VS_IA || selectedMode == IA_VS_IA || selectedMode == IA_BATTLE_ROYALE) {
        var winners = group.getWinners();

        if(selectedMode == JOUEUR_VS_IA) {
          if(winners.index.length == 2) {
            document.getElementById("gameStatus").innerHTML = window.i18next.t("game.equalityPlayerVSAI");
          } else if(winners.index[0] == 0) {
            document.getElementById("gameStatus").innerHTML = window.i18next.t("game.winPlayerVSAI");
          } else if(winners.index[0] == 1) {
            document.getElementById("gameStatus").innerHTML = window.i18next.t("game.losePlayerVSAI");
          }
        } else if(selectedMode == IA_VS_IA) {
          if(winners.index.length == 1) {
            document.getElementById("gameStatus").innerHTML = window.i18next.t("game.oneWinnerAIVSAI", { numWinner: winners.index[0] + 1 });
          } else if(winners.index.length == 2) {
            document.getElementById("gameStatus").innerHTML = window.i18next.t("game.equalityAIVSAI");
          }
        } else if(selectedMode == IA_BATTLE_ROYALE) {
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
      if(selectedMode == IA_SOLO || selectedMode == JOUEUR_SOLO || selectedMode == IA_VS_IA) {
        group.killAll();
        displayMenu();
      }
    });

    group.onReset(function() {
      document.getElementById("gameStatus").innerHTML = "";
    });
  }
}

document.getElementById("validateSettings").onclick = function() {
  validateSettings();
};

function enableDebugMode() {
  showDebugInfo = true;
  console.log(window.i18next.t("debugModeEnabled"));
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
  translateContent();
});
