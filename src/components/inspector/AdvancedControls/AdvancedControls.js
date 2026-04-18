import { __ } from '@wordpress/i18n';
import { ResponsiveSpacingControl } from '../../controls/ResponsiveSpacingControl/ResponsiveSpacingControl';
import { ColorOpacityControl } from '../../controls/ColorOpacityControl/ColorOpacityControl';

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
			<div className="croco-blocks-advanced-controls__section">
				<p className="components-base-control__help croco-blocks-advanced-controls__bg-help">
					{ __(
						'Applies to the block wrapper. Leave empty for no background.',
						'croco-blocks'
					) }
				</p>
				<ColorOpacityControl
					label={ __( 'Background color', 'croco-blocks' ) }
					color={ attributes.cbAdvancedBackgroundColor || '' }
					onChange={ ( value ) =>
						setAttributes( {
							cbAdvancedBackgroundColor: value || '',
						} )
					}
				/>
			</div>
		</div>
	);
};
