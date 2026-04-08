<?php

namespace CrocoBlocks;

class Plugin {

	private static $instance = null;

	public static function init() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'init', array( $this, 'register_blocks' ) );
		add_action( 'init', array( $this, 'register_menus' ) );
		add_action( 'admin_menu', array( $this, 'register_admin_page' ) );
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );

		add_action( 'after_setup_theme', array( $this, 'add_image_sizes' ) );
		add_filter( 'block_categories_all', array( $this, 'register_block_category' ) );
	}

	public function register_blocks() {
		BlockController::register();
	}

	public function register_menus() {
		add_theme_support( 'menus' );
		register_nav_menus(
			array(
				'primary' => __( 'Primary Menu', 'croco-blocks' ),
			)
		);
	}

	public function register_admin_page() {
		AdminPage::register();
	}

	public function register_rest_routes() {
		RestController::register_routes();
	}

	public function add_image_sizes() {
		add_image_size( 'cb-hero-image', 1920, 800, true );
	}

	public function register_block_category( $categories ) {
		array_unshift( $categories, array(
			'slug'  => 'croco-blocks',
			'title' => __( 'Croco Blocks', 'croco-blocks' ),
		) );
		return $categories;
	}

	public static function get_all_block_slugs() {
		return array( 'navigation-menu', 'hero-slider' );
	}

	public static function get_active_blocks() {
		$all    = self::get_all_block_slugs();
		$active = get_option( 'croco_blocks_active_blocks', null );

		if ( null === $active || ! is_array( $active ) ) {
			return $all;
		}

		return array_values( array_intersect( $active, $all ) );
	}
}
