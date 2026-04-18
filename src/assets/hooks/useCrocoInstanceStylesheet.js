import { useLayoutEffect, useRef } from '@wordpress/element';
import {
	getCrocoInstanceCssSelector,
	shouldUseExternalInstanceCss,
	sanitizeCbInstanceKey,
} from '../utils/crocoInstanceCssSelectors';

/**
 * Injects a style rule into the block document (iframe) head; cleans up on change/unmount.
 *
 * @param {string} blockName Block name.
 * @param {Object} attributes
 * @param {string} cssText   Declaration string (no outer braces).
 * @return {Object} Ref to pass to useBlockProps.
 */
export function useCrocoInstanceStylesheet( blockName, attributes, cssText ) {
	const ref = useRef( null );

	useLayoutEffect( () => {
		const el = ref.current;
		const doc = el?.ownerDocument;
		if ( ! doc ) {
			return undefined;
		}

		const anchor = attributes?.anchor
			? String( attributes.anchor ).trim()
			: '';
		const key = sanitizeCbInstanceKey( attributes?.cbInstanceKey );
		const unique =
			key ||
			( anchor ? anchor.replace( /[^a-zA-Z0-9_-]/g, '' ) : '' ) ||
			'legacy';
		const styleId =
			'croco-cb-inst-' +
			blockName.replace( /\//g, '-' ) +
			'-' +
			unique;

		const enabled =
			shouldUseExternalInstanceCss( attributes ) &&
			cssText &&
			getCrocoInstanceCssSelector( blockName, attributes );

		if ( ! enabled ) {
			doc.getElementById( styleId )?.remove();
			return undefined;
		}

		const selector = getCrocoInstanceCssSelector( blockName, attributes );
		const full = `${ selector }{${ cssText }}`;

		let node = doc.getElementById( styleId );
		if ( ! node ) {
			node = doc.createElement( 'style' );
			node.id = styleId;
			doc.head.appendChild( node );
		}
		node.textContent = full;

		return () => {
			doc.getElementById( styleId )?.remove();
		};
	}, [ blockName, attributes, cssText ] );

	return ref;
}
