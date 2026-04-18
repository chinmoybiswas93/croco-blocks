/**
 * Mirrors NavigationMenuStyleDeclarations::declarations (PHP).
 *
 * @param {Object} attributes
 * @return {string}
 */
import { buildAdvancedTabDeclarationsString } from './crocoInstanceCssAdvanced';

function navAlignmentToJustify( alignment ) {
	switch ( alignment ) {
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
 * @param {Object} a
 * @return {string}
 */
export function buildNavigationMenuStyleDeclarationsString( a ) {
	const item_spacing = a.itemSpacing || '20px';

	const allowed = [ 'left', 'center', 'right' ];

	let alignment_desktop = a.alignmentDesktop || 'left';
	if ( ! allowed.includes( alignment_desktop ) ) {
		alignment_desktop = 'left';
	}

	let alignment_tablet = a.alignmentTablet || '';
	if ( alignment_tablet && ! allowed.includes( alignment_tablet ) ) {
		alignment_tablet = '';
	}

	let alignment_mobile = a.alignmentMobile || '';
	if ( alignment_mobile && ! allowed.includes( alignment_mobile ) ) {
		alignment_mobile = '';
	}

	const justify_desktop = navAlignmentToJustify( alignment_desktop );
	const justify_tablet = alignment_tablet
		? navAlignmentToJustify( alignment_tablet )
		: '';
	const justify_mobile = alignment_mobile
		? navAlignmentToJustify( alignment_mobile )
		: '';

	const submenu_text_color = a.submenuTextColor || '';
	const submenu_text_hover_color = a.submenuTextHoverColor || '';

	const mobile_menu_text_color = a.mobileMenuTextColor || '#ffffff';
	const mobile_menu_hover_text_color = a.mobileMenuHoverTextColor || '';
	const mobile_submenu_text_color = a.mobileSubmenuTextColor || '#ffffff';
	const mobile_submenu_hover_text_color = a.mobileSubmenuHoverTextColor || '';

	let submenu_text_alignment = a.submenuTextAlignment || 'left';
	if ( ! allowed.includes( submenu_text_alignment ) ) {
		submenu_text_alignment = 'left';
	}

	let submenu_offset_top = a.submenuOffsetTop ?? '0px';
	if ( submenu_offset_top === '' ) {
		submenu_offset_top = '0px';
	}

	const submenu_hover_bg = a.submenuHoverBackgroundColor || '';

	let submenu_item_padding = a.submenuItemPadding ?? '0.4rem 1rem';
	if ( submenu_item_padding === '' ) {
		submenu_item_padding = '0';
	}

	let menu_item_padding = a.menuItemPadding ?? '0px';
	if ( menu_item_padding === '' ) {
		menu_item_padding = '0';
	}

	let menu_item_padding_vertical = a.menuItemPaddingVertical ?? '0px';
	if ( menu_item_padding_vertical === '' ) {
		menu_item_padding_vertical = '0';
	}

	const toggle_icon_color = a.toggleIconColor || '';
	const toggle_icon_size = a.toggleIconSize ?? '18px';
	const toggle_icon_padding = a.toggleIconPadding ?? '0px';

	const offcanvas_width = a.offcanvasWidth || '90vw';

	const offcanvas_background_color = a.offcanvasBackgroundColor ?? '';

	let offcanvas_menu_item_padding_horizontal =
		a.offcanvasMenuItemPaddingHorizontal ?? '0px';
	if ( offcanvas_menu_item_padding_horizontal === '' ) {
		offcanvas_menu_item_padding_horizontal = '0px';
	}

	let offcanvas_menu_item_padding_vertical =
		a.offcanvasMenuItemPaddingVertical ?? '0px';
	if ( offcanvas_menu_item_padding_vertical === '' ) {
		offcanvas_menu_item_padding_vertical = '0px';
	}

	const show_dropdown_indicator = !! a.showDropdownIndicator;
	let dropdown_indicator_gap = a.dropdownIndicatorGap ?? '8px';
	if ( dropdown_indicator_gap === '' ) {
		dropdown_indicator_gap = '8px';
	}
	let dropdown_indicator_size = a.dropdownIndicatorSize ?? '12px';
	if ( dropdown_indicator_size === '' ) {
		dropdown_indicator_size = '12px';
	}

	let style = `--cb-navigation-gap:${ String( item_spacing ) };`;
	style += `--cb-navigation-justify-desktop:${ String( justify_desktop ) };`;

	if ( justify_tablet ) {
		style += `--cb-navigation-justify-tablet:${ String( justify_tablet ) };`;
	}

	if ( justify_mobile ) {
		style += `--cb-navigation-justify-mobile:${ String( justify_mobile ) };`;
	}

	if ( submenu_text_color ) {
		style += `--cb-navigation-submenu-text-color:${ String( submenu_text_color ) };`;
	}

	if ( submenu_text_hover_color ) {
		style += `--cb-navigation-submenu-text-hover-color:${ String( submenu_text_hover_color ) };`;
	}

	if ( submenu_text_alignment ) {
		style += `--cb-navigation-submenu-text-align:${ String( submenu_text_alignment ) };`;
	}

	if ( submenu_offset_top ) {
		style += `--cb-navigation-submenu-offset-top:${ String( submenu_offset_top ) };`;
	}

	if ( submenu_hover_bg ) {
		style += `--cb-navigation-submenu-hover-bg:${ String( submenu_hover_bg ) };`;
	}

	if ( submenu_item_padding ) {
		style += `--cb-navigation-submenu-item-padding:${ String( submenu_item_padding ) };`;
	}

	if ( menu_item_padding ) {
		style += `--cb-navigation-menu-item-padding-horizontal:${ String( menu_item_padding ) };`;
	}

	if ( menu_item_padding_vertical ) {
		style += `--cb-navigation-menu-item-padding-vertical:${ String( menu_item_padding_vertical ) };`;
	}

	style += `--cb-navigation-mobile-menu-text-color:${ String( mobile_menu_text_color ) };`;

	if ( mobile_menu_hover_text_color ) {
		style += `--cb-navigation-mobile-menu-text-hover-color:${ String( mobile_menu_hover_text_color ) };`;
	}

	style += `--cb-navigation-mobile-submenu-text-color:${ String( mobile_submenu_text_color ) };`;

	if ( mobile_submenu_hover_text_color ) {
		style += `--cb-navigation-mobile-submenu-text-hover-color:${ String( mobile_submenu_hover_text_color ) };`;
	}

	style += `--cb-navigation-toggle-icon-size:${ String( toggle_icon_size ) };`;
	style += `--cb-navigation-toggle-padding:${ String( toggle_icon_padding ) };`;

	if ( toggle_icon_color ) {
		style += `--cb-navigation-toggle-icon-color:${ String( toggle_icon_color ) };`;
	}

	style += `--cb-navigation-offcanvas-width:${ String( offcanvas_width ) };`;

	if ( offcanvas_background_color !== '' ) {
		style += `--cb-navigation-offcanvas-bg:${ String( offcanvas_background_color ) };`;
	}

	style += `--cb-navigation-offcanvas-menu-item-padding-horizontal:${ String(
		offcanvas_menu_item_padding_horizontal
	) };`;
	style += `--cb-navigation-offcanvas-menu-item-padding-vertical:${ String(
		offcanvas_menu_item_padding_vertical
	) };`;

	if ( show_dropdown_indicator ) {
		const indicator_gap_css =
			typeof dropdown_indicator_gap === 'number' ||
			( typeof dropdown_indicator_gap === 'string' &&
				! Number.isNaN( Number( dropdown_indicator_gap ) ) )
				? `${ parseFloat( String( dropdown_indicator_gap ), 10 ) }px`
				: dropdown_indicator_gap;
		const indicator_size_css =
			typeof dropdown_indicator_size === 'number' ||
			( typeof dropdown_indicator_size === 'string' &&
				! Number.isNaN( Number( dropdown_indicator_size ) ) )
				? `${ parseFloat( String( dropdown_indicator_size ), 10 ) }px`
				: dropdown_indicator_size;
		style += `--cb-navigation-indicator-gap:${ String( indicator_gap_css ) };`;
		style += `--cb-navigation-indicator-size:${ String( indicator_size_css ) };`;
	}

	const adv = buildAdvancedTabDeclarationsString( a );
	if ( adv ) {
		style += ( style !== '' ? ';' : '' ) + adv;
	}

	return style;
}

