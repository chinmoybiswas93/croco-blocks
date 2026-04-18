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

use CrocoBlocks\BlockSupport\InstanceCss;
use CrocoBlocks\BlockSupport\NavigationMenuStyleDeclarations;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$menu_id     = ! empty( $attributes['menuId'] ) ? intval( $attributes['menuId'] ) : 0;
$orientation = ! empty( $attributes['orientation'] ) ? $attributes['orientation'] : 'horizontal';

$allowed_alignments = array( 'left', 'center', 'right' );

$submenu_alignment = ! empty( $attributes['submenuAlignment'] ) ? $attributes['submenuAlignment'] : 'center';
if ( ! in_array( $submenu_alignment, $allowed_alignments, true ) ) {
	$submenu_alignment = 'center';
}

$enable_toggle = ! empty( $attributes['enableToggle'] );

$toggle_breakpoint = ! empty( $attributes['toggleBreakpoint'] ) ? $attributes['toggleBreakpoint'] : 'mobile';
if ( ! in_array( $toggle_breakpoint, array( 'tablet', 'mobile' ), true ) ) {
	$toggle_breakpoint = 'mobile';
}

$show_dropdown_indicator = ! empty( $attributes['showDropdownIndicator'] );

if ( ! $menu_id ) {
	if ( is_admin() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
		echo '<p>' . esc_html__( 'Please select a menu in the block settings.', 'croco-blocks' ) . '</p>';
	}
	return;
}

$decl = NavigationMenuStyleDeclarations::declarations( $attributes );

$style = '';
$queued = false;
if ( '' !== $decl ) {
	$queued = InstanceCss::try_queue( 'croco-blocks/navigation-menu', $attributes, $decl );
}
if ( $queued ) {
	$style = '';
} else {
	$style = $decl;
}

$inst_classes = InstanceCss::wrapper_class_string( 'croco-blocks/navigation-menu', $attributes );

$nav_classes = 'cb-navigation cb-navigation--' . esc_attr( $orientation ) . ' cb-navigation--submenu-align-' . esc_attr( $submenu_alignment );

if ( $show_dropdown_indicator ) {
	$nav_classes .= ' cb-navigation--show-indicators';
}

if ( $enable_toggle ) {
	$nav_classes .= ' cb-navigation--has-toggle cb-navigation--toggle-from-' . esc_attr( $toggle_breakpoint );
}

if ( $inst_classes ) {
	$nav_classes .= ' ' . $inst_classes;
}

$wrapper_attrs = array(
	'class' => $nav_classes,
);

if ( '' !== $style ) {
	$wrapper_attrs['style'] = $style;
}

$wrapper_attributes = get_block_wrapper_attributes( $wrapper_attrs );

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
