/**
 * Map block `attributes.style` (core shape) to React inline style for useBlockProps in the editor.
 *
 * When supports.spacing is false, core does not attach the style hook; we merge so theme/preset/nested
 * layout values stored on `style` still preview (PHP uses wp_style_engine_get_styles on save).
 *
 * @param {Object|undefined} styleAttr attributes.style
 * @return {Object<string, string>}
 */
export function getCoreStyleInlineFromAttributes( styleAttr ) {
	if ( ! styleAttr || typeof styleAttr !== 'object' ) {
		return {};
	}
	const out = {};
	const spacing = styleAttr.spacing;
	if ( spacing && typeof spacing === 'object' ) {
		[ 'margin', 'padding' ].forEach( ( box ) => {
			const val = spacing[ box ];
			if ( ! val ) {
				return;
			}
			if ( typeof val === 'string' ) {
				out[ box ] = val;
				return;
			}
			if ( typeof val === 'object' ) {
				[ 'top', 'right', 'bottom', 'left' ].forEach( ( side ) => {
					if ( val[ side ] ) {
						const camel =
							box +
							side.charAt( 0 ).toUpperCase() +
							side.slice( 1 );
						out[ camel ] = val[ side ];
					}
				} );
			}
		} );
		if ( spacing.blockGap && typeof spacing.blockGap === 'string' ) {
			out.gap = spacing.blockGap;
		}
	}
	const dimensions = styleAttr.dimensions;
	if ( dimensions && typeof dimensions === 'object' ) {
		if ( dimensions.minHeight ) {
			out.minHeight = dimensions.minHeight;
		}
		if ( dimensions.aspectRatio ) {
			out.aspectRatio = dimensions.aspectRatio;
		}
	}
	return out;
}
