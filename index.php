<?php 
require 'php/config.php';
require 'php/router.php';
require 'php/DB.php';
require 'php/game.php';
require 'php/create.php';
require 'php/main.php';

$db = new DB( 'localhost', 'root', 'root', 'click_game' );
$router = new Router();

$router->initializeRoute( $_SERVER['REQUEST_URI'] );

