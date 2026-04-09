<?php
/**
 * Navigation Menu block — server-side render.
 *
 * @package Croco_Blocks
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block inner content (empty for dynamic blocks).
 * @var WP_Block $block      Block instance.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once dirname( __DIR__, 3 ) . '/src/block-support/spacing-css.php';

$menu_id      = ! empty( $attributes['menuId'] ) ? intval( $attributes['menuId'] ) : 0;
$orientation  = ! empty( $attributes['orientation'] ) ? $attributes['orientation'] : 'horizontal';
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

/**
 * Map alignment keyword to flex alignment value.
 *
 * @param string $alignment Alignment keyword.
 * @return string
 */
if ( ! function_exists( 'croco_blocks_nav_alignment_to_justify' ) ) {
	function croco_blocks_nav_alignment_to_justify( $alignment ) {
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

$justify_desktop = croco_blocks_nav_alignment_to_justify( $alignment_desktop );
$justify_tablet  = $alignment_tablet ? croco_blocks_nav_alignment_to_justify( $alignment_tablet ) : '';
$justify_mobile  = $alignment_mobile ? croco_blocks_nav_alignment_to_justify( $alignment_mobile ) : '';

$submenu_text_color       = ! empty( $attributes['submenuTextColor'] ) ? $attributes['submenuTextColor'] : '';
$submenu_text_hover_color = ! empty( $attributes['submenuTextHoverColor'] ) ? $attributes['submenuTextHoverColor'] : '';

$mobile_menu_text_color         = ! empty( $attributes['mobileMenuTextColor'] ) ? $attributes['mobileMenuTextColor'] : '#ffffff';
$mobile_menu_hover_text_color   = ! empty( $attributes['mobileMenuHoverTextColor'] ) ? $attributes['mobileMenuHoverTextColor'] : '';
$mobile_submenu_text_color      = ! empty( $attributes['mobileSubmenuTextColor'] ) ? $attributes['mobileSubmenuTextColor'] : '#ffffff';
$mobile_submenu_hover_text_color = ! empty( $attributes['mobileSubmenuHoverTextColor'] ) ? $attributes['mobileSubmenuHoverTextColor'] : '';

$submenu_alignment = ! empty( $attributes['submenuAlignment'] ) ? $attributes['submenuAlignment'] : 'center';
if ( ! in_array( $submenu_alignment, $allowed_alignments, true ) ) {
	$submenu_alignment = 'center';
}

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

$enable_toggle = ! empty( $attributes['enableToggle'] );

$toggle_breakpoint = ! empty( $attributes['toggleBreakpoint'] ) ? $attributes['toggleBreakpoint'] : 'mobile';
if ( ! in_array( $toggle_breakpoint, array( 'tablet', 'mobile' ), true ) ) {
	$toggle_breakpoint = 'mobile';
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

if ( ! $menu_id ) {
	if ( is_admin() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
		echo '<p>' . esc_html__( 'Please select a menu in the block settings.', 'croco-blocks' ) . '</p>';
	}
	return;
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

$nav_classes = 'cb-navigation cb-navigation--' . esc_attr( $orientation ) . ' cb-navigation--submenu-align-' . esc_attr( $submenu_alignment );

if ( $show_dropdown_indicator ) {
	$nav_classes .= ' cb-navigation--show-indicators';
	// Always output gap/size; plain 0 is valid (do not use `if ( $gap )` — 0 is falsy in PHP).
	$indicator_gap_css = ( is_int( $dropdown_indicator_gap ) || is_float( $dropdown_indicator_gap ) || ( is_string( $dropdown_indicator_gap ) && is_numeric( $dropdown_indicator_gap ) ) )
		? floatval( $dropdown_indicator_gap ) . 'px'
		: $dropdown_indicator_gap;
	$indicator_size_css = ( is_int( $dropdown_indicator_size ) || is_float( $dropdown_indicator_size ) || ( is_string( $dropdown_indicator_size ) && is_numeric( $dropdown_indicator_size ) ) )
		? floatval( $dropdown_indicator_size ) . 'px'
		: $dropdown_indicator_size;
	$style .= '--cb-navigation-indicator-gap:' . esc_attr( $indicator_gap_css ) . ';';
	$style .= '--cb-navigation-indicator-size:' . esc_attr( $indicator_size_css ) . ';';
}

if ( $enable_toggle ) {
	$nav_classes .= ' cb-navigation--has-toggle cb-navigation--toggle-from-' . esc_attr( $toggle_breakpoint );
}

$cb_spacing_vars = croco_blocks_spacing_css_vars_style( $attributes );
if ( '' !== $cb_spacing_vars ) {
	$style .= $cb_spacing_vars;
}

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => $nav_classes,
		'style' => $style,
	)
);

// Render a classic WordPress menu via wp_nav_menu() only.
$menu_html = wp_nav_menu(
	array(
		'menu'        => $menu_id,
		'container'   => false,
		'items_wrap'  => '%3$s',
		'echo'        => false,
		'fallback_cb' => false,
		// Allow full hierarchy so submenus can be shown on hover.
		'depth'       => 0,
	)
);

if ( ! $menu_html ) {
	return;
}

$menu_object = wp_get_nav_menu_object( $menu_id );
$aria_label  = esc_attr( $menu_object->name ?? __( 'Navigation', 'croco-blocks' ) );

// Build logo/header markup for off-canvas.
$logo_markup = '';
if ( function_exists( 'get_custom_logo' ) && has_custom_logo() ) {
	$logo_markup = get_custom_logo();
} else {
	$site_title  = get_bloginfo( 'name' );
	$logo_markup = sprintf(
		'<span class="cb-navigation__site-title">%s</span>',
		esc_html( $site_title )
	);
}

// Off-canvas id (used for aria-controls and search input id when toggle is enabled).
$offcanvas_id = $enable_toggle ? 'cb-navigation-offcanvas-' . uniqid() : 'nav';

// Search form for off-canvas (WordPress search flow).
$search_form  = '<form role="search" method="get" class="cb-navigation__offcanvas-search" action="' . esc_url( home_url( '/' ) ) . '">';
$search_form .= '<label for="cb-offcanvas-search-' . esc_attr( $offcanvas_id ) . '" class="screen-reader-text">' . esc_html__( 'Search', 'croco-blocks' ) . '</label>';
$search_form .= '<span class="cb-navigation__offcanvas-search-wrap">';
$search_form .= '<input type="search" id="cb-offcanvas-search-' . esc_attr( $offcanvas_id ) . '" class="cb-navigation__offcanvas-search-input" name="s" placeholder="' . esc_attr__( 'Search…', 'croco-blocks' ) . '" />';
$search_form .= '<span class="cb-navigation__offcanvas-search-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></span>';
$search_form .= '</span></form>';

$offcanvas_header = sprintf(
	'<div class="cb-navigation__offcanvas-header">%1$s%2$s</div>',
	$logo_markup,
	$search_form
);

if ( $enable_toggle ) {
	printf(
		'<nav %1$s aria-label="%2$s" data-cb-toggle-breakpoint="%3$s">
			<button class="cb-navigation__toggle-button" type="button" aria-expanded="false" aria-controls="%4$s">
				<span class="cb-navigation__toggle-icon" aria-hidden="true"></span>
				<span class="screen-reader-text">%5$s</span>
			</button>
			<ul class="cb-navigation__list cb-navigation__list--desktop">%6$s</ul>
			<div class="cb-navigation__offcanvas" id="%4$s" aria-hidden="true">
				<div class="cb-navigation__offcanvas-inner">
					%7$s
					<ul class="cb-navigation__list cb-navigation__list--offcanvas">%6$s</ul>
				</div>
			</div>
		</nav>',
		$wrapper_attributes,
		$aria_label,
		esc_attr( $toggle_breakpoint ),
		esc_attr( $offcanvas_id ),
		esc_html__( 'Toggle navigation', 'croco-blocks' ),
		$menu_html,
		$offcanvas_header
	);
} else {
	printf(
		'<nav %1$s aria-label="%2$s"><ul class="cb-navigation__list">%3$s</ul></nav>',
		$wrapper_attributes,
		$aria_label,
		$menu_html
	);
}
