/**
 * Mirrors HeroSliderStyleDeclarations::declarations (PHP) for editor instance CSS.
 *
 * @param {Object} attributes
 * @return {string}
 */
import { buildAdvancedTabDeclarationsString } from './crocoInstanceCssAdvanced';

/**
 * @param {number|string|undefined} val
 * @param {string|undefined}        unit
 * @param {boolean|undefined}       explicitSet false = default; true = emit including 0; undefined = legacy.
 * @return {string}
 */
function heroLineHeightCss( val, unit, explicitSet ) {
	if ( explicitSet === false ) {
		return '';
	}
	const v = parseFloat( String( val ), 10 );
	if ( ! Number.isFinite( v ) ) {
		return '';
	}
	if ( explicitSet === undefined ) {
		if ( v <= 0 ) {
			return '';
		}
	} else if ( explicitSet === true && v < 0 ) {
		return '';
	}
	const u = String( unit ?? '' ).toLowerCase().trim();
	if ( [ 'px', 'em', 'rem' ].includes( u ) ) {
		return `${ v }${ u }`;
	}
	return String( v );
}

/**
 * @param {Object} a
 * @return {string}
 */
export function buildHeroSliderStyleDeclarationsString( a ) {
	const height_mode = a.heightMode ?? 'vh';
	const height_desktop = a.heightDesktop ?? '80vh';
	const height_tablet = a.heightTablet ?? '60vh';
	const height_mobile = a.heightMobile ?? '60vh';

	const overlay_color = a.overlayColor ?? '';
	const overlay_gradient = a.overlayGradient ?? '';

	const content_align = a.contentAlign ?? 'left';

	const heading_color = a.headingColor ?? '';
	const text_color = a.textColor ?? '';
	const heading_font_size = a.headingFontSize ? parseInt( String( a.headingFontSize ), 10 ) : 0;
	const text_font_size = a.textFontSize ? parseInt( String( a.textFontSize ), 10 ) : 0;
	const heading_line_height_css = heroLineHeightCss(
		a.headingLineHeight,
		a.headingLineHeightUnit,
		Object.prototype.hasOwnProperty.call( a, 'headingLineHeightSet' )
			? a.headingLineHeightSet
			: undefined
	);
	const text_line_height_css = heroLineHeightCss(
		a.textLineHeight,
		a.textLineHeightUnit,
		Object.prototype.hasOwnProperty.call( a, 'textLineHeightSet' )
			? a.textLineHeightSet
			: undefined
	);
	const heading_margin_bottom = a.headingMarginBottom
		? parseInt( String( a.headingMarginBottom ), 10 )
		: 0;
	const text_margin_bottom = a.textMarginBottom
		? parseInt( String( a.textMarginBottom ), 10 )
		: 0;

	const heading_font_size_desktop = a.headingFontSizeDesktop
		? parseFloat( String( a.headingFontSizeDesktop ) )
		: 0;
	const heading_font_size_tablet = a.headingFontSizeTablet
		? parseFloat( String( a.headingFontSizeTablet ) )
		: 0;
	const heading_font_size_mobile = a.headingFontSizeMobile
		? parseFloat( String( a.headingFontSizeMobile ) )
		: 0;
	let heading_font_size_unit = a.headingFontSizeUnit ?? 'px';

	const text_font_size_desktop = a.textFontSizeDesktop
		? parseFloat( String( a.textFontSizeDesktop ) )
		: 0;
	const text_font_size_tablet = a.textFontSizeTablet
		? parseFloat( String( a.textFontSizeTablet ) )
		: 0;
	const text_font_size_mobile = a.textFontSizeMobile
		? parseFloat( String( a.textFontSizeMobile ) )
		: 0;
	let text_font_size_unit = a.textFontSizeUnit ?? 'px';

	let heading_margin_bottom_desktop = a.headingMarginBottomDesktop
		? parseFloat( String( a.headingMarginBottomDesktop ) )
		: 0;
	let heading_margin_bottom_tablet = a.headingMarginBottomTablet
		? parseFloat( String( a.headingMarginBottomTablet ) )
		: 0;
	let heading_margin_bottom_mobile = a.headingMarginBottomMobile
		? parseFloat( String( a.headingMarginBottomMobile ) )
		: 0;
	let heading_margin_bottom_unit = a.headingMarginBottomUnit ?? 'px';

	let text_margin_bottom_desktop = a.textMarginBottomDesktop
		? parseFloat( String( a.textMarginBottomDesktop ) )
		: 0;
	let text_margin_bottom_tablet = a.textMarginBottomTablet
		? parseFloat( String( a.textMarginBottomTablet ) )
		: 0;
	let text_margin_bottom_mobile = a.textMarginBottomMobile
		? parseFloat( String( a.textMarginBottomMobile ) )
		: 0;
	let text_margin_bottom_unit = a.textMarginBottomUnit ?? 'px';

	const allowedFont = [ 'px', 'rem', 'em' ];
	if ( ! allowedFont.includes( heading_font_size_unit ) ) {
		heading_font_size_unit = 'px';
	}
	if ( ! allowedFont.includes( text_font_size_unit ) ) {
		text_font_size_unit = 'px';
	}
	if ( ! allowedFont.includes( heading_margin_bottom_unit ) ) {
		heading_margin_bottom_unit = 'px';
	}
	if ( ! allowedFont.includes( text_margin_bottom_unit ) ) {
		text_margin_bottom_unit = 'px';
	}

	const content_max_width = a.contentMaxWidth ? parseInt( String( a.contentMaxWidth ), 10 ) : 0;
	const content_padding_top_desktop = a.contentPaddingTopDesktop
		? parseInt( String( a.contentPaddingTopDesktop ), 10 )
		: 0;
	const content_padding_top_tablet = a.contentPaddingTopTablet
		? parseInt( String( a.contentPaddingTopTablet ), 10 )
		: 0;
	const content_padding_top_mobile = a.contentPaddingTopMobile
		? parseInt( String( a.contentPaddingTopMobile ), 10 )
		: 0;
	let content_padding_top_unit = a.contentPaddingTopUnit ?? 'px';

	const allowedPad = [ 'px', 'vh', 'rem', 'em' ];
	if ( ! allowedPad.includes( content_padding_top_unit ) ) {
		content_padding_top_unit = 'px';
	}

	const button_align = a.buttonAlign ?? 'left';
	const button_padding_y = a.buttonPaddingY ? parseInt( String( a.buttonPaddingY ), 10 ) : 0;
	const button_padding_x = a.buttonPaddingX ? parseInt( String( a.buttonPaddingX ), 10 ) : 0;
	const button_margin_top = a.buttonMarginTop ? parseInt( String( a.buttonMarginTop ), 10 ) : 0;

	const button_border_radius_raw = Object.prototype.hasOwnProperty.call( a, 'buttonBorderRadius' )
		? a.buttonBorderRadius
		: null;
	const button_border_radius =
		button_border_radius_raw === '' || button_border_radius_raw === null
			? null
			: parseInt( String( button_border_radius_raw ), 10 );

	const button_border_width = a.buttonBorderWidth
		? parseInt( String( a.buttonBorderWidth ), 10 )
		: 0;
	const button_bg_color = a.buttonBgColor ?? '';
	const button_bg_color_hover = a.buttonBgColorHover ?? '';
	const button_text_color = a.buttonTextColor ?? '';
	const button_text_color_hover = a.buttonTextColorHover ?? '';
	const button_border_color = a.buttonBorderColor ?? '';
	const button_icon_size_desktop = a.buttonIconSizeDesktop
		? parseInt( String( a.buttonIconSizeDesktop ), 10 )
		: 0;
	const button_icon_size_tablet = a.buttonIconSizeTablet
		? parseInt( String( a.buttonIconSizeTablet ), 10 )
		: 0;
	const button_icon_size_mobile = a.buttonIconSizeMobile
		? parseInt( String( a.buttonIconSizeMobile ), 10 )
		: 0;

	const styleVars = [];

	if ( height_mode !== 'auto' ) {
		if ( height_desktop ) {
			styleVars.push( `--cb-hero-slider-height-desktop:${ String( height_desktop ) }` );
		}
		if ( height_tablet ) {
			styleVars.push( `--cb-hero-slider-height-tablet:${ String( height_tablet ) }` );
		}
		if ( height_mobile ) {
			styleVars.push( `--cb-hero-slider-height-mobile:${ String( height_mobile ) }` );
		}
	}

	if ( overlay_gradient ) {
		styleVars.push( `--cb-hero-slider-overlay-gradient:${ String( overlay_gradient ) }` );
	} else if ( overlay_color ) {
		styleVars.push( `--cb-hero-slider-overlay-color:${ String( overlay_color ) }` );
	}

	styleVars.push( '--cb-hero-slider-overlay-opacity:1' );

	if ( content_align ) {
		styleVars.push( `--cb-hero-slider-text-align:${ String( content_align ) }` );
	}

	if ( heading_color ) {
		styleVars.push( `--cb-hero-slider-heading-color:${ String( heading_color ) }` );
	}

	if ( text_color ) {
		styleVars.push( `--cb-hero-slider-text-color:${ String( text_color ) }` );
	}

	if ( heading_font_size_desktop ) {
		styleVars.push(
			`--cb-hero-slider-heading-font-size:${ heading_font_size_desktop }${ heading_font_size_unit }`
		);
		styleVars.push(
			`--cb-hero-slider-heading-font-size-desktop:${ heading_font_size_desktop }${ heading_font_size_unit }`
		);
	} else if ( heading_font_size ) {
		styleVars.push( `--cb-hero-slider-heading-font-size:${ heading_font_size }px` );
	}

	if ( heading_font_size_tablet ) {
		styleVars.push(
			`--cb-hero-slider-heading-font-size-tablet:${ heading_font_size_tablet }${ heading_font_size_unit }`
		);
	}

	if ( heading_font_size_mobile ) {
		styleVars.push(
			`--cb-hero-slider-heading-font-size-mobile:${ heading_font_size_mobile }${ heading_font_size_unit }`
		);
	}

	if ( text_font_size_desktop ) {
		styleVars.push(
			`--cb-hero-slider-text-font-size:${ text_font_size_desktop }${ text_font_size_unit }`
		);
		styleVars.push(
			`--cb-hero-slider-text-font-size-desktop:${ text_font_size_desktop }${ text_font_size_unit }`
		);
	} else if ( text_font_size ) {
		styleVars.push( `--cb-hero-slider-text-font-size:${ text_font_size }px` );
	}

	if ( text_font_size_tablet ) {
		styleVars.push(
			`--cb-hero-slider-text-font-size-tablet:${ text_font_size_tablet }${ text_font_size_unit }`
		);
	}

	if ( text_font_size_mobile ) {
		styleVars.push(
			`--cb-hero-slider-text-font-size-mobile:${ text_font_size_mobile }${ text_font_size_unit }`
		);
	}

	if ( heading_line_height_css ) {
		styleVars.push(
			`--cb-hero-slider-heading-line-height:${ heading_line_height_css }`
		);
	}

	if ( text_line_height_css ) {
		styleVars.push(
			`--cb-hero-slider-text-line-height:${ text_line_height_css }`
		);
	}

	if ( heading_margin_bottom_desktop ) {
		styleVars.push(
			`--cb-hero-slider-heading-margin-bottom:${ heading_margin_bottom_desktop }${ heading_margin_bottom_unit }`
		);
		styleVars.push(
			`--cb-hero-slider-heading-margin-bottom-desktop:${ heading_margin_bottom_desktop }${ heading_margin_bottom_unit }`
		);
	} else if ( heading_margin_bottom ) {
		styleVars.push( `--cb-hero-slider-heading-margin-bottom:${ heading_margin_bottom }px` );
	}

	if ( heading_margin_bottom_tablet ) {
		styleVars.push(
			`--cb-hero-slider-heading-margin-bottom-tablet:${ heading_margin_bottom_tablet }${ heading_margin_bottom_unit }`
		);
	}

	if ( heading_margin_bottom_mobile ) {
		styleVars.push(
			`--cb-hero-slider-heading-margin-bottom-mobile:${ heading_margin_bottom_mobile }${ heading_margin_bottom_unit }`
		);
	}

	if ( text_margin_bottom_desktop ) {
		styleVars.push(
			`--cb-hero-slider-text-margin-bottom:${ text_margin_bottom_desktop }${ text_margin_bottom_unit }`
		);
		styleVars.push(
			`--cb-hero-slider-text-margin-bottom-desktop:${ text_margin_bottom_desktop }${ text_margin_bottom_unit }`
		);
	} else if ( text_margin_bottom ) {
		styleVars.push( `--cb-hero-slider-text-margin-bottom:${ text_margin_bottom }px` );
	}

	if ( text_margin_bottom_tablet ) {
		styleVars.push(
			`--cb-hero-slider-text-margin-bottom-tablet:${ text_margin_bottom_tablet }${ text_margin_bottom_unit }`
		);
	}

	if ( text_margin_bottom_mobile ) {
		styleVars.push(
			`--cb-hero-slider-text-margin-bottom-mobile:${ text_margin_bottom_mobile }${ text_margin_bottom_unit }`
		);
	}

	if ( content_max_width ) {
		styleVars.push( `--cb-hero-slider-content-max-width:${ content_max_width }px` );
	}

	if ( content_padding_top_desktop ) {
		styleVars.push(
			`--cb-hero-slider-content-padding-top-desktop:${ content_padding_top_desktop }${ content_padding_top_unit }`
		);
	}

	if ( content_padding_top_tablet ) {
		styleVars.push(
			`--cb-hero-slider-content-padding-top-tablet:${ content_padding_top_tablet }${ content_padding_top_unit }`
		);
	}

	if ( content_padding_top_mobile ) {
		styleVars.push(
			`--cb-hero-slider-content-padding-top-mobile:${ content_padding_top_mobile }${ content_padding_top_unit }`
		);
	}

	if ( button_padding_y ) {
		styleVars.push( `--cb-hero-slider-button-padding-y:${ button_padding_y }px` );
	}

	if ( button_padding_x ) {
		styleVars.push( `--cb-hero-slider-button-padding-x:${ button_padding_x }px` );
	}

	if ( button_margin_top ) {
		styleVars.push( `--cb-hero-slider-button-margin-top:${ button_margin_top }px` );
	}

	if ( button_border_radius !== null ) {
		styleVars.push( `--cb-hero-slider-button-radius:${ button_border_radius }px` );
	}

	styleVars.push( `--cb-hero-slider-button-border-size:${ button_border_width }px` );

	if ( button_bg_color ) {
		styleVars.push( `--cb-hero-slider-button-bg:${ String( button_bg_color ) }` );
	}

	if ( button_bg_color_hover ) {
		styleVars.push( `--cb-hero-slider-button-bg-hover:${ String( button_bg_color_hover ) }` );
	}

	if ( button_text_color ) {
		styleVars.push( `--cb-hero-slider-button-color:${ String( button_text_color ) }` );
	}

	if ( button_text_color_hover ) {
		styleVars.push( `--cb-hero-slider-button-color-hover:${ String( button_text_color_hover ) }` );
	}

	if ( button_border_color ) {
		styleVars.push( `--cb-hero-slider-button-border-color:${ String( button_border_color ) }` );
	}

	if ( button_icon_size_desktop ) {
		styleVars.push( `--cb-hero-slider-button-icon-size-desktop:${ button_icon_size_desktop }px` );
	}

	if ( button_icon_size_tablet ) {
		styleVars.push( `--cb-hero-slider-button-icon-size-tablet:${ button_icon_size_tablet }px` );
	}

	if ( button_icon_size_mobile ) {
		styleVars.push( `--cb-hero-slider-button-icon-size-mobile:${ button_icon_size_mobile }px` );
	}

	if ( button_align ) {
		let justify = 'flex-start';
		if ( button_align === 'center' ) {
			justify = 'center';
		} else if ( button_align === 'right' ) {
			justify = 'flex-end';
		}
		styleVars.push( `--cb-hero-slider-button-justify:${ justify }` );
	}

	let styleValue = styleVars.length ? styleVars.join( ';' ) : '';
	const adv = buildAdvancedTabDeclarationsString( a );
	if ( adv ) {
		styleValue = styleValue ? `${ styleValue };${ adv }` : adv;
	}
	return styleValue;
}
