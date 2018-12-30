var ClickGame = {
	// Setting up gameObject variables
	init: function () { 
			gameObject.screenHeight = window.innerHeight;
			gameObject.screenWidth = window.innerWidth;
			gameObject.container = document.getElementsByTagName('body')[0];
			gameObject.previousHeight = gameObject.screenHeight;
			userControlled.cannons = {
				'topRight' : { 'cannon' : null, 'side': 'right', 'postion': null, 'centerPoint': [0,0]},
				'bottomRight' : { 'cannon' : null, 'side': 'right', 'postion': null, 'centerPoint': [0,0]},
				'topLeft' : { 'cannon' : null, 'side:': 'left', 'postion': null, 'centerPoint': [0,0]},
				'bottomLeft' : { 'cannon' : null, 'side:': 'left', 'postion': null, 'centerPoint': [0,0]}
			};
			gameObject.mouseX;
			gameObject.mouseY;
			gameObject.currentCannon = 'topLeft';  

			var height = 0;
			for( var j in userControlled.cannons ) {
				userControlled.cannons[j].cannon = document.createElement('div');
				userControlled.cannons[j].cannon.setAttribute( 'id', 'cannon-' + j );
				userControlled.cannons[j].cannon.setAttribute( 'class', 'cannon-general' );
				gameObject.container.appendChild(userControlled.cannons[j].cannon);
				userControlled.cannons[j].position = userControlled.cannons[j].cannon.getBoundingClientRect();
				height = userControlled.cannons[j].position.height / 2;
				userControlled.cannons[j].centerPoint[1] = gameObject.screenHeight - (userControlled.cannons[j].position.y + height);
				userControlled.cannons[j].centerPoint[0] = userControlled.cannons[j].position.x;
			}

			gameObject.cannonHeight = document.getElementById('cannon-' + gameObject.currentCannon).clientHeight;
			gameObject.laserArray = [];
			gameObject.laserCounter = 0;
			
			gameObject.container.addEventListener('click', ClickGame.laserInit);
			document.addEventListener('keyup', ClickGame.keypress);

			window.addEventListener("resize", ClickGame.resizing, false);

			document.onmousemove = function( event ) {
				var degree = ClickGame.getAngle(event, true);
				userControlled.cannons[gameObject.currentCannon].cannon.style.webkitTransform = 'translateY(-50%) rotate( ' + degree + 'deg)';
				userControlled.cannons[gameObject.currentCannon].cannon.style.transform = 'translateY(-50%) rotate( ' + degree + 'deg)';
			}
	},

	
	laserInit: function( event ) { 
		// Setting up lazer start point and angle
		var laser 			= ClickGame.createLaser(event); 
    	var tieFighterNoise = document.getElementById('tie-fighter-audio');
    	var side 			= userControlled.cannons[gameObject.currentCannon].side;

    	// Getting slope and y-interept for y=mx+b formula
    	var laserValues 	= {'slope' : 0, 'yIntercept' : 0, 'xIncrementor' : 0, 'speed' : 1, 'laserNum' : -1};
    	var y = parseInt(laser.style.bottom.replace('px',''));
    	var x = userControlled.cannons[gameObject.currentCannon].centerPoint[0];
    	var mouseX 		= event.clientX;
		var mouseY 		= Math.abs(event.clientY - gameObject.screenHeight);	
    	
    	laserValues.slope 	= ClickGame.getSlope(mouseX, mouseY); 
    	laserValues.xIncrementor = side != 'right' ? 1 : -1;
    	laserValues.yIntercept = y - (laserValues.slope * x); 

    	laserValues.laserNum = gameObject.laserCounter;
    	console.log(typeof laserValues.speed);
    	ClickGame.updateLaser(laserValues, laser, x, y);

    	gameObject.laserCounter += 1; 
    	tieFighterNoise.setAttribute('src', 'http://www.sa-matra.net/sounds/starwars/TIE-Fire.wav');
    	tieFighterNoise.play();
    
		gameObject.laserArray.push( laser );
	
	},

	//Creates a laser based on where the cannon is currently pointing.
	createLaser: function( event ) {
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
		laser.style.transform = 'translateY(-50%) rotate( ' + degree + 'deg)';
		laser.style.webkitTransform = 'translateY(-50%) rotate( ' + degree + 'deg)';

		
		var height = userControlled.cannons[gameObject.currentCannon].position.height/2;	
		var bottom = gameObject.screenHeight - (userControlled.cannons[gameObject.currentCannon].position.bottom + height);

		laser.style.bottom = bottom + 'px';

		gameObject.container.appendChild( laser ); 

		return laser;
	},

	updateLaser: function( laserValues, laser, x, y ) {
		window.setTimeout( function(){ 
			var newX = x + laserValues.xIncrementor;
			var newY = (laserValues.slope * x) + laserValues.yIntercept;

			laser.style.bottom 	= newY + 'px';
			laser.style.left 	= newX + 'px';

			laserValues['speed'] = laserValues['speed'] - .3;
			console.log
			if(newX >= 0 && newX <= gameObject.screenWidth ) {
				ClickGame.updateLaser( laserValues, laser, newX, newY );
			} else {
				var elem = document.getElementsByClassName('laserNum-' + laserValues.laserNum)[0];
				elem.remove(); 
			}
		}, laserValues['speed']);

	},

	getAngle: function( event ) {
		var side = userControlled.cannons[gameObject.currentCannon].side;
		var position = userControlled.cannons[gameObject.currentCannon].position;

		var mouseX = event.clientX;
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

	//recenters the game cannon and changes screenHeight and screenWidth when window is resized.
	resizing: function(event) {
		gameObject.screenHeight = window.innerHeight;
		gameObject.screenWidth = window.innerWidth;
		var height;

		for( var j in userControlled.cannons ) {

			userControlled.cannons[j].position = userControlled.cannons[j].cannon.getBoundingClientRect();

			height = userControlled.cannons[j].position.height / 2;
			userControlled.cannons[j].centerPoint[1] = gameObject.screenHeight - (userControlled.cannons[j].position.y + height);
			userControlled.cannons[j].centerPoint[0] = userControlled.cannons[j].position.x;

		}
	},


	getSlope: function( X, Y ) {
		return ( Y - userControlled.cannons[gameObject.currentCannon].centerPoint[1] ) / ( X - userControlled.cannons[gameObject.currentCannon].centerPoint[0] );
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