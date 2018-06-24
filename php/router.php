<?php


class Router {

	function call( $className = 'unknown', $methodName = 'unknown' ) {
		if ( 'unknown' == $methodName ) {
			include_once './html/404.html';
		} else {
			switch( $className ) {
				case 'game':
					$controller = new Game();
					break;
				case 'create':
					$controller = new Create();
				break;
				case 'main':
					$controller = new Main();
			}

			$controller->{ $methodName }();
		}
	}

	function initializeRoute( $parameters ) {
		$permitted_controllers = array( 'game', 'create' );
		$permitted_methods = array( 'play', 'user', 'new_user' );

		// Call the header
		self::call( 'main', 'header' );

		// Main call
		if( $parameters != '/' ) {
			$uri = explode( '/', $parameters );
			unset( $uri[0] );

			if ( count( $uri ) == 2 ) {				
				if ( array_search( $uri[1], $permitted_controllers ) !== false && array_search( $uri[2], $permitted_methods ) !== false ) {
					self::call( $uri[1], $uri[2] );
				} else {
					self::call( 'unknown', 'unknown' );			
				}
			} else {
				self::call( 'unknown', 'unknown' );
			}
		} else {
			self::call( 'game', 'play' );
		}

		// Call the footer
		self::call( 'main', 'footer' );
	}
}
