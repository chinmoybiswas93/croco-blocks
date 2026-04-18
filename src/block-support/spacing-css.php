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
 * Whether a spacing attribute should emit a CSS variable (aligned with getSpacingCssVarsForEditor in spacingKeys.js).
 *
 * @param array  $attributes All block attributes.
 * @param string $key        Attribute key.
 * @return bool
 */
function croco_blocks_spacing_attr_has_value( $attributes, $key ) {
	if ( ! array_key_exists( $key, $attributes ) ) {
		return false;
	}
	$val = $attributes[ $key ];
	if ( null === $val ) {
		return false;
	}
	return '' !== trim( (string) $val );
}

/**
 * Zero length with a safe unit (aligned with formatSpacingValue in spacingKeys.js).
 *
 * @param string $unit px|rem|em|vh|vw.
 * @return string
 */
function croco_blocks_spacing_zero_with_unit( $unit ) {
	$allowed = array( 'px', 'rem', 'em', 'vh', 'vw' );
	$u       = is_string( $unit ) && in_array( $unit, $allowed, true ) ? $unit : 'px';
	return '0' . $u;
}

/**
 * Clamp padding lengths so negative values are not output (margin may stay negative).
 *
 * @param string $val        Stored value e.g. "-5px".
 * @param string $mode_key   "padding" or "margin".
 * @param string $zero       Zero with same unit context.
 * @return string
 */
function croco_blocks_spacing_normalize_value_for_mode( $val, $mode_key, $zero ) {
	$val = trim( (string) $val );
	if ( 'padding' !== $mode_key ) {
		return $val;
	}
	if ( preg_match( '/^(-?[0-9]*\.?[0-9]+)\s*([a-z%]*)$/i', $val, $m ) ) {
		$n = floatval( $m[1] );
		if ( $n < 0 ) {
			return $zero;
		}
	}
	return $val;
}

/**
 * Build inline style fragment with --cb-padding-* and --cb-margin-* variables.
 * When any side is set for a breakpoint, missing sides emit 0 so mixed inputs work.
 *
 * @param array $attributes Block attributes.
 * @return string Safe to append to style="" (already escaped values).
 */
function croco_blocks_spacing_css_vars_style( $attributes ) {
	$parts = array();

	$modes = array(
		'padding' => array(
			'css'       => 'padding',
			'attr'      => 'cbPadding',
			'unit_attr' => 'cbPaddingUnit',
		),
		'margin'  => array(
			'css'       => 'margin',
			'attr'      => 'cbMargin',
			'unit_attr' => 'cbMarginUnit',
		),
	);

	$sides = array( 'Top', 'Right', 'Bottom', 'Left' );

	$breakpoints = array(
		array(
			'css_suffix' => '',
			'key_suffix' => '',
		),
		array(
			'css_suffix' => '-tablet',
			'key_suffix' => 'Tablet',
		),
		array(
			'css_suffix' => '-mobile',
			'key_suffix' => 'Mobile',
		),
	);

	foreach ( $modes as $mode_key => $mode_cfg ) {
		$css_name    = $mode_cfg['css'];
		$attr_prefix = $mode_cfg['attr'];
		$unit_key    = $mode_cfg['unit_attr'];
		$unit        = isset( $attributes[ $unit_key ] ) ? $attributes[ $unit_key ] : 'px';
		$zero        = croco_blocks_spacing_zero_with_unit( is_string( $unit ) ? $unit : 'px' );

		foreach ( $breakpoints as $bp ) {
			$key_suffix = $bp['key_suffix'];
			$attr_keys  = array();
			foreach ( $sides as $side ) {
				$attr_keys[] = $attr_prefix . $side . $key_suffix;
			}

			$has_any = false;
			foreach ( $attr_keys as $k ) {
				if ( croco_blocks_spacing_attr_has_value( $attributes, $k ) ) {
					$has_any = true;
					break;
				}
			}
			if ( ! $has_any ) {
				continue;
			}

			foreach ( $sides as $side ) {
				$key        = $attr_prefix . $side . $key_suffix;
				$side_lower = strtolower( $side );
				$var_name   = '--cb-' . $css_name . '-' . $side_lower . $bp['css_suffix'];
				$val     = croco_blocks_spacing_attr_has_value( $attributes, $key )
					? trim( (string) $attributes[ $key ] )
					: $zero;
				$val     = croco_blocks_spacing_normalize_value_for_mode( $val, $mode_key, $zero );
				$parts[] = $var_name . ':' . esc_attr( $val );
			}
		}
	}

	if ( empty( $parts ) ) {
		return '';
	}

	return implode( ';', $parts ) . ';';
}

/**
 * Sanitize Advanced tab background color for inline style (hex, transparent, rgb/rgba).
 *
 * @param mixed $value Raw attribute.
 * @return string Safe CSS color or empty string.
 */
function croco_blocks_sanitize_advanced_background_color( $value ) {
	if ( ! is_string( $value ) ) {
		return '';
	}
	$value = trim( $value );
	if ( '' === $value ) {
		return '';
	}
	$lower = strtolower( $value );
	if ( 'transparent' === $lower ) {
		return 'transparent';
	}
	$hex = sanitize_hex_color( $value );
	if ( $hex ) {
		return $hex;
	}
	if ( preg_match( '/^rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+\s*)?\)$/i', $value ) ) {
		return $value;
	}
	return '';
}

/**
 * Inline background-color for Advanced tab (front end).
 *
 * @param array $attributes Block attributes.
 * @return string Fragment for style="" or empty.
 */
function croco_blocks_advanced_background_style_fragment( $attributes ) {
	if ( ! is_array( $attributes ) || ! isset( $attributes['cbAdvancedBackgroundColor'] ) ) {
		return '';
	}
	$safe = croco_blocks_sanitize_advanced_background_color( $attributes['cbAdvancedBackgroundColor'] );
	if ( '' === $safe ) {
		return '';
	}
	return 'background-color:' . esc_attr( $safe ) . ';';
}
