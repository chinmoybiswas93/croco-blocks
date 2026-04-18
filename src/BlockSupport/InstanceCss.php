<?php
/**
 * Instance-scoped CSS: emit one rule per block instance as a compact &lt;style&gt; during render.
 *
 * @package Croco_Blocks
 */

namespace CrocoBlocks\BlockSupport;

class InstanceCss {

	/**
	 * Bootstrap hooks (call from BlockController::register).
	 *
	 * Kept for backward compatibility; instance CSS no longer uses wp_footer.
	 */
	public static function bootstrap() {
	}

	/**
	 * Sanitize cbInstanceKey for class names and selectors.
	 *
	 * @param mixed $key Raw attribute.
	 * @return string Safe token or empty.
	 */
	public static function sanitize_instance_key( $key ) {
		if ( is_array( $key ) || is_object( $key ) ) {
			return '';
		}
		$key = trim( (string) $key );
		if ( ! preg_match( '/^[a-zA-Z0-9_-]{8,40}$/', $key ) ) {
			return '';
		}
		return $key;
	}

	/**
	 * @param string $block_name Block name.
	 * @return string e.g. wp-block-croco-blocks-hero-slider
	 */
	public static function block_name_to_wp_class( $block_name ) {
		if ( ! is_string( $block_name ) || '' === $block_name ) {
			return '';
		}
		return 'wp-block-' . str_replace( '/', '-', $block_name );
	}

	/**
	 * CSS id selector from anchor attribute when safe.
	 *
	 * @param mixed $anchor Anchor string.
	 * @return string e.g. #my-id or empty.
	 */
	public static function anchor_selector( $anchor ) {
		if ( ! is_string( $anchor ) ) {
			return '';
		}
		$a = trim( $anchor );
		if ( '' === $a ) {
			return '';
		}
		if ( ! preg_match( '/^[A-Za-z][A-Za-z0-9_:.-]*$/', $a ) ) {
			return '';
		}
		return '#' . $a;
	}

	/**
	 * Selector for instance CSS: prefer #anchor, else .wp-block-….cb-i-{key}.
	 *
	 * @param string $block_name Block name.
	 * @param array  $attributes Block attributes.
	 * @return string Safe CSS selector or empty.
	 */
	public static function selector( $block_name, $attributes ) {
		if ( ! is_array( $attributes ) ) {
			return '';
		}
		$anchor_sel = self::anchor_selector(
			isset( $attributes['anchor'] ) ? $attributes['anchor'] : ''
		);
		if ( '' !== $anchor_sel ) {
			return $anchor_sel;
		}
		$key = self::sanitize_instance_key(
			isset( $attributes['cbInstanceKey'] ) ? $attributes['cbInstanceKey'] : ''
		);
		if ( '' === $key ) {
			return '';
		}
		$bc = self::block_name_to_wp_class( $block_name );
		if ( '' === $bc ) {
			return '';
		}
		return '.' . $bc . '.cb-i-' . $key;
	}

	/**
	 * Whether we should emit declarations as an external rule (vs legacy inline style).
	 *
	 * @param array $attributes Block attributes.
	 * @return bool
	 */
	public static function use_external_rule( $attributes ) {
		if ( ! is_array( $attributes ) ) {
			return false;
		}
		if ( '' !== self::sanitize_instance_key(
			isset( $attributes['cbInstanceKey'] ) ? $attributes['cbInstanceKey'] : ''
		) ) {
			return true;
		}
		return '' !== self::anchor_selector(
			isset( $attributes['anchor'] ) ? $attributes['anchor'] : ''
		);
	}

	/**
	 * Extra wrapper classes: cb-block, slug alias, cb-i-{key}.
	 *
	 * @param string $block_name Block name.
	 * @param array  $attributes Attributes.
	 * @return string Space-separated classes (leading space if non-empty).
	 */
	public static function wrapper_class_string( $block_name, $attributes ) {
		$parts = array( 'cb-block' );
		if ( 'croco-blocks/hero-slider' === $block_name ) {
			$parts[] = 'cb-hero';
		} elseif ( 'croco-blocks/navigation-menu' === $block_name ) {
			$parts[] = 'cb-nav';
		}
		$key = self::sanitize_instance_key(
			isset( $attributes['cbInstanceKey'] ) ? $attributes['cbInstanceKey'] : ''
		);
		if ( '' !== $key ) {
			$parts[] = 'cb-i-' . $key;
		}
		return implode( ' ', array_filter( $parts ) );
	}

	/**
	 * Instance CSS for a block: return true when the caller should omit inline style on the wrapper.
	 *
	 * @param string $block_name   Block name.
	 * @param array  $attributes   Attributes.
	 * @param string $declarations Full declaration string.
	 * @return bool True if inline style should be omitted on the rendered element.
	 */
	public static function try_queue( $block_name, $attributes, $declarations ) {
		$declarations = trim( (string) $declarations );
		if ( '' === $declarations ) {
			return false;
		}
		if ( ! self::use_external_rule( $attributes ) ) {
			return false;
		}
		$sel = self::selector( $block_name, $attributes );
		if ( '' === $sel ) {
			return false;
		}

		$editor_context = is_admin() || ( defined( 'REST_REQUEST' ) && REST_REQUEST );

		if ( ! $editor_context ) {
			static $emitted = array();
			$fingerprint = $block_name . "\x1e" . $sel;
			if ( ! isset( $emitted[ $fingerprint ] ) ) {
				$emitted[ $fingerprint ] = true;
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Safe selector; declarations from escaped builders.
				echo "\n" . '<style class="croco-blocks-instance-css">' . $sel . '{' . $declarations . '}</style>' . "\n";
			}
		}

		return true;
	}
}
