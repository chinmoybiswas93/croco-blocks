import { __ } from '@wordpress/i18n';
import { ResponsiveSpacingControl } from '../../controls/ResponsiveSpacingControl/ResponsiveSpacingControl';

export const AdvancedControls = ( { attributes, setAttributes } ) => {
	return (
		<div className="croco-blocks-advanced-controls">
			<div className="croco-blocks-advanced-controls__section">
				<ResponsiveSpacingControl
					label={ __( 'Padding', 'croco-blocks' ) }
					mode="padding"
					attributes={ attributes }
					setAttributes={ setAttributes }
				/>
			</div>
			<div className="croco-blocks-advanced-controls__section">
				<ResponsiveSpacingControl
					label={ __( 'Margin', 'croco-blocks' ) }
					mode="margin"
					attributes={ attributes }
					setAttributes={ setAttributes }
				/>
			</div>
		</div>
	);
};
