/**
 * Mirrors CrocoBlocks\BlockSupport\InstanceCss (PHP) for editor instance CSS.
 *
 * @param {string|undefined|null} key cbInstanceKey
 * @return {string} Sanitized token or ''
 */
export function sanitizeCbInstanceKey( key ) {
	if ( key === undefined || key === null ) {
		return '';
	}
	const s = String( key ).trim();
	if ( ! /^[a-zA-Z0-9_-]{8,40}$/.test( s ) ) {
		return '';
	}
	return s;
}

/**
 * @param {string} blockName e.g. croco-blocks/hero-slider
 * @return {string} wp-block-… class
 */
export function blockNameToWpClass( blockName ) {
	if ( ! blockName || typeof blockName !== 'string' ) {
		return '';
	}
	return 'wp-block-' + blockName.replace( /\//g, '-' );
}

/**
 * @param {string|undefined} anchor
 * @return {string} #id or ''
 */
export function anchorToIdSelector( anchor ) {
	if ( anchor === undefined || anchor === null ) {
		return '';
	}
	const a = String( anchor ).trim();
	if ( a === '' ) {
		return '';
	}
	if ( ! /^[A-Za-z][A-Za-z0-9_:.-]*$/.test( a ) ) {
		return '';
	}
	return '#' + a;
}

/**
 * @param {string} blockName
 * @param {Object} attributes
 * @return {string} Full CSS selector or ''
 */
export function getCrocoInstanceCssSelector( blockName, attributes ) {
	const idSel = anchorToIdSelector( attributes?.anchor );
	if ( idSel !== '' ) {
		return idSel;
	}
	const key = sanitizeCbInstanceKey( attributes?.cbInstanceKey );
	if ( key === '' ) {
		return '';
	}
	const bc = blockNameToWpClass( blockName );
	if ( bc === '' ) {
		return '';
	}
	return '.' + bc + '.cb-i-' + key;
}

/**
 * @param {Object} attributes
 * @return {boolean}
 */
export function shouldUseExternalInstanceCss( attributes ) {
	if ( ! attributes || typeof attributes !== 'object' ) {
		return false;
	}
	if ( sanitizeCbInstanceKey( attributes.cbInstanceKey ) !== '' ) {
		return true;
	}
	return anchorToIdSelector( attributes.anchor ) !== '';
}

/**
 * Shared layout classes for block roots (mirrors InstanceCss::wrapper_class_string).
 *
 * @param {string} blockName
 * @param {Object} attributes
 * @return {string}
 */
export function getInstanceWrapperClassString( blockName, attributes ) {
	const parts = [ 'cb-block' ];
	if ( blockName === 'croco-blocks/hero-slider' ) {
		parts.push( 'cb-hero' );
	} else if ( blockName === 'croco-blocks/navigation-menu' ) {
		parts.push( 'cb-nav' );
	}
	const k = sanitizeCbInstanceKey( attributes?.cbInstanceKey );
	if ( k ) {
		parts.push( 'cb-i-' + k );
	}
	return parts.filter( Boolean ).join( ' ' );
}

