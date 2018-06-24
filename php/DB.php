<?php 
class DB {

	private $mysqli; 

	function __construct( $host, $username, $password, $db ) {
		$this->host 		= $host;
		$this->username 	= $username;
		$this->password 	= $password;
		$this->db 			= $db;
	}

	public function db_connect() {
		$mysqli = self::open_database( $this->host, $this->username, $this->password, $this->db );
		// self::query();
		self::close_database( $mysqli );
	}

	private function open_database( $host, $username, $password, $db ) {
		$mysqli = new mysqli( $host, $username, $password, $db); 

		if (mysqli_connect_error()) {
			die('Connect Error ('.mysqli_connect_errno().') '.mysqli_connect_error());
		}

		return $mysqli;
	}

	private function close_database( $mysqli ) {
		$mysqli->close();
	}
}