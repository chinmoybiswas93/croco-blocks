<?php
/**
 * Hero slider: concatenated CSS declaration string (custom properties + advanced tab).
 *
 * @package Croco_Blocks
 */

namespace CrocoBlocks\BlockSupport;

class HeroSliderStyleDeclarations {

	/**
	 * @param array $attributes Block attributes.
	 * @return string Semicolon-separated declarations (no wrapping braces).
	 */
	public static function declarations( $attributes ) {
		if ( ! is_array( $attributes ) ) {
			return '';
		}
	
			
		$height_mode    = isset( $attributes['heightMode'] ) ? $attributes['heightMode'] : 'vh';
		$height_desktop = isset( $attributes['heightDesktop'] ) ? $attributes['heightDesktop'] : '80vh';
		$height_tablet  = isset( $attributes['heightTablet'] ) ? $attributes['heightTablet'] : '60vh';
		$height_mobile  = isset( $attributes['heightMobile'] ) ? $attributes['heightMobile'] : '60vh';
	
		$overlay_color    = isset( $attributes['overlayColor'] ) ? $attributes['overlayColor'] : '';
		$overlay_gradient = isset( $attributes['overlayGradient'] ) ? $attributes['overlayGradient'] : '';
	
		$content_align = isset( $attributes['contentAlign'] ) ? $attributes['contentAlign'] : 'left';
	
		$heading_color        = isset( $attributes['headingColor'] ) ? $attributes['headingColor'] : '';
		$text_color           = isset( $attributes['textColor'] ) ? $attributes['textColor'] : '';
		$heading_font_size    = ! empty( $attributes['headingFontSize'] ) ? (int) $attributes['headingFontSize'] : 0;
		$text_font_size       = ! empty( $attributes['textFontSize'] ) ? (int) $attributes['textFontSize'] : 0;
		$heading_line_height  = ! empty( $attributes['headingLineHeight'] ) ? (float) $attributes['headingLineHeight'] : 0;
		$text_line_height     = ! empty( $attributes['textLineHeight'] ) ? (float) $attributes['textLineHeight'] : 0;
		$heading_margin_bottom = isset( $attributes['headingMarginBottom'] ) ? (int) $attributes['headingMarginBottom'] : 0;
		$text_margin_bottom    = isset( $attributes['textMarginBottom'] ) ? (int) $attributes['textMarginBottom'] : 0;
	
		$heading_font_size_desktop = ! empty( $attributes['headingFontSizeDesktop'] ) ? (float) $attributes['headingFontSizeDesktop'] : 0;
		$heading_font_size_tablet  = ! empty( $attributes['headingFontSizeTablet'] ) ? (float) $attributes['headingFontSizeTablet'] : 0;
		$heading_font_size_mobile  = ! empty( $attributes['headingFontSizeMobile'] ) ? (float) $attributes['headingFontSizeMobile'] : 0;
		$heading_font_size_unit    = isset( $attributes['headingFontSizeUnit'] ) ? $attributes['headingFontSizeUnit'] : 'px';
	
		$text_font_size_desktop = ! empty( $attributes['textFontSizeDesktop'] ) ? (float) $attributes['textFontSizeDesktop'] : 0;
		$text_font_size_tablet  = ! empty( $attributes['textFontSizeTablet'] ) ? (float) $attributes['textFontSizeTablet'] : 0;
		$text_font_size_mobile  = ! empty( $attributes['textFontSizeMobile'] ) ? (float) $attributes['textFontSizeMobile'] : 0;
		$text_font_size_unit    = isset( $attributes['textFontSizeUnit'] ) ? $attributes['textFontSizeUnit'] : 'px';
	
		$heading_margin_bottom_desktop = ! empty( $attributes['headingMarginBottomDesktop'] ) ? (float) $attributes['headingMarginBottomDesktop'] : 0;
		$heading_margin_bottom_tablet  = ! empty( $attributes['headingMarginBottomTablet'] ) ? (float) $attributes['headingMarginBottomTablet'] : 0;
		$heading_margin_bottom_mobile  = ! empty( $attributes['headingMarginBottomMobile'] ) ? (float) $attributes['headingMarginBottomMobile'] : 0;
		$heading_margin_bottom_unit    = isset( $attributes['headingMarginBottomUnit'] ) ? $attributes['headingMarginBottomUnit'] : 'px';
	
		$text_margin_bottom_desktop = ! empty( $attributes['textMarginBottomDesktop'] ) ? (float) $attributes['textMarginBottomDesktop'] : 0;
		$text_margin_bottom_tablet  = ! empty( $attributes['textMarginBottomTablet'] ) ? (float) $attributes['textMarginBottomTablet'] : 0;
		$text_margin_bottom_mobile  = ! empty( $attributes['textMarginBottomMobile'] ) ? (float) $attributes['textMarginBottomMobile'] : 0;
		$text_margin_bottom_unit    = isset( $attributes['textMarginBottomUnit'] ) ? $attributes['textMarginBottomUnit'] : 'px';
	
		$allowed_font_units = array( 'px', 'rem', 'em' );
		if ( ! in_array( $heading_font_size_unit, $allowed_font_units, true ) ) {
			$heading_font_size_unit = 'px';
		}
		if ( ! in_array( $text_font_size_unit, $allowed_font_units, true ) ) {
			$text_font_size_unit = 'px';
		}
		if ( ! in_array( $heading_margin_bottom_unit, $allowed_font_units, true ) ) {
			$heading_margin_bottom_unit = 'px';
		}
		if ( ! in_array( $text_margin_bottom_unit, $allowed_font_units, true ) ) {
			$text_margin_bottom_unit = 'px';
		}
	
		$content_max_width           = isset( $attributes['contentMaxWidth'] ) ? (int) $attributes['contentMaxWidth'] : 0;
		$content_padding_top_desktop = ! empty( $attributes['contentPaddingTopDesktop'] ) ? (int) $attributes['contentPaddingTopDesktop'] : 0;
		$content_padding_top_tablet  = ! empty( $attributes['contentPaddingTopTablet'] ) ? (int) $attributes['contentPaddingTopTablet'] : 0;
		$content_padding_top_mobile  = ! empty( $attributes['contentPaddingTopMobile'] ) ? (int) $attributes['contentPaddingTopMobile'] : 0;
		$content_padding_top_unit    = isset( $attributes['contentPaddingTopUnit'] ) ? $attributes['contentPaddingTopUnit'] : 'px';
	
		$allowed_padding_units = array( 'px', 'vh', 'rem', 'em' );
		if ( ! in_array( $content_padding_top_unit, $allowed_padding_units, true ) ) {
			$content_padding_top_unit = 'px';
		}
	
		$button_align      = isset( $attributes['buttonAlign'] ) ? $attributes['buttonAlign'] : 'left';
		$button_padding_y  = ! empty( $attributes['buttonPaddingY'] ) ? (int) $attributes['buttonPaddingY'] : 0;
		$button_padding_x  = ! empty( $attributes['buttonPaddingX'] ) ? (int) $attributes['buttonPaddingX'] : 0;
		$button_margin_top = isset( $attributes['buttonMarginTop'] ) ? (int) $attributes['buttonMarginTop'] : 0;
	
		$button_border_radius_raw = array_key_exists( 'buttonBorderRadius', $attributes ) ? $attributes['buttonBorderRadius'] : null;
		$button_border_radius     = ( '' === $button_border_radius_raw || null === $button_border_radius_raw )
			? null
			: (int) $button_border_radius_raw;
	
		$button_border_width = ! empty( $attributes['buttonBorderWidth'] ) ? (int) $attributes['buttonBorderWidth'] : 0;
		$button_bg_color       = isset( $attributes['buttonBgColor'] ) ? $attributes['buttonBgColor'] : '';
		$button_bg_color_hover = isset( $attributes['buttonBgColorHover'] ) ? $attributes['buttonBgColorHover'] : '';
		$button_text_color     = isset( $attributes['buttonTextColor'] ) ? $attributes['buttonTextColor'] : '';
		$button_text_color_hover = isset( $attributes['buttonTextColorHover'] ) ? $attributes['buttonTextColorHover'] : '';
		$button_border_color   = isset( $attributes['buttonBorderColor'] ) ? $attributes['buttonBorderColor'] : '';
		$button_icon_size_desktop = ! empty( $attributes['buttonIconSizeDesktop'] ) ? (int) $attributes['buttonIconSizeDesktop'] : 0;
		$button_icon_size_tablet  = ! empty( $attributes['buttonIconSizeTablet'] ) ? (int) $attributes['buttonIconSizeTablet'] : 0;
		$button_icon_size_mobile  = ! empty( $attributes['buttonIconSizeMobile'] ) ? (int) $attributes['buttonIconSizeMobile'] : 0;
	
		$style_variables = array();
	
		if ( 'auto' !== $height_mode ) {
			if ( $height_desktop ) {
				$style_variables[] = '--cb-hero-slider-height-desktop:' . esc_attr( $height_desktop );
			}
			if ( $height_tablet ) {
				$style_variables[] = '--cb-hero-slider-height-tablet:' . esc_attr( $height_tablet );
			}
			if ( $height_mobile ) {
				$style_variables[] = '--cb-hero-slider-height-mobile:' . esc_attr( $height_mobile );
			}
		}
	
		if ( $overlay_gradient ) {
			$style_variables[] = '--cb-hero-slider-overlay-gradient:' . esc_attr( $overlay_gradient );
		} elseif ( $overlay_color ) {
			$style_variables[] = '--cb-hero-slider-overlay-color:' . esc_attr( $overlay_color );
		}
	
		$style_variables[] = '--cb-hero-slider-overlay-opacity:1';
	
		if ( $content_align ) {
			$style_variables[] = '--cb-hero-slider-text-align:' . esc_attr( $content_align );
		}
	
		if ( $heading_color ) {
			$style_variables[] = '--cb-hero-slider-heading-color:' . esc_attr( $heading_color );
		}
	
		if ( $text_color ) {
			$style_variables[] = '--cb-hero-slider-text-color:' . esc_attr( $text_color );
		}
	
		if ( $heading_font_size_desktop ) {
			$style_variables[] = '--cb-hero-slider-heading-font-size:' . $heading_font_size_desktop . $heading_font_size_unit;
			$style_variables[] = '--cb-hero-slider-heading-font-size-desktop:' . $heading_font_size_desktop . $heading_font_size_unit;
		} elseif ( $heading_font_size ) {
			$style_variables[] = '--cb-hero-slider-heading-font-size:' . (int) $heading_font_size . 'px';
		}
	
		if ( $heading_font_size_tablet ) {
			$style_variables[] = '--cb-hero-slider-heading-font-size-tablet:' . $heading_font_size_tablet . $heading_font_size_unit;
		}
	
		if ( $heading_font_size_mobile ) {
			$style_variables[] = '--cb-hero-slider-heading-font-size-mobile:' . $heading_font_size_mobile . $heading_font_size_unit;
		}
	
		if ( $text_font_size_desktop ) {
			$style_variables[] = '--cb-hero-slider-text-font-size:' . $text_font_size_desktop . $text_font_size_unit;
			$style_variables[] = '--cb-hero-slider-text-font-size-desktop:' . $text_font_size_desktop . $text_font_size_unit;
		} elseif ( $text_font_size ) {
			$style_variables[] = '--cb-hero-slider-text-font-size:' . (int) $text_font_size . 'px';
		}
	
		if ( $text_font_size_tablet ) {
			$style_variables[] = '--cb-hero-slider-text-font-size-tablet:' . $text_font_size_tablet . $text_font_size_unit;
		}
	
		if ( $text_font_size_mobile ) {
			$style_variables[] = '--cb-hero-slider-text-font-size-mobile:' . $text_font_size_mobile . $text_font_size_unit;
		}
	
		if ( $heading_line_height ) {
			$style_variables[] = '--cb-hero-slider-heading-line-height:' . $heading_line_height;
		}
	
		if ( $text_line_height ) {
			$style_variables[] = '--cb-hero-slider-text-line-height:' . $text_line_height;
		}
	
		if ( $heading_margin_bottom_desktop ) {
			$style_variables[] = '--cb-hero-slider-heading-margin-bottom:' . $heading_margin_bottom_desktop . $heading_margin_bottom_unit;
			$style_variables[] = '--cb-hero-slider-heading-margin-bottom-desktop:' . $heading_margin_bottom_desktop . $heading_margin_bottom_unit;
		} elseif ( $heading_margin_bottom ) {
			$style_variables[] = '--cb-hero-slider-heading-margin-bottom:' . (int) $heading_margin_bottom . 'px';
		}
	
		if ( $heading_margin_bottom_tablet ) {
			$style_variables[] = '--cb-hero-slider-heading-margin-bottom-tablet:' . $heading_margin_bottom_tablet . $heading_margin_bottom_unit;
		}
	
		if ( $heading_margin_bottom_mobile ) {
			$style_variables[] = '--cb-hero-slider-heading-margin-bottom-mobile:' . $heading_margin_bottom_mobile . $heading_margin_bottom_unit;
		}
	
		if ( $text_margin_bottom_desktop ) {
			$style_variables[] = '--cb-hero-slider-text-margin-bottom:' . $text_margin_bottom_desktop . $text_margin_bottom_unit;
			$style_variables[] = '--cb-hero-slider-text-margin-bottom-desktop:' . $text_margin_bottom_desktop . $text_margin_bottom_unit;
		} elseif ( $text_margin_bottom ) {
			$style_variables[] = '--cb-hero-slider-text-margin-bottom:' . (int) $text_margin_bottom . 'px';
		}
	
		if ( $text_margin_bottom_tablet ) {
			$style_variables[] = '--cb-hero-slider-text-margin-bottom-tablet:' . $text_margin_bottom_tablet . $text_margin_bottom_unit;
		}
	
		if ( $text_margin_bottom_mobile ) {
			$style_variables[] = '--cb-hero-slider-text-margin-bottom-mobile:' . $text_margin_bottom_mobile . $text_margin_bottom_unit;
		}
	
		if ( $content_max_width ) {
			$style_variables[] = '--cb-hero-slider-content-max-width:' . (int) $content_max_width . 'px';
		}
	
		if ( $content_padding_top_desktop ) {
			$style_variables[] = '--cb-hero-slider-content-padding-top-desktop:' . (int) $content_padding_top_desktop . $content_padding_top_unit;
		}
	
		if ( $content_padding_top_tablet ) {
			$style_variables[] = '--cb-hero-slider-content-padding-top-tablet:' . (int) $content_padding_top_tablet . $content_padding_top_unit;
		}
	
		if ( $content_padding_top_mobile ) {
			$style_variables[] = '--cb-hero-slider-content-padding-top-mobile:' . (int) $content_padding_top_mobile . $content_padding_top_unit;
		}
	
		if ( $button_padding_y ) {
			$style_variables[] = '--cb-hero-slider-button-padding-y:' . (int) $button_padding_y . 'px';
		}
	
		if ( $button_padding_x ) {
			$style_variables[] = '--cb-hero-slider-button-padding-x:' . (int) $button_padding_x . 'px';
		}
	
		if ( $button_margin_top ) {
			$style_variables[] = '--cb-hero-slider-button-margin-top:' . (int) $button_margin_top . 'px';
		}
	
		if ( null !== $button_border_radius ) {
			$style_variables[] = '--cb-hero-slider-button-radius:' . (int) $button_border_radius . 'px';
		}
	
		$style_variables[] = '--cb-hero-slider-button-border-size:' . (int) $button_border_width . 'px';
	
		if ( $button_bg_color ) {
			$style_variables[] = '--cb-hero-slider-button-bg:' . esc_attr( $button_bg_color );
		}
	
		if ( $button_bg_color_hover ) {
			$style_variables[] = '--cb-hero-slider-button-bg-hover:' . esc_attr( $button_bg_color_hover );
		}
	
		if ( $button_text_color ) {
			$style_variables[] = '--cb-hero-slider-button-color:' . esc_attr( $button_text_color );
		}
	
		if ( $button_text_color_hover ) {
			$style_variables[] = '--cb-hero-slider-button-color-hover:' . esc_attr( $button_text_color_hover );
		}
	
		if ( $button_border_color ) {
			$style_variables[] = '--cb-hero-slider-button-border-color:' . esc_attr( $button_border_color );
		}
	
		if ( $button_icon_size_desktop ) {
			$style_variables[] = '--cb-hero-slider-button-icon-size-desktop:' . (int) $button_icon_size_desktop . 'px';
		}
	
		if ( $button_icon_size_tablet ) {
			$style_variables[] = '--cb-hero-slider-button-icon-size-tablet:' . (int) $button_icon_size_tablet . 'px';
		}
	
		if ( $button_icon_size_mobile ) {
			$style_variables[] = '--cb-hero-slider-button-icon-size-mobile:' . (int) $button_icon_size_mobile . 'px';
		}
	
		if ( $button_align ) {
			$justify = 'flex-start';
			if ( 'center' === $button_align ) {
				$justify = 'center';
			} elseif ( 'right' === $button_align ) {
				$justify = 'flex-end';
			}
			$style_variables[] = '--cb-hero-slider-button-justify:' . $justify;
		}
	
		$cb_spacing_vars = SpacingCss::spacing_vars_style( $attributes );
		$style_value     = '';
	
		if ( ! empty( $style_variables ) ) {
			$style_value = implode( ';', $style_variables );
		}
	
		if ( '' !== $cb_spacing_vars ) {
			$style_value .= ( '' !== $style_value ? ';' : '' ) . $cb_spacing_vars;
		}
	
		$cb_border_vars = SpacingCss::border_vars_style( $attributes );
		if ( '' !== $cb_border_vars ) {
			$style_value .= ( '' !== $style_value ? ';' : '' ) . $cb_border_vars;
		}
	
		$cb_bg = SpacingCss::background_style_fragment( $attributes );
		if ( '' !== $cb_bg ) {
			$style_value .= ( '' !== $style_value ? ';' : '' ) . rtrim( $cb_bg, ';' );
		}
	
		return $style_value;
	}
}
