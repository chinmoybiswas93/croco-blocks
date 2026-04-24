import { registerBlockType } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import ServerSideRender from '@wordpress/server-side-render';
import metadata from './block.json';
import {
	getBorderCssVarsForEditor,
	getSpacingCssVarsForEditor,
} from '../../utils/spacingKeys';
import { getCoreStyleInlineFromAttributes } from '../../utils/blockStyleInline';
import { getAdvancedBackgroundStyle } from '../../utils/advancedBackground';
import { useBlockEditContext, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RadioControl,
	ToggleControl,
	Spinner,
	Placeholder,
} from '@wordpress/components';
import { InspectorTabs } from '../../components/inspector/InspectorTabs/InspectorTabs';
import { ResponsiveAlignmentControl } from '../../components/controls/ResponsiveAlignmentControl/ResponsiveAlignmentControl';
import { AlignmentControl } from '../../components/controls/AlignmentControl/AlignmentControl';
import { ColorOpacityControl } from '../../components/controls/ColorOpacityControl/ColorOpacityControl';
import { ResponsiveUnitControl } from '../../components/controls/ResponsiveUnitControl/ResponsiveUnitControl';
import { SliderUnitControl } from '../../components/controls/SliderUnitControl/SliderUnitControl';
import { useCrocoInstanceKey } from '../../hooks/useCrocoInstanceKey';
import { useCrocoInstanceStylesheet } from '../../hooks/useCrocoInstanceStylesheet';
import { buildCrocoInstanceCssText } from '../../utils/crocoInstanceCssText';
import {
	getInstanceWrapperClassString,
	shouldUseExternalInstanceCss,
} from '../../utils/crocoInstanceCssSelectors';
import './style.scss';
import './editor.scss';

function parsePxIntForRange( raw, fallback ) {
	const n = parseInt(
		String( raw ?? '' ).replace( /px\s*$/i, '' ),
		10
	);
	return Number.isFinite( n ) ? n : fallback;
}

/** Parse px string for sliders; keeps 0. Uses fallback only when NaN (not for 0). */
function parsePxSliderInt( raw, fallbackIfNaN ) {
	const n = parseInt(
		String( raw ?? '' ).replace( /px\s*$/i, '' ),
		10
	);
	return Number.isNaN( n ) ? fallbackIfNaN : n;
}

const SLIDER_PX_UNITS = [ { value: 'px', label: 'px' } ];

const LINE_HEIGHT_UNITS = [
	{ value: 'px', label: 'px' },
	{ value: 'em', label: 'em' },
	{ value: 'rem', label: 'rem' },
];
const LINE_HEIGHT_FIRST = LINE_HEIGHT_UNITS[ 0 ].value;

