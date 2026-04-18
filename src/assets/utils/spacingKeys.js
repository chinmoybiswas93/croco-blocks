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
 * @param {'padding'|'margin'|'border'|'borderHover'} mode
 * @param {'Top'|'Right'|'Bottom'|'Left'} side
 * @param {'desktop'|'tablet'|'mobile'} device
 * @return {string} Attribute key e.g. cbPaddingTopTablet
 */
export function getSpacingAttrKey( mode, side, device ) {
	let prefix;
	if ( mode === 'padding' ) {
		prefix = 'cbPadding';
	} else if ( mode === 'margin' ) {
		prefix = 'cbMargin';
	} else if ( mode === 'border' ) {
		prefix = 'cbBorder';
	} else if ( mode === 'borderHover' ) {
		prefix = 'cbBorderHover';
	} else {
		prefix = 'cbMargin';
	}
	const suffix =
		device === 'desktop'
			? ''
			: device === 'tablet'
				? 'Tablet'
				: 'Mobile';
	return `${ prefix }${ side }${ suffix }`;
}

/**
 * @param {'padding'|'margin'|'border'|'borderHover'} mode
 * @return {string}
 */
export function getSpacingUnitKey( mode ) {
	if ( mode === 'padding' ) {
		return 'cbPaddingUnit';
	}
	if ( mode === 'margin' ) {
		return 'cbMarginUnit';
	}
	if ( mode === 'border' ) {
		return 'cbBorderUnit';
	}
	if ( mode === 'borderHover' ) {
		return 'cbBorderHoverUnit';
	}
	return 'cbMarginUnit';
}

/**
 * @param {'padding'|'margin'|'border'|'borderHover'} mode
 * @return {string}
 */
export function getSpacingLinkedKey( mode ) {
	if ( mode === 'padding' ) {
		return 'cbPaddingLinked';
	}
	if ( mode === 'margin' ) {
		return 'cbMarginLinked';
	}
	if ( mode === 'border' ) {
		return 'cbBorderLinked';
	}
	if ( mode === 'borderHover' ) {
		return 'cbBorderHoverLinked';
	}
	return 'cbMarginLinked';
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
 * @param {'padding'|'margin'|'border'|'borderHover'|undefined} mode Padding/border widths cannot be negative; margin can.
 * @return {string} Never empty — blanks become 0 with unit (consistent CSS vars).
 */
export function formatSpacingValue( num, unit, mode ) {
	const u = unit || 'px';
	if ( num === undefined || num === null || String( num ).trim() === '' ) {
		return `0${ u }`;
	}
	let n = String( num ).trim();
	const nonNegative =
		mode === 'padding' ||
		mode === 'border' ||
		mode === 'borderHover';
	if ( nonNegative ) {
		const parsed = parseFloat( n );
		if ( Number.isFinite( parsed ) && parsed < 0 ) {
			n = '0';
		}
	}
	return `${ n }${ u }`;
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
		const unitKey =
			name === 'padding' ? 'cbPaddingUnit' : 'cbMarginUnit';
		const unit = attributes[ unitKey ] || 'px';
		const zeroVal = formatSpacingValue( '0', unit, name );

		for ( const { id, suffix } of devices ) {
			const keys = SPACING_SIDES.map( ( side ) =>
				getSpacingAttrKey( name, side, id )
			);
			const hasAny = keys.some( ( k ) => {
				const v = attributes[ k ];
				return (
					v !== undefined &&
					v !== null &&
					String( v ).trim() !== ''
				);
			} );
			if ( ! hasAny ) {
				continue;
			}
			for ( const side of SPACING_SIDES ) {
				const key = getSpacingAttrKey( name, side, id );
				const sideLower = side.toLowerCase();
				const raw = attributes[ key ];
				const trimmed =
					raw !== undefined &&
					raw !== null &&
					String( raw ).trim() !== ''
						? String( raw ).trim()
						: '';
				const { num } = parseSpacingValue(
					trimmed || `0${ unit }`
				);
				const val = formatSpacingValue(
					num === '' ? '0' : num,
					unit,
					name
				);
				out[ `--cb-${ css }-${ sideLower }${ suffix }` ] = val;
			}
		}
	}
	return out;
}

/**
 * Border width CSS variables for editor preview (--cb-border-*, --cb-border-hover-*).
 *
 * @param {Object} attributes Block attributes.
 * @return {Object<string, string>}
 */
export function getBorderCssVarsForEditor( attributes ) {
	const out = {};
	const devices = [
		{ id: 'desktop', suffix: '' },
		{ id: 'tablet', suffix: '-tablet' },
		{ id: 'mobile', suffix: '-mobile' },
	];

	const emitWidths = ( mode, cssBase ) => {
		const unitKey = mode === 'border' ? 'cbBorderUnit' : 'cbBorderHoverUnit';
		const unit = attributes[ unitKey ] || 'px';
		const zeroVal = formatSpacingValue( '0', unit, mode );

		for ( const { id, suffix } of devices ) {
			const keys = SPACING_SIDES.map( ( side ) =>
				getSpacingAttrKey( mode, side, id )
			);
			const hasAny = keys.some( ( k ) => {
				const v = attributes[ k ];
				return (
					v !== undefined &&
					v !== null &&
					String( v ).trim() !== ''
				);
			} );
			if ( ! hasAny ) {
				continue;
			}
			for ( const side of SPACING_SIDES ) {
				const key = getSpacingAttrKey( mode, side, id );
				const sideLower = side.toLowerCase();
				const raw = attributes[ key ];
				const trimmed =
					raw !== undefined &&
					raw !== null &&
					String( raw ).trim() !== ''
						? String( raw ).trim()
						: '';
				const { num } = parseSpacingValue(
					trimmed || `0${ unit }`
				);
				const val = formatSpacingValue(
					num === '' ? '0' : num,
					unit,
					mode
				);
				out[ `--cb-${ cssBase }-${ sideLower }${ suffix }` ] = val;
			}
		}
	};

	emitWidths( 'border', 'border' );
	emitWidths( 'borderHover', 'border-hover' );

	const style = attributes.cbBorderStyle;
	if ( style !== undefined && style !== null && String( style ).trim() !== '' ) {
		out[ '--cb-border-style' ] = String( style ).trim();
	}

	const hStyle = attributes.cbBorderHoverStyle;
	if (
		hStyle !== undefined &&
		hStyle !== null &&
		String( hStyle ).trim() !== ''
	) {
		out[ '--cb-border-hover-style' ] = String( hStyle ).trim();
	}

	const color = attributes.cbBorderColor;
	if ( color !== undefined && color !== null && String( color ).trim() !== '' ) {
		out[ '--cb-border-color' ] = String( color ).trim();
	}

	const hColor = attributes.cbBorderHoverColor;
	if (
		hColor !== undefined &&
		hColor !== null &&
		String( hColor ).trim() !== ''
	) {
		out[ '--cb-border-hover-color' ] = String( hColor ).trim();
	}

	return out;
}
