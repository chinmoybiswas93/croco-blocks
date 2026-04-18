/**
 * Advanced tab spacing + border + background as a single declaration string (mirrors PHP fragments).
 *
 * @param {Object} attributes Block attributes.
 * @return {string}
 */
import { getBorderCssVarsForEditor, getSpacingCssVarsForEditor } from './spacingKeys';
import { getAdvancedBackgroundStyle } from './advancedBackground';

export function buildAdvancedTabDeclarationsString( attributes ) {
	const sp = getSpacingCssVarsForEditor( attributes );
	const br = getBorderCssVarsForEditor( attributes );
	const bg = getAdvancedBackgroundStyle( attributes );
	const parts = [];
	for ( const [ k, v ] of Object.entries( { ...sp, ...br } ) ) {
		parts.push( `${ k }:${ v }` );
	}
	if ( bg.backgroundColor ) {
		parts.push( `background-color:${ bg.backgroundColor }` );
	}
	return parts.join( ';' );
}
