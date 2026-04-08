import { useState } from '@wordpress/element';
import {
	ColorPalette,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { Popover, TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './ColorOpacityControl.scss';

const TAB_DEFAULT = 'default';
const TAB_HOVER = 'hover';

/**
 * Uses block-editor ColorPalette (theme + default origins, custom color dropdown)
 * so the UI matches core block color pickers in the sidebar.
 */
export const ColorOpacityControl = ( {
	label,
	color,
	onChange,
	hoverColor,
	onHoverChange,
} ) => {
	const [ anchorEl, setAnchorEl ] = useState( null );
	const [ isOpen, setIsOpen ] = useState( false );

	const {
		colors: editorColorOrigins,
		disableCustomColors: editorDisableCustomColors,
	} = useMultipleOriginColorsAndGradients();

	const isPair = typeof onHoverChange === 'function';

	const currentDefault = color || '';
	const currentHover = isPair ? hoverColor || '' : '';

	const togglePopover = () => {
		setIsOpen( ( prev ) => ! prev );
	};

	const closePopover = () => {
		setIsOpen( false );
	};

	const commitDefault = ( next ) => {
		if ( typeof onChange === 'function' ) {
			onChange( next || '' );
		}
	};

	const commitHover = ( next ) => {
		if ( typeof onHoverChange === 'function' ) {
			onHoverChange( next || '' );
		}
	};

	const handlePaletteChange = ( newColor, tab ) => {
		const val =
			newColor === undefined || newColor === null ? '' : newColor;
		if ( tab === TAB_HOVER ) {
			commitHover( val );
		} else {
			commitDefault( val );
		}
	};

	const renderPaletteForTab = ( tab ) => {
		const active = tab.name;
		const current =
			active === TAB_HOVER ? currentHover : currentDefault;

		return (
			<div className="cb-color-opacity-control__popover-body">
				<ColorPalette
					colors={ editorColorOrigins }
					disableCustomColors={ editorDisableCustomColors }
					__experimentalIsRenderedInSidebar
					enableAlpha
					value={ current || undefined }
					onChange={ ( newColor ) =>
						handlePaletteChange( newColor, active )
					}
				/>
			</div>
		);
	};

	const renderSinglePalette = () => (
		<div className="cb-color-opacity-control__popover-body">
			<ColorPalette
				colors={ editorColorOrigins }
				disableCustomColors={ editorDisableCustomColors }
				__experimentalIsRenderedInSidebar
				enableAlpha
				value={ currentDefault || undefined }
				onChange={ ( newColor ) =>
					handlePaletteChange( newColor, TAB_DEFAULT )
				}
			/>
		</div>
	);

	return (
		<div className="cb-color-opacity-control">
			<button
				ref={ ( node ) => {
					setAnchorEl( node );
				} }
				type="button"
				className="cb-color-opacity-control__swatch-row"
				onClick={ togglePopover }
				aria-expanded={ isOpen }
				aria-haspopup="dialog"
			>
				<span
					className={
						'cb-color-opacity-control__swatch-group' +
						( isPair
							? ' cb-color-opacity-control__swatch-group--pair'
							: '' )
					}
				>
					<span
						className={
							'cb-color-opacity-control__swatch' +
							( ! currentDefault
								? ' cb-color-opacity-control__swatch--empty'
								: '' )
						}
						style={
							currentDefault
								? { backgroundColor: currentDefault }
								: undefined
						}
						title={
							isPair
								? __( 'Default', 'croco-blocks' )
								: label
						}
						aria-label={
							isPair
								? __( 'Default', 'croco-blocks' )
								: label
						}
					/>
					{ isPair && (
						<span
							className={
								'cb-color-opacity-control__swatch cb-color-opacity-control__swatch--pair-front' +
								( ! currentHover
									? ' cb-color-opacity-control__swatch--empty'
									: '' )
							}
							style={
								currentHover
									? {
											backgroundColor:
												currentHover,
									  }
									: undefined
							}
							title={ __( 'Hover', 'croco-blocks' ) }
							aria-label={ __( 'Hover', 'croco-blocks' ) }
						/>
					) }
				</span>
				<span className="cb-color-opacity-control__label">
					{ label }
				</span>
			</button>

			{ isOpen && (
				<Popover
					className="cb-color-opacity-control__popover"
					anchor={ anchorEl }
					onClose={ closePopover }
					placement="left-start"
				>
					<div className="cb-color-opacity-control__popover-inner">
						{ isPair ? (
							<TabPanel
								className="cb-color-opacity-control__tab-panel"
								activeClass="is-active"
								tabs={ [
									{
										name: TAB_DEFAULT,
										title: __(
											'Default',
											'croco-blocks'
										),
									},
									{
										name: TAB_HOVER,
										title: __(
											'Hover',
											'croco-blocks'
										),
									},
								] }
								initialTabName={ TAB_DEFAULT }
							>
								{ ( tab ) => renderPaletteForTab( tab ) }
							</TabPanel>
						) : (
							renderSinglePalette()
						) }
					</div>
				</Popover>
			) }
		</div>
	);
};
