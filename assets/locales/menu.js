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
// French
i18next.addResourceBundle("fr", "translation", {
  "debugModeEnabled": "Mode de debug activé",
  "lang": {
    "fr": "Français",
    "en": "English"
  },
  "update": {
    "updateAvailable": "Une mise à jour du jeu est disponible",
    "version": "Version",
    "of": "du",
    "current": "Vous disposez actuellement de la version",
    "versionDate": "{{date, DD/MM/YYYY}}",
    "download": "Télécharger la mise à jour",
    "getURL": "Obtenir l'adresse URL du téléchargement",
    "getChanges": "Obtenir la liste des changements",
    "URLToDownload": "Adresse URL menant au téléchargement :",
    "noChanges": "Aucun changement renseigné.",
    "changes": "Changements de la nouvelle version :"
  },
  "menu": {
    "selectGame": "Sélectionnez un mode de jeu :",
    "soloAi": "IA solo",
    "soloPlayer": "Joueur solo",
    "playerVsAi": "Joueur VS IA",
    "aiVsAi": "IA VS IA",
    "battleRoyale": "Battle Royale",
    "levelsSoloPlayer": "Niveaux (joueur solo)",
    "levelsSoloAI": "Niveaux (IA solo)",
    "version": "Version",
    "versionDate": "{{date, DD/MM/YYYY}}",
    "by": "Par",
    "infos": "Plus d'infos",
    "readme": "Fichier Lisez-moi",
    "source": "Télécharger la source",
    "language": "Langue :",
  },
  "settings": {
    "title": "Paramètres de la partie :",
    "possibleFailInitGame": "Il est possible que l'initialisation de la partie échoue avec vos paramètres car il n'y aura pas assez d'espace pour placer tous les Snake. Dans ce cas, un message « Une erreur est survenue » peut s'afficher. Essayez avec d'autres paramètres.",
    "gridSize": "Taille de la grille :",
    "placeholderHeight": "Hauteur",
    "placeholderWidth": "Largeur",
    "invalidHeight": "Cette valeur doit être comprise entre 5 et 100",
    "invalidWidth": "Cette valeur doit être comprise entre 5 et 100",
    "options": "Autres options :",
    "borderWalls": "Entourer la grille de murs",
    "generateWalls": "Générer des murs à des positions aléatoires",
    "sameGrid": "Partie sur la même grille",
    "speed": "Vitesse du jeu :",
    "speedSelect": {
      "1": "1 – La plus rapide",
      "3": "3 – Rapide",
      "5": "5 – Moyenne",
      "8": "8 – Normale",
      "10": "10 – Assez lente",
      "15": "15 – Lente",
      "20": "20 – Très lente",
      "25": "25 – Extrêmement lente",
      "custom": "Vitesse personnalisée…"
    },
    "invalidSpeed": "Cette valeur doit être comprise entre 1 et 100",
    "progressiveSpeed": "Augmenter la vitesse progressivement",
    "customSpeed": "Vitesse personnalisée :",
    "placeholderCustomSpeed": "Entrez la vitesse…",
    "invalidCustomSpeed": "Cette valeur doit être comprise entre 1 et 100",
    "customSpeedHelp": "Plus le nombre est élevé, plus la vitesse du jeu est lente, et inversement",
    "aiLevel": "Niveau de l'IA :",
    "aiLevelSelect": {
      "random": "Au hasard",
      "low": "Faible",
      "normal": "Normal",
      "high": "Élevé",
      "ultra": "Ultra"
    },
    "invalidaiLevel": "Cette valeur est invalide",
    "autoRetry": "Faire que l'IA recommence auto sa partie après un Game Over",
    "numberIA": "Nombre d'IA :",
    "placeholderNumberIA": "Entrez le nombre…",
    "invalidIANumber": "Cette valeur doit être comprise entre 2 et 100",
    "battleAgainstAIs": "Jouer contre les IA",
    "validate": "Valider",
    "reset": "Réinitialiser",
    "backToMenu": "Retour au menu"
  },
  "game": {
    "backToMenu": "Retour au menu",
    "currentMode": "Mode de jeu actuel :",
    "confirmQuit": "Êtes-vous sûr de vouloir retourner au menu ?",
    "equalityPlayerVSAI": "Vous avez fini ex-aequo avec l'IA !",
    "winPlayerVSAI": "Bravo, vous avez gagné !",
    "losePlayerVSAI": "Dommage, l'IA vous a battu avec un score supérieur !",
    "oneWinnerAIVSAI": "L'IA n°{{numWinner}} a gagné !",
    "equalityAIVSAI": "Les deux IA ont fini ex-aequo !",
    "oneWinnerBattleRoyale": "L'IA n°{{numWinner}} a gagné avec un score de {{score}} !",
    "winnersBattleRoyale": "Les IA",
    "winnersNumBattleRoyale": "n°{{numWinner}}",
    "andWinnersBattleRoyale": "et",
    "winScoreBattleRoyale": "ont gagné avec un score de {{score}} !"
  },
  "levels": {
    "default": "Niveaux par défaut",
    "downloaded": "Niveaux téléchargés",
    "titlePlayer": "Niveaux (joueur solo)",
    "titleAI": "Niveaux (IA solo)",
    "emptyList": "Aucun niveau trouvé…",
    "download": "Télécharger des niveaux",
    "downloadLink": "Les niveaux seront téléchargés depuis {{url}}",
    "editDownloadURL": "Modifier l'URL de téléchargement",
    "editDownloadURLPrompt": "Entrez l'URL de téléchargement des niveaux.\n* Variables disponibles :\n{player} - type de joueur (humain, IA)\n{appVersion} - version de l'application.\n\nLa modification de ce paramètre peut faire planter le jeu ou vous exposer à des problèmes de sécurité. Ne la modifiez que si vous savez ce que vous faites. Ce paramètre n'est pas persistant et sera effacé si vous rechargez l'application.",
    "downloading": "Téléchargement en cours, veuillez patienter… Si le bouton reste grisé après plus de 10 secondes, cliquez sur le bouton ci-dessous pour le débloquer et réessayer le téléchargement :",
    "buttonDeblock": "Débloquer le téléchargement",
    "disabledLevel": "Niveau bloqué. Terminez les niveaux précédents pour le débloquer.",
    "notCompatible": "Ce niveau n'est pas compatible avec cette version du jeu. Mettez-le à jour.",
    "goalAchieved": "Objectif atteint ! Vous pouvez passer au prochain niveau.",
    "goalNotAchieved": "Objectif raté ! Essayez à nouveau.",
    "level": "Niveau",
    "reachScore": "Atteignez au moins le score de {{value}} pour passer ce niveau !",
    "reachScoreTime": "Atteignez le score de {{value}} en moins de {{count}} seconde !",
    "reachScoreTime_plural": "Atteignez le score de {{value}} en moins de {{count}} secondes !",
    "reachMaxScore": "Atteignez le score maximal pour cette grille pour passer ce niveau !",
    "multiBestScore": "Terminez cette partie en obtenant un meilleur score que l'adversaire pour passer ce niveau !",
    "multiBestScore_plural": "Terminez cette partie en obtenant un meilleur score que les adversaires pour passer ce niveau !",
    "multiReachScoreFirst": "Atteignez le score de {{value}} avant l'adversaire pour passer ce niveau !",
    "multiReachScoreFirst_plural": "Atteignez le score de {{value}} avant les adversaires pour passer ce niveau !",
    "bestScore": "Meilleur score : {{count}}",
    "bestTime": "Meilleur temps : {{count}} seconde",
    "bestTime_plural": "Meilleur temps : {{count}} secondes",
    "timerRemaining": "Il reste {{count}} seconde",
    "timerRemaining_plural": "Il reste {{count}} secondes",
    "localstorageDisabled": "Les cookies sont désactivés sur votre navigateur. Vous perdrez votre progression au prochain rechargement de la page. Activez-les puis rechargez la page pour éviter cela."
  }
}, true, false);

