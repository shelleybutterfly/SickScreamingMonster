// ==UserScript==
// @name /u/chelleliberty steam "SCREAMIN' MONSTERS'" Monster Minigame script
// @namespace https://github.com/shelleybutterfly/SickScreamingMonster
// @description A certainly not-so-wonderful script released on the last day of the minigame. Why? Who can say?
// @version 0.0.5
// @match *://steamcommunity.com/minigame/towerattack*
// @match *://steamcommunity.com//minigame/towerattack*
// @grant none
// @updateURL file:///G:\code\freshstart\SteamSummerMinigame\SickScreamingMonster\sickScreamingMonster.user.js
// @downloadURL https://raw.githubusercontent.com/shelleybutterfly/SickScreamingMonster/master/sickScreamingMonster.user.js
// ==/UserScript==

// OKAY: FINAL NOTE
//
// Sorry, folks, I didn't get this quite where I wanted it. It kinda works. I am going to be continuing to update. It should be
// minorly useful for its stated purpose. That's about it. :) <3 you all!
//

// NOTE: 
//   I forked this from wchill's repo; however, since this is really a recombination and then total
//   hacky mash-up (and not even a pretty one) of so many things, that I have just stripped it down
//   and noted the source material and am letting it stand by itself.
//
//   Source material: (in no particular order, and, yes, I realize SteamDatabase was deriviative)
//      https://github.com/wchill/Steam
//      https://github.com/YeOldeWH/MonsterMinigameWormholeWarp
//      https://github.com/SteamDatabase/steamSummerMinigame
//
//      of course: 
//      
//      THE STEAM SUMMER MONSTER MINIGAME! 
//      ALL THE STUFF IT DERIVES FROM!
//      ALL THE SHOULDERS OF ALL THE GIANTS I STAND UPON!
//
//   So, I have my eye towards certain a very particular goal, and a very particular way of meeting
//   it: get as many wormholes out as fast as possible, with a _very_ small eye toward at least 
//   being able to tune for hitting the x00's; but mostly such that we can help out THE FOLKS THAT
//   HAVEN'T HIT 1,000,000 YET!
//
//   That's right, rather than focusing on how to get yet another group to 100mil; or what-have-you,
//   or to up the speed at which it happens, especially with all I'm observing with folks not paying
//   attention to what IMO are some fairly large issues; but most of all, just the huge negative 
//   vibe that I started to get off the whole deal, even as such generous efforts were being made
//   on behalf of everyone... 
//
//   From those who would troll to those who are far far too focused on the fact that there are 
//   those who would troll, it's just this glut of negative energy that I am not interested in 
//   being a part of today. Instead, I want to be a part of this, in a way that I have some modicum
//   of control; hell, at this point I don't even know that I'm going to be able to pay my rent next
//   month or how we're going to survive, but I do know that my calling has something to do with 
//   figuring out to deal positively with these things, for myself, and maybe even someday to help
//   others through as well.

//   And if nothing else, maybe just have some fun and at least bring some joy in the meantime.

//   So, without further ado. 


// Keep in mind this is super-ultra-pre-beta right now and needs some real tuning. We're not going
// to get a chance to tune much. The goal is to make a script that between, say, 10 people can 
// successfully/easily help most teeny rooms get to 1-2mil in 12 hours. Seeing as how there isn't 
// much time I'd better get on it.



//----------------------------------------------------------------------------------------------
//
// THEORY OF OPERATION (such as it is...)
//
// 1. There may be trolls, or, quite possibly, the people we're helping might actualy *gasp*
//    want to play the game! So, it's kinda not too fun to be playing a click game if you have to 
//    completely stop clicking! I think we ought to be trying to help them reach a million while
//    we all have fun! And the experience I had earlier today showed me that it ought be possible.
//
// 2. It very well may be that we don't stay very long on the x00 rounds, therefore. But, 10-20-30
//    seconds is fine. And since most of us will have so many wormholes... WHO CARES? We have more
//    than enough to get them there. And so the assumption is that you're going to buy a 1:1 ratio
//    of Like New to Wormhole and then the script will bang it out. I see no real need to muck 
//    about with it as yet.
//
// 3. I say let's get a fair amount of Feeling Lucky also! 'Cause then we give them a lotta stuff 
//    to play with when we go-go. That's just hardcoded to be used in the script. Didn't have time 
//    to learn what I needed to to make it all work with the auto buys, sorry!
//
// 4. The rest of everything is just getting banged out too! Because, we're just hitting everything!
//    It's all getting hit hard, basically there's one check and that is used for most everything, 
//    it backs off and ideally so will whoever we are trying to help out, at least a little, but
//    if not then we just ramp up again. I bought a fair amount of raining gold, treasure, etc.
//    It's not like we need all our points since we don't need 50K WH and 50K LN, so go wild!
//


