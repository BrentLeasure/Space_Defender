var ClickGame = {
	// Setting up gameObject variables
	init: function () { 
			gameObject.laserWidth 		= 10;
			gameObject.container 		= document.getElementById('game-container');
			gameObject.position 		= gameObject.container.getBoundingClientRect();
			gameObject.screenHeight 	= gameObject.position.bottom;
			gameObject.screenWidth 		= gameObject.position.width;
			gameObject.containerHeight 	= (gameObject.position.height - gameObject.position.top) - (gameObject.laserWidth/2);
			gameObject.containerWidth 	= gameObject.position.width - (gameObject.laserWidth/2);
			userControlled.cannons 		= {
				'topRight' : { 'obj' : null, 'side': 'right', 'position': null, 'centerPoint': [0,0]},
				'bottomRight' : { 'obj' : null, 'side': 'right', 'position': null, 'centerPoint': [0,0]},
				'topLeft' : { 'obj' : null, 'side:': 'left', 'position': null, 'centerPoint': [0,0]},
				'bottomLeft' : { 'obj' : null, 'side:': 'left', 'position': null, 'centerPoint': [0,0]}
			};
			gameObject.mouseX;
			gameObject.mouseY;
			gameObject.currentCannon = 'topLeft';  

			var height 	= 0;

			for( var j in userControlled.cannons ) {
				var side = userControlled.cannons[j].side;
				userControlled.cannons[j].obj = document.createElement('div');
				userControlled.cannons[j].obj.setAttribute( 'id', 'cannon-' + j );
				userControlled.cannons[j].obj.setAttribute( 'class', 'cannon-general' );
				gameObject.container.appendChild(userControlled.cannons[j].obj);
				userControlled.cannons[j].position = userControlled.cannons[j].obj.getBoundingClientRect();
				height = userControlled.cannons[j].position.height/2;
			}

			for( var j in userControlled.cannons ) {
				userControlled.cannons[j].centerPoint[1] = gameObject.screenHeight - ( userControlled.cannons[j].position.bottom - (userControlled.cannons[j].position.height / 2) );
				userControlled.cannons[j].centerPoint[0] = userControlled.cannons[j].position.left - gameObject.position.left;
			}


			gameObject.cannonHeight = document.getElementById('cannon-' + gameObject.currentCannon).clientHeight;

			gameObject.laserArray = [];
			gameObject.laserCounter = 0;
			gameObject.laserTimers = [];
			gameObject.fighterCounter = 0;
			gameObject.fighterTimers = [];
			gameObject.fighters = [];

			gameObject.container.addEventListener('click', ClickGame.laserInit);
			document.addEventListener('keyup', ClickGame.keypress);

			document.onmousemove = function( event ) {
				var degree = ClickGame.getAngle(event, true);
				userControlled.cannons[gameObject.currentCannon].obj.style.webkitTransform = 'translateY(-50%) rotate( ' + degree + 'deg)';
				userControlled.cannons[gameObject.currentCannon].obj.style.transform = 'translateY(-50%) rotate( ' + degree + 'deg)';
			}

			ClickGame.FighterInit();
	},

// LASER CODE STARTS HERE
	laserInit: function( event ) { 
		// Setting up lazer start point and angle
		var laserValues 		= {'slope' : 0, 'yIntercept' : 0, 'xIncrementor' : 0, 'laserNum' : -1, 'obj': null, side: 'left'}; 
    	var tieFighterNoise 	= document.getElementById('tie-fighter-audio');
    	laserValues.side 		= userControlled.cannons[gameObject.currentCannon].side;
    	var height 				= userControlled.cannons[gameObject.currentCannon].obj.clientHeight;
    	var x 					= laserValues.side != 'right' ? 0 : gameObject.position.width;
    	var y 					= gameObject.screenHeight - (userControlled.cannons[gameObject.currentCannon].position.bottom - (height/2)); 
    	var mouseX 				= event.clientX - gameObject.position.left; 
		var mouseY 				= Math.abs(event.clientY - gameObject.screenHeight);
		laserValues.obj			= ClickGame.createLaser(event, x);	

    	laserValues.slope 		= ClickGame.getSlope(mouseX, mouseY); 



    	laserValues.xIncrementor = gameObject.laserWidth;
    	laserValues.yIntercept = parseInt(laserValues.obj.style.bottom.replace('px', ''));

    	laserValues.laserNum = gameObject.laserCounter;

    	ClickGame.updateLaser(laserValues, 0 );

    	gameObject.laserCounter += 1; 
    	// tieFighterNoise.setAttribute('src', 'http://www.sa-matra.net/sounds/starwars/TIE-Fire.wav');
    	// tieFighterNoise.play();
	},

	//Creates a laser based on where the cannon is currently pointing.
	createLaser: function( event, x ) {
		var laser 		= document.createElement('div');
		var laserTop 	= document.createElement('div');
		var laserBottom = document.createElement('div');
		var degree 		= ClickGame.getAngle(event, false);
		var side 		= userControlled.cannons[gameObject.currentCannon].side;


		laserTop.className = 'laser-top laser-general';
		laserBottom.className = 'laser-bottom laser-general';

		laser.appendChild(laserTop);
		laser.appendChild(laserBottom);
		
		if ( side !== 'right' ) {
			laser.className 		= 'laser-container laser-container-left push-laser-left laserNum-' + gameObject.laserCounter; 
			laserTop.className 		= 'laser-top push-laser-right laser-general';
			laserBottom.className 	= 'laser-bottom push-laser-right laser-general';
		} else {
			laser.className = 'laser-container laser-container-right push-laser-right laserNum-' + gameObject.laserCounter; 
			laserTop.className 		= 'laser-top push-laser-left laser-general';
			laserBottom.className 	= 'laser-bottom push-laser-left laser-general';
		}

		if( side != 'right' ) {
			laser.style.left = 0 + 'px';	
		} else {
			laser.style.right = 0 + 'px';
		}	
		
		laser.style.transform 		= 'translateY(-50%) rotate( ' + degree + 'deg)';
		laser.style.webkitTransform = 'translateY(-50%) rotate( ' + degree + 'deg)';

		
		var height = userControlled.cannons[gameObject.currentCannon].position.height/2;	
		var bottom = gameObject.screenHeight - (userControlled.cannons[gameObject.currentCannon].position.bottom + height);

		laser.style.bottom = bottom + 'px';

		gameObject.container.appendChild( laser ); 

		return laser;
	},

	updateLaser: function( laserValues, x ) {
		gameObject.laserTimers[laserValues.laserNum] = setTimeout( function(){ 

			var side 			= laserValues.side;
			var newX 			= x + laserValues.xIncrementor; 
			var mx 				= laserValues.slope * newX;
			mx 					= side != 'right' ? mx : -mx;
			var newY 			=  mx + laserValues.yIntercept;
			// var bottom =  Math.abs(newY - gameObject.screenHeight);

			laserValues.obj.style.bottom 	= newY + 'px'; 

		if( side != 'right' ) { 
			laserValues.obj.style.left = newX + 'px';	
		} else {
			laserValues.obj.style.right =  newX + 'px';
		}
			
			var hitBox = ClickGame.hasHit(laserValues.obj);

			if( (newX >= 0 && newX < gameObject.containerWidth) && (newY >= 0 && newY < gameObject.containerHeight) && !hitBox ) {
				ClickGame.updateLaser( laserValues, newX );
			} else {
				laserValues.obj.remove();
				clearTimeout(gameObject.laserTimers[laserValues.laserNum])
			}
		}, 5); 

	},
// LASER CODE ENDS HERE

// FIGHTER CODE STARTS HERE
	FighterInit: function() {
		var currentFighters = [];
		var numFighters = 3;
		var attackerSet = false;
		var randomNumber = (Math.ceil(Math.random() * 10) > 5) ? 0 : 2;
		
		for (var i = 0; i < numFighters; i++) {
			var fighter = ClickGame.createFighters(numFighters, i);
			if ( i%2 == 0 && !attackerSet && i == randomNumber ) {
				fighter.isAttacker = true;
				attackerSet = true;
			}
			gameObject.fighters.push(fighter);
			currentFighters.push(fighter);
			gameObject.fighterCounter++;
		}

		[].forEach.call(currentFighters, function(fighter) {			
			ClickGame.updateFighter(fighter);
		});

		setTimeout(function() {	
			ClickGame.FighterInit();
		}, 10000);
	},

	createFighters: function(numFighters, number) {
		var fighter = {'y': 0, 'yIncrementor': 10, 'x': 0, 'xIncrementor': 10, 'totalHP': 3, 'hitPoints': 3, 'fighterNum': gameObject.fighterCounter, 'hpBar': null, 'container': null, 'obj': null, 'position': -1, 'isAttacker': false};
		fighter.obj = document.createElement('div');
		fighter.hpBar = document.createElement('div');
		fighter.container = document.createElement('div');
		fighter.hpBar.className = 'fighter-hit-points';
		fighter.hpBar.style.width = '30px';
		fighter.obj.className = 'fighters fighter+' + gameObject.fighterCounter + '+';
		fighter.container.appendChild(fighter.obj);
		fighter.container.appendChild(fighter.hpBar);
		fighter.container.className = 'fighter-containers';
		fighter.position = number;
		fighter.isAttacker = false;

		if( numFighters == 2 ) {
			switch(number) {
			  case 0:
			    fighter.x = (gameObject.screenWidth/2 - 15) - 30;
			    fighter.y = -60;
			    break;
			  case 1:
			    fighter.x = (gameObject.screenWidth/2 - 15) + 30;
			    fighter.y = -60;
			    break;
			} 
		} else {
			switch(number) {
			  case 0:
			    fighter.x = (gameObject.screenWidth/2 - 15) - 55;
			    fighter.y = -70;
			    break;
			  case 1:
			    fighter.x = (gameObject.screenWidth/2 - 15);
			    fighter.y = -60;
			    break;
			  case 2:
			  	fighter.x = (gameObject.screenWidth/2 - 15) + 55;
			  	fighter.y = -70;
			  	break;
			} 
		}

		fighter.container.style.left = fighter.x + 'px';
		fighter.container.style.top = fighter.y + 'px';
		gameObject.container.appendChild(fighter.container);
		return fighter;
	},

	updateFighter: function(fighter, chosenFighter) {
		gameObject.fighterTimers[fighter.fighterNum] = setTimeout( function(){
			var topOrBottomTurret = (Math.ceil(Math.random() * 10) > 5) ? 'top' : 'bottom';
			var turret; 

			if (fighter.isAttacker) {
				if(fighter.position == 0) {
					turret = topOrBottomTurret + 'left';
					
					userControlled.cannons[turret].position;
					fighter.x = fighter.x - 1;
					fighter.container.style.left = fighter.x + 'px';
				} else {
					turret = topOrBottomTurret + 'right';
					userControlled.cannons[turret].position;
					fighter.x += 1;
					fighter.container.style.left = fighter.x + 'px';
				}
			} else {
				fighter.y += fighter.yIncrementor;
				fighter.container.style.top = fighter.y + 'px';
			}

			if (fighter.y <= gameObject.screenHeight) {
				ClickGame.updateFighter(fighter);
			} else {
				clearTimeout(gameObject.fighterTimers[fighter.figherNum]);
				fighter.container.remove();
			}

			// }
		}, 100);
	},
// FIGHTER CODE ENDS HERE


	getAngle: function( event ) {
		var side = userControlled.cannons[gameObject.currentCannon].side;
		var position = userControlled.cannons[gameObject.currentCannon].position;

		var mouseX = event.clientX - gameObject.position.left;
		var mouseY = Math.abs(event.clientY - gameObject.screenHeight);
		var cannonY = gameObject.screenHeight - ( position.bottom - (gameObject.cannonHeight / 2) );
		var cannonX = side == 'right' ? position.right : position.left;
		
		var wall = { 'x': (side == 'right' ? gameObject.screenWidth : 0), 'y': mouseY};
		var mouse = { 'x': mouseX, 'y': mouseY}; 
		var cannon = { 'x': cannonX, 'y': cannonY};

		var opposite = Math.abs(mouse.x - wall.x);
		var adjacent = Math.abs(cannon.y - wall.y); 
		var tan = opposite/adjacent;
		var degree = Math.atan(tan) * 180 / Math.PI; 

		degree = 90 - degree;

		if (side == 'right') { 
			if (mouse.y < cannon.y) { 
				degree = -degree;
			} 
		} else {
			if (mouse.y > cannon.y) {
				degree = -degree;
			} 
		}

		return degree;	
	},

	hasHit: function(laser) {
		var fighters = document.getElementsByClassName('fighters');
		var hit = false;
		[].forEach.call(fighters, function(fighter) {
			var position 		= fighter.getBoundingClientRect();
			var theLaser		= laser.getBoundingClientRect();
			var regex = /\+(.*)\+/;
			var fighterNum = fighter.className.match(regex)[1]; 
			var currentFighter = gameObject.fighters[fighterNum];
			if ( ((theLaser.top > position.top && theLaser.top < position.bottom) || (theLaser.bottom > position.top && theLaser.bottom < position.bottom)) 
				&& ((theLaser.right < position.right && theLaser.right > position.left) || (theLaser.left < position.right && theLaser.left > position.left)) ) {
				currentFighter.hitPoints = currentFighter.hitPoints - 1;
				var newHP = currentFighter.hpBar.style.width.replace('px', '') * (currentFighter.hitPoints/currentFighter.totalHP); 
				currentFighter.hpBar.style.width = newHP + 'px';
				
				if (currentFighter.hitPoints == 0) {
					fighter.parentNode.remove();	
				}
				hit = true;
			}
		});
		return hit;
	},

	keypress: function(event) {
		switch(event.keyCode) {
			case 49:
				gameObject.currentCannon = 'topLeft'; 
				break;
			case 50:
				gameObject.currentCannon = 'bottomLeft'; 
				break;
			case 51:
				gameObject.currentCannon = 'topRight'; 
				break;
			case 52:
				gameObject.currentCannon = 'bottomRight'; 
				break;
		}
	},


	getSlope: function( X1, Y1) {
		return ( Y1 - userControlled.cannons[gameObject.currentCannon].centerPoint[1] ) / ( X1 - userControlled.cannons[gameObject.currentCannon].centerPoint[0] );
	},


	lineLength: function ( X, Y ) {
		var x; 
		var xCalc = Math.pow( ( userControlled.cannons[gameObject.currentCannon].centerPoint[0] - X ),  2);
		var yCalc = Math.pow( ( userControlled.cannons[gameObject.currentCannon].centerPoint[0] - Y ), 2);
		
		return Math.sqrt( (xCalc + yCalc) );
	}

}


var gameObject = new Object();
var userControlled = new Object();
window.onload = ClickGame.init();