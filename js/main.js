var ClickGame = {

	// Setting up gameObject variables
	init: function () {
		
		gameObject.centerPoint = [ 0, 0];
		gameObject.screenHeight = window.innerHeight;
		gameObject.screenWidth = window.innerWidth;
		gameObject.container = document.getElementsByTagName("body")[0];
		gameObject.previousHeight = gameObject.screenHeight;

		gameObject.base = document.createElement("div");
		gameObject.cannon = document.createElement("div");
		gameObject.laserArray = [];
		gameObject.laserCounter = 0;


		gameObject.cannon.setAttribute( "id", "cannon" );
		gameObject.base.setAttribute( "id", "base" );
		gameObject.base.style.top = (gameObject.previousHeight - 45) + "px";
		gameObject.container.appendChild(gameObject.base);
		gameObject.container.appendChild(gameObject.cannon);

		var cannon = document.getElementById('cannon');
		var cannonStyles = window.getComputedStyle(cannon);
		gameObject.cannonWidth = cannonStyles.getPropertyValue('width').split('px')[0];
		gameObject.cannonHeight = cannonStyles.getPropertyValue('height').split('px')[0] - 2;
		gameObject.cannonCenter = [ gameObject.cannon.offsetLeft - (gameObject.cannonWidth / 2), gameObject.cannon.offsetTop - ( gameObject.cannonHeight / 2 ) ];
		
		gameObject.container.addEventListener('click', ClickGame.laserInit);
		window.onresize =  ClickGame.resizing;
		document.onmousemove = ClickGame.followMouse;
	},

	// sets up the needed values for creating the lazer using the click event. Calls create laser and passes the starting point.
	laserInit: function(event) {
		var mouseX = event.clientX - ( gameObject.screenWidth / 2 );
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
		var laser = document.createElement("div");
		laser.style.transform = gameObject.cannon.style.transform;
		laser.style.webkitTransform = gameObject.cannon.style.transform;

		laser.className = "laser laserNum-" + gameObject.laserCounter;
		var position = ClickGame.updateLaserPosition(X, Y, laser);
		
		gameObject.container.appendChild( laser );
		gameObject.laserCounter += 1;

		return laser;
	},

	fireLaser: function( laserValues, laser ) {
		laserValues['height'] = laserValues['height'] + laserValues['speed'];
		laserValues['X'] = ( laserValues['X'] > 0 ? ClickGame.getNewPointX( laserValues['height'], laserValues['slope'] ) : -ClickGame.getNewPointX( laserValues['height'], laserValues['slope'] ) );
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

	// creates a graph and calculates the Hypotenuse and Opposite and plugs them into Arcsine to get degrees.
	// degrees are the opposite with transform, so you have to subtract from 90 for the positive X
	// and subtract 90 from the negative X
	followMouse: function(event) {
		var mouseX = event.clientX - ( gameObject.screenWidth / 2 );
		var mouseY = Math.abs( event.clientY - gameObject.screenHeight );
		var hypotenuse = ClickGame.lineLength( mouseX, mouseY );
		var Opposite = mouseY;
		var SOH = Opposite / hypotenuse;
		var degree = Math.asin(SOH) * (180/Math.PI);
		
		degree = mouseX > 0 ? 90 - degree : degree - 90;

		gameObject.cannon.style.webkitTransform = "translateX(-50%) rotate( " + degree + "deg)";
		gameObject.cannon.style.transform = "translateX(-50%) rotate( " + degree + "deg)";			

	},

	//recenters the game cannon and changes screenHeight and screenWidth when window is resized.
	resizing: function() {
		gameObject.screenHeight = window.innerHeight;
		gameObject.screenWidth = window.innerWidth;
		if( gameObject.screenHeight != gameObject.previousHeight ) {
			gameObject.previousHeight = gameObject.screenHeight;
			gameObject.base.style.top = (gameObject.previousHeight - 45) + "px";
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
window.onload = ClickGame.init();