(function(w) {
	"use strict";

	//Version displayed to client, update along with the @version above
	var SCRIPT_VERSION = '0.0.1';

	// OPTIONS
	var clickRate = 20;
	var g_logLevel = 1; // 5 is the most verbose, 0 is fatal errors only
	var THROW_ON_ERROR = true; // whether to throw an exception on fatal errors to stop the script running. 

	var enableAutoClicker = getPreferenceBoolean("enableAutoClicker", true);

	var removeInterface = getPreferenceBoolean("removeInterface", true); // get rid of a bunch of pointless DOM var removeParticles = getPreferenceBoolean("removeParticles", true);
	var removeParticles = getPreferenceBoolean("removeParticles", true);
	var removeFlinching = getPreferenceBoolean("removeFlinching", true);
	var removeCritText = getPreferenceBoolean("removeCritText", true);
	var removeGoldText = getPreferenceBoolean("removeGoldText", true);
	var removeAllText = getPreferenceBoolean("removeAllText", true);
	var enableAutoRefresh = true;
	var enableFingering = getPreferenceBoolean("enableFingering", false);
	var disableRenderer = getPreferenceBoolean("disableRenderer", true);
	var useTrollTracker = getPreferenceBoolean("useTrollTracker", false);
	var praiseGoldHelm = getPreferenceBoolean("praiseGoldHelm", true);
	var enableElementLock = getPreferenceBoolean("enableElementLock", true);

	var autoRefreshMinutes = 30; // refresh page after x minutes
	var autoRefreshMinutesRandomDelay = 10;
	var autoRefreshSecondsCheckLoadedDelay = 30;

	// DO NOT MODIFY
	var isAlreadyRunning = false;
	
	var refreshTimer = null;
	var currentClickRate = enableAutoClicker ? clickRate : 0;
	var lastLevel = 0;
	var goldHelmURLs = {
		"Original Gold Helm": "https://i.imgur.com/1zRXQgm.png",
		"Moving Gold Helm": "http://i.imgur.com/XgT8Us8.gif",
		"Golden Gaben": "http://i.imgur.com/ueDBBrA.png",
		"Gaben + Snoop Dogg": "http://i.imgur.com/9R0436k.gif",
		"Wormhole Gaben": "http://i.imgur.com/6BuBgxY.png"
	};
	var goldHelmUI = getPreference("praiseGoldHelmImage", goldHelmURLs["Original Gold Helm"]);
	var fixedUI = "http://i.imgur.com/ieDoLnx.png";
	var trt_oldCrit = function() {};
	var trt_oldPush = function() {};
	var trt_oldRender = function() {};

	var control = {
		speedThreshold: 200,
		// Stop using offensive abilities shortly before rain/wormhole rounds.
		rainingSafeRounds: 5,
		rainingRounds: 100,
		timePerUpdate: 60000,
		useSlowMode: false,
		minsLeft: 60,
		allowWormholeLevel: 180000,
		githubVersion: SCRIPT_VERSION,
		useAbilityChance: 1.0,
		useLikeNewMinChance: 0.02,
		useLikeNewMaxChance: 0.25,
		useLikeNewMinTime: 0,
		useLikeNewMaxTime: 500,
		useGoldThreshold: 200
	};

	var canUseLikeNew = true;
	var levelsSkipped = [0, 0, 0, 0, 0];
	var oldLevel = 0;
	var replacedCUI = false;

	//var showedUpdateInfo = getPreferenceBoolean("showedUpdateInfo", false);

	var lane_info = {};

	function getAbilityItems() {
		return getScene().m_rgPlayerTechTree.ability_items;
	}
	
	function getAbilityItemCount(abilityItemId) {
		var retVal = 0;

		var abilityItems = getAbilityItems();
		
		for (var i=0; i < abilityItems.length; ++i) {
			var abilityItem = abilityItems[i];
			
			if ( abilityItem.ability == abilityItemId )
				retVal = abilityItem.quantity;
		}
		
		return retVal;
	}
	
	var UPGRADES = {
		LIGHT_ARMOR: 0,
		AUTO_FIRE_CANNON: 1,
		ARMOR_PIERCING_ROUND: 2,
		DAMAGE_TO_FIRE_MONSTERS: 3,
		DAMAGE_TO_WATER_MONSTERS: 4,
		DAMAGE_TO_AIR_MONSTERS: 5,
		DAMAGE_TO_EARTH_MONSTERS: 6,
		LUCKY_SHOT: 7,
		HEAVY_ARMOR: 8,
		ADVANCED_TARGETING: 9,
		EXPLOSIVE_ROUNDS: 10,
		MEDICS: 11,
		MORALE_BOOSTER: 12,
		GOOD_LUCK_CHARMS: 13,
		METAL_DETECTOR: 14,
		DECREASE_COOLDOWNS: 15,
		TACTICAL_NUKE: 16,
		CLUSTER_BOMB: 17,
		NAPALM: 18,
		BOSS_LOOT: 19,
		ENERGY_SHIELDS: 20,
		FARMING_EQUIPMENT: 21,
		RAILGUN: 22,
		PERSONAL_TRAINING: 23,
		AFK_EQUIPMENT: 24,
		NEW_MOUSE_BUTTON: 25
	};
	
	var ABILITIES = {
		FIRE_WEAPON: 1,
		CHANGE_LANE: 2,
		RESPAWN: 3,
		CHANGE_TARGET: 4,
		MORALE_BOOSTER: 5,
		GOOD_LUCK_CHARMS: 6,
		MEDICS: 7,
		METAL_DETECTOR: 8,
		DECREASE_COOLDOWNS: 9,
		TACTICAL_NUKE: 10,
		CLUSTER_BOMB: 11,
		NAPALM: 12,
		RESURRECTION: 13,
		CRIPPLE_SPAWNER: 14,
		CRIPPLE_MONSTER: 15,
		MAX_ELEMENTAL_DAMAGE: 16,
		RAINING_GOLD: 17,
		CRIT: 18,
		PUMPED_UP: 19,
		THROW_MONEY_AT_SCREEN: 20,
		GOD_MODE: 21,
		TREASURE: 22,
		STEAL_HEALTH: 23,
		REFLECT_DAMAGE: 24,
		FEELING_LUCKY: 25,
		WORMHOLE: 26,
		LIKE_NEW: 27
	};

	var BOSS_DISABLED_ABILITIES = [
		ABILITIES.MORALE_BOOSTER,
		ABILITIES.GOOD_LUCK_CHARMS,
		ABILITIES.TACTICAL_NUKE,
		ABILITIES.CLUSTER_BOMB,
		ABILITIES.NAPALM,
		ABILITIES.CRIT,
		ABILITIES.CRIPPLE_SPAWNER,
		ABILITIES.CRIPPLE_MONSTER,
		ABILITIES.MAX_ELEMENTAL_DAMAGE,
		ABILITIES.REFLECT_DAMAGE,
		ABILITIES.THROW_MONEY_AT_SCREEN
	];

	var ENEMY_TYPE = {
		"SPAWNER": 0,
		"CREEP": 1,
		"BOSS": 2,
		"MINIBOSS": 3,
		"TREASURE": 4
	};

	disableParticles();

	function getMinigame() {
		var ret = g_Minigame;

		if (ret === null)
			ret = w.g_Minigame;

		if (ret !== null) {
			return ret;
		} else {
			fatal_error("ERROR: could not access g_Minigame either globally or via window reference; something is not working!");
		}
	}

	function getScene() {
		return getMinigame().m_CurrentScene;
	}

	function firstRun() {
		log("Starting /u/chelleliberty's script (version " + SCRIPT_VERSION + ")", 1);

		trt_oldCrit = getScene().DoCritEffect;
		trt_oldPush = getScene().m_rgClickNumbers.push;
		trt_oldRender = w.g_Minigame.Render;
		
		if(enableElementLock) {
			lockElements();
		}

		// disable particle effects - this drastically reduces the game's memory leak
		if (removeParticles) {
			disableParticles();
		}

		// disable enemy flinching animation when they get hit
		if (removeFlinching && w.CEnemy) {
			w.CEnemy.prototype.TakeDamage = function() {};
			w.CEnemySpawner.prototype.TakeDamage = function() {};
			w.CEnemyBoss.prototype.TakeDamage = function() {};
		}

		if (removeCritText) {
			toggleCritText();
		}

		if (removeAllText) {
			toggleAllText();
		}

		var node = document.getElementById("abilities");

		if (node) {
			node.style.textAlign = 'left';
		}

		if (removeInterface) {
			node = document.getElementById("global_header");
			if (node && node.parentNode) {
				node.parentNode.removeChild(node);
			}
			node = document.getElementById("footer");
			if (node && node.parentNode) {
				node.parentNode.removeChild(node);
			}
			node = document.getElementById("footer_spacer");
			if (node && node.parentNode) {
				node.parentNode.removeChild(node);
			}
			node = document.querySelector(".pagecontent");
			if (node) {
				node.style["padding-bottom"] = 0;
			}

			document.body.style.backgroundPosition = "0 0";
		}

		if (enableAutoRefresh) {
			autoRefreshPage(autoRefreshMinutes);
		}

		if (enableFingering) {
			startFingering();
		}

		if (disableRenderer) {
			toggleRenderer();
		}

		if (w.CSceneGame !== undefined) {
			w.CSceneGame.prototype.DoScreenShake = function() {};
		}

		fixActiveCapacityUI();

		// Easter egg button
		var egg = document.createElement("span");
		egg.className = "toggle_music_btn";
		egg.textContent = "Easter Egg";
		egg.onclick = function() {
			w.SmackTV();
		};
		document.querySelector(".game_options").insertBefore(egg, document.querySelector(".leave_game_btn"));
        
		document.getElementById("activeinlanecontainer").setAttribute("style","height: 154px; overflow-y: auto;");

		// Add "players in game" label
		var titleActivity = document.querySelector('.title_activity');
		var playersInGame = document.createElement('span');
		playersInGame.innerHTML = '<span id=\"players_in_game\">0/1500</span>&nbsp;Players in room<br>';
		titleActivity.insertBefore(playersInGame, titleActivity.firstChild);

		// Fix alignment
		var activity = document.getElementById("activitylog");
		activity.style.marginTop = "33px";

		var newDiv = document.createElement("div");
		document.getElementsByClassName('pagecontent')[0].insertBefore(newDiv, document.getElementsByClassName('footer_spacer')[0]);
		newDiv.className = "options_box";

		var options_box = document.querySelector(".options_box");

		if(!options_box) {
			options_box = document.querySelector(".options_box");
		}
		options_box.innerHTML = '<b>OPTIONS</b> (v' + SCRIPT_VERSION + ')<br>Settings marked with a <span style="color:#FF5252;font-size:22px;line-height:4px;vertical-align:bottom;">*</span> requires a refresh to take effect.<hr>';
		document.getElementById("activeinlanecontainer").setAttribute("style","height: 154px; overflow-y: auto;");

		// reset the CSS for the info box for aesthetics
		options_box.className = "options_box";
		options_box.style.backgroundColor = "#000000";
		options_box.style.width = "600px";
		options_box.style.marginTop = "12px";
		options_box.style.padding = "12px";
		options_box.style.boxShadow = "2px 2px 0 rgba( 0, 0, 0, 0.6 )";
		options_box.style.color = "#ededed";
		options_box.style.marginLeft = "auto";
		options_box.style.marginRight = "auto";

		var info_box = options_box.cloneNode(true);

		var options1 = document.createElement("div");
		options1.style["-moz-column-count"] = 3;
		options1.style["-webkit-column-count"] = 3;
		options1.style["column-count"] = 3;
		options1.style.width = "100%";

		options1.appendChild(makeCheckBox("enableAutoClicker", "Enable autoclicker", enableAutoClicker, toggleAutoClicker, false));
		options1.appendChild(makeCheckBox("removeInterface", "Remove interface", removeInterface, handleEvent, true));
		options1.appendChild(makeCheckBox("removeParticles", "Remove particle effects", removeParticles, handleEvent, true));
		options1.appendChild(makeCheckBox("removeFlinching", "Remove flinching effects", removeFlinching, handleEvent, true));
		options1.appendChild(makeCheckBox("removeCritText", "Remove crit text", removeCritText, toggleCritText, false));
		options1.appendChild(makeCheckBox("removeGoldText", "Remove gold text", removeGoldText, handleEvent, false));
		options1.appendChild(makeCheckBox("removeAllText", "Remove all text", removeAllText, toggleAllText, false));
		options1.appendChild(makeCheckBox("disableRenderer", "Throttle game renderer", disableRenderer, toggleRenderer, true));
		options1.appendChild(makeCheckBox("enableElementLock", "Lock element upgrades", enableElementLock, toggleElementLock, false));

		if (typeof GM_info !== "undefined") {
			options1.appendChild(makeCheckBox("enableAutoRefresh", "Enable auto-refresh", enableAutoRefresh, toggleAutoRefresh, false));
		}

		options1.appendChild(makeCheckBox("enableFingering", "Enable targeting pointer", enableFingering, handleEvent, true));
		options1.appendChild(makeCheckBox("useTrollTracker", "Track improper ability use", useTrollTracker, handleEvent, true));
		options1.appendChild(makeCheckBox("praiseGoldHelm", "Praise Gold Helm!", praiseGoldHelm, togglePraise, false));
		options1.appendChild(makeDropdown("praiseGoldHelmImage", "", goldHelmUI, goldHelmURLs, changePraiseImage));
		options1.appendChild(makeNumber("setLogLevel", "Change the log level", "25px", g_logLevel, 0, 5, updateLogLevel));

		options_box.appendChild(options1);

		info_box.innerHTML = "<b>GAME INFO</b><br/>";
		info_box.className = "info_box";
		info_box.style.right = "0px";
		lane_info = document.createElement("div");
		lane_info.style["-moz-column-count"] = 3;
		lane_info.style["-webkit-column-count"] = 3;
		lane_info.style["column-count"] = 3;

		lane_info.appendChild(document.createElement("div"));
		lane_info.appendChild(document.createElement("div"));
		lane_info.appendChild(document.createElement("div"));

		info_box.appendChild(lane_info);
		options_box.parentElement.appendChild(info_box);

		var leave_game_box = document.querySelector(".leave_game_helper");
		leave_game_box.parentElement.removeChild(leave_game_box);

		enhanceTooltips();
		enableMultibuy();
		waitForWelcomePanelLoad();
	}

	function updateLaneData() {
		var element_names = {1:":shelterwildfire:", 2:":waterrune:", 3:":Wisp:", 4:":FateTree:"};
		for(var i = 0; i < 3; i++) {
			var element = getScene().m_rgGameData.lanes[i].element;
			var abilities = getScene().m_rgLaneData[i].abilities;
			if(!abilities) {
				abilities = {};
			}
			var enemies = [];
			for (var j = 0; j < 4; j++) {
				var enemy = getScene().GetEnemy(i, j);
				if (enemy) {
					enemies.push(enemy);
				}
			}
			var players = getScene().m_rgLaneData[i].players;
			var output = "Lane " + (i+1) + " - <img src=\"http://cdn.steamcommunity.com/economy/emoticon/" + element_names[element] + "\"><br>" + players + " players";
			lane_info.children[i].innerHTML = output;
		}
	}

	function fixActiveCapacityUI() {
		if(praiseGoldHelm) {
			w.$J('.tv_ui').css('background-image', 'url(' + goldHelmUI + ')');
		} else {
			w.$J('.tv_ui').css('background-image', 'url(' + fixedUI + ')');
		}
		w.$J('#activeinlanecontainer').css('height', '154px');
		w.$J('#activitycontainer').css('height', '270px');
		w.$J('#activityscroll').css('height', '270px');
	}

	function disableParticles() {
		if (w.CSceneGame) {
			w.CSceneGame.prototype.DoScreenShake = function() {};

			if (removeParticles) {
				w.CSceneGame.prototype.SpawnEmitter = function(emitter) {
					emitter.emit = false;
					return emitter;
				};
			}
		}
	}

	function isNearEndGame() {
		var cTime = new Date();
		var cHours = cTime.getUTCHours();
		var cMins = cTime.getUTCMinutes();
		var timeLeft = 60 - cMins;
		if (cHours == 15 && timeLeft <= control.minsLeft) {
			return true;
		} else {
			return false;
		}
	}

    var SECONDS_PER_UPDATE = 15;
    var updateCounter = 1;

	var likeNewTimer = null;
	var wormholeTimer = null;
 
	var MIN_TIMER_INTERVAL = 250;
	var MAX_TIMER_INTERVAL = 1000;
	var FINALLY_THERE_INTERVAL = 250;

	var ignoreWormholeLimits = true;

	function getGameLevel() {
		return getScene().m_rgGameData.level + 1;
	}

	function makeTime() {
		var aDate = new Date();
		return aDate.getTime();
	}	

	var _INT = 0;
	var _REM = 0;
	function intDiv(x,y) { return (x/y)|0; }
	function modDiv(x,y) { return [ (x/y)|0, x % y ]; }
	
	// we need a simple, self-adjusting heuristic that will let us really crank but also handle tons of people
	// or hardly any people using the script; so let's keep it simple...

	// i want some sort of velocity adjuster
	// i want some sort of momentum adjuster

	// for velocity i am trying adjusting the distance to 100 for areWeThereYet on-the-fly
	// for momentum i am going to try an overrun counter with a decay upon no longer overrunning, but with an overrun tolerance
	//    and then the adjustment will be +/- on the rate of WHs sent during the non-finally-there WH dumping

	// i think that's enough 

	// are we there yet == distance from x00 levels where we intend to stop slamming wormholes/damage and 
	// to start doing other things and to stop and get ready for the x00 levels themselves

	// [ VELOCITY HEURISTIC ] Are We There Yet - Settings
	var ARE_WE_THERE_YET_INTERVAL_INITIALIZER = 250;
	var ARE_WE_THERE_YET_DISTANCE_INITIALIZER = 5;
	var ARE_WE_THERE_YET_MIN_DISTANCE = 1;
	var ARE_WE_THERE_YET_MAX_DISTANCE = 50;

	var awtyDistance = ARE_WE_THERE_YET_DISTANCE_INITIALIZER;
	var awtyInterval = ARE_WE_THERE_YET_INTERVAL_INITIALIZER;
	var AWTY_ADJUST_INCREMENT = 10;

	// [ MOMENTUM HEURISTIC ] - Settings
	var ALLOWED_NUMBER_OF_OVERAGES = 10;
	var momentumTargetLevel = 0;

	// basically this will reduce our timer interval by 10ms per minute, or basically allow a reset every 45 minutes or so
	var DECAY_COUNTDOWN_TIMER = 30;
	var decayCounter = 0;

	function adjustTimerInterval() {
		var level = getGameLevel();
		var nextTarget = (intDiv(level + 100, 100) + 1) * 100;

		if (momentumTargetLevel === 0) {
			momentumTargetLevel = nextTarget;
		} else {
			clearInterval()
		}
	}

	var Timer = function( interval, onTimer, name, logStartStop ) {
		this.interval = interval;
		this.onTimer = onTimer;
		this.name = name;
		this.logStartStop = logStartStop;
	}
	Timer.prototype.instance = null;
	Timer.prototype.setInterval = function( interval, onTimer ) { 
		this.interval = interval;
		this.onTimer = onTimer;
	}
	Timer.prototype.start = function() {
		if (this.instance !== null) return false;
		this.logStartStop(this.name, "started");
		this.instance = setInterval(this.onTimer, this.interval);
		return true;
	}
	Timer.prototype.stop = function() {
		if (this.instance === null) return false;
		clearInterval(this.instance);
		this.logStartStop(this.name, "stopped");
		this.instance = null;
		return true;
	}


	var awtyCheckLevel = 0;
	var awtyCheckStartTime = 0; 

	// for every 10 seconds we go *without* going up a level, decrement awtyDistance down to minimum; or, if we didn't 
	// go 2 seconds without changing, then let's increment awtyDistance by 1 otherwise there's no upward pressure
	function awtyHeuristicCheck() {
		var level = getGameLevel();

		if (awtyCheckLevel == 0) {
			awtyCheckLevel = level;
			awtyCheckStartTime = makeTime();
		} else if (awtyCheckLevel != level) {
			awtyCheckLevel = level;
			var secondsBeforeChange = intDiv(makeTime() - awtyCheckStartTime, 1000);

			if (secondsBeforeChange < 2) {
				if ((awtyDistance + 1) < ARE_WE_THERE_YET_MAX_DISTANCE) {
					awtyDistance += 1; log("upping awtyDistance from fast change in level");
				} else {
					log("would up awtyDistance from fast change in level, but already at max");
				}
			} else if (secondsBeforeChange > 10) {
				var levelsToDecrease = intDiv(secondsBeforeChange, 10);

				var testLevel = awtyDistance - levelsToDecrease;
				var before = awtyDistance;
				awtyDistance = Math.max(awtyDistance, testLevel);
				var after = awtyDistance;

				log("downing the awtyDistance due to very slow level change; was " + secondsBeforeChange + " before change. before: " + before + " after: " + after);
			}
		} 
	}

	function areWeThereYet() { return areWeGettingClose() || areWeFinallyThere(); }

	function areWeGettingClose() {
		var mod100 = (getGameLevel() % 100);
		return (mod100 > (100 - awtyDistance));
	}

	function areWeFinallyThere() {
		return (getGameLevel() % 100) === 0;
	}

	//var triggerFunction = function (abilityId) { triggerAbility(abilityId) };
	var fn_TriggerAbility = function (abilityId) { triggerAbilityImmediate(abilityId) };

	var triggerLikeNew = function () { fn_TriggerAbility(ABILITIES.LIKE_NEW); };
	var triggerWormhole = function () { fn_TriggerAbility(ABILITIES.WORMHOLE); };

	var logStartStopTimer = function (timerName, startedstopped) {
		log(timerName + " " + startedstopped + " at level " + getGameLevel(), 1);
	}

	// these two timers are for when we're approaching the 100 level; thus they are affected by velocity/momentum 
	var likeNewTimer_ThereYet = new Timer(awtyInterval, triggerLikeNew, "likeNewTimer_ThereYet", logStartStopTimer);
	var wormholeTimer_ThereYet = new Timer(awtyInterval, triggerWormhole, "wormholeTimer_ThereYet", logStartStopTimer);

	// these two are not, and are at a constant rate set above
	var likeNewTimer_FinallyThere = new Timer(FINALLY_THERE_INTERVAL, triggerLikeNew, "likeNewTimer_FinallyThere", logStartStopTimer);
	var wormholeTimer_FinallyThere = new Timer(FINALLY_THERE_INTERVAL, triggerWormhole, "wormholeTimer_FinallyThere", logStartStopTimer);

	var thereYetTimers = [ likeNewTimer_ThereYet, wormholeTimer_ThereYet ];
	var finallyThereTimers = [ likeNewTimer_FinallyThere, wormholeTimer_FinallyThere ];

	// eh, probably should be resetting the intervals on the timers rather than having two sets; let's try this first.
	function MainLoop() {
		if (!isAlreadyRunning) {
			isAlreadyRunning = true;

			var level = getGameLevel();
			
			awtyHeuristicCheck();

			if (!areWeFinallyThere()) {
				if (!areWeGettingClose()) {
					// not there yet; cram with not there yet timers
					finallyThereTimers.forEach(function (item) { item.stop(); });
					thereYetTimers.forEach(function (item) { item.start(); });
				} else {
					// stop all timers; prepare for finally there
					thereYetTimers.concat(finallyThereTimers).forEach(function (item) { item.stop(); });
				}
			} else {
				// DO IT!!!!! GO GO GO GO !!!!!
				thereYetTimers.forEach(function (item) { item.stop(); });
				finallyThereTimers.forEach(function (item) { item.start(); });
			}

			updateLaneData();
			attemptRespawn();

			if (areWeFinallyThere())
				goToRainingLane();
			else
				goToLaneWithBestTarget();

			if (!areWeThereYet()) {
				useOffensiveAbilities();
			}
			
			useOtherAbilities();
			updatePlayersInGame();

			if (level !== lastLevel) {
				lastLevel = level;
				updateLevelInfoTitle(level);
				refreshPlayerData();
			}

			currentClickRate = getWantedClicksPerSecond();
			getScene().m_nClicks = currentClickRate;
			getScene().m_nLastTick = false;
			w.g_msTickRate = 1000;

			var damagePerClick = getScene().CalculateDamage(
				getScene().m_rgPlayerTechTree.damage_per_click,
				getScene().m_rgGameData.lanes[getScene().m_rgPlayerData.current_lane].element
			);

			log("Ticked. Current clicks per second: " + currentClickRate + ". Current damage per second: " + (damagePerClick * currentClickRate), 4);

			if(disableRenderer) {
				getScene().Tick();

				updateCounter -= 1;
                
				if (updateCounter <= 0) {
					updateCounter = SECONDS_PER_UPDATE;
                    
					requestAnimationFrame(function() {
						w.g_Minigame.Renderer.render(getScene().m_Container);
					});
				}
            }

			isAlreadyRunning = false;

			var enemy = getScene().GetEnemy(
				getScene().m_rgPlayerData.current_lane,
				getScene().m_rgPlayerData.target
			);

			if (currentClickRate > 0) {

				if (enemy) {
					displayText(
						enemy.m_Sprite.position.x - (enemy.m_nLane * 440),
						enemy.m_Sprite.position.y - 52,
						"-" + w.FormatNumberForDisplay((damagePerClick * currentClickRate), 5),
						"#aaf"
					);

					if (getScene().m_rgStoredCrits.length > 0) {
						var rgDamage = getScene().m_rgStoredCrits.reduce(function(a, b) {
							return a + b;
						});
						getScene().m_rgStoredCrits.length = 0;

						getScene().DoCritEffect(rgDamage, enemy.m_Sprite.position.x - (enemy.m_nLane * 440), enemy.m_Sprite.position.y + 17, 'Crit!');
					}

					var goldPerClickPercentage = getScene().m_rgGameData.lanes[getScene().m_rgPlayerData.current_lane].active_player_ability_gold_per_click;
					if (goldPerClickPercentage > 0 && enemy.m_data.hp > 0) {
						var goldPerSecond = enemy.m_data.gold * goldPerClickPercentage * currentClickRate;
						getScene().ClientOverride('player_data', 'gold', getScene().m_rgPlayerData.gold + goldPerSecond);
						getScene().ApplyClientOverrides('player_data', true);
						log(
							"Raining gold ability is active in current lane. Percentage per click: " + goldPerClickPercentage + "%. Approximately gold per second: " + goldPerSecond,
							4
						);
						if (!removeGoldText) {
							displayText(
								enemy.m_Sprite.position.x - (enemy.m_nLane * 440),
								enemy.m_Sprite.position.y - 17,
								"+" + w.FormatNumberForDisplay(goldPerSecond, 5),
								"#e1b21e"
							);
						}
					}
				}
			}

			// Make sure to only include ticks that are relevant
			var level_jump = getGameLevel() - oldLevel;
			if (level_jump > 0) {
				// Iterate down the levelskipped memory
				for (var i = 4; i >= 0; i--) {
					levelsSkipped[i+1] = levelsSkipped[i];
				}
				levelsSkipped[0] = level_jump;

				oldLevel = getGameLevel();
			}
		}

		if(w.CUI && !replacedCUI) {
			replacedCUI = true;
			log("Anti nuke in effect", 1);
			w.CUI.prototype.UpdateLog = function( rgLaneLog )
			{
				var abilities = this.m_Game.m_rgTuningData.abilities;

				if( !this.m_Game.m_rgPlayerTechTree ) {
					return;
				}

				var nHighestTime = 0;

				for( var i=rgLaneLog.length-1; i >= 0; i--) {
					var rgEntry = rgLaneLog[i];

					// If we got a bad time for some reason, assume it's n+1 since we'll be ahead of it by the next update anyway
					if( isNaN( rgEntry.time ) ) {
						rgEntry.time = this.m_nActionLogTime + 1;
					}

					if( rgEntry.time <= this.m_nActionLogTime ) {
						continue;
					}

					switch( rgEntry.type ) {
						case 'ability':
							var ele = this.m_eleUpdateLogTemplate.clone();
							if(useTrollTracker) {
								if(getGameLevel() % 100 === 0 && [10, 11, 12, 15, 20].indexOf(rgEntry.ability) > -1) {
									w.$J(ele).data('abilityid', rgEntry.ability );
									w.$J('.name', ele).text( rgEntry.actor_name );
									w.$J('.ability', ele).text( this.m_Game.m_rgTuningData.abilities[ rgEntry.ability ].name + " on level " + getGameLevel());
									w.$J('img', ele).attr( 'src', w.g_rgIconMap['ability_' + rgEntry.ability].icon );
	
									w.$J(ele).v_tooltip({tooltipClass: 'ta_tooltip', location: 'top'});
	
									this.m_eleUpdateLogContainer[0].insertBefore(ele[0], this.m_eleUpdateLogContainer[0].firstChild);
									log(rgEntry.actor_name + " used " + this.m_Game.m_rgTuningData.abilities[ rgEntry.ability ].name + " on level " + getGameLevel(), 1);
									w.$J('.name', ele).attr( "style", "color: red; font-weight: bold;" );
								} else if(getGameLevel() % 100 !== 0 && getGameLevel() % 10 > 3 && rgEntry.ability === 26) {
									w.$J(ele).data('abilityid', rgEntry.ability );
									w.$J('.name', ele).text( rgEntry.actor_name );
									w.$J('.ability', ele).text( this.m_Game.m_rgTuningData.abilities[ rgEntry.ability ].name + " on level " + getGameLevel());
									w.$J('img', ele).attr( 'src', w.g_rgIconMap['ability_' + rgEntry.ability].icon );
									w.$J('.name', ele).attr( "style", "color: yellow" );
	
									w.$J(ele).v_tooltip({tooltipClass: 'ta_tooltip', location: 'top'});
	
									this.m_eleUpdateLogContainer[0].insertBefore(ele[0], this.m_eleUpdateLogContainer[0].firstChild);
								}
							} else {
								w.$J(ele).data('abilityid', rgEntry.ability );
								w.$J('.name', ele).text( rgEntry.actor_name );
								w.$J('.ability', ele).text( this.m_Game.m_rgTuningData.abilities[ rgEntry.ability ].name + " on level " + getGameLevel());
								w.$J('img', ele).attr( 'src', w.g_rgIconMap['ability_' + rgEntry.ability].icon );

								w.$J(ele).v_tooltip({tooltipClass: 'ta_tooltip', location: 'top'});

								this.m_eleUpdateLogContainer[0].insertBefore(ele[0], this.m_eleUpdateLogContainer[0].firstChild);
							}
							break;

						default:
							console.log("Unknown action log type: %s", rgEntry.type);
							console.log(rgEntry);
					}

					if( rgEntry.time > nHighestTime ) {
						nHighestTime = rgEntry.time;
					}
				}

				if( nHighestTime > this.m_nActionLogTime ) {
					this.m_nActionLogTime = nHighestTime;
				}

				// Prune older entries
				var e = this.m_eleUpdateLogContainer[0];
				while(e.children.length > 20 )
				{
					e.children[e.children.length-1].remove();
				}
			};
			if(this.m_eleUpdateLogContainer) {
				this.m_eleUpdateLogContainer[0].innerHTML = "";
			}
		}
	}
	
	function useOffensiveAbilities() {
		usePumpedUp_ReflectDamage_StealHealth();
		useCrippleMonsterIfRelevant();
		useCrippleSpawnerIfRelevant();
		useFeelingLuckyIfRelevant();
		useNapalmIfRelevant();
		useClusterBombIfRelevant();
		useGoodLuckCharmIfRelevant();
		useTacticalNukeIfRelevant();
		useMaxElementalDmgIfRelevant();
		useMoraleBoosterIfRelevant();
	}
	
	var LIKE_NEW_COUNTDOWN_TIMER = 15;
	var likeNewCountdown = 15;
	function useOtherAbilities() {
		useCooldownIfRelevant();		
		useGoldRainIfRelevant();
		useMetalDetectorOrTreasureIfRelevant();
		useFeelingLuckyIfRelevant();
		useMedics();
		useGodMode();
		
		if (likeNewCountdown > 0)
			likeNewCountdown = likeNewCountdown - 1;

		if ( getAbilityItemCount(ABILITIES.LIKE_NEW) > getAbilityItemCount(ABILITIES.WORMHOLE) )  {
			if (likeNewCountdown <= 0) {
				likeNewCountdown = LIKE_NEW_COUNTDOWN_TIMER;
				triggerAbility(ABILITIES.LIKE_NEW);
			}
		}

		//tryUsingAbility(ABILITIES.RESSURECTION);
	}
	
	function refreshPlayerData() {
		log("Refreshing player data", 2);

		var resultHandler = function (rgResult) {
			var instance = getScene();

			if (rgResult.response.player_data) {
				instance.m_rgPlayerData = rgResult.response.player_data;
				instance.ApplyClientOverrides('player_data');
				instance.ApplyClientOverrides('ability');
			}

			if (rgResult.response.tech_tree) {
				instance.m_rgPlayerTechTree = rgResult.response.tech_tree;
				if (rgResult.response.tech_tree.upgrades) {
					instance.m_rgPlayerUpgrades = w.V_ToArray(rgResult.response.tech_tree.upgrades);
				} else {
					instance.m_rgPlayerUpgrades = [];
				}
			}

			instance.OnReceiveUpdate();
		};

		w.g_Server.GetPlayerData(resultHandler, function () { }, true);
	}

	function makeDropdown(name, desc, value, values, listener) {
		var label = document.createElement("label");
		var description = document.createTextNode(desc);
		var drop = document.createElement("select");

		for(var k in values) {
			var choice = document.createElement("option");
			choice.value = values[k];
			choice.textContent = k;
			if(values[k] == value) {
				choice.selected = true;
			}
			drop.appendChild(choice);
		}

		drop.name = name;
		drop.style.marginRight = "5px";
		drop.onchange = listener;

		label.appendChild(drop);
		label.appendChild(description);
		label.appendChild(document.createElement("br"));
		return label;
	}

	function makeNumber(name, desc, width, value, min, max, listener) {
		var label = document.createElement("label");
		var description = document.createTextNode(desc);
		var number = document.createElement("input");

		number.type = "number";
		number.name = name;
		number.style.width = width;
		number.style.marginRight = "5px";
		number.value = value;
		number.min = min;
		number.max = max;
		number.onchange = listener;
		w[number.name] = number;

		label.appendChild(number);
		label.appendChild(description);
		label.appendChild(document.createElement("br"));
		return label;
	}

	function makeCheckBox(name, desc, state, listener, reqRefresh) {
		var asterisk = document.createElement('span');
		asterisk.appendChild(document.createTextNode("*"));
		asterisk.style.color = "#FF5252";
		asterisk.style.fontSize = "22px";
		asterisk.style.lineHeight = "14px";
		asterisk.style.verticalAlign = "bottom";

		var label = document.createElement("label");
		var description = document.createTextNode(desc);
		var checkbox = document.createElement("input");

		checkbox.type = "checkbox";
		checkbox.name = name;
		checkbox.checked = state;
		checkbox.onclick = listener;
		w[checkbox.name] = checkbox.checked;

		label.appendChild(checkbox);
		label.appendChild(description);
		if (reqRefresh) {
			label.appendChild(asterisk);
		}
		label.appendChild(document.createElement("br"));
		return label;
	}

	function handleEvent(event) {
		handleCheckBox(event);
	}

	function autoRefreshPage(autoRefreshMinutes) {
		var timerValue = (autoRefreshMinutes + autoRefreshMinutesRandomDelay * Math.random()) * 60 * 1000;
		refreshTimer = setTimeout(function() {
			autoRefreshHandler();
		}, timerValue);
	}

	function autoRefreshHandler() {
		var enemyData = getScene().GetEnemy(getScene().m_rgPlayerData.current_lane, getScene().m_rgPlayerData.target).m_data;
		if (typeof enemyData !== "undefined") {
			var enemyType = enemyData.type;
			if (enemyType != ENEMY_TYPE.BOSS) {
				log('Refreshing, not boss', 5);
				w.location.reload(true);
			} else {
				log('Not refreshing, A boss!', 5);
				setTimeout(autoRefreshHandler, 3000);
			}
		} else {
			//Wait until it is defined
			setTimeout(autoRefreshHandler, 1000);
		}
	}

	function handleCheckBox(event) {
		var checkbox = event.target;
		setPreference(checkbox.name, checkbox.checked);

		w[checkbox.name] = checkbox.checked;
		return checkbox.checked;
	}

	function handleDropdown(event) {
		var dropdown = event.target;
		setPreference(dropdown.name, dropdown.value);

		w[dropdown.name] = dropdown.value;
		return dropdown.value;
	}

	function togglePraise(event) {
		if (event !== undefined) {
			praiseGoldHelm = handleCheckBox(event);
		}
		fixActiveCapacityUI();
	}

	function changePraiseImage(event) {
		if (event !== undefined) {
			goldHelmUI = handleDropdown(event);
		}
		fixActiveCapacityUI();
	}

	function toggleAutoClicker(event) {
		var value = enableAutoClicker;
		if (event !== undefined) {
			value = handleCheckBox(event);
		}
		enableAutoClicker = value;
		log('Autoclicker is ' + enableAutoClicker, 1);
	}

	function toggleAutoRefresh(event) {
		var value = enableAutoRefresh;
		if (event !== undefined) {
			value = handleCheckBox(event);
		}
		if (value) {
			autoRefreshPage(autoRefreshMinutes);
		} else {
			clearTimeout(refreshTimer);
		}
	}

	function toggleRenderer(event) {
		var value = disableRenderer;

		if (event !== undefined) {
			value = disableRenderer = handleCheckBox(event);
		}

		var ticker = w.PIXI.ticker.shared;

		if (!value) {
			ticker.autoStart = true;
			ticker.start();

			w.g_Minigame.Render = trt_oldRender;
			w.g_Minigame.Render();
		} else {
			ticker.autoStart = false;
			ticker.stop();

			w.g_Minigame.Render = function() {};
		}
	}

	function toggleCritText(event) {
		var value = removeCritText;
		if (event !== undefined) {
			value = handleCheckBox(event);
		}
		if (value) {
			// Replaces the entire crit display function.
			getScene().DoCritEffect = function(nDamage, x, y, additionalText) {};
		} else {
			getScene().DoCritEffect = trt_oldCrit;
		}
	}

	function toggleAllText(event) {
		var value = removeAllText;
		if (event !== undefined) {
			value = handleCheckBox(event);
		}
		if (value) {
			// Replaces the entire text function.
			getScene().m_rgClickNumbers.push = function(elem) {
				elem.container.removeChild(elem);
			};
		} else {
			getScene().m_rgClickNumbers.push = trt_oldPush;
		}
	}

	function getWantedClicksPerSecond() {
		var level = getGameLevel();
		if (!enableAutoClicker) {
			return 0;
		}
		if (level % control.rainingRounds === 0) {
			if (hasItem(ABILITIES.WORMHOLE)) {
				return 0;
			} else {
				return Math.floor(clickRate/2);
			}
		}
		if (level % control.rainingRounds > control.rainingRounds - control.rainingSafeRounds) {
			return Math.floor(clickRate/10);
		} else if (level % control.rainingRounds > control.rainingRounds - control.rainingSafeRounds*2) {
			return Math.floor(clickRate/5);
		}
		return clickRate;
	}

	function getLevelsSkipped() {
		var total = 0;
		for (var i = 3; i >= 0; i--) {
			levelsSkipped[i+1] = levelsSkipped[i];
			total += levelsSkipped[i];
		}
		total += levelsSkipped[0];
		return total;
	}

	function updateLogLevel(event) {
		if (event !== undefined) {
			g_logLevel = event.target.value;
		}
	}

	var LOCAL_STORAGE_NS = "steamdb-minigame";
	
	function setPreference(key, value) {
		try {
			if (w.localStorage !== 'undefined') {
				w.localStorage.setItem(LOCAL_STORAGE_NS + "/" + key, value);
			}
		} catch (e) {
			console.log(e); // silently ignore error
		}
	}

	function getPreference(key, defaultValue) {
		try {
			if (w.localStorage !== 'undefined') {
				var result = w.localStorage.getItem(LOCAL_STORAGE_NS + "/" + key);
				return (result !== null ? result : defaultValue);
			}
		} catch (e) {
			console.log(e); // silently ignore error
			return defaultValue;
		}
	}

	function getPreferenceBoolean(key, defaultValue) {
		return (getPreference(key, defaultValue.toString()) == "true");
	}

	function lockElements() {
		var elementMultipliers = [
		getScene().m_rgPlayerTechTree.damage_multiplier_fire,
		getScene().m_rgPlayerTechTree.damage_multiplier_water,
		getScene().m_rgPlayerTechTree.damage_multiplier_air,
		getScene().m_rgPlayerTechTree.damage_multiplier_earth
		];

		var hashCode=function(str) {
			var t=0, i, char;
			if (0 === str.length) {
				return t;
			}

			for (i=0; i<str.length; i++) {
				char=str.charCodeAt(i);
				t=(t<<5)-t+char;
				t&=t;
			}

			return t;
		};

		var elem = Math.abs(hashCode(w.g_steamID) % 4);

		// If more than two elements are leveled to 3 or higher, do not enable lock
		var leveled = 0;
		var lastLeveled = -1;

		for (var i=0; i < elementMultipliers.length; i++){
			log("Element " + i + " is at level " + (elementMultipliers[i]-1)/1.5, 3);
			if ((elementMultipliers[i]-1)/1.5 >= 3) {
				leveled++;
				// Only used if there is only one so overwriting it doesn't matter
				lastLeveled = i;
			}
		}

		if (leveled >= 2) {
			log("More than 2 elementals leveled to 3 or above, not locking.", 1);
			return;
		} else if (leveled == 1) {
			log("Found existing lock on " + lastLeveled + ", locking to it.", 1);
			lockToElement(lastLeveled);
		} else {
			log("Locking to element " + elem + " as chosen by SteamID", 1);
			lockToElement(elem);
		}
	}

	function lockToElement(element) {
		var fire = document.querySelector("a.link.element_upgrade_btn[data-type=\"3\"]");
		var water = document.querySelector("a.link.element_upgrade_btn[data-type=\"4\"]");
		var air = document.querySelector("a.link.element_upgrade_btn[data-type=\"5\"]");
		var earth = document.querySelector("a.link.element_upgrade_btn[data-type=\"6\"]");

		var elems = [fire, water, air, earth];

		for (var i=0; i < elems.length; i++) {
			if (i === element) {
				continue;
			}
			elems[i].style.visibility = "hidden";
		}
		lockedElement = element; // Save locked element.
	}

	function displayText(x, y, strText, color) {
		var text = new w.PIXI.Text(strText, {
			font: "35px 'Press Start 2P'",
			fill: color,
			stroke: '#000',
			strokeThickness: 2
		});

		text.x = x;
		text.y = y;

		getScene().m_containerUI.addChild(text);
		text.container = getScene().m_containerUI;

		var e = new w.CEasingSinOut(text.y, -200, 1000);
		e.parent = text;
		text.m_easeY = e;

		e = new w.CEasingSinOut(2, -2, 1000);
		e.parent = text;
		text.m_easeAlpha = e;

		getScene().m_rgClickNumbers.push(text);
	}

	function updatePlayersInGame() {
		var totalPlayers = getScene().m_rgLaneData[0].players +
			getScene().m_rgLaneData[1].players +
			getScene().m_rgLaneData[2].players;
		document.getElementById("players_in_game").innerHTML = totalPlayers + "/1500";
	}

	function goToRainingLane() {
		// On a WH level, jump everyone to lane 0, unless there is a boss there, in which case jump to lane 1.
		var targetLane = 0;
		
		// Check lane 0, enemy 0 to see if it's a boss.
		var enemyData = getScene().GetEnemy(0, 0).m_data;
		
		if (typeof enemyData !== "undefined") {
			var enemyType = enemyData.type;
			
			if (enemyType == ENEMY_TYPE.BOSS) {
				log('In lane 0, there is a boss, avoiding', 4);
				targetLane = 1;
			}
		}

		if (getScene().m_nExpectedLane != targetLane) {
			log('Switching to raining lane' + targetLane, 3);
			getScene().TryChangeLane(targetLane);
		}
	}
	
	function goToLaneWithBestTarget() {
		// We can overlook spawners if all spawners are 40% hp or higher and a creep is under 10% hp
		var spawnerOKThreshold = 0.4;
		var creepSnagThreshold = 0.1;

		var targetFound = false;
		var lowHP = 0;
		var lowLane = 0;
		var lowTarget = 0;
		var lowPercentageHP = 0;
		var preferredLane = -1;
		var preferredTarget = -1;

		// determine which lane and enemy is the optimal target
		var enemyTypePriority = [
			ENEMY_TYPE.TREASURE,
			ENEMY_TYPE.BOSS,
			ENEMY_TYPE.MINIBOSS,
			ENEMY_TYPE.SPAWNER,
			ENEMY_TYPE.CREEP
		];

		var i;
		var skippingSpawner = false;
		var skippedSpawnerLane = 0;
		var skippedSpawnerTarget = 0;
		var targetIsTreasure = false;
		var targetIsBoss = false;

		for (var k = 0; !targetFound && k < enemyTypePriority.length; k++) {
			targetIsTreasure = (enemyTypePriority[k] == ENEMY_TYPE.TREASURE);
			targetIsBoss = (enemyTypePriority[k] == ENEMY_TYPE.BOSS);

			var enemies = [];

			// gather all the enemies of the specified type.
			for (i = 0; i < 3; i++) {
				for (var j = 0; j < 4; j++) {
					var enemy = getScene().GetEnemy(i, j);
					if (enemy && enemy.m_data.type == enemyTypePriority[k]) {
						enemies[enemies.length] = enemy;
					}
				}
			}

			//Prefer lane with raining gold, unless current enemy target is a treasure or boss.
			if (!targetIsTreasure && !targetIsBoss) {
				var potential = 0;
				// Loop through lanes by elemental preference
				var sortedLanes = sortLanesByElementals();
				for (var notI = 0; notI < sortedLanes.length; notI++) {
					// Maximize compability with upstream
					i = sortedLanes[notI];
					// ignore if lane is empty
					if (getScene().m_rgGameData.lanes[i].dps === 0) {
						continue;
					}
					var stacks = 0;
					if (typeof getScene().m_rgLaneData[i].abilities[17] != 'undefined') {
						stacks = getScene().m_rgLaneData[i].abilities[17];
						log('stacks: ' + stacks, 3);
					}
					for (var m = 0; m < getScene().m_rgEnemies.length; m++) {
						var enemyGold = getScene().m_rgEnemies[m].m_data.gold;
						if (stacks * enemyGold > potential) {
							potential = stacks * enemyGold;
							preferredTarget = getScene().m_rgEnemies[m].m_nID;
							preferredLane = i;
						}
					}
				}
			}

			// target the enemy of the specified type with the lowest hp
			var mostHPDone = 0;
			for (i = 0; i < enemies.length; i++) {
				if (enemies[i] && !enemies[i].m_bIsDestroyed) {
					// Only select enemy and lane if the preferedLane matches the potential enemy lane
					if (lowHP < 1 || enemies[i].m_flDisplayedHP < lowHP) {
						var element = getScene().m_rgGameData.lanes[enemies[i].m_nLane].element;

						var dmg = getScene().CalculateDamage(
							getScene().m_rgPlayerTechTree.dps,
							element
						);
						if (mostHPDone <= dmg) {
							mostHPDone = dmg;
						} else {
							continue;
						}

						targetFound = true;
						lowHP = enemies[i].m_flDisplayedHP;
						lowLane = enemies[i].m_nLane;
						lowTarget = enemies[i].m_nID;
					}
					var percentageHP = enemies[i].m_flDisplayedHP / enemies[i].m_data.max_hp;
					if (lowPercentageHP === 0 || percentageHP < lowPercentageHP) {
						lowPercentageHP = percentageHP;
					}
				}
			}

			if (preferredLane != -1 && preferredTarget != -1) {
				lowLane = preferredLane;
				lowTarget = preferredTarget;
				log('Switching to a lane with best raining gold benefit', 2);
			}

			// If we just finished looking at spawners,
			// AND none of them were below our threshold,
			// remember them and look for low creeps (so don't quit now)
			// Don't skip spawner if lane has raining gold
			if ((enemyTypePriority[k] == ENEMY_TYPE.SPAWNER && lowPercentageHP > spawnerOKThreshold) && preferredLane == -1) {
				skippedSpawnerLane = lowLane;
				skippedSpawnerTarget = lowTarget;
				skippingSpawner = true;
				targetFound = false;
			}

			// If we skipped a spawner and just finished looking at creeps,
			// AND the lowest was above our snag threshold,
			// just go back to the spawner!
			if (skippingSpawner && enemyTypePriority[k] == ENEMY_TYPE.CREEP && lowPercentageHP > creepSnagThreshold) {
				lowLane = skippedSpawnerLane;
				lowTarget = skippedSpawnerTarget;
			}
		}


		// go to the chosen lane
		if (targetFound) {
			if (getScene().m_nExpectedLane != lowLane) {
				log('Switching to lane' + lowLane, 3);
				getScene().TryChangeLane(lowLane);
			}

			// target the chosen enemy
			if (getScene().m_nTarget != lowTarget) {
				log('Switching targets', 3);
				getScene().TryChangeTarget(lowTarget);
			}

			// Prevent attack abilities and items if up against a boss or treasure minion
			var level = getGameLevel();
			if (targetIsTreasure || (targetIsBoss && (level < control.speedThreshold || level % control.rainingRounds === 0))) {
				BOSS_DISABLED_ABILITIES.forEach(disableAbility);
			} else {
				BOSS_DISABLED_ABILITIES.forEach(enableAbility);
			}
			if (level < control.allowWormholeLevel && !isNearEndGame()) {
				//disableAbility(ABILITIES.WORMHOLE);
			} else {
				enableAbility(ABILITIES.WORMHOLE);
			}
		}
	}

	function useCooldownIfRelevant() {
		if (getActiveAbilityLaneCount(ABILITIES.DECREASE_COOLDOWNS) > 0) {
			disableAbility(ABILITIES.DECREASE_COOLDOWNS);
			return;
		}

		if (!isAbilityActive(ABILITIES.DECREASE_COOLDOWNS)) {
			enableAbility(ABILITIES.DECREASE_COOLDOWNS);
		}

		tryUsingAbility(ABILITIES.DECREASE_COOLDOWNS);
	}

	function useMedics() {
		// check if Medics is purchased and cooled down
		if (tryUsingAbility(ABILITIES.MEDICS)) {
			log('Medics is purchased, cooled down. Trigger it.', 2);
		}
	}
	
	function useGodMode() {
		if (tryUsingItem(ABILITIES.GOD_MODE)) {
			log('We have god mode, cooled down. Trigger it.', 2);
		}
	}
	
	function usePumpedUp_ReflectDamage_StealHealth() {
		tryUsingItem(ABILITIES.PUMPED_UP) 
		|| tryUsingItem(ABILITIES.REFLECT_DAMAGE)
		|| tryUsingItem(ABILITIES.STEAL_HEALTH)
	}

	function useFeelingLuckyIfRelevant() {
		triggerAbility(ABILITIES.FEELING_LUCKY);
	}
	
	// Use Good Luck Charm if doable
	function useGoodLuckCharmIfRelevant() {

		// check if Crits is purchased and cooled down
		if (tryUsingItem(ABILITIES.CRIT)) {
			// Crits is purchased, cooled down, and needed. Trigger it.
			log('Crit chance is always good.', 3);
		}

		// check if Good Luck Charms is purchased and cooled down
		if (tryUsingAbility(ABILITIES.GOOD_LUCK_CHARMS)) {
			log('Good Luck Charms is purchased, cooled down, and needed. Trigger it.', 2);
		}
	}

	function useClusterBombIfRelevant() {
		//Check if Cluster Bomb is purchased and cooled down		
		if (!canUseAbility(ABILITIES.CLUSTER_BOMB) || !canUseOffensiveAbility()) {
			return;
		}

		//Check lane has monsters to explode
		var currentLane = getScene().m_nExpectedLane;
		var enemyCount = 0;
		var enemySpawnerExists = false;
		var level = getGameLevel();
		//Count each slot in lane
		for (var i = 0; i < 4; i++) {
			var enemy = getScene().GetEnemy(currentLane, i);
			if (enemy) {
				enemyCount++;
				if (enemy.m_data.type === 0 || (level > control.speedThreshold && level % control.rainingRounds !== 0 && level % 10 === 0)) {
					enemySpawnerExists = true;
				}
			}
		}
		
		if (enemyCount >= 1)
			triggerAbility(ABILITIES.CLUSTER_BOMB);
			
		//Bombs away if spawner and 2+ other monsters
		//if (enemySpawnerExists && enemyCount >= 3) {
		//	triggerAbility(ABILITIES.CLUSTER_BOMB);
		//}
	}

	function useNapalmIfRelevant() {
		//Check if Napalm is purchased and cooled down
		if (!canUseAbility(ABILITIES.NAPALM) || !canUseOffensiveAbility() || Math.random() > control.useAbilityChance) {
			return;
		}

		//Check lane has monsters to burn
		var currentLane = getScene().m_nExpectedLane;
		var enemyCount = 0;
		var enemySpawnerExists = false;
		var level = getGameLevel();

		// Prevent this outright if its within control.rainingSafeRounds of the next rainingRound
		if (level % control.rainingRounds > control.rainingRounds - control.rainingSafeRounds) {
			return;
		}

		//Count each slot in lane
		for (var i = 0; i < 4; i++) {
			var enemy = getScene().GetEnemy(currentLane, i);
			if (enemy) {
				enemyCount++;
				if (enemy.m_data.type === 0 || (level > control.speedThreshold && level % control.rainingRounds !== 0 && level % 10 === 0)) {
					enemySpawnerExists = true;
				}
			}
		}

		//Burn them all if spawner and 2+ other monsters
		if (enemySpawnerExists && enemyCount >= 3) {
			triggerAbility(ABILITIES.NAPALM);
		}
	}

	// Use Moral Booster if doable
	function useMoraleBoosterIfRelevant() {
		// check if Good Luck Charms is purchased and cooled down
		if (!canUseAbility(ABILITIES.MORALE_BOOSTER)) {
			return;
		}
		var numberOfWorthwhileEnemies = 0;
		for (var i = 0; i < getScene().m_rgGameData.lanes[getScene().m_nExpectedLane].enemies.length; i++) {
			//Worthwhile enemy is when an enamy has a current hp value of at least 1,000,000
			if (getScene().m_rgGameData.lanes[getScene().m_nExpectedLane].enemies[i].hp > 1000000) {
				numberOfWorthwhileEnemies++;
			}
		}
		if (numberOfWorthwhileEnemies >= 2) {
			// Morale Booster is purchased, cooled down, and needed. Trigger it.
			log('Morale Booster is purchased, cooled down, and needed. Trigger it.', 2);
			triggerAbility(ABILITIES.MORALE_BOOSTER);
		}
	}

	function useTacticalNukeIfRelevant() {
		// Check if Tactical Nuke is purchased
		if (!canUseAbility(ABILITIES.TACTICAL_NUKE) || !canUseOffensiveAbility()) {
			return;
		}

		//Check that the lane has a spawner and record it's health percentage
		var currentLane = getScene().m_nExpectedLane;
		var enemySpawnerExists = false;
		var enemySpawnerHealthPercent = 0.0;
		var level = getGameLevel();
		//Count each slot in lane
		for (var i = 0; i < 4; i++) {
			var enemy = getScene().GetEnemy(currentLane, i);
			if (enemy) {
				if (enemy.m_data.type === 0 || (level > control.speedThreshold && level % control.rainingRounds !== 0 && level % 10 === 0)) {
					enemySpawnerExists = true;
					enemySpawnerHealthPercent = enemy.m_flDisplayedHP / enemy.m_data.max_hp;
				}
			}
		}

		// If there is a spawner and it's health is between 60% and 30%, nuke it!
		if (enemySpawnerExists && enemySpawnerHealthPercent < 0.6 && enemySpawnerHealthPercent > 0.3) {
			log("Tactical Nuke is purchased, cooled down, and needed. Nuke 'em.", 2);
			triggerAbility(ABILITIES.TACTICAL_NUKE);
		}
	}

	function useCrippleMonsterIfRelevant() {
		if (areWeThereYet())
			return;

		triggerAbility(ABILITIES.CRIPPLE_MONSTER);
			
		return;
	}

	function useCrippleSpawnerIfRelevant() {
		// Check if Cripple Spawner is available
		if (!canUseItem(ABILITIES.CRIPPLE_SPAWNER)) {
			return;
		}

		//Check that the lane has a spawner and record it's health percentage
		var currentLane = getScene().m_nExpectedLane;
		var enemySpawnerExists = false;
		var enemySpawnerHealthPercent = 0.0;

		//Count each slot in lane
		for (var i = 0; i < 4; i++) {
			var enemy = getScene().GetEnemy(currentLane, i);
			if (enemy) {
				if (enemy.m_data.type === 0) {
					enemySpawnerExists = true;
					enemySpawnerHealthPercent = enemy.m_flDisplayedHP / enemy.m_data.max_hp;
				}
			}
		}

		// If there is a spawner and it's health is above 95%, cripple it!
		if (enemySpawnerExists && enemySpawnerHealthPercent > 0.60) {
			log("Cripple Spawner available, and needed. Cripple 'em.", 2);
			triggerItem(ABILITIES.CRIPPLE_SPAWNER);
		}
	}

	function useGoldRainIfRelevant() {
		// Check if gold rain is purchased
		if (!canUseItem(ABILITIES.RAINING_GOLD)) {
			return;
		}

		var enemy = getScene().GetEnemy(getScene().m_rgPlayerData.current_lane, getScene().m_rgPlayerData.target);
		
		// check if current target is a boss, otherwise its not worth using the gold rain
		//if (enemy && enemy.m_data.type == ENEMY_TYPE.BOSS) {
			//var enemyBossHealthPercent = enemy.m_flDisplayedHP / enemy.m_data.max_hp;

			//if (enemyBossHealthPercent >= 0.6) { // We want sufficient time for the gold rain to be applicable
				// Gold Rain is purchased, cooled down, and needed. Trigger it.
				//log('Gold rain is purchased and cooled down, Triggering it on boss', 2);
				triggerItem(ABILITIES.RAINING_GOLD);
			//}
		//}
	}

	function useMetalDetectorOrTreasureIfRelevant() {
		// get a few early game treasures; but then wait a while longer
		if ((getGameLevel() <= 30 || getGameLevel() >= 1000) && canUseItem(ABILITIES.TREASURE)) {
			triggerItem(ABILITIES.TREASURE);
		}
		
		// Check if metal detector or treasure is purchased
		if (canUseAbility(ABILITIES.METAL_DETECTOR) || canUseItem(ABILITIES.TREASURE)) {
			if (isAbilityActive(ABILITIES.METAL_DETECTOR)) {
				return;
			}

			if (canUseAbility(ABILITIES.METAL_DETECTOR)) {
				triggerAbility(ABILITIES.METAL_DETECTOR);
			} else if (canUseItem(ABILITIES.TREASURE)) {
				log('Treasure is available and cooled down, Triggering it on boss', 2);
				triggerItem(ABILITIES.TREASURE);
			}
		}
	}


	function useMaxElementalDmgIfRelevant() {
		// Check if Max Elemental Damage is purchased
		if (isAbilityActive(ABILITIES.MAX_ELEMENTAL_DAMAGE))
			return;

		if (areWeThereYet())
			return;
			
		if (tryUsingItem(ABILITIES.MAX_ELEMENTAL_DAMAGE, true)) {
			log('Max Elemental Damage is purchased and cooled down, triggering it.', 2);
		}
	}

	/*
	function useWormholeIfRelevant() {
		triggerAbility(ABILITIES.WORMHOLE);
	}

	function useLikeNewIfRelevant() {
		// Allow Like New use for next farm boss round.
		if (!hasItem(ABILITIES.LIKE_NEW)) {
			return;
		}

		var level = getGameLevel();
		//if (level % control.rainingRounds !== 0 && !canUseLikeNew) {
		//	canUseLikeNew = true;
		//	return;
		//}
		// Check if wormhole is on cooldown and roll the dice.

		//var cLobbyTime = (getCurrentTime() - getScene().m_rgGameData.timestamp_game_start) / 3600;
		//var likeNewChance = (control.useLikeNewMaxChance - control.useLikeNewMinChance) * cLobbyTime/24.0 + control.useLikeNewMinChance;

        if ((level % control.rainingRounds) == 0)
            if (Math.random() < 0.05)
                useLikeNew();
		//if (Math.random() > likeNewChance || level % control.rainingRounds !== 0) {
		//	return;
		//}
		// Start a timer between 1 and 5 seconds to try to use LikeNew.
		//var rand = Math.floor(Math.random() * control.useLikeNewMaxTime - control.useLikeNewMinTime + control.useLikeNewMinTime);
		//setTimeout(useLikeNew, 1);
		//log('Attempting to use Like New after ' + rand + 'ms.', 2);
		//canUseLikeNew = false;
	}

	function useLikeNew() {
		// Make sure that we're still in the boss round when we actually use it.
		var level = getGameLevel();
		if (level % control.rainingRounds === 0) {
			if (tryUsingItem(ABILITIES.LIKE_NEW)) {
				log('We can actually use Like New semi-reliably! Cooldowns-b-gone.', 2);
				//canUseLikeNew = true;
			}
		}
	}

	function useReviveIfRelevant(level) {
		if (level % 10 === 9 && Math.random() <= control.useAbilityChance && tryUsingItem(ABILITIES.RESURRECTION)) {
			// Resurrect is purchased and we are using it.
			log('Triggered Resurrect.');
		}
	}
	*/
	
	function attemptRespawn() {
		if ((getScene().m_bIsDead) &&
			((getScene().m_rgPlayerData.time_died) + 5) < (getScene().m_nTime)) {
			w.RespawnPlayer();
		}
	}

	function disableAbility(abilityId) {
		toggleAbilityVisibility(abilityId, false);
	}

	function enableAbility(abilityId) {
		toggleAbilityVisibility(abilityId, true);
	}

	function toggleAbilityVisibility(abilityId, show) {
		var vis = show === true ? "visible" : "hidden";

		var elem = document.getElementById('ability_' + abilityId);

		// temporary
		if(!elem) {
			elem = document.getElementById('abilityitem_' + abilityId);
		}

		if (elem && elem.childElements() && elem.childElements().length >= 1) {
			elem.childElements()[0].style.visibility = vis;
		}
	}

	function isAbilityActive(abilityId) {
		return getScene().bIsAbilityActive(abilityId);
	}

	function isAbilityEnabled(abilityId) {
		var elem = document.getElementById('ability_' + abilityId);
		if (elem && elem.childElements() && elem.childElements().length >= 1) {
			return elem.childElements()[0].style.visibility !== "hidden";
		}
		return false;
	}

	function canUseAbility(abilityId) {
		return hasPurchasedAbility(abilityId) && !isAbilityCoolingDown(abilityId) && isAbilityEnabled(abilityId);
	}

	function canUseOffensiveAbility() {
		return !(areWeThereYet());
	}

	function tryUsingAbility(abilityId) {
		if (!canUseAbility(abilityId)) {
			return false;
		}

		triggerAbility(abilityId);
		return true;
	}

	function triggerAbilityImmediate(abilityId) {
		g_Server.UseAbilities( $J.noop, $J.noop, 
			{ requested_abilities: [ { ability: abilityId } ] }
		);
	}
	
	//function triggerAbilityImmediate() {
	//	g_Server.UseAbilities( $J.noop, $J.noop, 
	//		{ requested_abilities: [ { ability: ABILITIES.WORMHOLE } ] }
	//	);
	//}
	
	//function triggerWormholeLikeNewQueued() {
	//	triggerWormholeLikeNewImmediate();
	//	
	//	getScene().m_rgAbilityQueue.push({ 'ability': ABILITIES.LIKE_NEW });
	//	getScene().m_rgAbilityQueue.push({ 'ability': ABILITIES.WORMHOLE });
	//}
	
	
	function triggerWormholeOrLikeNew(abilityId) { 
		if (areWeThereYetAreWeThereYet()) { 
			getScene().m_rgAbilityQueue.push( { 'ability': abilityId } ); 
		}
	}
	
	function triggerAbility(abilityId) {
		if (abilityId == ABILITIES.WORMHOLE || abilityId == ABILITIES.LIKE_NEW)
			triggerWormholeOrLikeNew(abilityId)
		else 
			getScene().m_rgAbilityQueue.push({ 'ability': abilityId });
	}

	
	function triggerAbility(abilityId) {
		// Queue the ability directly. No need for any DOM searching.
		getScene().m_rgAbilityQueue.push({
			'ability': abilityId
		});
	}

	function isAbilityCoolingDown(abilityId) {
		return getScene().GetCooldownForAbility(abilityId) > 0;
	}

	function hasPurchasedAbility(abilityId) {
		// each bit in unlocked_abilities_bitfield corresponds to an ability.
		// the above condition checks if the ability's bit is set or cleared. I.e. it checks if
		// the player has purchased the specified ability.
		return (1 << abilityId) & getScene().m_rgPlayerTechTree.unlocked_abilities_bitfield;
	}

	function toggleAbilityItemVisibility(abilityId, show) {
		var elem = document.getElementById('abilityitem_' + abilityId);
		if (elem && elem.childElements() && elem.childElements().length >= 1) {
			elem.childElements()[0].style.visibility = show === true ? "visible" : "hidden";
		}
	}

	function disableAbilityItem(abilityId) {
		toggleAbilityItemVisibility(abilityId, false);
	}

	function enableAbilityItem(abilityId) {
		toggleAbilityItemVisibility(abilityId, true);
	}

	function canUseItem(itemId) {
		return hasItem(itemId) && !isAbilityCoolingDown(itemId) && isAbilityItemEnabled(itemId);
	}

	function hasItem(itemId) {
		for (var i = 0; i < getScene().m_rgPlayerTechTree.ability_items.length; ++i) {
			var abilityItem = getScene().m_rgPlayerTechTree.ability_items[i];
			if (abilityItem.ability == itemId) {
				return true;
			}
		}
		return false;
	}

	function tryUsingItem(itemId, checkInLane) {
		if (!canUseItem(itemId)) {
			return false;
		}
		if (checkInLane && getActiveAbilityLaneCount(itemId) > 0) {
			return false;
		}
		triggerItem(itemId);
		return true;
	}

	function triggerItem(itemId) {
		var elem = document.getElementById('abilityitem_' + itemId);
		if (elem && elem.childElements() && elem.childElements().length >= 1) {
			getScene().TryAbility(document.getElementById('abilityitem_' + itemId).childElements()[0]);
		}
	}

	function sortLanesByElementals() {
		var elementPriorities = [
			getScene().m_rgPlayerTechTree.damage_multiplier_fire,
			getScene().m_rgPlayerTechTree.damage_multiplier_water,
			getScene().m_rgPlayerTechTree.damage_multiplier_air,
			getScene().m_rgPlayerTechTree.damage_multiplier_earth
		];

		var lanes = getScene().m_rgGameData.lanes;
		var lanePointers = [];

		for (var i = 0; i < lanes.length; i++) {
			lanePointers[i] = i;
		}

		lanePointers.sort(function(a, b) {
			return elementPriorities[lanes[b].element - 1] - elementPriorities[lanes[a].element - 1];
		});

		log("Lane IDs  : " + lanePointers[0] + " " + lanePointers[1] + " " + lanePointers[2], 4);
		log("Elements  : " + lanes[lanePointers[0]].element + " " + lanes[lanePointers[1]].element + " " + lanes[lanePointers[2]].element, 4);

		return lanePointers;
	}

	function getCurrentTime() {
		return getScene().m_rgGameData.timestamp;
	}

	function getActiveAbilityLaneCount(ability) {
		var now = getCurrentTime();
		var abilities = getScene().m_rgGameData.lanes[getScene().m_rgPlayerData.current_lane].active_player_abilities;
		var count = 0;
		for (var i = 0; i < abilities.length; i++) {
			if (abilities[i].ability != ability || abilities[i].timestamp_done < now) {
				continue;
			}
			count++;
		}
		return count;
	}

	function isAbilityItemEnabled(abilityId) {
		var elem = document.getElementById('abilityitem_' + abilityId);
		if (elem && elem.childElements() && elem.childElements().length >= 1) {
			return elem.childElements()[0].style.visibility !== "hidden";
		}
		return false;
	}

	function fatal_error(message) { log(message, 0); }
	function log(message, level) {
		if (level <= g_logLevel) 
			console.log(message);

		if ((g_logLevel == 0) && THROW_ON_ERROR)
			throw (new Error(message));
	}

	if (w.SteamDB_Minigame_Timer) {
		w.clearInterval(w.SteamDB_Minigame_Timer);
	}

	w.SteamDB_Minigame_Timer = w.setInterval(function() {
		if (w.g_Minigame && getScene().m_bRunning && getScene().m_rgPlayerTechTree && getScene().m_rgGameData) {
			w.clearInterval(w.SteamDB_Minigame_Timer);
			firstRun();
			w.SteamDB_Minigame_Timer = w.setInterval( MainLoop, 1000 );
		}
	}, 1000);

	// reload page if game isn't fully loaded, regardless of autoRefresh setting
	w.setTimeout(function() {
		// m_rgGameData is 'undefined' if stuck at 97/97 or below
		if (!w.g_Minigame || !w.g_Minigame.m_CurrentScene || !w.g_Minigame.m_CurrentScene.m_rgGameData) {
			w.location.reload(true);
		}
	}, autoRefreshSecondsCheckLoadedDelay * 1000);

	// Append gameid to breadcrumbs
	var breadcrumbs = document.querySelector('.breadcrumbs');

	function countdown(time) {
		var hours = 0;
		var minutes = 0;
		for (var i = 0; i < 24; i++) {
			if (time >= 3600) {
				time = time - 3600;
				hours = hours + 1;
			}
		}
		for (var j = 0; j < 60; j++) {
			if (time >= 60) {
				time = time - 60;
				minutes = minutes + 1;
			}
		}
		return {hours : hours, minutes : minutes};
	}

	function expectedLevel(level) {
		var time = Math.floor(getScene().m_nTime) % 86400;
		time = time - 16*3600;
		if (time < 0) {
			time = time + 86400;
		}

		var remaining_time = 86400 - time;
		var passed_time = getCurrentTime() - getScene().m_rgGameData.timestamp_game_start;
		var expected_level = Math.floor(((level/passed_time)*remaining_time)+level);
		var likely_level = Math.floor((expected_level - level)/Math.log(3))+ level;

		return {expected_level : expected_level, likely_level : likely_level, remaining_time : remaining_time};
	}

	if (breadcrumbs) {
		var element = document.createElement('span');
		element.textContent = ' > ';
		breadcrumbs.appendChild(element);

		element = document.createElement('span');
		element.style.color = '#D4E157';
		element.style.textShadow = '1px 1px 0px rgba( 0, 0, 0, 0.3 )';
		element.textContent = 'Room ' + w.g_GameID;
		breadcrumbs.appendChild(element);

		element = document.createElement('span');
		element.textContent = ' > ';
		breadcrumbs.appendChild(element);

		element = document.createElement('span');
		element.style.color = '#FFA07A';
		element.style.textShadow = '1px 1px 0px rgba( 0, 0, 0, 0.3 )';
		element.textContent = 'Level: 0, Expected Level: 0, Likely Level: 0';
		breadcrumbs.appendChild(element);
		document.ExpectedLevel = element;

		element = document.createElement('span');
		element.textContent = ' > ';
		breadcrumbs.appendChild(element);

		element = document.createElement('span');
		element.style.color = '#9AC0FF';
		element.style.textShadow = '1px 1px 0px rgba( 0, 0, 0, 0.3 )';
		element.textContent = 'Remaining Time: 0 hours, 0 minutes.';
		breadcrumbs.appendChild(element);
		document.RemainingTime = element;

		element = document.createElement('span');
		element.textContent = ' > ';
		breadcrumbs.appendChild(element);

		element = document.createElement('span');
		element.style.color = '#33FF33';
		element.style.textShadow = '1px 1px 0px rgba( 0, 0, 0, 0.3 )';
		element.textContent = 'Skipped 0 levels in last 5s.';
		breadcrumbs.appendChild(element);
		document.LevelsSkip = element;
	}

	function updateLevelInfoTitle(level)
	{
		var exp_lvl = expectedLevel(level);
		var rem_time = countdown(exp_lvl.remaining_time);
		var lvl_skip = getLevelsSkipped();

		document.ExpectedLevel.textContent = 'Level: ' + level + ', Expected Level: ' + exp_lvl.expected_level + ', Likely Level: ' + exp_lvl.likely_level;
		document.RemainingTime.textContent = 'Remaining Time: ' + rem_time.hours + ' hours, ' + rem_time.minutes + ' minutes.';
		document.LevelsSkip.textContent = 'Skipped ' + lvl_skip + ' levels in last 5s.';
	}

	// Helpers to access player stats.
	function getCritChance() {
		return getScene().m_rgPlayerTechTree.crit_percentage * 100;
	}

	function getCritMultiplier() {
		return getScene().m_rgPlayerTechTree.damage_multiplier_crit;
	}

	function getElementMultiplier(index) {
		switch (index) {
			case 3:
				return getScene().m_rgPlayerTechTree.damage_multiplier_fire;
			case 4:
				return getScene().m_rgPlayerTechTree.damage_multiplier_water;
			case 5:
				return getScene().m_rgPlayerTechTree.damage_multiplier_air;
			case 6:
				return getScene().m_rgPlayerTechTree.damage_multiplier_earth;
		}
		return 1;
	}

	function getDPS() {
		return getScene().m_rgPlayerTechTree.dps;
	}

	function getClickDamage() {
		return getScene().m_rgPlayerTechTree.damage_per_click;
	}

	function getClickDamageMultiplier() {
		return getScene().m_rgPlayerTechTree.damage_per_click_multiplier;
	}

	function getBossLootChance() {
		return getScene().m_rgPlayerTechTree.boss_loot_drop_percentage * 100;
	}

	function startFingering() {
		w.CSceneGame.prototype.ClearNewPlayer = function() {};

		if (!getScene().m_spriteFinger) {
			w.WebStorage.SetLocal('mg_how2click', 0);
			getScene().CheckNewPlayer();
			w.WebStorage.SetLocal('mg_how2click', 1);
		}

		document.getElementById('newplayer').style.display = 'none';
	}

	function enhanceTooltips() {
		var trt_oldTooltip = w.fnTooltipUpgradeDesc;
		w.fnTooltipUpgradeDesc = function(context) {
			var $context = w.$J(context);
			var desc = $context.data('desc');
			var strOut = desc;
			var multiplier = parseFloat($context.data('multiplier'));
			switch ($context.data('upgrade_type')) {
				case 2: // Type for click damage. All tiers.
					strOut = trt_oldTooltip(context);
					var currentCrit = getClickDamage() * getCritMultiplier();
					var newCrit = w.g_Minigame.CurrentScene().m_rgTuningData.player.damage_per_click * (getClickDamageMultiplier() + multiplier) * getCritMultiplier();
					strOut += '<br><br>Crit Click: ' + w.FormatNumberForDisplay(currentCrit) + ' => ' + w.FormatNumberForDisplay(newCrit);
					break;
				case 7: // Lucky Shot's type.
					var currentMultiplier = getCritMultiplier();
					var newMultiplier = currentMultiplier + multiplier;
					var dps = getDPS();
					var clickDamage = getClickDamage();

					strOut += '<br><br>You can have multiple crits in a second. The server combines them into one.';

					strOut += '<br><br>Crit Percentage: ' + getCritChance().toFixed(1) + '%';

					strOut += '<br><br>Critical Damage Multiplier:';
					strOut += '<br>Current: ' + (currentMultiplier) + 'x';
					strOut += '<br>Next Level: ' + (newMultiplier) + 'x';

					strOut += '<br><br>Damage with one crit:';
					strOut += '<br>DPS: ' + w.FormatNumberForDisplay(currentMultiplier * dps) + ' => ' + w.FormatNumberForDisplay(newMultiplier * dps);
					strOut += '<br>Click: ' + w.FormatNumberForDisplay(currentMultiplier * clickDamage) + ' => ' + w.FormatNumberForDisplay(newMultiplier * clickDamage);
					strOut += '<br><br>Base Increased By: ' + multiplier.toFixed(1) + 'x';
					break;
				case 9: // Boss Loot Drop's type
					strOut += '<br><br>Boss Loot Drop Rate:';
					strOut += '<br>Current: ' + getBossLootChance().toFixed(0) + '%';
					strOut += '<br>Next Level: ' + (getBossLootChance() + multiplier * 100).toFixed(0) + '%';
					strOut += '<br><br>Base Increased By: ' + w.FormatNumberForDisplay(multiplier * 100) + '%';
					break;
				default:
					return trt_oldTooltip(context);
			}

			return strOut;
		};
	}

	function enableMultibuy() {
		// We have to add this to the scene so that we can access the "this" identifier.
		getScene().trt_oldbuy = w.g_Minigame.m_CurrentScene.TrySpendBadgePoints;
		w.g_Minigame.m_CurrentScene.TrySpendBadgePoints = function(ele, count){

			if (count != 1){
				getScene().trt_oldbuy(ele, count);
				return;
			}

			var instance = this;
			var $ele = w.$J(ele);

			var name = w.$J('.name', ele).text();
			var type = $ele.data('type');
			var cost = $ele.data('cost');

			var badge_points = instance.m_rgPlayerTechTree.badge_points;
			var maxBuy = Math.floor(badge_points / cost);
			var resp = prompt("How many "+ name + " do you want to buy? (max " + maxBuy + ")", 0);

			if (!resp){
				return;
			}

			var newCount = parseInt(resp);

			if (isNaN(newCount) || newCount < 0) {
				alert("Please enter a positive number.");
				return;
			}

			if ( instance.m_rgPlayerTechTree.badge_points < (cost * newCount))
			{
				alert("Not enough badge points.");
				return;
			}

			getScene().trt_oldbuy(ele, newCount);
		};
	}

	
	function toggleElementLock(event) {
		var value = enableElementLock;

		if(event !== undefined) {
			value = handleCheckBox(event);
		}

		if(value) {
			lockElements();
		} else {
			unlockElements();
		}
	}
	
	/** Check periodicaly if the welcome panel is visible
	 * then trigger an event 'event:welcomePanelVisible' */
	function waitForWelcomePanelLoad() {
		var checkTicks = 20; // not very elegant but effective
		var waitForWelcomePanelInterval = setInterval(function() {
			var $welcomePanel = w.$J('.spend_badge_ponts_ctn');
			var panelReady = !!($welcomePanel && $welcomePanel.length && $welcomePanel.is(':visible'));

			if(panelReady) { // Got it! Tuning time!
				window.document.dispatchEvent(new Event('event:welcomePanelVisible'));
				clearInterval(waitForWelcomePanelInterval);
			}
			else if(w.g_Minigame && w.g_Minigame.CurrentScene() && w.g_Minigame.CurrentScene().m_rgPlayerTechTree && !w.g_Minigame.CurrentScene().m_rgPlayerTechTree.badge_points) { // techtree but no points
				clearInterval(waitForWelcomePanelInterval);
			}
			else if(--checkTicks <= 0) { // give up
				clearInterval(waitForWelcomePanelInterval);
			}
		}, 500);
	}

	// Wait for welcome panel then add more buttons for batch purchase
	w.document.addEventListener('event:welcomePanelVisible', function() {
		// Select existings x10 buttons
		w.$J('#badge_items > .purchase_ability_item > .sub_item').each(function() {
			var x10Button = w.$J(this);

			// New button
			var x100Button = w.$J('<div class="sub_item x100">x100</div>');
			x100Button.click(function(event) { // same from steam script but x100 (incredible!)
					w.g_Minigame.CurrentScene().TrySpendBadgePoints(this, 1000);
					event.stopPropagation();
				});
			x100Button.data(x10Button.data());

			x10Button.css('margin-right', '50px'); // Shift the x10 button a little
			x10Button.after(x100Button);
		});

		// Wrap panel update to enable/disable x100 buttons
		var oldUpdate = w.g_Minigame.CurrentScene().m_UI.UpdateSpendBadgePointsDialog;
		w.g_Minigame.CurrentScene().m_UI.UpdateSpendBadgePointsDialog = function() {
			oldUpdate.apply(w.g_Minigame.CurrentScene().m_UI, arguments); // super call

			// remaining badgepoints
			var badgePoints = w.g_Minigame.CurrentScene().m_rgPlayerTechTree.badge_points;

			// each x100 button
			w.$J('#badge_items > .purchase_ability_item > .sub_item.x100').each(function() {
				var button = w.$J(this);
				// disable if not enougth points
				if(badgePoints < button.data().cost * 1000) {
					button.addClass('disabled');
				}
				else {
					button.removeClass('disabled');
				}
			});
		};
	}, false);


}(window));
