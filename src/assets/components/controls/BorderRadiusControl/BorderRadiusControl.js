import { __ } from '@wordpress/i18n';
import { ResponsiveSpacingControl } from '../ResponsiveSpacingControl/ResponsiveSpacingControl';

/**
 * @param {Object} props
 * @param {Object} props.attributes
 * @param {Function} props.setAttributes
 * @param {'borderRadius'|'borderRadiusHover'} props.mode
 */
export const BorderRadiusControl = ( { attributes, setAttributes, mode } ) => (
	<ResponsiveSpacingControl
		label={ __( 'Border radius', 'croco-blocks' ) }
		mode={ mode }
		attributes={ attributes }
		setAttributes={ setAttributes }
	/>
);
