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
// Exports engine classes
import "../assets/locales/init.js";
import "../assets/locales/menu.js";
import "../assets/locales/engine.js";
import "../main.js";
import GameConstants from "./constants";
import Event from "./event";
import Reactor from "./reactor";
import Grid from "./grid";
import Snake from "./snake";
import GameGroup from "./gameGroup";
import GameUtils from "./gameUtils";
import Position from "./position";
import GameEngine from './gameEngine';
import { Game } from "./shim";
import GameController from "./gameController";
import GameControllerWorker from "./gameControllerWorker";
import GameControllerSocket from "./gameControllerSocket";
import GameUI from "./gameUI";
import OnlineClient from "./onlineClient";

export { GameConstants, Event, Reactor, Grid, Snake, GameGroup, GameUtils, Position, GameEngine, Game, GameController, GameControllerWorker, GameControllerSocket, GameUI, OnlineClient };