// English
i18next.addResourceBundle("en", "translation", {
  "debugModeEnabled": "Debug mode enabled",
  "lang": {
    "fr": "Français",
    "en": "English"
  },
  "update": {
    "updateAvailable": "An update of the game is available",
    "version": "Version",
    "of": "of",
    "current": "You currently have the version",
    "versionDate": "{{date, MM/DD/YYYY}}",
    "download": "Download the update",
    "getURL": "Get the URL of the download",
    "getChanges": "Get the list of changes",
    "URLToDownload": "Download URL:",
    "noChanges": "No change filled.",
    "changes": "Changes in the new version:"
  },
  "menu": {
    "selectGame": "Select a game mode:",
    "soloAi": "Solo AI",
    "soloPlayer": "Solo player",
    "playerVsAi": "Player VS AI",
    "aiVsAi": "AI VS AI",
    "battleRoyale": "Battle Royale",
    "levelsSoloPlayer": "Levels (solo player)",
    "levelsSoloAI": "Levels (solo AI)",
    "version": "Version",
    "versionDate": "{{date, MM/DD/YYYY}}",
    "by": "By",
    "infos": "More informations",
    "readme": "Readme file",
    "source": "Download the source",
    "language": "Language:"
  },
  "settings": {
    "title": "Game settings:",
    "possibleFailInitGame": "It's possible that the initialization of the game fails with your settings because there will not be enough space to place all Snake. In this case, a message \"An error has occurred\" may be displayed. Try with other settings.",
    "gridSize": "Grid size:",
    "placeholderHeight": "Height",
    "placeholderWidth": "Width",
    "invalidHeight": "This value must be between 5 and 100",
    "invalidWidth": "This value must be between 5 and 100",
    "options": "Others options:",
    "borderWalls": "Surround the grid with walls",
    "generateWalls": "Generate walls at random positions",
    "sameGrid": "Game on the same grid",
    "speed": "Speed:",
    "speedSelect": {
      "1": "1 – Fastest",
      "3": "3 – Fast",
      "5": "5 – Medium",
      "8": "8 – Normal",
      "10": "10 – Quite slow",
      "15": "15 – Slow",
      "20": "20 – Very slow",
      "25": "25 – Extremely slow",
      "custom": "Custom speed…"
    },
    "invalidSpeed": "This value must be between 1 and 100",
    "progressiveSpeed": "Increase the speed progressively",
    "customSpeed": "Custom speed:",
    "placeholderCustomSpeed": "Enter the speed…",
    "invalidCustomSpeed": "This value must be between 1 and 100",
    "customSpeedHelp": "The higher the number, the slower the game speed, and inversely",
    "aiLevel": "AI level:",
    "aiLevelSelect": {
      "random": "Random",
      "low": "Low",
      "normal": "Normal",
      "high": "High",
      "ultra": "Ultra"
    },
    "invalidaiLevel": "This value is invalid",
    "autoRetry": "Make the AI restart its game after a Game Over",
    "numberIA": "Number of AI:",
    "placeholderNumberIA": "Enter the number…",
    "invalidIANumber": "This value must be between 2 and 100",
    "battleAgainstAIs": "Play against AIs",
    "validate": "Validate",
    "reset": "Reset",
    "backToMenu": "Back to the menu"
  },
  "game": {
    "backToMenu": "Back to the menu",
    "currentMode": "Current game mode:",
    "confirmQuit": "Are you sure that you want to go back to the menu?",
    "equalityPlayerVSAI": "You finished tied with AI!",
    "winPlayerVSAI": "Congratulations, you won!",
    "losePlayerVSAI": "Too bad, the AI ​​beat you with a higher score!",
    "oneWinnerAIVSAI": "The AI n°{{numWinner}} won!",
    "equalityAIVSAI": "The two AIs finished tied!",
    "oneWinnerBattleRoyale": "The AI n°{{numWinner}} won with a score of {{score}}!",
    "winnersBattleRoyale": "The AIs",
    "winnersNumBattleRoyale": "n°{{numWinner}}",
    "andWinnersBattleRoyale": "and",
    "winScoreBattleRoyale": "won with a score of {{score}}!"
  },
  "levels": {
    "default": "Default levels",
    "downloaded": "Downloaded levels",
    "titlePlayer": "Levels (solo player)",
    "titleAI": "Levels (solo AI)",
    "emptyList": "No level found…",
    "download": "Download levels",
    "downloadLink": "The levels will be downloaded from {{url}}",
    "editDownloadURL": "Edit the download URL",
    "editDownloadURLPrompt": "Enter the download URL of the levels.\n* Available variables:\n{player} - player type (human, AI)\n{appVersion} - version of the application.\n\nChanging this setting may cause the game to crash or expose you to security issues. Only change it if you know what you are doing. This setting is not persistent and will be erased if you reload the application.",
    "downloading": "Downloading, please wait… If the button remains gray after more than 10 seconds, click on the button below to unblock and try again:",
    "buttonDeblock": "Unlock the download",
    "disabledLevel": "Level locked. Complete the previous levels to unlock it.",
    "notCompatible": "This level is not compatible with this version of the game. Update it.",
    "goalAchieved": "Goal achieved! You can move to the next level.",
    "goalNotAchieved": "Goal missed! Try again.",
    "level": "Level",
    "reachScore": "Reach at least the score of {{value}} to pass this level!",
    "reachScoreTime": "Reach the score of {{value}} in less than {{count}} second!",
    "reachScoreTime_plural": "Reach the score of {{value}} in less than {{count}} seconds!",
    "reachMaxScore": "Reach the maximum score for this grid to pass this level!",
    "multiBestScore": "Finish this game by getting a better score than the opponent to pass this level!",
    "multiBestScore_plural": "Finish this game by getting a better score than the opponents to pass this level!",
    "multiReachScoreFirst": "Reach the score of {{value}} before the opponent to pass this level!",
    "multiReachScoreFirst_plural": "Reach the score of {{value}} before the opponents to pass this level!",
    "bestScore": "Best score: {{count}}",
    "bestTime": "Best time: {{count}} second",
    "bestTime_plural": "Best time: {{count}} seconds",
    "timerRemaining": "{{count}} second left",
    "timerRemaining_plural": "{{count}} seconds left",
    "localstorageDisabled": "Cookies are disabled on your browser. You will lose your progress the next time you reload the page. Activate them and reload the page to avoid this."
  }
}, true, false);
