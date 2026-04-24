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

use CrocoBlocks\BlockSupport\HeroSliderStyleDeclarations;
use CrocoBlocks\BlockSupport\InstanceCss;
use CrocoBlocks\BlockSupport\SpacingCss;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$slides         = isset( $attributes['slides'] ) && is_array( $attributes['slides'] ) ? $attributes['slides'] : array();
$show_arrows    = ! empty( $attributes['showArrows'] );
$show_dots      = ! empty( $attributes['showDots'] );
$autoplay       = ! empty( $attributes['autoplay'] );
$autoplay_speed = isset( $attributes['autoplaySpeed'] ) ? (int) $attributes['autoplaySpeed'] : 5000;
$loop           = array_key_exists( 'loop', $attributes ) ? (bool) $attributes['loop'] : true;
$pause_on_hover = array_key_exists( 'pauseOnHover', $attributes ) ? (bool) $attributes['pauseOnHover'] : true;

$height_mode = isset( $attributes['heightMode'] ) ? $attributes['heightMode'] : 'vh';

$button_style   = isset( $attributes['buttonStyle'] ) ? $attributes['buttonStyle'] : 'filled';
$button_icon_url = isset( $attributes['buttonIconUrl'] ) ? $attributes['buttonIconUrl'] : '';
$button_icon_alt = isset( $attributes['buttonIconAlt'] ) ? $attributes['buttonIconAlt'] : '';
$button_show_text = array_key_exists( 'buttonShowText', $attributes ) ? (bool) $attributes['buttonShowText'] : true;

// Bail if there are no slides.
if ( empty( $slides ) ) {
	if ( is_admin() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
		echo '<p>' . esc_html__( 'Add one or more slides to display the hero slider.', 'croco-blocks' ) . '</p>';
	}
	return;
}

$decl = HeroSliderStyleDeclarations::declarations( $attributes );

$style_value = '';
$queued      = false;
if ( '' !== $decl ) {
	$queued = InstanceCss::try_queue( 'croco-blocks/hero-slider', $attributes, $decl );
}
if ( $queued ) {
	$style_value = '';
} else {
	$style_value = $decl;
}

$style_value = SpacingCss::append_core_style_attribute_to_inline( $style_value, $attributes );

$inst_classes = InstanceCss::wrapper_class_string( 'croco-blocks/hero-slider', $attributes );

$wrapper_class = trim( 'cb-hero-slider cb-hero-slider--height-' . esc_attr( $height_mode ) . ( $inst_classes ? ' ' . $inst_classes : '' ) );
$wrapper_class .= SpacingCss::classnames_suffix_from_core_style_attribute( $attributes );
$wrapper_extra_attributes = array(
	'class' => trim( $wrapper_class ),
);

if ( '' !== $style_value ) {
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

			$slide_style_attribute = '';

			if ( $image_url ) {
				$slide_vars = array(
					'--cb-hero-slide-bg:url(' . esc_url( $image_url ) . ')',
					'--cb-hero-slide-focal:' . esc_attr( $background_pos ),
				);
				$slide_style_attribute = 'style="' . esc_attr( implode( ';', $slide_vars ) ) . '"';
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
