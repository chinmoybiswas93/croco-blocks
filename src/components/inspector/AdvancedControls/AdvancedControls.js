import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export const AdvancedControls = ( { attributes, setAttributes } ) => {
	const {
		cbPaddingTop = '',
		cbPaddingRight = '',
		cbPaddingBottom = '',
		cbPaddingLeft = '',
		cbMarginTop = '',
		cbMarginBottom = '',
	} = attributes;

	return (
		<>
			<PanelBody
				title={ __( 'Padding', 'croco-blocks' ) }
				initialOpen={ true }
			>
				<div className="croco-blocks-spacing-grid">
					<TextControl
						label={ __( 'Top', 'croco-blocks' ) }
						value={ cbPaddingTop }
						onChange={ ( value ) =>
							setAttributes( { cbPaddingTop: value } )
						}
						placeholder="e.g. 10px"
					/>
					<TextControl
						label={ __( 'Right', 'croco-blocks' ) }
						value={ cbPaddingRight }
						onChange={ ( value ) =>
							setAttributes( { cbPaddingRight: value } )
						}
						placeholder="e.g. 10px"
					/>
					<TextControl
						label={ __( 'Bottom', 'croco-blocks' ) }
						value={ cbPaddingBottom }
						onChange={ ( value ) =>
							setAttributes( { cbPaddingBottom: value } )
						}
						placeholder="e.g. 10px"
					/>
					<TextControl
						label={ __( 'Left', 'croco-blocks' ) }
						value={ cbPaddingLeft }
						onChange={ ( value ) =>
							setAttributes( { cbPaddingLeft: value } )
						}
						placeholder="e.g. 10px"
					/>
				</div>
			</PanelBody>

			<PanelBody
				title={ __( 'Margin', 'croco-blocks' ) }
				initialOpen={ false }
			>
				<div className="croco-blocks-spacing-grid croco-blocks-spacing-grid--2col">
					<TextControl
						label={ __( 'Top', 'croco-blocks' ) }
						value={ cbMarginTop }
						onChange={ ( value ) =>
							setAttributes( { cbMarginTop: value } )
						}
						placeholder="e.g. 20px"
					/>
					<TextControl
						label={ __( 'Bottom', 'croco-blocks' ) }
						value={ cbMarginBottom }
						onChange={ ( value ) =>
							setAttributes( { cbMarginBottom: value } )
						}
						placeholder="e.g. 20px"
					/>
				</div>
			</PanelBody>
		</>
	);
};
