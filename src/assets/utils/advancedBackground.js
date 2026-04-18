/**
 * Advanced tab: optional wrapper background color (editor preview).
 *
 * @param {Object} attributes Block attributes.
 * @return {Object<string, string>} Style object fragment for useBlockProps.
 */
export function getAdvancedBackgroundStyle( attributes ) {
	const raw = attributes?.cbAdvancedBackgroundColor;
	if ( raw === undefined || raw === null ) {
		return {};
	}
	const value = String( raw ).trim();
	if ( value === '' ) {
		return {};
	}
	return { backgroundColor: value };
}
