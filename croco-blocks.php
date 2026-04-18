<?php
/**
 * Plugin Name: Croco Blocks
 * Plugin URI: https://chinmoybiswas.com/croco-blocks
 * Description: A collection of custom Gutenberg blocks for WordPress – navigation menu, hero slider, and more.
 * Version: 1.0.0
 * Author: Chinmoy Biswas
 * Author URI: https://chinmoybiswas.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: croco-blocks
 * Domain Path: /languages
 * Requires at least: 6.2
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'CROCO_BLOCKS_VERSION', '1.0.0' );
define( 'CROCO_BLOCKS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'CROCO_BLOCKS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'CROCO_BLOCKS_PLUGIN_FILE', __FILE__ );

if ( file_exists( CROCO_BLOCKS_PLUGIN_DIR . 'vendor/autoload.php' ) ) {
	require_once CROCO_BLOCKS_PLUGIN_DIR . 'vendor/autoload.php';
}

require_once CROCO_BLOCKS_PLUGIN_DIR . 'src/Core/Bootstrap.php';
