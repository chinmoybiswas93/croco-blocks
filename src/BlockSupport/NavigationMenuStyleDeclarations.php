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
}
