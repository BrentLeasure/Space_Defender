var ClickGame = {
	// Setting up gameObject variables
	init: function () { 
			gameObject.centerPoint = [0, 0];
			gameObject.screenHeight = window.innerHeight;
			gameObject.screenWidth = window.innerWidth;
			gameObject.container = document.getElementsByTagName('body')[0];
			gameObject.previousHeight = gameObject.screenHeight;
			userControlled.cannons = {
				'topRight' : { 'cannon' : null, 'side': 'right', 'postion': null},
				'bottomRight' : { 'cannon' : null, 'side': 'right', 'postion': null},
				'topLeft' : { 'cannon' : null, 'side:': 'left', 'postion': null},
				'bottomLeft' : { 'cannon' : null, 'side:': 'left', 'postion': null}
			};
			gameObject.mouseX;
			gameObject.mouseY;
			gameObject.currentCannon = 'topRight'; 

			for( var j in userControlled.cannons ) {

				userControlled.cannons[j].cannon = document.createElement('div');
				userControlled.cannons[j].cannon.setAttribute( 'id', 'cannon-' + j );
				userControlled.cannons[j].cannon.setAttribute( 'class', 'cannon-general' );
				gameObject.container.appendChild(userControlled.cannons[j].cannon);
				userControlled.cannons[j].position = userControlled.cannons[j].cannon.getBoundingClientRect();

			}

			gameObject.cannonHeight = document.getElementById('cannon-' + gameObject.currentCannon).clientHeight;
			gameObject.laserArray = [];
			gameObject.laserCounter = 0;
			
			gameObject.container.addEventListener('click', ClickGame.laserInit);
			document.addEventListener('keyup', ClickGame.keypress);

			window.addEventListener("resize", ClickGame.resizing, false);

			document.onmousemove = ClickGame.followMouse;
	},

	// sets up the needed values for creating the lazer using the click event. Calls create laser and passes the starting point.
	laserInit: function(event) {
		var side = userControlled.cannons[gameObject.currentCannon].side;
		var mouseX = side == 'right' ? Math.abs(gameObject.screenWidth - event.clientX) : event.clientX;
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
				console.log(laserValues['X'] + ' Screen Width: ' + )
			} else {
				var the_laser = document.getElementsByClassName( 'laserNum-' + laserValues['laserNum'] )[0];
				document.getElementsByTagName('body')[0].removeChild( the_laser );
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
		var side = userControlled.cannons[gameObject.currentCannon].side;
		var position = userControlled.cannons[gameObject.currentCannon].position;

		var mouseX = event.clientX;
		var mouseY = Math.abs(event.clientY - gameObject.screenHeight);
		var cannonY = Math.abs((position.bottom - (gameObject.cannonHeight / 2) - gameObject.screenHeight));
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
	resizing: function(event) {
		gameObject.screenHeight = window.innerHeight;
		gameObject.screenWidth = window.innerWidth;


		for( var j in userControlled.cannons ) {

			userControlled.cannons[j].position = userControlled.cannons[j].cannon.getBoundingClientRect();

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
		var x; 
		var xCalc = Math.pow( ( gameObject.centerPoint[0] - X ),  2);
		var yCalc = Math.pow( ( gameObject.centerPoint[1] - Y ), 2);
		
		return Math.sqrt( (xCalc + yCalc) );
	}

}


var gameObject = new Object();
var userControlled = new Object();
window.onload = ClickGame.init();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBDbGlja0dhbWUgPSB7XG5cdC8vIFNldHRpbmcgdXAgZ2FtZU9iamVjdCB2YXJpYWJsZXNcblx0aW5pdDogZnVuY3Rpb24gKCkgeyBcblx0XHRcdGdhbWVPYmplY3QuY2VudGVyUG9pbnQgPSBbMCwgMF07XG5cdFx0XHRnYW1lT2JqZWN0LnNjcmVlbkhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0XHRcdGdhbWVPYmplY3Quc2NyZWVuV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHRcdGdhbWVPYmplY3QuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXTtcblx0XHRcdGdhbWVPYmplY3QucHJldmlvdXNIZWlnaHQgPSBnYW1lT2JqZWN0LnNjcmVlbkhlaWdodDtcblx0XHRcdHVzZXJDb250cm9sbGVkLmNhbm5vbnMgPSB7XG5cdFx0XHRcdCd0b3BSaWdodCcgOiB7ICdjYW5ub24nIDogbnVsbCwgJ3NpZGUnOiAncmlnaHQnLCAncG9zdGlvbic6IG51bGx9LFxuXHRcdFx0XHQnYm90dG9tUmlnaHQnIDogeyAnY2Fubm9uJyA6IG51bGwsICdzaWRlJzogJ3JpZ2h0JywgJ3Bvc3Rpb24nOiBudWxsfSxcblx0XHRcdFx0J3RvcExlZnQnIDogeyAnY2Fubm9uJyA6IG51bGwsICdzaWRlOic6ICdsZWZ0JywgJ3Bvc3Rpb24nOiBudWxsfSxcblx0XHRcdFx0J2JvdHRvbUxlZnQnIDogeyAnY2Fubm9uJyA6IG51bGwsICdzaWRlOic6ICdsZWZ0JywgJ3Bvc3Rpb24nOiBudWxsfVxuXHRcdFx0fTtcblx0XHRcdGdhbWVPYmplY3QubW91c2VYO1xuXHRcdFx0Z2FtZU9iamVjdC5tb3VzZVk7XG5cdFx0XHRnYW1lT2JqZWN0LmN1cnJlbnRDYW5ub24gPSAndG9wUmlnaHQnOyBcblxuXHRcdFx0Zm9yKCB2YXIgaiBpbiB1c2VyQ29udHJvbGxlZC5jYW5ub25zICkge1xuXG5cdFx0XHRcdHVzZXJDb250cm9sbGVkLmNhbm5vbnNbal0uY2Fubm9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdHVzZXJDb250cm9sbGVkLmNhbm5vbnNbal0uY2Fubm9uLnNldEF0dHJpYnV0ZSggJ2lkJywgJ2Nhbm5vbi0nICsgaiApO1xuXHRcdFx0XHR1c2VyQ29udHJvbGxlZC5jYW5ub25zW2pdLmNhbm5vbi5zZXRBdHRyaWJ1dGUoICdjbGFzcycsICdjYW5ub24tZ2VuZXJhbCcgKTtcblx0XHRcdFx0Z2FtZU9iamVjdC5jb250YWluZXIuYXBwZW5kQ2hpbGQodXNlckNvbnRyb2xsZWQuY2Fubm9uc1tqXS5jYW5ub24pO1xuXHRcdFx0XHR1c2VyQ29udHJvbGxlZC5jYW5ub25zW2pdLnBvc2l0aW9uID0gdXNlckNvbnRyb2xsZWQuY2Fubm9uc1tqXS5jYW5ub24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cblx0XHRcdH1cblxuXHRcdFx0Z2FtZU9iamVjdC5jYW5ub25IZWlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2Fubm9uLScgKyBnYW1lT2JqZWN0LmN1cnJlbnRDYW5ub24pLmNsaWVudEhlaWdodDtcblx0XHRcdGdhbWVPYmplY3QubGFzZXJBcnJheSA9IFtdO1xuXHRcdFx0Z2FtZU9iamVjdC5sYXNlckNvdW50ZXIgPSAwO1xuXHRcdFx0XG5cdFx0XHRnYW1lT2JqZWN0LmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIENsaWNrR2FtZS5sYXNlckluaXQpO1xuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBDbGlja0dhbWUua2V5cHJlc3MpO1xuXG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBDbGlja0dhbWUucmVzaXppbmcsIGZhbHNlKTtcblxuXHRcdFx0ZG9jdW1lbnQub25tb3VzZW1vdmUgPSBDbGlja0dhbWUuZm9sbG93TW91c2U7XG5cdH0sXG5cblx0Ly8gc2V0cyB1cCB0aGUgbmVlZGVkIHZhbHVlcyBmb3IgY3JlYXRpbmcgdGhlIGxhemVyIHVzaW5nIHRoZSBjbGljayBldmVudC4gQ2FsbHMgY3JlYXRlIGxhc2VyIGFuZCBwYXNzZXMgdGhlIHN0YXJ0aW5nIHBvaW50LlxuXHRsYXNlckluaXQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHNpZGUgPSB1c2VyQ29udHJvbGxlZC5jYW5ub25zW2dhbWVPYmplY3QuY3VycmVudENhbm5vbl0uc2lkZTtcblx0XHR2YXIgbW91c2VYID0gc2lkZSA9PSAncmlnaHQnID8gTWF0aC5hYnMoZ2FtZU9iamVjdC5zY3JlZW5XaWR0aCAtIGV2ZW50LmNsaWVudFgpIDogZXZlbnQuY2xpZW50WDtcblx0XHR2YXIgbW91c2VZID0gTWF0aC5hYnMoIGV2ZW50LmNsaWVudFkgLSBnYW1lT2JqZWN0LnNjcmVlbkhlaWdodCApO1xuXHRcdHZhciBzbG9wZSA9IENsaWNrR2FtZS5nZXRTbG9wZSggbW91c2VYLCBtb3VzZVkgKTsgXG5cdFx0XG5cdFx0dmFyIG5ld1ggPSAoIG1vdXNlWCA+IDAgPyBDbGlja0dhbWUuZ2V0TmV3UG9pbnRYKCBnYW1lT2JqZWN0LmNhbm5vbkhlaWdodCwgc2xvcGUgKSA6IC1DbGlja0dhbWUuZ2V0TmV3UG9pbnRYKCBnYW1lT2JqZWN0LmNhbm5vbkhlaWdodCwgc2xvcGUgKSApO1xuXHRcdHZhciBuZXdZID0gQ2xpY2tHYW1lLmdldE5ld1BvaW50WSggbmV3WCwgc2xvcGUgKTtcblx0XHR2YXIgbGFzZXJWYWx1ZXMgPSB7fTtcblx0XHR2YXIgbGFzZXIgPSBDbGlja0dhbWUuY3JlYXRlTGFzZXIoIG5ld1gsIG5ld1kgKTtcblx0XHR2YXIgbGFzZXJmaXJlID0gW107XG5cblx0XHRsYXNlclZhbHVlc1snc2xvcGUnXSA9IHNsb3BlO1xuXHRcdGxhc2VyVmFsdWVzWydZJ10gPSBuZXdZO1xuXHRcdGxhc2VyVmFsdWVzWydYJ10gPSBuZXdYO1xuXHRcdGxhc2VyVmFsdWVzWydoZWlnaHQnXSA9IGdhbWVPYmplY3QuY2Fubm9uSGVpZ2h0O1xuXHRcdGxhc2VyVmFsdWVzWydsaW5lTGVuZ3RoJ10gPSBDbGlja0dhbWUubGluZUxlbmd0aCggbW91c2VYLCBtb3VzZVkgKTtcblx0XHRsYXNlclZhbHVlc1snbGFzZXJOdW0nXSA9IGdhbWVPYmplY3QubGFzZXJDb3VudGVyO1xuXHRcdGxhc2VyVmFsdWVzWydzcGVlZCddID0gMTtcblxuICAgIFx0dmFyIHRpZUZpZ2h0ZXJOb2lzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aWUtZmlnaHRlci1hdWRpbycpO1xuICAgIFx0dGllRmlnaHRlck5vaXNlLnNldEF0dHJpYnV0ZSgnc3JjJywgJ2h0dHA6Ly93d3cuc2EtbWF0cmEubmV0L3NvdW5kcy9zdGFyd2Fycy9USUUtRmlyZS53YXYnKTtcbiAgICBcdHRpZUZpZ2h0ZXJOb2lzZS5wbGF5KCk7XG4gICAgXG5cdFx0Z2FtZU9iamVjdC5sYXNlckFycmF5LnB1c2goIGxhc2VyVmFsdWVzICk7XG5cblx0XHRDbGlja0dhbWUuZmlyZUxhc2VyKCBnYW1lT2JqZWN0Lmxhc2VyQXJyYXlbZ2FtZU9iamVjdC5sYXNlckNvdW50ZXIgLSAxXSwgbGFzZXIgKTtcdFxuXHR9LFxuXG5cdC8vQ3JlYXRlcyBhIGxhc2VyIGJhc2VkIG9uIHdoZXJlIHRoZSBjYW5ub24gaXMgY3VycmVudGx5IHBvaW50aW5nLlxuXHRjcmVhdGVMYXNlcjogZnVuY3Rpb24oIFgsIFkgKSB7XG5cdFx0dmFyIGxhc2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0bGFzZXIuc3R5bGUudHJhbnNmb3JtO1xuXHRcdGxhc2VyLnN0eWxlLndlYmtpdFRyYW5zZm9ybTtcblxuXHRcdGxhc2VyLmNsYXNzTmFtZSA9ICdsYXNlciBsYXNlck51bS0nICsgZ2FtZU9iamVjdC5sYXNlckNvdW50ZXI7XG5cdFx0dmFyIHBvc2l0aW9uID0gQ2xpY2tHYW1lLnVwZGF0ZUxhc2VyUG9zaXRpb24oWCwgWSwgbGFzZXIpO1xuXHRcdFxuXHRcdGdhbWVPYmplY3QuY29udGFpbmVyLmFwcGVuZENoaWxkKCBsYXNlciApO1xuXHRcdGdhbWVPYmplY3QubGFzZXJDb3VudGVyICs9IDE7XG5cblx0XHRyZXR1cm4gbGFzZXI7XG5cdH0sXG5cblx0ZmlyZUxhc2VyOiBmdW5jdGlvbiggbGFzZXJWYWx1ZXMsIGxhc2VyICkge1xuXHRcdGxhc2VyVmFsdWVzWydoZWlnaHQnXSA9IGxhc2VyVmFsdWVzWydoZWlnaHQnXSArIGxhc2VyVmFsdWVzWydzcGVlZCddO1xuXHRcdGxhc2VyVmFsdWVzWydYJ10gPSAoIGxhc2VyVmFsdWVzWydYJ10gPiAwID8gQ2xpY2tHYW1lLmdldE5ld1BvaW50WCggbGFzZXJWYWx1ZXNbJ2hlaWdodCddLCBsYXNlclZhbHVlc1snc2xvcGUnXSApIDogLSBDbGlja0dhbWUuZ2V0TmV3UG9pbnRYKCBsYXNlclZhbHVlc1snaGVpZ2h0J10sIGxhc2VyVmFsdWVzWydzbG9wZSddICkgKTtcblx0XHRsYXNlclZhbHVlc1snWSddID0gQ2xpY2tHYW1lLmdldE5ld1BvaW50WSggbGFzZXJWYWx1ZXNbJ1gnXSwgbGFzZXJWYWx1ZXNbJ3Nsb3BlJ10gKTtcblx0XHRsYXNlclZhbHVlc1snc3BlZWQnXSArPSAuMDM7XG5cblx0XHRDbGlja0dhbWUudXBkYXRlTGFzZXJQb3NpdGlvbiggbGFzZXJWYWx1ZXNbJ1gnXSwgbGFzZXJWYWx1ZXNbJ1knXSwgbGFzZXIgKTtcblx0XHR2YXIgdHJhdmVsZWREaXN0YW5jZSA9IENsaWNrR2FtZS5saW5lTGVuZ3RoKCBsYXNlclZhbHVlc1snWCddLCBsYXNlclZhbHVlc1snWSddICk7XG5cdFx0d2luZG93LnNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAoIGxhc2VyVmFsdWVzWydYJ10gPCAoIGdhbWVPYmplY3Quc2NyZWVuV2lkdGggLSAoIGdhbWVPYmplY3Quc2NyZWVuV2lkdGggLyAyKSApICYmIGxhc2VyVmFsdWVzWydYJ10gPiAoIDAgLSBnYW1lT2JqZWN0LnNjcmVlbldpZHRoIC8gMiApICYmIGxhc2VyVmFsdWVzWydZJ10gPCBnYW1lT2JqZWN0LnNjcmVlbkhlaWdodCApIHtcblx0XHRcdFx0Q2xpY2tHYW1lLmZpcmVMYXNlciggbGFzZXJWYWx1ZXMsIGxhc2VyICk7IFxuXHRcdFx0XHRjb25zb2xlLmxvZyhsYXNlclZhbHVlc1snWCddICsgJyBTY3JlZW4gV2lkdGg6ICcgKyApXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgdGhlX2xhc2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggJ2xhc2VyTnVtLScgKyBsYXNlclZhbHVlc1snbGFzZXJOdW0nXSApWzBdO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLnJlbW92ZUNoaWxkKCB0aGVfbGFzZXIgKTtcblx0XHRcdH1cblx0XHR9LCA1KTtcblx0fSxcblxuXHR1cGRhdGVMYXNlclBvc2l0aW9uOiBmdW5jdGlvbiggWCwgWSwgbGFzZXIgICkge1xuXHRcdHZhciBjZW50ZXJZID0gZ2FtZU9iamVjdC5jYW5ub25XaWR0aCAvIDI7XG5cdFx0dmFyIHBvc2l0aW9uID0geyAnbGVmdCcgOiAtMSwgJ3RvcCc6IC0xIH07XG5cdFx0XG5cdFx0cG9zaXRpb25bJ2xlZnQnXSA9IFggKyAoIGdhbWVPYmplY3Quc2NyZWVuV2lkdGggLyAyICk7XG5cdFx0cG9zaXRpb25bJ3RvcCddID0gTWF0aC5hYnMoIFkgLSBnYW1lT2JqZWN0LnNjcmVlbkhlaWdodCApO1xuXG5cdFx0bGFzZXIuc3R5bGUubGVmdCA9ICBwb3NpdGlvblsnbGVmdCddICsgJ3B4Jztcblx0XHRsYXNlci5zdHlsZS50b3AgPSAgKCBwb3NpdGlvblsndG9wJ10gLSBjZW50ZXJZICkrICdweCc7XG5cblx0XHRyZXR1cm4gcG9zaXRpb247XG5cdH0sXG5cblx0Zm9sbG93TW91c2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHNpZGUgPSB1c2VyQ29udHJvbGxlZC5jYW5ub25zW2dhbWVPYmplY3QuY3VycmVudENhbm5vbl0uc2lkZTtcblx0XHR2YXIgcG9zaXRpb24gPSB1c2VyQ29udHJvbGxlZC5jYW5ub25zW2dhbWVPYmplY3QuY3VycmVudENhbm5vbl0ucG9zaXRpb247XG5cblx0XHR2YXIgbW91c2VYID0gZXZlbnQuY2xpZW50WDtcblx0XHR2YXIgbW91c2VZID0gTWF0aC5hYnMoZXZlbnQuY2xpZW50WSAtIGdhbWVPYmplY3Quc2NyZWVuSGVpZ2h0KTtcblx0XHR2YXIgY2Fubm9uWSA9IE1hdGguYWJzKChwb3NpdGlvbi5ib3R0b20gLSAoZ2FtZU9iamVjdC5jYW5ub25IZWlnaHQgLyAyKSAtIGdhbWVPYmplY3Quc2NyZWVuSGVpZ2h0KSk7XG5cdFx0dmFyIGNhbm5vblggPSBzaWRlID09ICdyaWdodCcgPyBwb3NpdGlvbi5yaWdodCA6IHBvc2l0aW9uLmxlZnQ7XG5cdFx0XG5cdFx0dmFyIHdhbGwgPSB7ICd4JzogKHNpZGUgPT0gJ3JpZ2h0JyA/IGdhbWVPYmplY3Quc2NyZWVuV2lkdGggOiAwKSwgJ3knOiBtb3VzZVl9O1xuXHRcdHZhciBtb3VzZSA9IHsgJ3gnOiBtb3VzZVgsICd5JzogbW91c2VZfTsgXG5cdFx0dmFyIGNhbm5vbiA9IHsgJ3gnOiBjYW5ub25YLCAneSc6IGNhbm5vbll9O1xuXG5cdFx0dmFyIG9wcG9zaXRlID0gTWF0aC5hYnMobW91c2UueCAtIHdhbGwueCk7XG5cdFx0dmFyIGFkamFjZW50ID0gTWF0aC5hYnMoY2Fubm9uLnkgLSB3YWxsLnkpOyBcblx0XHR2YXIgdGFuID0gb3Bwb3NpdGUvYWRqYWNlbnQ7XG5cdFx0dmFyIGRlZ3JlZSA9IE1hdGguYXRhbih0YW4pICogMTgwIC8gTWF0aC5QSTtcblxuXHRcdGRlZ3JlZSA9IDkwIC0gZGVncmVlO1xuXG5cdFx0aWYgKHNpZGUgPT0gJ3JpZ2h0JykgeyBcblx0XHRcdGlmIChtb3VzZS55IDwgY2Fubm9uLnkpIHsgXG5cdFx0XHRcdGRlZ3JlZSA9IC1kZWdyZWU7XG5cdFx0XHR9IFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAobW91c2UueSA+IGNhbm5vbi55KSB7XG5cdFx0XHRcdGRlZ3JlZSA9IC1kZWdyZWU7XG5cdFx0XHR9IFxuXHRcdH1cblxuXG5cdFx0dXNlckNvbnRyb2xsZWQuY2Fubm9uc1tnYW1lT2JqZWN0LmN1cnJlbnRDYW5ub25dLmNhbm5vbi5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSAndHJhbnNsYXRlWSgtNTAlKSByb3RhdGUoICcgKyBkZWdyZWUgKyAnZGVnKSc7XG5cdFx0dXNlckNvbnRyb2xsZWQuY2Fubm9uc1tnYW1lT2JqZWN0LmN1cnJlbnRDYW5ub25dLmNhbm5vbi5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWSgtNTAlKSByb3RhdGUoICcgKyBkZWdyZWUgKyAnZGVnKSc7XHRcblx0fSxcblxuXHRrZXlwcmVzczogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRzd2l0Y2goZXZlbnQua2V5Q29kZSkge1xuXHRcdFx0Y2FzZSA0OTpcblx0XHRcdFx0Z2FtZU9iamVjdC5jdXJyZW50Q2Fubm9uID0gJ3RvcFJpZ2h0JzsgXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA1MDpcblx0XHRcdFx0Z2FtZU9iamVjdC5jdXJyZW50Q2Fubm9uID0gJ2JvdHRvbVJpZ2h0JzsgXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA1MTpcblx0XHRcdFx0Z2FtZU9iamVjdC5jdXJyZW50Q2Fubm9uID0gJ3RvcExlZnQnOyBcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDUyOlxuXHRcdFx0XHRnYW1lT2JqZWN0LmN1cnJlbnRDYW5ub24gPSAnYm90dG9tTGVmdCc7IFxuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH0sXG5cblx0Ly9yZWNlbnRlcnMgdGhlIGdhbWUgY2Fubm9uIGFuZCBjaGFuZ2VzIHNjcmVlbkhlaWdodCBhbmQgc2NyZWVuV2lkdGggd2hlbiB3aW5kb3cgaXMgcmVzaXplZC5cblx0cmVzaXppbmc6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0Z2FtZU9iamVjdC5zY3JlZW5IZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdFx0Z2FtZU9iamVjdC5zY3JlZW5XaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXG5cblx0XHRmb3IoIHZhciBqIGluIHVzZXJDb250cm9sbGVkLmNhbm5vbnMgKSB7XG5cblx0XHRcdHVzZXJDb250cm9sbGVkLmNhbm5vbnNbal0ucG9zaXRpb24gPSB1c2VyQ29udHJvbGxlZC5jYW5ub25zW2pdLmNhbm5vbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuXHRcdH1cblx0fSxcblxuXG5cdGdldFNsb3BlOiBmdW5jdGlvbiggWCwgWSApIHtcblx0XHRyZXR1cm4gKCBZIC0gZ2FtZU9iamVjdC5jZW50ZXJQb2ludFsxXSApIC8gKCBYIC0gZ2FtZU9iamVjdC5jZW50ZXJQb2ludFswXSApO1xuXHR9LFxuXG5cdC8vIENlbnRlciBwb2ludCBpcyAoMCwwKSwgc28gdGhlcmUgaXMgbm8gcG9pbnQgdG8gYWRkIGl0IHRvIHRoZSBmb3JtdWxhXG5cdGdldE5ld1BvaW50WDogZnVuY3Rpb24oIGRpc3RhbmNlLCBzbG9wZSApIHtcblx0XHRyZXR1cm4gZ2FtZU9iamVjdC5jZW50ZXJQb2ludFswXSArIGRpc3RhbmNlIC8gTWF0aC5zcXJ0KCAoIDEgKyBNYXRoLnBvdyhzbG9wZSwgMikgKSApO1xuXHR9LFxuXG5cdC8vIENlbnRlciBwb2ludCBpcyAoMCwwKSwgc28gdGhlcmUgaXMgbm8gcG9pbnQgdG8gYWRkIGl0IHRvIHRoZSBmb3JtdWxhXG5cdGdldE5ld1BvaW50WTogZnVuY3Rpb24oIG5ld1gsIHNsb3BlICkge1xuXHRcdHJldHVybiBzbG9wZSAqIG5ld1ggKyBnYW1lT2JqZWN0LmNlbnRlclBvaW50WzFdO1xuXHR9LFxuXG5cblx0bGluZUxlbmd0aDogZnVuY3Rpb24gKCBYLCBZICkge1xuXHRcdHZhciB4OyBcblx0XHR2YXIgeENhbGMgPSBNYXRoLnBvdyggKCBnYW1lT2JqZWN0LmNlbnRlclBvaW50WzBdIC0gWCApLCAgMik7XG5cdFx0dmFyIHlDYWxjID0gTWF0aC5wb3coICggZ2FtZU9iamVjdC5jZW50ZXJQb2ludFsxXSAtIFkgKSwgMik7XG5cdFx0XG5cdFx0cmV0dXJuIE1hdGguc3FydCggKHhDYWxjICsgeUNhbGMpICk7XG5cdH1cblxufVxuXG5cbnZhciBnYW1lT2JqZWN0ID0gbmV3IE9iamVjdCgpO1xudmFyIHVzZXJDb250cm9sbGVkID0gbmV3IE9iamVjdCgpO1xud2luZG93Lm9ubG9hZCA9IENsaWNrR2FtZS5pbml0KCk7Il0sImZpbGUiOiJtYWluLmpzIn0=
