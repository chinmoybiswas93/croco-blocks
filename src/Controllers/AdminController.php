<?php
/**
 * Admin menu and Croco Blocks settings screen.
 *
 * @package Croco_Blocks
 */

namespace CrocoBlocks\Controllers;

use CrocoBlocks\Core\Plugin;

class AdminController {

	const MENU_SLUG = 'croco-blocks';

	/**
	 * @return void
	 */
	public static function register() {
		add_menu_page(
			__( 'Croco Blocks', 'croco-blocks' ),
			__( 'Croco Blocks', 'croco-blocks' ),
			'manage_options',
			self::MENU_SLUG,
			array( __CLASS__, 'render' ),
			'dashicons-screenoptions',
			59
		);
	}

	/**
	 * @return void
	 */
	public static function render() {
		$screen = get_current_screen();

		if ( ! $screen || false === strpos( $screen->id, self::MENU_SLUG ) ) {
			return;
		}

		self::enqueue_admin_assets();

		echo '<div id="croco-blocks-admin"></div>';
	}

	/**
	 * @return void
	 */
	private static function enqueue_admin_assets() {
		$asset_file = CROCO_BLOCKS_PLUGIN_DIR . 'build/admin/index.asset.php';

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = require $asset_file;

		wp_enqueue_script(
			'croco-blocks-admin',
			CROCO_BLOCKS_PLUGIN_URL . 'build/admin/index.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		$style_path = CROCO_BLOCKS_PLUGIN_DIR . 'build/admin/style-index.css';
		if ( file_exists( $style_path ) ) {
			wp_enqueue_style(
				'croco-blocks-admin',
				CROCO_BLOCKS_PLUGIN_URL . 'build/admin/style-index.css',
				array( 'wp-components' ),
				$asset['version']
			);
		}

		wp_localize_script(
			'croco-blocks-admin',
			'crocoBlocksData',
			array(
				'restUrl'   => rest_url( 'croco-blocks/v1' ),
				'nonce'     => wp_create_nonce( 'wp_rest' ),
				'blocks'    => self::get_block_registry(),
				'pluginUrl' => CROCO_BLOCKS_PLUGIN_URL,
				'version'   => CROCO_BLOCKS_VERSION,
			)
		);
	}

	/**
	 * @return array<int, array<string, mixed>>
	 */
	public static function get_block_registry() {
		$all_slugs     = Plugin::get_all_block_slugs();
		$active_blocks = Plugin::get_active_blocks();
		$registry      = array();

		foreach ( $all_slugs as $slug ) {
			$block_json_path = CROCO_BLOCKS_PLUGIN_DIR . 'src/assets/blocks/' . $slug . '/block.json';
			$title           = $slug;
			$description     = '';
			$icon            = 'block-default';
			$category        = '';

			if ( file_exists( $block_json_path ) ) {
				$data = json_decode( file_get_contents( $block_json_path ), true );

				if ( is_array( $data ) ) {
					$title       = isset( $data['title'] ) ? $data['title'] : $slug;
					$description = isset( $data['description'] ) ? $data['description'] : '';
					$icon        = isset( $data['icon'] ) ? $data['icon'] : 'block-default';
					$category    = isset( $data['category'] ) ? $data['category'] : '';
				}
			}

			$registry[] = array(
				'slug'        => $slug,
				'title'       => $title,
				'description' => $description,
				'icon'        => $icon,
				'category'    => $category,
				'active'      => in_array( $slug, $active_blocks, true ),
			);
		}

		return $registry;
	}
}
