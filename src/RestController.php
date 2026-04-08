<?php

namespace CrocoBlocks;

class RestController {

	const NAMESPACE = 'croco-blocks/v1';

	public static function register_routes() {
		register_rest_route(
			self::NAMESPACE,
			'/settings',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( __CLASS__, 'get_settings' ),
					'permission_callback' => array( __CLASS__, 'check_permission' ),
				),
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array( __CLASS__, 'update_settings' ),
					'permission_callback' => array( __CLASS__, 'check_permission' ),
					'args'                => array(
						'active_blocks' => array(
							'required'          => true,
							'type'              => 'array',
							'items'             => array( 'type' => 'string' ),
							'sanitize_callback' => array( __CLASS__, 'sanitize_block_slugs' ),
						),
					),
				),
			)
		);
	}

	public static function check_permission() {
		return current_user_can( 'manage_options' );
	}

	public static function get_settings() {
		return rest_ensure_response(
			array(
				'active_blocks' => Plugin::get_active_blocks(),
			)
		);
	}

	public static function update_settings( \WP_REST_Request $request ) {
		$active_blocks = $request->get_param( 'active_blocks' );
		$all_slugs     = Plugin::get_all_block_slugs();

		$validated = array_values( array_intersect( $active_blocks, $all_slugs ) );

		update_option( 'croco_blocks_active_blocks', $validated );

		return rest_ensure_response(
			array(
				'active_blocks' => $validated,
			)
		);
	}

	public static function sanitize_block_slugs( $value ) {
		if ( ! is_array( $value ) ) {
			return array();
		}

		return array_map( 'sanitize_key', $value );
	}
}
