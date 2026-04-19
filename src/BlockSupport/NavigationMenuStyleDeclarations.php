<?php
/**
 * Navigation menu: concatenated CSS declaration string (custom properties + advanced tab).
 *
 * @package Croco_Blocks
 */

namespace CrocoBlocks\BlockSupport;

class NavigationMenuStyleDeclarations {

	/**
	 * @param array $attributes Block attributes.
	 * @return string Semicolon-separated declarations (no wrapping braces).
	 */
	public static function declarations( $attributes ) {
		if ( ! is_array( $attributes ) ) {
			return '';
		}
	
			
		$item_spacing = ! empty( $attributes['itemSpacing'] ) ? $attributes['itemSpacing'] : '20px';
	
		$allowed_alignments = array( 'left', 'center', 'right' );
	
		$alignment_desktop = ! empty( $attributes['alignmentDesktop'] ) ? $attributes['alignmentDesktop'] : 'left';
		if ( ! in_array( $alignment_desktop, $allowed_alignments, true ) ) {
			$alignment_desktop = 'left';
		}
	
		$alignment_tablet = ! empty( $attributes['alignmentTablet'] ) ? $attributes['alignmentTablet'] : '';
		if ( $alignment_tablet && ! in_array( $alignment_tablet, $allowed_alignments, true ) ) {
			$alignment_tablet = '';
		}
	
		$alignment_mobile = ! empty( $attributes['alignmentMobile'] ) ? $attributes['alignmentMobile'] : '';
		if ( $alignment_mobile && ! in_array( $alignment_mobile, $allowed_alignments, true ) ) {
			$alignment_mobile = '';
		}
	
		$justify_desktop = self::alignment_to_justify( $alignment_desktop );
		$justify_tablet  = $alignment_tablet ? self::alignment_to_justify( $alignment_tablet ) : '';
		$justify_mobile  = $alignment_mobile ? self::alignment_to_justify( $alignment_mobile ) : '';
	
		$submenu_text_color       = ! empty( $attributes['submenuTextColor'] ) ? $attributes['submenuTextColor'] : '';
		$submenu_text_hover_color = ! empty( $attributes['submenuTextHoverColor'] ) ? $attributes['submenuTextHoverColor'] : '';
	
		$mobile_menu_text_color          = ! empty( $attributes['mobileMenuTextColor'] ) ? $attributes['mobileMenuTextColor'] : '#ffffff';
		$mobile_menu_hover_text_color    = ! empty( $attributes['mobileMenuHoverTextColor'] ) ? $attributes['mobileMenuHoverTextColor'] : '';
		$mobile_submenu_text_color       = ! empty( $attributes['mobileSubmenuTextColor'] ) ? $attributes['mobileSubmenuTextColor'] : '#ffffff';
		$mobile_submenu_hover_text_color = ! empty( $attributes['mobileSubmenuHoverTextColor'] ) ? $attributes['mobileSubmenuHoverTextColor'] : '';
	
		$submenu_text_alignment = ! empty( $attributes['submenuTextAlignment'] ) ? $attributes['submenuTextAlignment'] : 'left';
		if ( ! in_array( $submenu_text_alignment, $allowed_alignments, true ) ) {
			$submenu_text_alignment = 'left';
		}
	
		$submenu_offset_top = isset( $attributes['submenuOffsetTop'] ) ? $attributes['submenuOffsetTop'] : '0px';
		if ( '' === $submenu_offset_top ) {
			$submenu_offset_top = '0px';
		}
	
		$submenu_hover_bg = ! empty( $attributes['submenuHoverBackgroundColor'] ) ? $attributes['submenuHoverBackgroundColor'] : '';
	
		$submenu_item_padding = isset( $attributes['submenuItemPadding'] ) ? $attributes['submenuItemPadding'] : '0.4rem 1rem';
		if ( '' === $submenu_item_padding ) {
			$submenu_item_padding = '0';
		}
	
		$menu_item_padding = isset( $attributes['menuItemPadding'] ) ? $attributes['menuItemPadding'] : '0px';
		if ( '' === $menu_item_padding ) {
			$menu_item_padding = '0';
		}
	
		$menu_item_padding_vertical = isset( $attributes['menuItemPaddingVertical'] ) ? $attributes['menuItemPaddingVertical'] : '0px';
		if ( '' === $menu_item_padding_vertical ) {
			$menu_item_padding_vertical = '0';
		}
	
		$toggle_icon_color   = ! empty( $attributes['toggleIconColor'] ) ? $attributes['toggleIconColor'] : '';
		$toggle_icon_size    = isset( $attributes['toggleIconSize'] ) ? $attributes['toggleIconSize'] : '18px';
		$toggle_icon_padding = isset( $attributes['toggleIconPadding'] ) ? $attributes['toggleIconPadding'] : '0px';
	
		$offcanvas_width = ! empty( $attributes['offcanvasWidth'] ) ? $attributes['offcanvasWidth'] : '90vw';
	
		$offcanvas_background_color = isset( $attributes['offcanvasBackgroundColor'] ) ? $attributes['offcanvasBackgroundColor'] : '';
	
		$offcanvas_menu_item_padding_horizontal = isset( $attributes['offcanvasMenuItemPaddingHorizontal'] ) ? $attributes['offcanvasMenuItemPaddingHorizontal'] : '0px';
		if ( '' === $offcanvas_menu_item_padding_horizontal ) {
			$offcanvas_menu_item_padding_horizontal = '0px';
		}
	
		$offcanvas_menu_item_padding_vertical = isset( $attributes['offcanvasMenuItemPaddingVertical'] ) ? $attributes['offcanvasMenuItemPaddingVertical'] : '0px';
		if ( '' === $offcanvas_menu_item_padding_vertical ) {
			$offcanvas_menu_item_padding_vertical = '0px';
		}
	
		$show_dropdown_indicator = ! empty( $attributes['showDropdownIndicator'] );
		$dropdown_indicator_gap  = isset( $attributes['dropdownIndicatorGap'] ) ? $attributes['dropdownIndicatorGap'] : '8px';
		if ( '' === $dropdown_indicator_gap ) {
			$dropdown_indicator_gap = '8px';
		}
		$dropdown_indicator_size = isset( $attributes['dropdownIndicatorSize'] ) ? $attributes['dropdownIndicatorSize'] : '12px';
		if ( '' === $dropdown_indicator_size ) {
			$dropdown_indicator_size = '12px';
		}
	
		$style = '--cb-navigation-gap:' . esc_attr( $item_spacing ) . ';';
		$style .= '--cb-navigation-justify-desktop:' . esc_attr( $justify_desktop ) . ';';
	
		if ( $justify_tablet ) {
			$style .= '--cb-navigation-justify-tablet:' . esc_attr( $justify_tablet ) . ';';
		}
	
		if ( $justify_mobile ) {
			$style .= '--cb-navigation-justify-mobile:' . esc_attr( $justify_mobile ) . ';';
		}
	
		if ( $submenu_text_color ) {
			$style .= '--cb-navigation-submenu-text-color:' . esc_attr( $submenu_text_color ) . ';';
		}
	
		if ( $submenu_text_hover_color ) {
			$style .= '--cb-navigation-submenu-text-hover-color:' . esc_attr( $submenu_text_hover_color ) . ';';
		}
	
		if ( $submenu_text_alignment ) {
			$style .= '--cb-navigation-submenu-text-align:' . esc_attr( $submenu_text_alignment ) . ';';
		}
	
		if ( $submenu_offset_top ) {
			$style .= '--cb-navigation-submenu-offset-top:' . esc_attr( $submenu_offset_top ) . ';';
		}
	
		if ( $submenu_hover_bg ) {
			$style .= '--cb-navigation-submenu-hover-bg:' . esc_attr( $submenu_hover_bg ) . ';';
		}
	
		if ( $submenu_item_padding ) {
			$style .= '--cb-navigation-submenu-item-padding:' . esc_attr( $submenu_item_padding ) . ';';
		}
	
		if ( $menu_item_padding ) {
			$style .= '--cb-navigation-menu-item-padding-horizontal:' . esc_attr( $menu_item_padding ) . ';';
		}
	
		if ( $menu_item_padding_vertical ) {
			$style .= '--cb-navigation-menu-item-padding-vertical:' . esc_attr( $menu_item_padding_vertical ) . ';';
		}

		$menu_item_text_color = ! empty( $attributes['menuItemTextColor'] )
			? SpacingCss::sanitize_background_color( $attributes['menuItemTextColor'] )
			: '';
		$menu_item_text_hover_color = ! empty( $attributes['menuItemTextHoverColor'] )
			? SpacingCss::sanitize_background_color( $attributes['menuItemTextHoverColor'] )
			: '';
		$menu_item_font_weight    = self::sanitize_menu_item_font_weight( isset( $attributes['menuItemFontWeight'] ) ? $attributes['menuItemFontWeight'] : '' );
		$menu_item_font_sizes     = self::menu_item_font_sizes_from_attributes( $attributes );
		$lh_set = array_key_exists( 'menuItemLineHeightSet', $attributes )
			? (bool) $attributes['menuItemLineHeightSet']
			: null;
		$menu_item_line_height    = self::menu_item_line_height_css(
			isset( $attributes['menuItemLineHeight'] ) ? $attributes['menuItemLineHeight'] : 0,
			isset( $attributes['menuItemLineHeightUnit'] ) ? $attributes['menuItemLineHeightUnit'] : '',
			$lh_set
		);
		$menu_item_letter_spacing = self::menu_item_letter_spacing_merged( $attributes );

		if ( $menu_item_text_color ) {
			$style .= '--cb-navigation-menu-item-text-color:' . esc_attr( $menu_item_text_color ) . ';';
		}

		if ( $menu_item_text_hover_color ) {
			$style .= '--cb-navigation-menu-item-text-hover-color:' . esc_attr( $menu_item_text_hover_color ) . ';';
		}

		if ( ! empty( $menu_item_font_sizes['desktop'] ) ) {
			$style .= '--cb-navigation-menu-item-font-size:' . esc_attr( $menu_item_font_sizes['desktop'] ) . ';';
		}

		if ( ! empty( $menu_item_font_sizes['tablet'] ) ) {
			$style .= '--cb-navigation-menu-item-font-size-tablet:' . esc_attr( $menu_item_font_sizes['tablet'] ) . ';';
		}

		if ( ! empty( $menu_item_font_sizes['mobile'] ) ) {
			$style .= '--cb-navigation-menu-item-font-size-mobile:' . esc_attr( $menu_item_font_sizes['mobile'] ) . ';';
		}

		if ( $menu_item_font_weight ) {
			$style .= '--cb-navigation-menu-item-font-weight:' . esc_attr( $menu_item_font_weight ) . ';';
		}

		if ( $menu_item_line_height ) {
			$style .= '--cb-navigation-menu-item-line-height:' . esc_attr( $menu_item_line_height ) . ';';
		}

		if ( $menu_item_letter_spacing ) {
			$style .= '--cb-navigation-menu-item-letter-spacing:' . esc_attr( $menu_item_letter_spacing ) . ';';
		}
	
		$style .= '--cb-navigation-mobile-menu-text-color:' . esc_attr( $mobile_menu_text_color ) . ';';
	
		if ( $mobile_menu_hover_text_color ) {
			$style .= '--cb-navigation-mobile-menu-text-hover-color:' . esc_attr( $mobile_menu_hover_text_color ) . ';';
		}
	
		$style .= '--cb-navigation-mobile-submenu-text-color:' . esc_attr( $mobile_submenu_text_color ) . ';';
	
		if ( $mobile_submenu_hover_text_color ) {
			$style .= '--cb-navigation-mobile-submenu-text-hover-color:' . esc_attr( $mobile_submenu_hover_text_color ) . ';';
		}
	
		$style .= '--cb-navigation-toggle-icon-size:' . esc_attr( $toggle_icon_size ) . ';';
		$style .= '--cb-navigation-toggle-padding:' . esc_attr( $toggle_icon_padding ) . ';';
	
		if ( $toggle_icon_color ) {
			$style .= '--cb-navigation-toggle-icon-color:' . esc_attr( $toggle_icon_color ) . ';';
		}
	
		$style .= '--cb-navigation-offcanvas-width:' . esc_attr( $offcanvas_width ) . ';';
	
		if ( '' !== $offcanvas_background_color ) {
			$style .= '--cb-navigation-offcanvas-bg:' . esc_attr( $offcanvas_background_color ) . ';';
		}
	
		$style .= '--cb-navigation-offcanvas-menu-item-padding-horizontal:' . esc_attr( $offcanvas_menu_item_padding_horizontal ) . ';';
		$style .= '--cb-navigation-offcanvas-menu-item-padding-vertical:' . esc_attr( $offcanvas_menu_item_padding_vertical ) . ';';
	
		if ( $show_dropdown_indicator ) {
			$indicator_gap_css = ( is_int( $dropdown_indicator_gap ) || is_float( $dropdown_indicator_gap ) || ( is_string( $dropdown_indicator_gap ) && is_numeric( $dropdown_indicator_gap ) ) )
				? floatval( $dropdown_indicator_gap ) . 'px'
				: $dropdown_indicator_gap;
			$indicator_size_css = ( is_int( $dropdown_indicator_size ) || is_float( $dropdown_indicator_size ) || ( is_string( $dropdown_indicator_size ) && is_numeric( $dropdown_indicator_size ) ) )
				? floatval( $dropdown_indicator_size ) . 'px'
				: $dropdown_indicator_size;
			$style .= '--cb-navigation-indicator-gap:' . esc_attr( $indicator_gap_css ) . ';';
			$style .= '--cb-navigation-indicator-size:' . esc_attr( $indicator_size_css ) . ';';
		}
	
		$cb_spacing_vars = SpacingCss::spacing_vars_style( $attributes );
		if ( '' !== $cb_spacing_vars ) {
			$style .= $cb_spacing_vars;
		}
	
		$cb_border_vars = SpacingCss::border_vars_style( $attributes );
		if ( '' !== $cb_border_vars ) {
			$style .= ( '' !== $style ? ';' : '' ) . $cb_border_vars;
		}
	
		$cb_bg = SpacingCss::background_style_fragment( $attributes );
		if ( '' !== $cb_bg ) {
			$style .= ( '' !== $style ? ';' : '' ) . rtrim( $cb_bg, ';' );
		}
	
		return $style;
	}

