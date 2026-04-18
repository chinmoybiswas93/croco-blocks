<?php
/**
 * Loads the plugin after translations and other plugins are available.
 *
 * @package Croco_Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'plugins_loaded',
	static function () {
		\CrocoBlocks\Core\Plugin::instance()->run();
	},
	10
);
