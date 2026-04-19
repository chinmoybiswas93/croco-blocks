<?php
/**
 * Instance-scoped CSS helpers (wrapper classes, legacy try_queue API).
 * Declarations are always applied inline on the block root — no &lt;style&gt; in content.
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
	 * Legacy hook: previously echoed a &lt;style&gt; rule for large declaration strings.
	 * Always false so callers keep variables on the block’s inline style (no extra DOM nodes).
	 *
	 * @param string $block_name   Unused; kept for call-site compatibility.
	 * @param array  $attributes   Unused.
	 * @param string $declarations Unused.
	 * @return bool Always false.
	 */
	public static function try_queue( $block_name, $attributes, $declarations ) {
		return false;
	}
}
