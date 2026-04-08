<?php

namespace CrocoBlocks;

class BlockController {

	public static function register() {
		$active = Plugin::get_active_blocks();

		foreach ( $active as $slug ) {
			$block_dir = CROCO_BLOCKS_PLUGIN_DIR . 'build/blocks/' . $slug;

			if ( file_exists( $block_dir . '/block.json' ) ) {
				register_block_type( $block_dir );
			}
		}

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
}
