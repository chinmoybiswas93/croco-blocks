import { useEffect, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * @param {import('@wordpress/blocks').BlockInstance[]} blocks
 * @return {import('@wordpress/blocks').BlockInstance[]}
 */
function flattenBlocks( blocks ) {
	const out = [];
	const walk = ( list ) => {
		if ( ! list || ! list.length ) {
			return;
		}
		for ( const b of list ) {
			out.push( b );
			if ( b.innerBlocks?.length ) {
				walk( b.innerBlocks );
			}
		}
	};
	walk( blocks );
	return out;
}

function generateCbInstanceKey() {
	if (
		typeof crypto !== 'undefined' &&
		typeof crypto.randomUUID === 'function'
	) {
		return crypto.randomUUID().replace( /-/g, '' ).slice( 0, 12 );
	}
	return (
		'cb' +
		Date.now().toString( 36 ) +
		Math.random().toString( 36 ).slice( 2, 9 )
	);
}

/**
 * Assign a persistent cbInstanceKey once when empty (mirrors PHP expecting saved key).
 * When duplicate keys exist (e.g. duplicated block), regenerates for every instance except
 * the one with the lexicographically smallest clientId so instance-scoped CSS stays unique.
 *
 * @param {Object}   attributes    Block attributes.
 * @param {Function} setAttributes
 * @param {string}   [clientId]    From useBlockEditContext — enables duplicate detection.
 * @param {string}   [blockName]   Block name (e.g. metadata.name) — enables duplicate detection.
 */
export function useCrocoInstanceKey(
	attributes,
	setAttributes,
	clientId,
	blockName
) {
	const ran = useRef( false );

	const duplicateKeyPeers = useSelect(
		( select ) => {
			if ( ! clientId || ! blockName || ! attributes.cbInstanceKey ) {
				return null;
			}
			const tree = select( blockEditorStore ).getBlocks();
			const flat = flattenBlocks( tree );
			const key = attributes.cbInstanceKey;
			return flat.filter(
				( b ) =>
					b.name === blockName &&
					b.attributes?.cbInstanceKey === key
			);
		},
		[ clientId, blockName, attributes.cbInstanceKey ]
	);

	useEffect( () => {
		if ( attributes.cbInstanceKey ) {
			return;
		}
		if ( ran.current ) {
			return;
		}
		ran.current = true;
		setAttributes( { cbInstanceKey: generateCbInstanceKey() } );
	}, [ attributes.cbInstanceKey, setAttributes ] );

	useEffect( () => {
		if ( ! clientId || ! blockName || ! attributes.cbInstanceKey ) {
			return;
		}
		if ( ! duplicateKeyPeers || duplicateKeyPeers.length <= 1 ) {
			return;
		}
		const sorted = [ ...duplicateKeyPeers ].sort( ( a, b ) =>
			a.clientId.localeCompare( b.clientId )
		);
		if ( sorted[ 0 ].clientId === clientId ) {
			return;
		}
		setAttributes( { cbInstanceKey: generateCbInstanceKey() } );
	}, [
		attributes.cbInstanceKey,
		blockName,
		clientId,
		duplicateKeyPeers,
		setAttributes,
	] );
}
