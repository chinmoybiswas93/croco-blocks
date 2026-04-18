<?php
/**
 * Core plugin singleton: wires WordPress hooks to controllers.
 *
 * @package Croco_Blocks
 */

namespace CrocoBlocks\Core;

use CrocoBlocks\Controllers\AdminController;
use CrocoBlocks\Controllers\BlockController;
use CrocoBlocks\Rest\SettingsController;

class Plugin {

	/**
	 * @var Plugin|null
	 */
	private static $instance = null;

	/**
	 * Whether run() has executed.
	 *
	 * @var bool
	 */
	private $did_run = false;

	/**
	 * @return Plugin
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
	}

	/**
	 * Legacy entry (e.g. tests). Prefer Bootstrap + run().
	 *
	 * @return Plugin
	 */
	public static function init() {
		return self::instance()->run();
	}

	/**
	 * Register hooks once.
	 *
	 * @return Plugin
	 */
	public function run() {
		if ( $this->did_run ) {
			return $this;
		}
		$this->did_run = true;

		$this->load_textdomain();

		add_action( 'init', array( $this, 'register_blocks' ) );
		add_action( 'init', array( $this, 'register_menus' ) );
		add_action( 'admin_menu', array( $this, 'register_admin_page' ) );
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );

		add_action( 'after_setup_theme', array( $this, 'add_image_sizes' ) );
		add_filter( 'block_categories_all', array( $this, 'register_block_category' ) );

		return $this;
	}

	/**
	 * @return void
	 */
	public function load_textdomain() {
		load_plugin_textdomain(
			'croco-blocks',
			false,
			dirname( plugin_basename( CROCO_BLOCKS_PLUGIN_FILE ) ) . '/languages'
		);
	}

	/**
	 * @return void
	 */
	public function register_blocks() {
		BlockController::register();
	}

	/**
	 * @return void
	 */
	public function register_menus() {
		add_theme_support( 'menus' );
		register_nav_menus(
			array(
				'primary' => __( 'Primary Menu', 'croco-blocks' ),
			)
		);
	}

	/**
	 * @return void
	 */
	public function register_admin_page() {
		AdminController::register();
	}

	/**
	 * @return void
	 */
	public function register_rest_routes() {
		SettingsController::register_routes();
	}

	/**
	 * @return void
	 */
	public function add_image_sizes() {
		add_image_size( 'cb-hero-image', 1920, 800, true );
	}

	/**
	 * @param array $categories Block categories.
	 * @return array
	 */
	public function register_block_category( $categories ) {
		array_unshift(
			$categories,
			array(
				'slug'  => 'croco-blocks',
				'title' => __( 'Croco Blocks', 'croco-blocks' ),
			)
		);
		return $categories;
	}

	/**
	 * All block directory slugs from config.
	 *
	 * @return string[]
	 */
	public static function get_all_block_slugs() {
		$config = array();
		$path   = CROCO_BLOCKS_PLUGIN_DIR . 'config/blocks.php';
		if ( file_exists( $path ) ) {
			$config = require $path;
		}
		if ( ! is_array( $config ) || empty( $config['slugs'] ) || ! is_array( $config['slugs'] ) ) {
			return array();
		}
		return $config['slugs'];
	}

	/**
	 * Block slugs enabled in settings (subset of all slugs).
	 *
	 * @return string[]
	 */
	public static function get_active_blocks() {
		$all    = self::get_all_block_slugs();
		$active = get_option( 'croco_blocks_active_blocks', null );

		if ( null === $active || ! is_array( $active ) ) {
			return $all;
		}

		return array_values( array_intersect( $active, $all ) );
	}
}
