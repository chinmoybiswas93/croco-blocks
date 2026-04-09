/**
 * Attribute key helpers for responsive padding/margin (cbPadding*, cbMargin*).
 */

export const SPACING_SIDES = [ 'Top', 'Right', 'Bottom', 'Left' ];

export const SPACING_UNITS = [
	{ value: 'px', label: 'px' },
	{ value: 'rem', label: 'rem' },
	{ value: 'em', label: 'em' },
	{ value: 'vh', label: 'vh' },
	{ value: 'vw', label: 'vw' },
];

/**
 * @param {'padding'|'margin'} mode
 * @param {'Top'|'Right'|'Bottom'|'Left'} side
 * @param {'desktop'|'tablet'|'mobile'} device
 * @return {string} Attribute key e.g. cbPaddingTopTablet
 */
export function getSpacingAttrKey( mode, side, device ) {
	const prefix = mode === 'padding' ? 'cbPadding' : 'cbMargin';
	const suffix =
		device === 'desktop'
			? ''
			: device === 'tablet'
				? 'Tablet'
				: 'Mobile';
	return `${ prefix }${ side }${ suffix }`;
}

/**
 * @param {'padding'|'margin'} mode
 * @return {string} cbPaddingUnit | cbMarginUnit
 */
export function getSpacingUnitKey( mode ) {
	return mode === 'padding' ? 'cbPaddingUnit' : 'cbMarginUnit';
}

/**
 * @param {'padding'|'margin'} mode
 * @return {string} cbPaddingLinked | cbMarginLinked
 */
export function getSpacingLinkedKey( mode ) {
	return mode === 'padding' ? 'cbPaddingLinked' : 'cbMarginLinked';
}

/**
 * Parse "12px" / "1.5rem" into number string and unit.
 *
 * @param {string} raw
 * @return {{ num: string, unit: string }}
 */
export function parseSpacingValue( raw ) {
	if ( raw === undefined || raw === null || String( raw ).trim() === '' ) {
		return { num: '', unit: '' };
	}
	const s = String( raw ).trim();
	const m = s.match( /^(-?[0-9]*\.?[0-9]+)\s*([a-z%]*)$/i );
	if ( ! m ) {
		return { num: '', unit: '' };
	}
	return { num: m[ 1 ], unit: m[ 2 ] || '' };
}

/**
 * @param {string} num
 * @param {string} unit
 * @return {string}
 */
export function formatSpacingValue( num, unit ) {
	if ( num === undefined || num === null || String( num ).trim() === '' ) {
		return '';
	}
	const u = unit || 'px';
	return `${ String( num ).trim() }${ u }`;
}

/**
 * Build React style object for CSS variables (editor preview).
 *
 * @param {Object} attributes Block attributes
 * @return {Object<string, string>}
 */
export function getSpacingCssVarsForEditor( attributes ) {
	const out = {};
	const modes = [
		{ name: 'padding', css: 'padding' },
		{ name: 'margin', css: 'margin' },
	];
	const devices = [
		{ id: 'desktop', suffix: '' },
		{ id: 'tablet', suffix: '-tablet' },
		{ id: 'mobile', suffix: '-mobile' },
	];

	for ( const { name, css } of modes ) {
		for ( const side of SPACING_SIDES ) {
			const sideLower = side.toLowerCase();
			for ( const { id, suffix } of devices ) {
				const device =
					id === 'desktop'
						? 'desktop'
						: id === 'tablet'
							? 'tablet'
							: 'mobile';
				const key = getSpacingAttrKey( name, side, device );
				const val = attributes[ key ];
				if ( val !== undefined && val !== null && String( val ).trim() !== '' ) {
					out[ `--cb-${ css }-${ sideLower }${ suffix }` ] =
						String( val ).trim();
				}
			}
		}
	}
	return out;
}