	/**
	 * Map alignment keyword to flex alignment value.
	 *
	 * @param string $alignment Alignment keyword.
	 * @return string
	 */
	private static function alignment_to_justify( $alignment ) {
		switch ( $alignment ) {
			case 'center':
				return 'center';
			case 'right':
				return 'flex-end';
			case 'left':
			default:
				return 'flex-start';
		}
	}

	/**
	 * @param array $attributes Block attributes.
	 * @return array{desktop:string,tablet:string,mobile:string}
	 */
	private static function menu_item_font_sizes_from_attributes( $attributes ) {
		$unit = self::sanitize_menu_item_font_size_unit(
			isset( $attributes['menuItemFontSizeUnit'] ) ? $attributes['menuItemFontSizeUnit'] : 'px'
		);
		$desktop_n = isset( $attributes['menuItemFontSizeDesktop'] ) ? floatval( $attributes['menuItemFontSizeDesktop'] ) : 0;
		$tablet_n  = isset( $attributes['menuItemFontSizeTablet'] ) ? floatval( $attributes['menuItemFontSizeTablet'] ) : 0;
		$mobile_n  = isset( $attributes['menuItemFontSizeMobile'] ) ? floatval( $attributes['menuItemFontSizeMobile'] ) : 0;

		$legacy = isset( $attributes['menuItemFontSize'] ) ? trim( (string) $attributes['menuItemFontSize'] ) : '';
		if ( $desktop_n <= 0 && '' !== $legacy ) {
			$parsed = self::sanitize_menu_item_font_size( $legacy );
			if ( '' !== $parsed ) {
				return array(
					'desktop' => $parsed,
					'tablet'  => '',
					'mobile'  => '',
				);
			}
		}

		return array(
			'desktop' => self::menu_item_font_size_from_number_and_unit( $desktop_n, $unit ),
			'tablet'  => self::menu_item_font_size_from_number_and_unit( $tablet_n, $unit ),
			'mobile'  => self::menu_item_font_size_from_number_and_unit( $mobile_n, $unit ),
		);
	}