const LETTER_SPACING_UNITS = [
	{ value: 'em', label: 'em' },
	{ value: 'rem', label: 'rem' },
	{ value: 'px', label: 'px' },
	{ value: '%', label: '%' },
];
const LETTER_SPACING_FIRST = LETTER_SPACING_UNITS[ 0 ].value;

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const { clientId } = useBlockEditContext();
		const {
			menuId,
			itemSpacing,
			orientation,
			alignmentDesktop,
			alignmentTablet,
			alignmentMobile,
			submenuTextColor,
			submenuTextHoverColor,
			submenuAlignment,
			submenuTextAlignment,
			submenuOffsetTop,
			submenuHoverBackgroundColor,
			submenuItemPadding,
			mobileMenuTextColor,
			mobileMenuHoverTextColor,
			mobileSubmenuTextColor,
			mobileSubmenuHoverTextColor,
			offcanvasBackgroundColor,
			offcanvasMenuItemPaddingHorizontal,
			offcanvasMenuItemPaddingVertical,
			menuItemPadding,
			menuItemPaddingVertical,
			menuItemTextColor,
			menuItemTextHoverColor,
			menuItemFontSize,
			menuItemFontSizeDesktop,
			menuItemFontSizeTablet,
			menuItemFontSizeMobile,
			menuItemFontSizeUnit,
			menuItemFontWeight,
			menuItemLineHeight,
			menuItemLineHeightSet,
			menuItemLineHeightUnit,
			menuItemLetterSpacing,
			menuItemLetterSpacingValue,
			menuItemLetterSpacingSet,
			menuItemLetterSpacingUnit,
			enableToggle,
			toggleBreakpoint,
			toggleIconColor,
			toggleIconSize,
			toggleIconPadding,
			showDropdownIndicator,
			dropdownIndicatorGap,
			dropdownIndicatorSize,
		} = attributes;

		useCrocoInstanceKey(
			attributes,
			setAttributes,
			clientId,
			metadata.name
		);

		const instanceCssText = useMemo(
			() => buildCrocoInstanceCssText( metadata.name, attributes ),
			[ attributes ]
		);

		const instanceStyleRef = useCrocoInstanceStylesheet(
			metadata.name,
			attributes,
			instanceCssText
		);

		const useExternalInstanceCss = shouldUseExternalInstanceCss( attributes );

		const blockProps = useBlockProps( {
			ref: instanceStyleRef,
			className: [
				'croco-blocks-ssr-editor-root',
				getInstanceWrapperClassString( metadata.name, attributes ),
			]
				.filter( Boolean )
				.join( ' ' ),
			style: useExternalInstanceCss
				? undefined
				: {
						...getCoreStyleInlineFromAttributes(
							attributes.style
						),
						...getSpacingCssVarsForEditor( attributes ),
						...getBorderCssVarsForEditor( attributes ),
						...getAdvancedBackgroundStyle( attributes ),
				  },
		} );

		const menus = useSelect(
			( select ) =>
				select( coreStore ).getMenus( { per_page: -1 } ),
			[]
		);

		const isLoading = menus === null;

		const menuOptions = [
			{ label: __( '— Select a Menu —', 'croco-blocks' ), value: 0 },
		];

		const toValueString = ( value ) =>
			value === 0 || typeof value === 'number'
				? String( value )
				: value || '';

		const menuItemFontValues = useMemo( () => {
			let desktopNum = menuItemFontSizeDesktop ?? 0;
			if (
				( ! desktopNum ||
					parseFloat( String( desktopNum ), 10 ) <= 0 ) &&
				menuItemFontSize
			) {
				const m = String( menuItemFontSize )
					.trim()
					.match( /^([\d.]+)/ );
				if ( m ) {
					desktopNum = parseFloat( m[ 1 ], 10 ) || 0;
				}
			}
			return {
				desktop: toValueString( desktopNum ),
				tablet: toValueString( menuItemFontSizeTablet ?? 0 ),
				mobile: toValueString( menuItemFontSizeMobile ?? 0 ),
			};
		}, [
			menuItemFontSizeDesktop,
			menuItemFontSizeTablet,
			menuItemFontSizeMobile,
			menuItemFontSize,
		] );

		const menuItemLineHeightSetResolved = useMemo( () => {
			if ( menuItemLineHeightSet === true ) {
				return true;
			}
			if ( menuItemLineHeightSet === false ) {
				return false;
			}
			return (
				( menuItemLineHeight ?? 0 ) > 0 ||
				( menuItemLineHeightUnit || '' ) !== ''
			);
		}, [
			menuItemLineHeightSet,
			menuItemLineHeight,
			menuItemLineHeightUnit,
		] );

		const menuItemLetterSpacingSetResolved = useMemo( () => {
			if ( menuItemLetterSpacingSet === true ) {
				return true;
			}
			if ( menuItemLetterSpacingSet === false ) {
				return false;
			}
			return (
				( menuItemLetterSpacingValue ?? 0 ) !== 0 ||
				( menuItemLetterSpacingUnit || '' ) !== '' ||
				( menuItemLetterSpacing || '' ).trim() !== ''
			);
		}, [
			menuItemLetterSpacingSet,
			menuItemLetterSpacingValue,
			menuItemLetterSpacingUnit,
			menuItemLetterSpacing,
		] );

		const letterSpacingSliderBounds = useMemo( () => {
			const u = (
				menuItemLetterSpacingUnit || LETTER_SPACING_FIRST
			).toLowerCase();
			if ( u === 'px' ) {
				return {
					min: -5,
					max: 25,
					step: 0.5,
					allowNegative: true,
				};
			}
			if ( u === '%' ) {
				return {
					min: -10,
					max: 30,
					step: 0.5,
					allowNegative: true,
				};
			}
			if ( u === 'rem' ) {
				return {
					min: -0.2,
					max: 0.5,
					step: 0.005,
					allowNegative: true,
				};
			}
			return {
				min: -0.2,
				max: 0.5,
				step: 0.005,
				allowNegative: true,
			};
		}, [ menuItemLetterSpacingUnit ] );

		const lineHeightSliderBounds = useMemo( () => {
			const u = ( menuItemLineHeightUnit || LINE_HEIGHT_FIRST ).toLowerCase();
			if ( u === 'px' ) {
				/* 0 = no custom line-height; slider min aligns thumb with value 0. */
				return { min: 0, max: 96, step: 1 };
			}
			return { min: 0.8, max: 3, step: 0.05 };
		}, [ menuItemLineHeightUnit ] );

		const lineHeightUnitResolved = ( () => {
			const u = (
				menuItemLineHeightUnit || LINE_HEIGHT_FIRST
			).toLowerCase();
			return [ 'px', 'em', 'rem' ].includes( u ) ? u : LINE_HEIGHT_FIRST;
		} )();

		if ( menus ) {
			menus.forEach( ( menu ) => {
				menuOptions.push( { label: menu.name, value: menu.id } );
			} );
		}

		const settingsContent = (
			<>
				<PanelBody
					title={ __( 'Menu Settings', 'croco-blocks' ) }
					initialOpen={ true }
				>
					{ isLoading ? (
						<Spinner />
					) : (
						<SelectControl
							label={ __( 'Select Menu', 'croco-blocks' ) }
							value={ menuId }
							options={ menuOptions }
							onChange={ ( value ) =>
								setAttributes( {
									menuId: parseInt( value, 10 ),
								} )
							}
						/>
					) }
					<RadioControl
						label={ __( 'Orientation', 'croco-blocks' ) }
						selected={ orientation }
						options={ [
							{
								label: __( 'Horizontal', 'croco-blocks' ),
								value: 'horizontal',
							},
							{
								label: __( 'Vertical', 'croco-blocks' ),
								value: 'vertical',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { orientation: value } )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Toggle Menu Settings', 'croco-blocks' ) }
					initialOpen={ false }
				>
					<ToggleControl
						label={ __(
							'Enable toggle / off-canvas menu',
							'croco-blocks'
						) }
						checked={ !! enableToggle }
						onChange={ ( value ) =>
							setAttributes( { enableToggle: value } )
						}
						help={ __(
							'Below the chosen breakpoint, show a hamburger button and off-canvas menu instead of the horizontal navigation.',
							'croco-blocks'
						) }
					/>
					{ enableToggle && (
						<>
							<SelectControl
								label={ __(
									'Toggle from breakpoint',
									'croco-blocks'
								) }
								value={ toggleBreakpoint || 'mobile' }
								options={ [
									{
										label: __(
											'Tablet and below',
											'croco-blocks'
										),
										value: 'tablet',
									},
									{
										label: __(
											'Mobile only',
											'croco-blocks'
										),
										value: 'mobile',
									},
								] }
								onChange={ ( value ) =>
									setAttributes( {
										toggleBreakpoint: value,
									} )
								}
								help={ __(
									'Choose the viewport width from which the hamburger / off-canvas menu is used.',
									'croco-blocks'
								) }
							/>
							<ColorOpacityControl
								label={ __(
									'Toggle icon color',
									'croco-blocks'
								) }
								color={ toggleIconColor }
								onChange={ ( value ) =>
									setAttributes( {
										toggleIconColor: value,
									} )
								}
							/>
							<SliderUnitControl
								label={ __(
									'Toggle icon size',
									'croco-blocks'
								) }
								value={ parsePxSliderInt(
									toggleIconSize,
									18
								) }
								unit="px"
								units={ SLIDER_PX_UNITS }
								min={ 12 }
								max={ 32 }
								step={ 1 }
								help={ __(
									'Controls the width of the hamburger bars.',
									'croco-blocks'
								) }
								onChange={ ( { value } ) =>
									setAttributes( {
										toggleIconSize: `${ value || 0 }px`,
									} )
								}
							/>
							<SliderUnitControl
								label={ __(
									'Toggle button padding',
									'croco-blocks'
								) }
								value={ parsePxSliderInt(
									toggleIconPadding,
									0
								) }
								unit="px"
								units={ SLIDER_PX_UNITS }
								min={ 0 }
								max={ 16 }
								step={ 1 }
								help={ __(
									'Inner padding around the icon inside the button.',
									'croco-blocks'
								) }
								onChange={ ( { value } ) =>
									setAttributes( {
										toggleIconPadding: `${ value || 0 }px`,
									} )
								}
							/>
						</>
					) }
				</PanelBody>
			</>
		);

		const stylesContent = (
			<>
				<PanelBody
					title={ __( 'Menu text', 'croco-blocks' ) }
					initialOpen={ true }
				>
					<p className="components-base-control__label">
						{ __( 'Colors', 'croco-blocks' ) }
					</p>
					<ColorOpacityControl
						label={ __( 'Top-level text', 'croco-blocks' ) }
						color={ menuItemTextColor || '' }
						onChange={ ( value ) =>
							setAttributes( { menuItemTextColor: value || '' } )
						}
						hoverColor={ menuItemTextHoverColor || '' }
						onHoverChange={ ( value ) =>
							setAttributes( {
								menuItemTextHoverColor: value || '',
							} )
						}
					/>
					<p className="components-base-control__label cb-navigation-inspector__section-heading">
						{ __( 'Typography', 'croco-blocks' ) }
					</p>
					<ResponsiveUnitControl
						label={ __( 'Font size', 'croco-blocks' ) }
						values={ menuItemFontValues }
						unit={ menuItemFontSizeUnit || 'px' }
						units={ [
							{ value: 'px', label: 'px' },
							{ value: 'rem', label: 'rem' },
							{ value: 'em', label: 'em' },
							{ value: '%', label: '%' },
						] }
						min={ 8 }
						max={ 96 }
						step={ 1 }
						onChange={ ( next ) => {
							const desk =
								next.values.desktop !== ''
									? parseFloat( next.values.desktop ) || 0
									: 0;
							const u = next.unit || 'px';
							setAttributes( {
								menuItemFontSizeDesktop:
									next.values.desktop !== ''
										? parseFloat( next.values.desktop ) ||
										  0
										: 0,
								menuItemFontSizeTablet:
									next.values.tablet !== ''
										? parseFloat( next.values.tablet ) ||
										  0
										: 0,
								menuItemFontSizeMobile:
									next.values.mobile !== ''
										? parseFloat( next.values.mobile ) ||
										  0
										: 0,
								menuItemFontSizeUnit: u,
								menuItemFontSize:
									desk > 0 ? `${ desk }${ u }` : '',
							} );
						} }
					/>
					<SelectControl
						label={ __( 'Font weight', 'croco-blocks' ) }
						value={ menuItemFontWeight || '' }
						options={ [
							{
								label: __(
									'Default (inherit)',
									'croco-blocks'
								),
								value: '',
							},
							{ label: '400', value: '400' },
							{ label: '500', value: '500' },
							{ label: '600', value: '600' },
							{ label: '700', value: '700' },
						] }
						onChange={ ( value ) =>
							setAttributes( { menuItemFontWeight: value || '' } )
						}
						__nextHasNoMarginBottom
					/>
					<SliderUnitControl
						label={ __( 'Line height', 'croco-blocks' ) }
						value={
							menuItemLineHeightSetResolved
								? menuItemLineHeight
								: null
						}
						unit={ lineHeightUnitResolved }
						units={ LINE_HEIGHT_UNITS }
						min={ lineHeightSliderBounds.min }
						max={ lineHeightSliderBounds.max }
						step={ lineHeightSliderBounds.step }
						emptyWhenUnset
						unsetSliderValue={
							lineHeightUnitResolved === 'px'
								? undefined
								: 1.2
						}
						numberPlaceholder={
							lineHeightUnitResolved === 'px' ? '24' : '1.2'
						}
						onChange={ ( {
							value,
							unit,
							inputCleared,
						} ) => {
							if ( inputCleared ) {
								setAttributes( {
									menuItemLineHeightSet: false,
									menuItemLineHeight: 0,
									menuItemLineHeightUnit: '',
								} );
								return;
							}
							let v = value;
							if (
								typeof v !== 'number' ||
								Number.isNaN( v )
							) {
								v = parseFloat( String( v ), 10 );
							}
							if ( ! Number.isFinite( v ) ) {
								return;
							}
							const prevU =
								menuItemLineHeightUnit || LINE_HEIGHT_FIRST;
							const nextU = [ 'px', 'em', 'rem' ].includes(
								( unit || '' ).toLowerCase()
							)
								? unit
								: LINE_HEIGHT_FIRST;

							if ( ! menuItemLineHeightSetResolved ) {
								if ( v === 0 ) {
									if (
										nextU.toLowerCase() !==
										prevU.toLowerCase()
									) {
										setAttributes( {
											menuItemLineHeightUnit:
												nextU === LINE_HEIGHT_FIRST
													? ''
													: nextU,
										} );
									} else {
										setAttributes( {
											menuItemLineHeightSet: true,
											menuItemLineHeight: 0,
											menuItemLineHeightUnit: nextU,
										} );
									}
									return;
								}
								let nextV = v;
								if ( prevU !== nextU ) {
									if (
										nextU === 'px' &&
										v > 0 &&
										v <= 4
									) {
										nextV = Math.min(
											96,
											Math.max(
												0,
												Math.round( v * 16 )
											)
										);
									} else if (
										prevU === 'px' &&
										nextU !== 'px' &&
										v > 0
									) {
										nextV =
											Math.round(
												( v / 16 ) * 100
											) / 100;
										if ( nextV < 0.8 ) {
											nextV = 1.2;
										}
									}
								}
								setAttributes( {
									menuItemLineHeightSet: true,
									menuItemLineHeight: nextV,
									menuItemLineHeightUnit: nextU,
								} );
								return;
							}

							let nextV = v;
							if ( prevU !== nextU ) {
								if ( nextU === 'px' && v > 0 && v <= 4 ) {
									nextV = Math.min(
										96,
										Math.max(
											0,
											Math.round( v * 16 )
										)
									);
								} else if (
									prevU === 'px' &&
									nextU !== 'px' &&
									v > 0
								) {
									nextV =
										Math.round( ( v / 16 ) * 100 ) /
										100;
									if ( nextV < 0.8 ) {
										nextV = 1.2;
									}
								}
							}
							setAttributes( {
								menuItemLineHeightSet: true,
								menuItemLineHeight: nextV,
								menuItemLineHeightUnit: nextU,
							} );
						} }
						help={ __(
							'Px sets a fixed line height. Em and rem are relative to font size. Leave empty for the default (normal). Use 0 for zero line height.',
							'croco-blocks'
						) }
					/>
					<SliderUnitControl
						label={ __( 'Letter spacing', 'croco-blocks' ) }
						value={
							menuItemLetterSpacingSetResolved
								? menuItemLetterSpacingValue
								: null
						}
						unit={
							menuItemLetterSpacingUnit || LETTER_SPACING_FIRST
						}
						units={ LETTER_SPACING_UNITS }
						min={ letterSpacingSliderBounds.min }
						max={ letterSpacingSliderBounds.max }
						step={ letterSpacingSliderBounds.step }
						allowNegative={
							letterSpacingSliderBounds.allowNegative
						}
						emptyWhenUnset
						numberPlaceholder="0"
						onChange={ ( {
							value,
							unit,
							inputCleared,
						} ) => {
							if ( inputCleared ) {
								setAttributes( {
									menuItemLetterSpacingSet: false,
									menuItemLetterSpacingValue: 0,
									menuItemLetterSpacingUnit: '',
									menuItemLetterSpacing: '',
								} );
								return;
							}
							const prevU =
								menuItemLetterSpacingUnit ||
								LETTER_SPACING_FIRST;
							const nextU = unit || LETTER_SPACING_FIRST;

							if ( ! menuItemLetterSpacingSetResolved ) {
								if ( value === 0 ) {
									if (
										nextU.toLowerCase() !==
										prevU.toLowerCase()
									) {
										setAttributes( {
											menuItemLetterSpacingUnit:
												nextU ===
												LETTER_SPACING_FIRST
													? ''
													: nextU,
											menuItemLetterSpacing: '',
										} );
									} else {
										setAttributes( {
											menuItemLetterSpacingSet: true,
											menuItemLetterSpacingValue: 0,
											menuItemLetterSpacingUnit: nextU,
											menuItemLetterSpacing: '',
										} );
									}
									return;
								}
								setAttributes( {
									menuItemLetterSpacingSet: true,
									menuItemLetterSpacingValue: value,
									menuItemLetterSpacingUnit: nextU,
									menuItemLetterSpacing: '',
								} );
								return;
							}

							setAttributes( {
								menuItemLetterSpacingSet: true,
								menuItemLetterSpacingValue: value,
								menuItemLetterSpacingUnit: nextU,
								menuItemLetterSpacing: '',
							} );
						} }
						help={ __(
							'Leave empty for the default (normal). Use 0 for no extra spacing. Legacy letter-spacing text is used if present.',
							'croco-blocks'
						) }
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Spacing', 'croco-blocks' ) }
					initialOpen={ false }
				>
					<SliderUnitControl
						label={ __(
							'Space between items',
							'croco-blocks'
						) }
						value={ parsePxSliderInt( itemSpacing, 20 ) }
						unit="px"
						units={ SLIDER_PX_UNITS }
						min={ 0 }
						max={ 80 }
						step={ 2 }
						onChange={ ( { value } ) =>
							setAttributes( {
								itemSpacing: `${ value || 0 }px`,
							} )
						}
					/>
					<SliderUnitControl
						label={ __(
							'Menu item padding (horizontal)',
							'croco-blocks'
						) }
						help={ __(
							'Padding for top-level menu links in horizontal layout.',
							'croco-blocks'
						) }
						value={ parsePxSliderInt( menuItemPadding, 0 ) }
						unit="px"
						units={ SLIDER_PX_UNITS }
						min={ 0 }
						max={ 40 }
						step={ 1 }
						onChange={ ( { value } ) =>
							setAttributes( {
								menuItemPadding: `${ value || 0 }px`,
							} )
						}
					/>
					<SliderUnitControl
						label={ __(
							'Menu item padding (vertical)',
							'croco-blocks'
						) }
						help={ __(
							'Padding for top-level menu links (top & bottom).',
							'croco-blocks'
						) }
						value={ parsePxSliderInt(
							menuItemPaddingVertical,
							0
						) }
						unit="px"
						units={ SLIDER_PX_UNITS }
						min={ 0 }
						max={ 40 }
						step={ 1 }
						onChange={ ( { value } ) =>
							setAttributes( {
								menuItemPaddingVertical: `${ value || 0 }px`,
							} )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Alignment', 'croco-blocks' ) }
					initialOpen={ false }
				>
					<ResponsiveAlignmentControl
						label={ __(
							'Horizontal alignment',
							'croco-blocks'
						) }
						values={ {
							desktop: alignmentDesktop || 'left',
							tablet: alignmentTablet || '',
							mobile: alignmentMobile || '',
						} }
						onChange={ ( nextValues ) =>
							setAttributes( {
								alignmentDesktop: nextValues.desktop,
								alignmentTablet: nextValues.tablet,
								alignmentMobile: nextValues.mobile,
							} )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Dropdown Settings', 'croco-blocks' ) }
					initialOpen={ false }
				>
					<p className="components-base-control__label">
						{ __( 'Colors', 'croco-blocks' ) }
					</p>
					<ColorOpacityControl
						label={ __(
							'Dropdown text color',
							'croco-blocks'
						) }
						color={ submenuTextColor }
						onChange={ ( value ) =>
							setAttributes( { submenuTextColor: value } )
						}
						hoverColor={ submenuTextHoverColor }
						onHoverChange={ ( value ) =>
							setAttributes( {
								submenuTextHoverColor: value,
							} )
						}
					/>
					<ColorOpacityControl
						label={ __(
							'Dropdown hover background',
							'croco-blocks'
						) }
						color={ submenuHoverBackgroundColor }
						onChange={ ( value ) =>
							setAttributes( {
								submenuHoverBackgroundColor: value,
							} )
						}
					/>

					<p className="components-base-control__label cb-navigation-inspector__section-heading">
						{ __( 'Layout', 'croco-blocks' ) }
					</p>
					<SliderUnitControl
						label={ __(
							'Dropdown top spacing',
							'croco-blocks'
						) }
						value={ parsePxSliderInt( submenuOffsetTop, 0 ) }
						unit="px"
						units={ SLIDER_PX_UNITS }
						min={ 0 }
						max={ 40 }
						step={ 1 }
						onChange={ ( { value } ) =>
							setAttributes( {
								submenuOffsetTop: `${ value || 0 }px`,
							} )
						}
					/>
					<SliderUnitControl
						label={ __(
							'Dropdown item padding',
							'croco-blocks'
						) }
						help={ __(
							'Applies uniform vertical & horizontal padding.',
							'croco-blocks'
						) }
						value={ parsePxSliderInt(
							submenuItemPadding,
							8
						) }
						unit="px"
						units={ SLIDER_PX_UNITS }
						min={ 0 }
						max={ 32 }
						step={ 1 }
						onChange={ ( { value } ) =>
							setAttributes( {
								submenuItemPadding: `${ value || 0 }px`,
							} )
						}
					/>

					<AlignmentControl
						label={ __( 'Dropdown alignment', 'croco-blocks' ) }
						value={ submenuAlignment || 'center' }
						onChange={ ( value ) =>
							setAttributes( { submenuAlignment: value } )
						}
					/>

					<AlignmentControl
						label={ __( 'Dropdown text alignment', 'croco-blocks' ) }
						value={ submenuTextAlignment || 'left' }
						onChange={ ( value ) =>
							setAttributes( { submenuTextAlignment: value } )
						}
					/>

					<p className="components-base-control__label cb-navigation-inspector__section-heading">
						{ __( 'Indicator', 'croco-blocks' ) }
					</p>
					<ToggleControl
						label={ __(
							'Show dropdown arrow for items with submenus',
							'croco-blocks'
						) }
						checked={ !! showDropdownIndicator }
						onChange={ ( value ) =>
							setAttributes( {
								showDropdownIndicator: value,
							} )
						}
					/>
					{ showDropdownIndicator && (
						<>
							<SliderUnitControl
								label={ __(
									'Spacing between label and arrow',
									'croco-blocks'
								) }
								value={ parsePxIntForRange(
									dropdownIndicatorGap,
									8
								) }
								unit="px"
								units={ SLIDER_PX_UNITS }
								min={ 0 }
								max={ 24 }
								step={ 1 }
								onChange={ ( { value } ) =>
									setAttributes( {
										dropdownIndicatorGap: `${ value || 0 }px`,
									} )
								}
							/>
							<SliderUnitControl
								label={ __(
									'Arrow icon size',
									'croco-blocks'
								) }
								value={ parsePxIntForRange(
									dropdownIndicatorSize,
									12
								) }
								unit="px"
								units={ SLIDER_PX_UNITS }
								min={ 0 }
								max={ 24 }
								step={ 1 }
								onChange={ ( { value } ) =>
									setAttributes( {
										dropdownIndicatorSize: `${ value || 0 }px`,
									} )
								}
							/>
						</>
					) }
				</PanelBody>
				<PanelBody
					title={ __(
						'Off Canvas Body Customization',
						'croco-blocks'
					) }
					initialOpen={ false }
				>
					<p className="components-base-control__label">
						{ __( 'Colors', 'croco-blocks' ) }
					</p>
					<div className="cb-navigation-inspector-color-group">
						<ColorOpacityControl
							label={ __(
								'Off-canvas panel background',
								'croco-blocks'
							) }
							color={ offcanvasBackgroundColor }
							onChange={ ( value ) =>
								setAttributes( {
									offcanvasBackgroundColor: value,
								} )
							}
						/>
						<ColorOpacityControl
							label={ __(
								'Mobile menu text',
								'croco-blocks'
							) }
							color={ mobileMenuTextColor }
							onChange={ ( value ) =>
								setAttributes( {
									mobileMenuTextColor: value,
								} )
							}
							hoverColor={ mobileMenuHoverTextColor }
							onHoverChange={ ( value ) =>
								setAttributes( {
									mobileMenuHoverTextColor: value,
								} )
							}
						/>
						<ColorOpacityControl
							label={ __(
								'Mobile submenu text',
								'croco-blocks'
							) }
							color={ mobileSubmenuTextColor }
							onChange={ ( value ) =>
								setAttributes( {
									mobileSubmenuTextColor: value,
								} )
							}
							hoverColor={ mobileSubmenuHoverTextColor }
							onHoverChange={ ( value ) =>
								setAttributes( {
									mobileSubmenuHoverTextColor: value,
								} )
							}
						/>
					</div>
					<p className="components-base-control__label cb-navigation-inspector__section-heading">
						{ __( 'Spacing', 'croco-blocks' ) }
					</p>
					<SliderUnitControl
						label={ __(
							'Menu item horizontal spacing',
							'croco-blocks'
						) }
						value={ parsePxIntForRange(
							offcanvasMenuItemPaddingHorizontal,
							0
						) }
						unit="px"
						units={ SLIDER_PX_UNITS }
						min={ 0 }
						max={ 48 }
						step={ 1 }
						onChange={ ( { value } ) =>
							setAttributes( {
								offcanvasMenuItemPaddingHorizontal: `${ value || 0 }px`,
							} )
						}
					/>
					<SliderUnitControl
						label={ __(
							'Menu item vertical spacing',
							'croco-blocks'
						) }
						value={ parsePxIntForRange(
							offcanvasMenuItemPaddingVertical,
							0
						) }
						unit="px"
						units={ SLIDER_PX_UNITS }
						min={ 0 }
						max={ 48 }
						step={ 1 }
						onChange={ ( { value } ) =>
							setAttributes( {
								offcanvasMenuItemPaddingVertical: `${ value || 0 }px`,
							} )
						}
					/>
				</PanelBody>
			</>
		);

		return (
			<div { ...blockProps }>
				<InspectorTabs
					attributes={ attributes }
					setAttributes={ setAttributes }
					settings={ settingsContent }
					styles={ stylesContent }
				/>

				{ ! menuId ? (
					<Placeholder
						icon="menu"
						label={ __( 'CB Navigation', 'croco-blocks' ) }
						instructions={ __(
							'Select a menu from the block settings to display navigation links.',
							'croco-blocks'
						) }
					>
						{ isLoading ? (
							<Spinner />
						) : (
							<SelectControl
								value={ menuId }
								options={ menuOptions }
								onChange={ ( value ) =>
									setAttributes( {
										menuId: parseInt( value, 10 ),
									} )
								}
							/>
						) }
					</Placeholder>
				) : (
					<ServerSideRender
						block={ metadata.name }
						attributes={ attributes }
					/>
				) }
			</div>
		);
	},

	save: () => null,
} );
