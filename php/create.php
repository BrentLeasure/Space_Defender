<?php 
class Create {
	function user() {
			include_once './html/create_user.html';	
	}

	function new_user() {
		$message = array( 'success' => 0, 'message' => '' );

		if( !empty( $_FILES['user_picture'] ) ) {
			$path = "Photos/Users/";
			$name = basename( $_FILES['user_picture']['name'] );
			$path = $path . $name;
			move_uploaded_file( $_FILES['user_picture']['tmp_name'], $path );
		} else {
			$message['message'] = 'Your profile requires an image';
			echo $message;
		}



	}
}