	/**
	 * @param mixed $unit Raw unit.
	 * @return string
	 */
	private static function sanitize_menu_item_font_size_unit( $unit ) {
		$u = strtolower( trim( (string) $unit ) );
		$allowed = array( 'px', 'rem', 'em', '%' );
		return in_array( $u, $allowed, true ) ? $u : 'px';
	}

	/**
	 * @param float $n    Size number.
	 * @param mixed $unit Unit string.
	 * @return string
	 */
	private static function menu_item_font_size_from_number_and_unit( $n, $unit ) {
		if ( ! is_numeric( $n ) || floatval( $n ) <= 0 ) {
			return '';
		}
		$u = self::sanitize_menu_item_font_size_unit( $unit );
		return floatval( $n ) . $u;
	}

	/**
	 * @param mixed            $value        Raw line-height number.
	 * @param mixed            $unit         '', 'px', 'em', or 'rem'; empty means unitless ratio.
	 * @param bool|string|null $explicit_set false = theme default; true = emit including 0; null = legacy.
	 * @return string
	 */
	private static function menu_item_line_height_css( $value, $unit, $explicit_set = null ) {
		if ( is_array( $value ) || is_object( $value ) ) {
			return '';
		}
		if ( false === $explicit_set ) {
			return '';
		}
		$v = floatval( $value );
		if ( null === $explicit_set ) {
			if ( $v <= 0 ) {
				return '';
			}
		} elseif ( true === $explicit_set && $v < 0 ) {
			return '';
		}
		$u = strtolower( trim( (string) $unit ) );
		$allowed = array( '', 'px', 'em', 'rem' );
		if ( ! in_array( $u, $allowed, true ) ) {
			$u = '';
		}
		if ( '' === $u ) {
			return (string) $v;
		}
		return $v . $u;
	}

