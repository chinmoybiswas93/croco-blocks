<?php
/**
 * Responsive spacing / border CSS custom properties from block attributes.
 *
 * @package Croco_Blocks
 */

namespace CrocoBlocks\BlockSupport;

class SpacingCss {

	/**
	 * Whether a spacing attribute should emit a CSS variable.
	 *
	 * @param array  $attributes All block attributes.
	 * @param string $key        Attribute key.
	 * @return bool
	 */
	public static function attr_has_value( $attributes, $key ) {
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
	 * @param string $unit px|rem|em|vh|vw.
	 * @return string
	 */
	public static function zero_with_unit( $unit ) {
		$allowed = array( 'px', 'rem', 'em', '%', 'vh', 'vw' );
		$u       = is_string( $unit ) && in_array( $unit, $allowed, true ) ? $unit : 'px';
		return '0' . $u;
	}

	/**
	 * @param string $val        Stored value e.g. "-5px".
	 * @param string $mode_key   "padding" or "margin".
	 * @param string $zero       Zero with same unit context.
	 * @return string
	 */
	public static function normalize_value_for_mode( $val, $mode_key, $zero ) {
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
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function spacing_vars_style( $attributes ) {
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
			$zero        = self::zero_with_unit( is_string( $unit ) ? $unit : 'px' );

			foreach ( $breakpoints as $bp ) {
				$key_suffix = $bp['key_suffix'];
				$attr_keys  = array();
				foreach ( $sides as $side ) {
					$attr_keys[] = $attr_prefix . $side . $key_suffix;
				}

				$has_any = false;
				foreach ( $attr_keys as $k ) {
					if ( self::attr_has_value( $attributes, $k ) ) {
						$has_any = true;
						break;
					}
				}
				if ( ! $has_any ) {
					continue;
				}

				foreach ( $sides as $side ) {
					$key = $attr_prefix . $side . $key_suffix;
					/*
					 * Margin: only emit sides the user set. Filling unset sides with 0 would set
					 * --cb-margin-top etc. to 0px, so margin-block-start wins over parent layout
					 * block spacing (core uses > * + * { margin-block-start: gap } on flow layouts).
					 * Padding still uses 0 for unset sides so “one side only” behaves as a box.
					 */
					if ( 'margin' === $mode_key && ! self::attr_has_value( $attributes, $key ) ) {
						continue;
					}
					$side_lower = strtolower( $side );
					$var_name   = '--cb-' . $css_name . '-' . $side_lower . $bp['css_suffix'];
					$val        = self::attr_has_value( $attributes, $key )
						? trim( (string) $attributes[ $key ] )
						: $zero;
					$val        = self::normalize_value_for_mode( $val, $mode_key, $zero );
					$parts[]    = $var_name . ':' . esc_attr( $val );
				}
			}
		}

		if ( empty( $parts ) ) {
			return '';
		}

		return implode( ';', $parts ) . ';';
	}

	/**
	 * @param mixed $value Raw attribute.
	 * @return string Safe keyword or empty.
	 */
	public static function sanitize_border_style( $value ) {
		if ( is_array( $value ) || is_object( $value ) ) {
			return '';
		}
		$value   = strtolower( trim( (string) $value ) );
		$allowed = array( 'none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset' );
		if ( in_array( $value, $allowed, true ) ) {
			return $value;
		}
		return '';
	}

	/**
	 * Build inline style fragment with --cb-border-* and --cb-border-hover-* variables.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function border_vars_style( $attributes ) {
		if ( ! is_array( $attributes ) ) {
			return '';
		}

		$parts       = array();
		$sides       = array( 'Top', 'Right', 'Bottom', 'Left' );
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

		$width_groups = array(
			array(
				'attr_prefix' => 'cbBorder',
				'css_prefix'  => 'border',
			),
			array(
				'attr_prefix' => 'cbBorderHover',
				'css_prefix'  => 'border-hover',
			),
		);

		foreach ( $width_groups as $wg ) {
			$attr_prefix = $wg['attr_prefix'];
			$css_prefix  = $wg['css_prefix'];
			$unit_key    = 'cbBorder' === $attr_prefix ? 'cbBorderUnit' : 'cbBorderHoverUnit';
			$unit        = isset( $attributes[ $unit_key ] ) ? $attributes[ $unit_key ] : 'px';
			$zero        = self::zero_with_unit( is_string( $unit ) ? $unit : 'px' );

			foreach ( $breakpoints as $bp ) {
				$key_suffix = $bp['key_suffix'];
				$attr_keys  = array();
				foreach ( $sides as $side ) {
					$attr_keys[] = $attr_prefix . $side . $key_suffix;
				}

				$has_any = false;
				foreach ( $attr_keys as $k ) {
					if ( self::attr_has_value( $attributes, $k ) ) {
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
					$var_name   = '--cb-' . $css_prefix . '-' . $side_lower . $bp['css_suffix'];
					$val        = self::attr_has_value( $attributes, $key )
						? trim( (string) $attributes[ $key ] )
						: $zero;
					$val        = self::normalize_value_for_mode( $val, 'padding', $zero );
					$parts[]    = $var_name . ':' . esc_attr( $val );
				}
			}
		}

		$radius_groups = array(
			array(
				'attr_prefix' => 'cbBorderRadius',
				'css_prefix'  => 'border-radius',
				'unit_key'    => 'cbBorderRadiusUnit',
			),
			array(
				'attr_prefix' => 'cbBorderRadiusHover',
				'css_prefix'  => 'border-hover-radius',
				'unit_key'    => 'cbBorderRadiusHoverUnit',
			),
		);

		foreach ( $radius_groups as $rg ) {
			$attr_prefix = $rg['attr_prefix'];
			$css_prefix  = $rg['css_prefix'];
			$unit_key    = $rg['unit_key'];
			$unit        = isset( $attributes[ $unit_key ] ) ? $attributes[ $unit_key ] : 'px';
			$zero        = self::zero_with_unit( is_string( $unit ) ? $unit : 'px' );

			foreach ( $breakpoints as $bp ) {
				$key_suffix = $bp['key_suffix'];
				$attr_keys  = array();
				foreach ( $sides as $side ) {
					$attr_keys[] = $attr_prefix . $side . $key_suffix;
				}

				$has_any = false;
				foreach ( $attr_keys as $k ) {
					if ( self::attr_has_value( $attributes, $k ) ) {
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
					$var_name   = '--cb-' . $css_prefix . '-' . $side_lower . $bp['css_suffix'];
					$val        = self::attr_has_value( $attributes, $key )
						? trim( (string) $attributes[ $key ] )
						: $zero;
					$val        = self::normalize_value_for_mode( $val, 'padding', $zero );
					$parts[]    = $var_name . ':' . esc_attr( $val );
				}
			}
		}

		if ( isset( $attributes['cbBorderStyle'] ) ) {
			$st = self::sanitize_border_style( $attributes['cbBorderStyle'] );
			if ( '' !== $st ) {
				$parts[] = '--cb-border-style:' . esc_attr( $st );
			}
		}

		if ( isset( $attributes['cbBorderHoverStyle'] ) ) {
			$st = self::sanitize_border_style( $attributes['cbBorderHoverStyle'] );
			if ( '' !== $st ) {
				$parts[] = '--cb-border-hover-style:' . esc_attr( $st );
			}
		}

		if ( isset( $attributes['cbBorderColor'] ) ) {
			$c = self::sanitize_background_color( $attributes['cbBorderColor'] );
			if ( '' !== $c ) {
				$parts[] = '--cb-border-color:' . esc_attr( $c );
			}
		}

		if ( isset( $attributes['cbBorderHoverColor'] ) ) {
			$c = self::sanitize_background_color( $attributes['cbBorderHoverColor'] );
			if ( '' !== $c ) {
				$parts[] = '--cb-border-hover-color:' . esc_attr( $c );
			}
		}

		self::apply_border_defaults_when_width_only( $parts );

		if ( empty( $parts ) ) {
			return '';
		}

		return implode( ';', $parts ) . ';';
	}

	/**
	 * @param array $parts Fragments (modified by reference).
	 */
	private static function apply_border_defaults_when_width_only( array &$parts ) {
		$has_normal_width = false;
		$has_hover_width  = false;
		$has_normal_style = false;
		$has_hover_style  = false;

		foreach ( $parts as $p ) {
			if ( preg_match( '/^--cb-border-(?:top|right|bottom|left)(?:-tablet|-mobile)?:/', $p ) ) {
				$has_normal_width = true;
			} elseif ( preg_match( '/^--cb-border-hover-(?:top|right|bottom|left)(?:-tablet|-mobile)?:/', $p ) ) {
				$has_hover_width = true;
			}
			if ( 0 === strpos( $p, '--cb-border-style:' ) ) {
				$has_normal_style = true;
			}
			if ( 0 === strpos( $p, '--cb-border-hover-style:' ) ) {
				$has_hover_style = true;
			}
		}

		if ( $has_normal_width && ! $has_normal_style ) {
			$parts[] = '--cb-border-style:' . esc_attr( 'solid' );
		}
		if ( $has_hover_width && ! $has_hover_style ) {
			$parts[] = '--cb-border-hover-style:' . esc_attr( 'solid' );
		}
	}

	/**
	 * @param mixed $value Raw attribute.
	 * @return string Safe CSS color or empty string.
	 */
	public static function sanitize_background_color( $value ) {
		if ( is_array( $value ) || is_object( $value ) ) {
			return '';
		}
		$value = trim( (string) $value );
		if ( '' === $value ) {
			return '';
		}
		$lower = strtolower( $value );
		if ( 'transparent' === $lower ) {
			return 'transparent';
		}
		if ( preg_match( '/^var\(\s*(--[\w-]+)\s*\)$/', $value ) ) {
			return $value;
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
	public static function background_style_fragment( $attributes ) {
		if ( ! is_array( $attributes ) || ! isset( $attributes['cbAdvancedBackgroundColor'] ) ) {
			return '';
		}
		$safe = self::sanitize_background_color( $attributes['cbAdvancedBackgroundColor'] );
		if ( '' === $safe ) {
			return '';
		}
		return 'background-color:' . esc_attr( $safe ) . ';';
	}

	/**
	 * Inline CSS from the core block `style` attribute (spacing, dimensions, border, typography in style object).
	 *
	 * Used when `supports.spacing` is false so the default Dimensions inspector is not mounted, while nested
	 * layout / theme.json / patterns can still persist `attributes.style` and have it render like core blocks.
	 *
	 * @param array $attributes Block attributes.
	 * @return string CSS declarations (no wrapping attribute), or empty string.
	 */
	public static function inline_css_from_core_style_attribute( array $attributes ) {
		if ( empty( $attributes['style'] ) || ! is_array( $attributes['style'] ) ) {
			return '';
		}
		if ( ! function_exists( 'wp_style_engine_get_styles' ) ) {
			return '';
		}
		$generated = wp_style_engine_get_styles( $attributes['style'] );
		if ( empty( $generated['css'] ) ) {
			return '';
		}
		return trim( rtrim( (string) $generated['css'], ';' ) );
	}

	/**
	 * Extra class names produced by the style engine for the block `style` attribute (e.g. preset-based utilities).
	 *
	 * @param array $attributes Block attributes.
	 * @return string Leading space + classes, or empty string.
	 */
	public static function classnames_suffix_from_core_style_attribute( array $attributes ) {
		if ( empty( $attributes['style'] ) || ! is_array( $attributes['style'] ) ) {
			return '';
		}
		if ( ! function_exists( 'wp_style_engine_get_styles' ) ) {
			return '';
		}
		$generated = wp_style_engine_get_styles( $attributes['style'] );
		if ( empty( $generated['classnames'] ) ) {
			return '';
		}
		return ' ' . trim( (string) $generated['classnames'] );
	}

	/**
	 * Merge plugin inline style fragments with core `style` attribute output.
	 *
	 * @param string $existing Existing style="" fragment (may be empty).
	 * @param array  $attributes Block attributes.
	 * @return string
	 */
	public static function append_core_style_attribute_to_inline( $existing, array $attributes ) {
		$extra = self::inline_css_from_core_style_attribute( $attributes );
		if ( '' === $extra ) {
			return is_string( $existing ) ? $existing : '';
		}
		$existing = is_string( $existing ) ? trim( rtrim( trim( $existing ), ';' ) ) : '';
		if ( '' === $existing ) {
			return $extra . ';';
		}
		return $existing . ';' . $extra . ';';
	}
}
