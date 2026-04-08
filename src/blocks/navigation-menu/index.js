import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	RadioControl,
	ToggleControl,
	Spinner,
	Placeholder,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import ServerSideRender from '@wordpress/server-side-render';
import metadata from './block.json';
import { InspectorTabs } from '../../components/InspectorTabs/InspectorTabs';
import { ResponsiveAlignmentControl } from '../../components/ResponsiveAlignmentControl/ResponsiveAlignmentControl';
import { AlignmentControl } from '../../components/AlignmentControl/AlignmentControl';
import { ColorOpacityControl } from '../../components/ColorOpacityControl/ColorOpacityControl';
import './style.scss';
import './editor.scss';

function parsePxIntForRange( raw, fallback ) {
	const n = parseInt(
		String( raw ?? '' ).replace( /px\s*$/i, '' ),
		10
	);
	return Number.isFinite( n ) ? n : fallback;
}

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
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
			enableToggle,
			toggleBreakpoint,
			toggleIconColor,
			toggleIconSize,
			toggleIconPadding,
			showDropdownIndicator,
			dropdownIndicatorGap,
			dropdownIndicatorSize,
		} = attributes;

		const blockProps = useBlockProps();

		const menus = useSelect(
			( select ) =>
				select( coreStore ).getMenus( { per_page: -1 } ),
			[]
		);

		const isLoading = menus === null;

		const menuOptions = [
			{ label: __( '— Select a Menu —', 'croco-blocks' ), value: 0 },
		];

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
							<RangeControl
								label={ __(
									'Toggle icon size (px)',
									'croco-blocks'
								) }
								help={ __(
									'Controls the width of the hamburger bars.',
									'croco-blocks'
								) }
								value={
									parseInt( toggleIconSize || '18', 10 ) || 18
								}
								onChange={ ( value ) =>
									setAttributes( {
										toggleIconSize: `${ value }px`,
									} )
								}
								min={ 12 }
								max={ 32 }
								step={ 1 }
							/>
							<RangeControl
								label={ __(
									'Toggle button padding (px)',
									'croco-blocks'
								) }
								help={ __(
									'Inner padding around the icon inside the button.',
									'croco-blocks'
								) }
								value={
									parseInt(
										toggleIconPadding || '0',
										10
									) || 0
								}
								onChange={ ( value ) =>
									setAttributes( {
										toggleIconPadding: `${ value }px`,
									} )
								}
								min={ 0 }
								max={ 16 }
								step={ 1 }
							/>
						</>
					) }
				</PanelBody>
			</>
		);

		const stylesContent = (
			<>
				<PanelBody
					title={ __( 'Spacing', 'croco-blocks' ) }
					initialOpen={ false }
				>
					<RangeControl
						label={ __(
							'Space Between Items (px)',
							'croco-blocks'
						) }
						value={ parseInt( itemSpacing, 10 ) || 20 }
						onChange={ ( value ) =>
							setAttributes( { itemSpacing: value + 'px' } )
						}
						min={ 0 }
						max={ 80 }
						step={ 2 }
					/>
					<RangeControl
						label={ __(
							'Menu item padding (horizontal, px)',
							'croco-blocks'
						) }
						help={ __(
							'Padding for top-level menu links in horizontal layout.',
							'croco-blocks'
						) }
						value={ parseInt( menuItemPadding, 10 ) || 0 }
						onChange={ ( value ) =>
							setAttributes( {
								menuItemPadding: `${ value }px`,
							} )
						}
						min={ 0 }
						max={ 40 }
						step={ 1 }
					/>
					<RangeControl
						label={ __(
							'Menu item padding (vertical, px)',
							'croco-blocks'
						) }
						help={ __(
							'Padding for top-level menu links (top & bottom).',
							'croco-blocks'
						) }
						value={
							parseInt( menuItemPaddingVertical, 10 ) || 0
						}
						onChange={ ( value ) =>
							setAttributes( {
								menuItemPaddingVertical: `${ value }px`,
							} )
						}
						min={ 0 }
						max={ 40 }
						step={ 1 }
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

					<p
						className="components-base-control__label"
						style={ { marginTop: '1rem' } }
					>
						{ __( 'Layout', 'croco-blocks' ) }
					</p>
					<RangeControl
						label={ __(
							'Dropdown top spacing (px)',
							'croco-blocks'
						) }
						value={ parseInt( submenuOffsetTop, 10 ) || 0 }
						onChange={ ( value ) =>
							setAttributes( {
								submenuOffsetTop: `${ value }px`,
							} )
						}
						min={ 0 }
						max={ 40 }
						step={ 1 }
					/>
					<RangeControl
						label={ __(
							'Dropdown item padding (px)',
							'croco-blocks'
						) }
						help={ __(
							'Applies uniform vertical & horizontal padding.',
							'croco-blocks'
						) }
						value={
							parseInt( submenuItemPadding, 10 ) ||
							parseInt( '8', 10 )
						}
						onChange={ ( value ) =>
							setAttributes( {
								submenuItemPadding: `${ value }px`,
							} )
						}
						min={ 0 }
						max={ 32 }
						step={ 1 }
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

					<p
						className="components-base-control__label"
						style={ { marginTop: '1rem' } }
					>
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
							<RangeControl
								label={ __(
									'Spacing between label and arrow (px)',
									'croco-blocks'
								) }
								value={ parsePxIntForRange(
									dropdownIndicatorGap,
									8
								) }
								onChange={ ( value ) =>
									setAttributes( {
										dropdownIndicatorGap: `${ value }px`,
									} )
								}
								min={ 0 }
								max={ 24 }
								step={ 1 }
							/>
							<RangeControl
								label={ __(
									'Arrow icon size (px)',
									'croco-blocks'
								) }
								value={ parsePxIntForRange(
									dropdownIndicatorSize,
									12
								) }
								onChange={ ( value ) =>
									setAttributes( {
										dropdownIndicatorSize: `${ value }px`,
									} )
								}
								min={ 0 }
								max={ 24 }
								step={ 1 }
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
					<p
						className="components-base-control__label"
						style={ { marginTop: '1rem' } }
					>
						{ __( 'Spacing', 'croco-blocks' ) }
					</p>
					<RangeControl
						label={ __(
							'Menu item horizontal spacing (px)',
							'croco-blocks'
						) }
						value={ parsePxIntForRange(
							offcanvasMenuItemPaddingHorizontal,
							0
						) }
						onChange={ ( value ) =>
							setAttributes( {
								offcanvasMenuItemPaddingHorizontal: `${ value }px`,
							} )
						}
						min={ 0 }
						max={ 48 }
						step={ 1 }
					/>
					<RangeControl
						label={ __(
							'Menu item vertical spacing (px)',
							'croco-blocks'
						) }
						value={ parsePxIntForRange(
							offcanvasMenuItemPaddingVertical,
							0
						) }
						onChange={ ( value ) =>
							setAttributes( {
								offcanvasMenuItemPaddingVertical: `${ value }px`,
							} )
						}
						min={ 0 }
						max={ 48 }
						step={ 1 }
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
