var ClickGame = {
	// Setting up gameObject variables
	init: function () { 
			gameObject.centerPoint = [0, 0];
			gameObject.screenHeight = window.innerHeight;
			gameObject.screenWidth = window.innerWidth;
			gameObject.container = document.getElementsByTagName('body')[0];
			gameObject.previousHeight = gameObject.screenHeight;
			userControlled.cannons = {
				'topRight' : { 'cannon' : null, 'cannonBase': '0px', 'position': 'right'},
				'bottomRight' : { 'cannon' : null, 'cannonBase': '0px', 'position': 'right'},
				'topLeft' : { 'cannon' : null, 'cannonBase': '0px', 'position:': 'left'},
				'bottomLeft' : { 'cannon' : null, 'cannonBase': '0px', 'position:': 'left'}
			};
			gameObject.mouseX;
			gameObject.mouseY;
			gameObject.currentCannon = 'topRight'; 

			for( var j in userControlled.cannons ) {

				userControlled.cannons[j].cannon = document.createElement('div');
				userControlled.cannons[j].cannon.setAttribute( 'id', 'cannon-' + j );
				userControlled.cannons[j].cannon.setAttribute( 'class', 'cannon-general' );
				gameObject.container.appendChild(userControlled.cannons[j].cannon);
				userControlled.cannons[j].cannonBase = userControlled.cannons[j].cannon.offsetWidth;

			}

			gameObject.cannonHeight = document.getElementById('cannon-' + gameObject.currentCannon).clientHeight;
			gameObject.laserArray = [];
			gameObject.laserCounter = 0;
			
			gameObject.container.addEventListener('click', ClickGame.laserInit);
			document.addEventListener('keyup', ClickGame.keypress);

			window.addEventListener('resize', ClickGame.resize); 

			document.onmousemove = ClickGame.followMouse;
	},

	// sets up the needed values for creating the lazer using the click event. Calls create laser and passes the starting point.
	laserInit: function(event) {
		var position = userControlled.cannons[gameObject.currentCannon].position;
		var mouseX = position == 'right' ? Math.abs(gameObject.)
		var mouseY = Math.abs( event.clientY - gameObject.screenHeight );
		var slope = ClickGame.getSlope( mouseX, mouseY );
		
		var newX = ( mouseX > 0 ? ClickGame.getNewPointX( gameObject.cannonHeight, slope ) : -ClickGame.getNewPointX( gameObject.cannonHeight, slope ) );
		var newY = ClickGame.getNewPointY( newX, slope );
		var laserValues = {};
		var laser = ClickGame.createLaser( newX, newY );
		var laserfire = [];

		laserValues['slope'] = slope;
		laserValues['Y'] = newY;
		laserValues['X'] = newX;
		laserValues['height'] = gameObject.cannonHeight;
		laserValues['lineLength'] = ClickGame.lineLength( mouseX, mouseY );
		laserValues['laserNum'] = gameObject.laserCounter;
		laserValues['speed'] = 1;

    	var tieFighterNoise = document.getElementById('tie-fighter-audio');
    	tieFighterNoise.setAttribute('src', 'http://www.sa-matra.net/sounds/starwars/TIE-Fire.wav');
    	tieFighterNoise.play();
    
		gameObject.laserArray.push( laserValues );

		ClickGame.fireLaser( gameObject.laserArray[gameObject.laserCounter - 1], laser );	
	},

	//Creates a laser based on where the cannon is currently pointing.
	createLaser: function( X, Y ) {
		var laser = document.createElement('div');
		laser.style.transform;
		laser.style.webkitTransform;

		laser.className = 'laser laserNum-' + gameObject.laserCounter;
		var position = ClickGame.updateLaserPosition(X, Y, laser);
		
		gameObject.container.appendChild( laser );
		gameObject.laserCounter += 1;

		return laser;
	},

	fireLaser: function( laserValues, laser ) {
		laserValues['height'] = laserValues['height'] + laserValues['speed'];
		laserValues['X'] = ( laserValues['X'] > 0 ? ClickGame.getNewPointX( laserValues['height'], laserValues['slope'] ) : - ClickGame.getNewPointX( laserValues['height'], laserValues['slope'] ) );
		laserValues['Y'] = ClickGame.getNewPointY( laserValues['X'], laserValues['slope'] );
		laserValues['speed'] += .03;

		ClickGame.updateLaserPosition( laserValues['X'], laserValues['Y'], laser );
		var traveledDistance = ClickGame.lineLength( laserValues['X'], laserValues['Y'] );
		window.setTimeout( function(){
			if ( laserValues['X'] < ( gameObject.screenWidth - ( gameObject.screenWidth / 2) ) && laserValues['X'] > ( 0 - gameObject.screenWidth / 2 ) && laserValues['Y'] < gameObject.screenHeight ) {
				ClickGame.fireLaser( laserValues, laser ); 
			} else {
				var the_laser = document.getElementsByClassName( 'laserNum-' + laserValues['laserNum'] )[0];
				document.getElementsByTagName('body')[0].removeChild( laser );
			}
		}, 5);
	},

	updateLaserPosition: function( X, Y, laser  ) {
		var centerY = gameObject.cannonWidth / 2;
		var position = { 'left' : -1, 'top': -1 };
		
		position['left'] = X + ( gameObject.screenWidth / 2 );
		position['top'] = Math.abs( Y - gameObject.screenHeight );

		laser.style.left =  position['left'] + 'px';
		laser.style.top =  ( position['top'] - centerY )+ 'px';

		return position;
	},

	followMouse: function(event) {
		var position = userControlled.cannons[gameObject.currentCannon].position;
		var placement = userControlled.cannons[gameObject.currentCannon].cannon.getBoundingClientRect();

		var mouseX = event.clientX;
		var mouseY = Math.abs(event.clientY - gameObject.screenHeight);
		var cannonY = Math.abs((placement.bottom - (gameObject.cannonHeight / 2) - gameObject.screenHeight));
		var cannonX = position == 'right' ? placement.right : placement.left;
		
		var wall = { 'x': (position == 'right' ? gameObject.screenWidth : 0), 'y': mouseY};
		var mouse = { 'x': mouseX, 'y': mouseY}; 
		var cannon = { 'x': cannonX, 'y': cannonY};

		var opposite = Math.abs(mouse.x - wall.x);
		var adjacent = Math.abs(cannon.y - wall.y); 
		var tan = opposite/adjacent;
		var degree = Math.atan(tan) * 180 / Math.PI;

		degree = 90 - degree;

		if (position == 'right') {
			if (mouse.y < cannon.y) {
				degree = -degree;
			}
		} else {
			if (mouse.y > cannon.y) {
				degree = -degree;
			}
		}


		userControlled.cannons[gameObject.currentCannon].cannon.style.webkitTransform = 'translateY(-50%) rotate( ' + degree + 'deg)';
		userControlled.cannons[gameObject.currentCannon].cannon.style.transform = 'translateY(-50%) rotate( ' + degree + 'deg)';	
	},

	keypress: function(event) {
		switch(event.keyCode) {
			case 49:
				gameObject.currentCannon = 'topRight'; 
				break;
			case 50:
				gameObject.currentCannon = 'bottomRight'; 
				break;
			case 51:
				gameObject.currentCannon = 'topLeft'; 
				break;
			case 52:
				gameObject.currentCannon = 'bottomLeft'; 
				break;
		}
	},

	//recenters the game cannon and changes screenHeight and screenWidth when window is resized.
	resizing: function() {
		gameObject.screenHeight = window.innerHeight;
		gameObject.screenWidth = window.innerWidth;
		if( gameObject.screenHeight != gameObject.previousHeight ) {
			gameObject.previousHeight = gameObject.screenHeight;
		}
	},


	getSlope: function( X, Y ) {
		return ( Y - gameObject.centerPoint[1] ) / ( X - gameObject.centerPoint[0] );
	},

	// Center point is (0,0), so there is no point to add it to the formula
	getNewPointX: function( distance, slope ) {
		return gameObject.centerPoint[0] + distance / Math.sqrt( ( 1 + Math.pow(slope, 2) ) );
	},

	// Center point is (0,0), so there is no point to add it to the formula
	getNewPointY: function( newX, slope ) {
		return slope * newX + gameObject.centerPoint[1];
	},


	lineLength: function ( X, Y ) {
		var xCalc = Math.pow( ( gameObject.centerPoint[0] - X ),  2);
		var yCalc = Math.pow( ( gameObject.centerPoint[1] - Y ), 2);
		
		return Math.sqrt( (xCalc + yCalc) );
	}

}


var gameObject = new Object();
var userControlled = new Object();
window.onload = ClickGame.init();