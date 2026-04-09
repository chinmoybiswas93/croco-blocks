<?php
/**
 * Hero Slider block — server-side render.
 *
 * @package Croco_Blocks
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block inner content (unused).
 * @var WP_Block $block      Block instance.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once dirname( __DIR__, 3 ) . '/src/block-support/spacing-css.php';

$slides         = isset( $attributes['slides'] ) && is_array( $attributes['slides'] ) ? $attributes['slides'] : array();
$show_arrows    = ! empty( $attributes['showArrows'] );
$show_dots      = ! empty( $attributes['showDots'] );
$autoplay       = ! empty( $attributes['autoplay'] );
$autoplay_speed = isset( $attributes['autoplaySpeed'] ) ? (int) $attributes['autoplaySpeed'] : 5000;
$loop           = array_key_exists( 'loop', $attributes ) ? (bool) $attributes['loop'] : true;
$pause_on_hover = array_key_exists( 'pauseOnHover', $attributes ) ? (bool) $attributes['pauseOnHover'] : true;

$height_mode    = isset( $attributes['heightMode'] ) ? $attributes['heightMode'] : 'vh';
$height_desktop = isset( $attributes['heightDesktop'] ) ? $attributes['heightDesktop'] : '80vh';
$height_tablet  = isset( $attributes['heightTablet'] ) ? $attributes['heightTablet'] : '60vh';
$height_mobile  = isset( $attributes['heightMobile'] ) ? $attributes['heightMobile'] : '60vh';

$overlay_color    = isset( $attributes['overlayColor'] ) ? $attributes['overlayColor'] : '';
$overlay_gradient = isset( $attributes['overlayGradient'] ) ? $attributes['overlayGradient'] : '';
$overlay_opacity  = isset( $attributes['overlayOpacity'] ) ? (int) $attributes['overlayOpacity'] : 0;

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

// Border radius: allow an explicit 0 value to work, but fall back to theme default when unset.
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
$button_icon_id        = isset( $attributes['buttonIconId'] ) ? (int) $attributes['buttonIconId'] : 0;
$button_icon_url       = isset( $attributes['buttonIconUrl'] ) ? $attributes['buttonIconUrl'] : '';
$button_icon_alt       = isset( $attributes['buttonIconAlt'] ) ? $attributes['buttonIconAlt'] : '';
$button_show_text      = array_key_exists( 'buttonShowText', $attributes ) ? (bool) $attributes['buttonShowText'] : true;
$button_icon_size_desktop = ! empty( $attributes['buttonIconSizeDesktop'] ) ? (int) $attributes['buttonIconSizeDesktop'] : 0;
$button_icon_size_tablet  = ! empty( $attributes['buttonIconSizeTablet'] ) ? (int) $attributes['buttonIconSizeTablet'] : 0;
$button_icon_size_mobile  = ! empty( $attributes['buttonIconSizeMobile'] ) ? (int) $attributes['buttonIconSizeMobile'] : 0;
$button_style             = isset( $attributes['buttonStyle'] ) ? $attributes['buttonStyle'] : 'filled';

// Bail if there are no slides.
if ( empty( $slides ) ) {
	if ( is_admin() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
		echo '<p>' . esc_html__( 'Add one or more slides to display the hero slider.', 'croco-blocks' ) . '</p>';
	}
	return;
}

// Prepare inline CSS variables for responsive heights and styles.
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

// Overlay opacity is now fully controlled via the color (including alpha)
// chosen in the editor. Always use an opacity of 1 here to avoid double-
// applying transparency.
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

// Heading font size (responsive).
if ( $heading_font_size_desktop ) {
	$style_variables[] = '--cb-hero-slider-heading-font-size:' . $heading_font_size_desktop . $heading_font_size_unit;
	$style_variables[] = '--cb-hero-slider-heading-font-size-desktop:' . $heading_font_size_desktop . $heading_font_size_unit;
} elseif ( $heading_font_size ) {
	// Legacy single value, assume px.
	$style_variables[] = '--cb-hero-slider-heading-font-size:' . (int) $heading_font_size . 'px';
}

if ( $heading_font_size_tablet ) {
	$style_variables[] = '--cb-hero-slider-heading-font-size-tablet:' . $heading_font_size_tablet . $heading_font_size_unit;
}

if ( $heading_font_size_mobile ) {
	$style_variables[] = '--cb-hero-slider-heading-font-size-mobile:' . $heading_font_size_mobile . $heading_font_size_unit;
}

// Text font size (responsive).
if ( $text_font_size_desktop ) {
	$style_variables[] = '--cb-hero-slider-text-font-size:' . $text_font_size_desktop . $text_font_size_unit;
	$style_variables[]   = '--cb-hero-slider-text-font-size-desktop:' . $text_font_size_desktop . $text_font_size_unit;
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

// Heading bottom margin (responsive).
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

// Text bottom margin (responsive).
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

$cb_spacing_vars = croco_blocks_spacing_css_vars_style( $attributes );

$style_value = '';

if ( ! empty( $style_variables ) ) {
	$style_value = implode( ';', $style_variables );
}

if ( '' !== $cb_spacing_vars ) {
	$style_value .= ( '' !== $style_value ? ';' : '' ) . $cb_spacing_vars;
}

$wrapper_extra_attributes = array(
	'class' => 'cb-hero-slider cb-hero-slider--height-' . esc_attr( $height_mode ),
);

if ( $style_value ) {
	$wrapper_extra_attributes['style'] = $style_value;
}

$wrapper_attributes = get_block_wrapper_attributes( $wrapper_extra_attributes );

// Data attributes for JS initialization.
$data_attributes = array(
	'data-autoplay'       => $autoplay ? 'true' : 'false',
	'data-autoplay-speed' => $autoplay_speed > 0 ? (string) $autoplay_speed : '5000',
	'data-loop'           => $loop ? 'true' : 'false',
	'data-pause-on-hover' => $pause_on_hover ? 'true' : 'false',
	'data-show-arrows'    => $show_arrows ? 'true' : 'false',
	'data-show-dots'      => $show_dots ? 'true' : 'false',
);

$data_attribute_string_parts = array();

foreach ( $data_attributes as $data_key => $data_value ) {
	$data_attribute_string_parts[] = sprintf(
		'%s="%s"',
		esc_attr( $data_key ),
		esc_attr( $data_value )
	);
}

$data_attribute_string = implode( ' ', $data_attribute_string_parts );

?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> <?php echo $data_attribute_string; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="cb-hero-slider__track">
		<?php foreach ( $slides as $index => $slide ) : ?>
			<?php
			$image_url = isset( $slide['imageUrl'] ) ? $slide['imageUrl'] : '';
			$image_alt = isset( $slide['imageAlt'] ) ? $slide['imageAlt'] : '';

			$heading   = isset( $slide['heading'] ) ? $slide['heading'] : '';
			$text      = isset( $slide['text'] ) ? $slide['text'] : '';

			$button_label   = isset( $slide['buttonLabel'] ) ? $slide['buttonLabel'] : '';
			$button_url     = isset( $slide['buttonUrl'] ) ? $slide['buttonUrl'] : '';
			$button_new_tab = ! empty( $slide['buttonNewTab'] );

			$focal_point    = isset( $slide['focalPoint'] ) && is_array( $slide['focalPoint'] ) ? $slide['focalPoint'] : array( 'x' => 0.5, 'y' => 0.5 );
			$focal_x        = isset( $focal_point['x'] ) ? (float) $focal_point['x'] : 0.5;
			$focal_y        = isset( $focal_point['y'] ) ? (float) $focal_point['y'] : 0.5;
			$background_pos = sprintf(
				'%1$s%% %2$s%%',
				max( 0, min( 100, $focal_x * 100 ) ),
				max( 0, min( 100, $focal_y * 100 ) )
			);

			$slide_styles = array();

			if ( $image_url ) {
				$slide_styles[] = 'background-image:url(' . esc_url( $image_url ) . ')';
				$slide_styles[] = 'background-position:' . esc_attr( $background_pos );
				$slide_styles[] = 'background-size:cover';
				$slide_styles[] = 'background-repeat:no-repeat';
			}

			$slide_style_attribute = '';

			if ( ! empty( $slide_styles ) ) {
				$slide_style_attribute = 'style="' . esc_attr( implode( ';', $slide_styles ) ) . '"';
			}
			?>
			<section
				class="cb-hero-slider__slide<?php echo 0 === $index ? ' cb-hero-slider__slide--is-active' : ''; ?>"
				<?php echo $slide_style_attribute; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			>
				<div class="cb-hero-slider__overlay">
					<div class="cb-hero-slider__content">
						<?php if ( $heading ) : ?>
							<h2 class="cb-hero-slider__heading">
								<?php echo wp_kses_post( $heading ); ?>
							</h2>
						<?php endif; ?>

						<?php if ( $text ) : ?>
							<div class="cb-hero-slider__text">
								<?php echo wp_kses_post( wpautop( $text ) ); ?>
							</div>
						<?php endif; ?>

						<?php if ( $button_label && $button_url ) : ?>
							<div class="cb-hero-slider__actions">
								<a
									class="cb-hero-slider__button wp-element-button<?php echo 'outline' === $button_style ? ' cb-hero-slider__button--outline' : ''; ?>"
									href="<?php echo esc_url( $button_url ); ?>"
									<?php if ( $button_new_tab ) : ?>
										target="_blank" rel="noopener noreferrer"
									<?php endif; ?>
								>
									<?php if ( $button_icon_url ) : ?>
										<img
											class="cb-hero-slider__button-icon"
											src="<?php echo esc_url( $button_icon_url ); ?>"
											alt="<?php echo esc_attr( $button_icon_alt ); ?>"
										/>
									<?php endif; ?>
									<?php if ( $button_show_text ) : ?>
										<?php echo esc_html( $button_label ); ?>
									<?php endif; ?>
								</a>
							</div>
						<?php endif; ?>
					</div>
				</div>
			</section>
		<?php endforeach; ?>
	</div>

	<?php if ( $show_arrows ) : ?>
		<button class="cb-hero-slider__arrow cb-hero-slider__arrow--prev" type="button" aria-label="<?php esc_attr_e( 'Previous slide', 'croco-blocks' ); ?>">
			<span aria-hidden="true">&larr;</span>
		</button>
		<button class="cb-hero-slider__arrow cb-hero-slider__arrow--next" type="button" aria-label="<?php esc_attr_e( 'Next slide', 'croco-blocks' ); ?>">
			<span aria-hidden="true">&rarr;</span>
		</button>
	<?php endif; ?>

	<?php if ( $show_dots && count( $slides ) > 1 ) : ?>
		<div class="cb-hero-slider__dots" role="tablist">
			<?php foreach ( $slides as $index => $_slide ) : ?>
				<button
					type="button"
					class="cb-hero-slider__dot<?php echo 0 === $index ? ' cb-hero-slider__dot--is-active' : ''; ?>"
					data-slide="<?php echo esc_attr( (string) $index ); ?>"
					role="tab"
					aria-label="<?php printf( esc_attr__( 'Go to slide %d', 'croco-blocks' ), $index + 1 ); ?>"
					aria-selected="<?php echo 0 === $index ? 'true' : 'false'; ?>"
				></button>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>
</div>

