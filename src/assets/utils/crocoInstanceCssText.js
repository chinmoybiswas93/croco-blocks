/**
 * Full declaration string for instance-scoped CSS (mirrors PHP render builders).
 *
 * @param {string} blockName Block name.
 * @param {Object} attributes Attributes.
 * @return {string}
 */
import { buildHeroSliderStyleDeclarationsString } from './heroSliderStyleDeclarations';
import { buildNavigationMenuStyleDeclarationsString } from './navigationMenuStyleDeclarations';

export function buildCrocoInstanceCssText( blockName, attributes ) {
	if ( blockName === 'croco-blocks/hero-slider' ) {
		return buildHeroSliderStyleDeclarationsString( attributes );
	}
	if ( blockName === 'croco-blocks/navigation-menu' ) {
		return buildNavigationMenuStyleDeclarationsString( attributes );
	}
	return '';
}
