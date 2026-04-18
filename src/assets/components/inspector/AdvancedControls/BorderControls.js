import { SelectControl, TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ResponsiveSpacingControl } from '../../controls/ResponsiveSpacingControl/ResponsiveSpacingControl';
import { ColorOpacityControl } from '../../controls/ColorOpacityControl/ColorOpacityControl';
import './BorderControls.scss';

const TAB_NORMAL = 'normal';
const TAB_HOVER = 'hover';

const BORDER_STYLE_OPTIONS = [
	{ value: '', label: __( '— None —', 'croco-blocks' ) },
	{ value: 'none', label: __( 'None', 'croco-blocks' ) },
	{ value: 'solid', label: __( 'Solid', 'croco-blocks' ) },
	{ value: 'dashed', label: __( 'Dashed', 'croco-blocks' ) },
	{ value: 'dotted', label: __( 'Dotted', 'croco-blocks' ) },
	{ value: 'double', label: __( 'Double', 'croco-blocks' ) },
	{ value: 'groove', label: __( 'Groove', 'croco-blocks' ) },
	{ value: 'ridge', label: __( 'Ridge', 'croco-blocks' ) },
	{ value: 'inset', label: __( 'Inset', 'croco-blocks' ) },
	{ value: 'outset', label: __( 'Outset', 'croco-blocks' ) },
];

/**
 * @param {string} style Raw border style attribute.
 * @return {boolean} Whether width/color controls should show.
 */
function borderStyleShowsDetails( style ) {
	if ( style === undefined || style === null ) {
		return false;
	}
	const s = String( style ).trim();
	if ( s === '' || s === 'none' ) {
		return false;
	}
	return true;
}

/**
 * @param {Object} props
 * @param {Object} props.attributes
 * @param {Function} props.setAttributes
 */
export const BorderControls = ( { attributes, setAttributes } ) => {
	return (
		<div className="croco-blocks-border-controls">
			<span className="croco-blocks-advanced-controls__section-title">
				{ __( 'Border', 'croco-blocks' ) }
			</span>
			<TabPanel
				className="croco-blocks-border-controls__tabs"
				activeClass="is-active"
				initialTabName={ TAB_NORMAL }
				tabs={ [
					{
						name: TAB_NORMAL,
						title: __( 'Normal', 'croco-blocks' ),
					},
					{
						name: TAB_HOVER,
						title: __( 'Hover', 'croco-blocks' ),
					},
				] }
			>
				{ ( tab ) =>
					tab.name === TAB_NORMAL ? (
						<div className="croco-blocks-border-controls__panel">
							<div className="croco-blocks-border-controls__field">
								<SelectControl
									label={ __( 'Border type', 'croco-blocks' ) }
									value={ attributes.cbBorderStyle ?? '' }
									options={ BORDER_STYLE_OPTIONS }
									onChange={ ( value ) =>
										setAttributes( {
											cbBorderStyle: value || '',
										} )
									}
									__nextHasNoMarginBottom
								/>
							</div>
							{ borderStyleShowsDetails(
								attributes.cbBorderStyle
							) && (
								<>
									<div className="croco-blocks-advanced-controls__section croco-blocks-advanced-controls__section--nested">
										<ResponsiveSpacingControl
											label={ __(
												'Border width',
												'croco-blocks'
											) }
											mode="border"
											attributes={ attributes }
											setAttributes={ setAttributes }
										/>
									</div>
									<div className="croco-blocks-advanced-controls__section croco-blocks-advanced-controls__section--nested">
										<ColorOpacityControl
											label={ __(
												'Border color',
												'croco-blocks'
											) }
											color={
												attributes.cbBorderColor ||
												''
											}
											onChange={ ( value ) =>
												setAttributes( {
													cbBorderColor:
														value || '',
												} )
											}
										/>
									</div>
								</>
							) }
						</div>
					) : (
						<div className="croco-blocks-border-controls__panel">
							<div className="croco-blocks-border-controls__field">
								<SelectControl
									label={ __( 'Border type', 'croco-blocks' ) }
									value={
										attributes.cbBorderHoverStyle ?? ''
									}
									options={ BORDER_STYLE_OPTIONS }
									onChange={ ( value ) =>
										setAttributes( {
											cbBorderHoverStyle: value || '',
										} )
									}
									__nextHasNoMarginBottom
								/>
							</div>
							{ borderStyleShowsDetails(
								attributes.cbBorderHoverStyle
							) && (
								<>
									<div className="croco-blocks-advanced-controls__section croco-blocks-advanced-controls__section--nested">
										<ResponsiveSpacingControl
											label={ __(
												'Border width',
												'croco-blocks'
											) }
											mode="borderHover"
											attributes={ attributes }
											setAttributes={ setAttributes }
										/>
									</div>
									<div className="croco-blocks-advanced-controls__section croco-blocks-advanced-controls__section--nested">
										<ColorOpacityControl
											label={ __(
												'Border color',
												'croco-blocks'
											) }
											color={
												attributes.cbBorderHoverColor ||
												''
											}
											onChange={ ( value ) =>
												setAttributes( {
													cbBorderHoverColor:
														value || '',
												} )
											}
										/>
									</div>
								</>
							) }
						</div>
					)
				}
			</TabPanel>
		</div>
	);
};