	/**
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	private static function menu_item_letter_spacing_merged( $attributes ) {
		$legacy = isset( $attributes['menuItemLetterSpacing'] ) ? trim( (string) $attributes['menuItemLetterSpacing'] ) : '';
		$val_n  = isset( $attributes['menuItemLetterSpacingValue'] ) ? floatval( $attributes['menuItemLetterSpacingValue'] ) : 0;
		$u      = isset( $attributes['menuItemLetterSpacingUnit'] ) ? strtolower( trim( (string) $attributes['menuItemLetterSpacingUnit'] ) ) : 'em';
		$allowed_u = array( 'px', 'em', 'rem', '%' );
		if ( ! in_array( $u, $allowed_u, true ) ) {
			$u = 'em';
		}
		if ( array_key_exists( 'menuItemLetterSpacingSet', $attributes ) ) {
			if ( ! $attributes['menuItemLetterSpacingSet'] ) {
				return '' !== $legacy ? self::sanitize_menu_item_letter_spacing( $legacy ) : '';
			}
			$combined = $val_n . $u;
			return self::sanitize_menu_item_letter_spacing( $combined );
		}
		if ( 0.0 !== $val_n ) {
			$combined = $val_n . $u;
			return self::sanitize_menu_item_letter_spacing( $combined );
		}
		if ( '' !== $legacy ) {
			return self::sanitize_menu_item_letter_spacing( $legacy );
		}
		return '';
	}

	/**
	 * @param mixed $value Raw attribute.
	 * @return string Safe font-size or empty.
	 */
	private static function sanitize_menu_item_font_size( $value ) {
		if ( is_array( $value ) || is_object( $value ) ) {
			return '';
		}
		$value = trim( (string) $value );
		if ( '' === $value ) {
			return '';
		}
		if ( preg_match( '/^[\d.]+\s*(px|rem|em|%)$/i', $value ) ) {
			return preg_replace( '/\s+/', '', $value );
		}
		return '';
	}

	/**
	 * @param mixed $value Raw attribute.
	 * @return string Numeric weight or empty.
	 */
	private static function sanitize_menu_item_font_weight( $value ) {
		if ( is_array( $value ) || is_object( $value ) ) {
			return '';
		}
		$value = trim( (string) $value );
		if ( '' === $value ) {
			return '';
		}
		if ( in_array( $value, array( '400', '500', '600', '700' ), true ) ) {
			return $value;
		}
		return '';
	}

	/**
	 * @param mixed $value Raw attribute.
	 * @return string Safe letter-spacing or empty.
	 */
	private static function sanitize_menu_item_letter_spacing( $value ) {
		if ( is_array( $value ) || is_object( $value ) ) {
			return '';
		}
		$value = trim( (string) $value );
		if ( '' === $value ) {
			return '';
		}
		$lower = strtolower( $value );
		if ( in_array( $lower, array( 'normal', 'inherit', 'initial', 'unset' ), true ) ) {
			return $lower;
		}
		if ( preg_match( '/^-?[\d.]+\s*(px|rem|em|%)$/i', $value ) ) {
			return preg_replace( '/\s+/', '', $value );
		}
		return '';
	}
}
