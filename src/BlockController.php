<?php

namespace CrocoBlocks;

class BlockController {

	/**
	 * Merge shared Advanced-tab spacing attributes into every croco-blocks block.
	 *
	 * @param array  $args Block type settings.
	 * @param string $name Block name (e.g. croco-blocks/navigation-menu).
	 * @return array
	 */
	public static function merge_advanced_spacing_attributes( $args, $name ) {
		if ( ! is_string( $name ) || strpos( $name, 'croco-blocks/' ) !== 0 ) {
			return $args;
		}

		require_once CROCO_BLOCKS_PLUGIN_DIR . 'src/block-support/advanced-spacing-attributes.php';
		$shared = croco_blocks_get_advanced_spacing_block_attributes();
		$attrs  = isset( $args['attributes'] ) && is_array( $args['attributes'] ) ? $args['attributes'] : array();
		$args['attributes'] = array_merge( $shared, $attrs );

		return $args;
	}

	public static function register() {
		add_filter( 'register_block_type_args', array( __CLASS__, 'merge_advanced_spacing_attributes' ), 10, 2 );

		$active = Plugin::get_active_blocks();

		foreach ( $active as $slug ) {
			$block_dir = CROCO_BLOCKS_PLUGIN_DIR . 'build/blocks/' . $slug;

			if ( file_exists( $block_dir . '/block.json' ) ) {
				register_block_type( $block_dir );
			}
		}

		add_filter( 'render_block', array( __CLASS__, 'enqueue_frontend_block_style_on_render' ), 10, 2 );

		if ( current_user_can( 'manage_options' ) ) {
			$all     = Plugin::get_all_block_slugs();
			$missing = array();

			foreach ( $all as $slug ) {
				if ( ! file_exists( CROCO_BLOCKS_PLUGIN_DIR . 'build/blocks/' . $slug . '/block.json' ) ) {
					$missing[] = $slug;
				}
			}

			if ( ! empty( $missing ) ) {
				add_action(
					'admin_notices',
					static function () use ( $missing ) {
						echo '<div class="notice notice-warning"><p>';
						echo esc_html(
							sprintf(
								/* translators: 1: npm command, 2: block names */
								__( 'Croco Blocks: run %1$s in the plugin folder so blocks load (%2$s).', 'croco-blocks' ),
								'npm run build',
								implode( ', ', $missing )
							)
						);
						echo '</p></div>';
					}
				);
			}
		}
	}

	/**
	 * Enqueue block frontend CSS when a block is rendered (including template parts / FSE).
	 *
	 * Advanced spacing applies --cb-* variables from inline styles; padding/margin longhands
	 * live in style-index.css. Relying on post content alone misses blocks in headers/footers.
	 *
	 * @param string $block_content Rendered HTML.
	 * @param array  $parsed_block  Parsed block.
	 * @return string Unchanged HTML.
	 */
	public static function enqueue_frontend_block_style_on_render( $block_content, $parsed_block ) {
		if ( is_admin() ) {
			return $block_content;
		}

		$name = isset( $parsed_block['blockName'] ) ? $parsed_block['blockName'] : '';
		if ( ! is_string( $name ) || strpos( $name, 'croco-blocks/' ) !== 0 ) {
			return $block_content;
		}

		$slug       = substr( $name, strlen( 'croco-blocks/' ) );
		$block_type = \WP_Block_Type_Registry::get_instance()->get_registered( $name );

		if ( $block_type && ! empty( $block_type->style_handles ) ) {
			foreach ( $block_type->style_handles as $handle ) {
				wp_enqueue_style( $handle );
			}
			return $block_content;
		}

		$path = CROCO_BLOCKS_PLUGIN_DIR . 'build/blocks/' . $slug . '/style-index.css';
		$url  = CROCO_BLOCKS_PLUGIN_URL . 'build/blocks/' . $slug . '/style-index.css';

		if ( ! file_exists( $path ) ) {
			return $block_content;
		}

		$handle = 'croco-blocks-' . $slug . '-style-fallback';
		if ( ! wp_style_is( $handle, 'registered' ) ) {
			wp_register_style(
				$handle,
				$url,
				array(),
				CROCO_BLOCKS_VERSION
			);
		}
		wp_enqueue_style( $handle );

		return $block_content;
	}
}
