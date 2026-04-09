<?php
/**
 * Responsive spacing: CSS custom properties from block attributes.
 *
 * @package Croco_Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Build inline style fragment with --cb-padding-* and --cb-margin-* variables.
 *
 * @param array $attributes Block attributes.
 * @return string Safe to append to style="" (already escaped values).
 */
function croco_blocks_spacing_css_vars_style( $attributes ) {
	$parts = array();

	$modes = array(
		'padding' => 'cbPadding',
		'margin'  => 'cbMargin',
	);

	$sides = array( 'Top', 'Right', 'Bottom', 'Left' );

	foreach ( $modes as $css_name => $attr_prefix ) {
		foreach ( $sides as $side ) {
			$side_lower = strtolower( $side );

			$desktop_key = $attr_prefix . $side;
			$tablet_key  = $attr_prefix . $side . 'Tablet';
			$mobile_key   = $attr_prefix . $side . 'Mobile';

			if ( ! empty( $attributes[ $desktop_key ] ) ) {
				$parts[] = '--cb-' . $css_name . '-' . $side_lower . ':' . esc_attr( $attributes[ $desktop_key ] );
			}
			if ( ! empty( $attributes[ $tablet_key ] ) ) {
				$parts[] = '--cb-' . $css_name . '-' . $side_lower . '-tablet:' . esc_attr( $attributes[ $tablet_key ] );
			}
			if ( ! empty( $attributes[ $mobile_key ] ) ) {
				$parts[] = '--cb-' . $css_name . '-' . $side_lower . '-mobile:' . esc_attr( $attributes[ $mobile_key ] );
			}
		}
	}

	if ( empty( $parts ) ) {
		return '';
	}

	return implode( ';', $parts ) . ';';
}
