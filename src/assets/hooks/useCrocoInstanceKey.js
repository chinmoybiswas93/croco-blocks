import { useEffect, useRef } from '@wordpress/element';

/**
 * Assign a persistent cbInstanceKey once when empty (mirrors PHP expecting saved key).
 *
 * @param {Object}   attributes    Block attributes.
 * @param {Function} setAttributes
 */
export function useCrocoInstanceKey( attributes, setAttributes ) {
	const ran = useRef( false );

	useEffect( () => {
		if ( attributes.cbInstanceKey ) {
			return;
		}
		if ( ran.current ) {
			return;
		}
		ran.current = true;
		let key = '';
		if (
			typeof crypto !== 'undefined' &&
			typeof crypto.randomUUID === 'function'
		) {
			key = crypto.randomUUID().replace( /-/g, '' ).slice( 0, 12 );
		} else {
			key =
				'cb' +
				Date.now().toString( 36 ) +
				Math.random().toString( 36 ).slice( 2, 9 );
		}
		setAttributes( { cbInstanceKey: key } );
	}, [ attributes.cbInstanceKey, setAttributes ] );
}
