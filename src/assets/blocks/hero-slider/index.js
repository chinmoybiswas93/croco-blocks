import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import ServerSideRender from '@wordpress/server-side-render';
import metadata from './block.json';
import './style.scss';
import './editor.scss';
import {
	useBlockEditContext,
	useBlockProps,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	Button,
	FocalPointPicker,
	Placeholder,
} from '@wordpress/components';
import { InspectorTabs } from '../../components/inspector/InspectorTabs/InspectorTabs';
import { ResponsiveUnitControl } from '../../components/controls/ResponsiveUnitControl/ResponsiveUnitControl';
import { ColorOpacityControl } from '../../components/controls/ColorOpacityControl/ColorOpacityControl';
import { SliderUnitControl } from '../../components/controls/SliderUnitControl/SliderUnitControl';
import {
	getBorderCssVarsForEditor,
	getSpacingCssVarsForEditor,
} from '../../utils/spacingKeys';
import { getAdvancedBackgroundStyle } from '../../utils/advancedBackground';
import { useCrocoInstanceKey } from '../../hooks/useCrocoInstanceKey';
import { useCrocoInstanceStylesheet } from '../../hooks/useCrocoInstanceStylesheet';
import { buildCrocoInstanceCssText } from '../../utils/crocoInstanceCssText';
import {
	getInstanceWrapperClassString,
	shouldUseExternalInstanceCss,
} from '../../utils/crocoInstanceCssSelectors';

const DEFAULT_SLIDE = {
	id: null,
	imageId: 0,
	imageUrl: '',
	imageAlt: '',
	focalPoint: { x: 0.5, y: 0.5 },
	heading: '',
	text: '',
	buttonLabel: '',
	buttonUrl: '',
	buttonNewTab: false,
};

const SLIDER_PX_UNITS = [ { value: 'px', label: 'px' } ];
const SLIDER_MS_UNITS = [ { value: 'ms', label: 'ms' } ];
const LINE_HEIGHT_UNITS = [
	{ value: 'px', label: 'px' },
	{ value: 'em', label: 'em' },
	{ value: 'rem', label: 'rem' },
];
const LINE_HEIGHT_UNIT_DEFAULT = LINE_HEIGHT_UNITS[ 0 ].value;

registerBlockType( metadata.name, {
	edit( { attributes, setAttributes } ) {
		const { clientId } = useBlockEditContext();
		const {
			slides = [],
			showArrows,
			showDots,
			autoplay,
			autoplaySpeed,
			loop,
			pauseOnHover,
			heightMode,
			heightDesktop,
			heightTablet,
			heightMobile,
			overlayColor,
			overlayGradient,
			overlayOpacity,
			contentAlign,
			headingColor,
			textColor,
			headingFontSize,
			textFontSize,
			headingFontSizeDesktop,
			headingFontSizeTablet,
			headingFontSizeMobile,
			headingFontSizeUnit,
			textFontSizeDesktop,
			textFontSizeTablet,
			textFontSizeMobile,
			textFontSizeUnit,
			headingLineHeight,
			headingLineHeightSet,
			headingLineHeightUnit,
			textLineHeight,
			textLineHeightSet,
			textLineHeightUnit,
			headingMarginBottom,
			textMarginBottom,
			headingMarginBottomDesktop,
			headingMarginBottomTablet,
			headingMarginBottomMobile,
			headingMarginBottomUnit,
			textMarginBottomDesktop,
			textMarginBottomTablet,
			textMarginBottomMobile,
			textMarginBottomUnit,
			buttonPaddingY,
			buttonPaddingX,
			buttonMarginTop,
			buttonBorderRadius,
			buttonBorderWidth,
			contentMaxWidth,
			contentPaddingTopDesktop,
			contentPaddingTopTablet,
			contentPaddingTopMobile,
			contentPaddingTopUnit,
			buttonAlign,
			buttonBgColor,
			buttonBgColorHover,
			buttonTextColor,
			buttonTextColorHover,
			buttonBorderColor,
			buttonIconId,
			buttonIconUrl,
			buttonIconAlt,
			buttonShowText,
			buttonIconSizeDesktop,
			buttonIconSizeTablet,
			buttonIconSizeMobile,
			buttonStyle,
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
						...getSpacingCssVarsForEditor( attributes ),
						...getBorderCssVarsForEditor( attributes ),
						...getAdvancedBackgroundStyle( attributes ),
				  },
		} );

		const updateSlide = ( index, updates ) => {
			const nextSlides = [ ...slides ];
			nextSlides[ index ] = {
				...DEFAULT_SLIDE,
				...nextSlides[ index ],
				...updates,
			};
			setAttributes( { slides: nextSlides } );
		};

		const addSlide = () => {
			setAttributes( {
				slides: [
					...slides,
					{ ...DEFAULT_SLIDE, id: Date.now() },
				],
			} );
		};

		const removeSlide = ( index ) => {
			const nextSlides = [ ...slides ];
			nextSlides.splice( index, 1 );
			setAttributes( { slides: nextSlides } );
		};

		const hasSlides = slides && slides.length > 0;

		const headingLineHeightSetResolved = useMemo( () => {
			if ( headingLineHeightSet === true ) {
				return true;
			}
			if ( headingLineHeightSet === false ) {
				return false;
			}
			return (
				( headingLineHeight ?? 0 ) > 0 ||
				( headingLineHeightUnit || '' ) !== ''
			);
		}, [
			headingLineHeightSet,
			headingLineHeight,
			headingLineHeightUnit,
		] );

		const textLineHeightSetResolved = useMemo( () => {
			if ( textLineHeightSet === true ) {
				return true;
			}
			if ( textLineHeightSet === false ) {
				return false;
			}
			return (
				( textLineHeight ?? 0 ) > 0 ||
				( textLineHeightUnit || '' ) !== ''
			);
		}, [ textLineHeightSet, textLineHeight, textLineHeightUnit ] );

		const headingLineHeightSliderBounds = useMemo( () => {
			const u = (
				headingLineHeightUnit || LINE_HEIGHT_UNIT_DEFAULT
			).toLowerCase();
			if ( u === 'px' ) {
				return { min: 0, max: 96, step: 1 };
			}
			return { min: 0.8, max: 3, step: 0.05 };
		}, [ headingLineHeightUnit ] );

		const textLineHeightSliderBounds = useMemo( () => {
			const u = (
				textLineHeightUnit || LINE_HEIGHT_UNIT_DEFAULT
			).toLowerCase();
			if ( u === 'px' ) {
				return { min: 0, max: 96, step: 1 };
			}
			return { min: 0.8, max: 3, step: 0.05 };
		}, [ textLineHeightUnit ] );

		const resolveHeroLineHeightUnit = ( raw ) => {
			const u = ( raw || LINE_HEIGHT_UNIT_DEFAULT ).toLowerCase();
			return [ 'px', 'em', 'rem' ].includes( u )
				? u
				: LINE_HEIGHT_UNIT_DEFAULT;
		};

		const heightValues = {
			desktop: heightDesktop
				? String( parseFloat( heightDesktop ) || '' )
				: '',
			tablet: heightTablet
				? String( parseFloat( heightTablet ) || '' )
				: '',
			mobile: heightMobile
				? String( parseFloat( heightMobile ) || '' )
				: '',
		};

		let heightUnit = 'vh';
		if ( typeof heightDesktop === 'string' ) {
			if ( /px$/i.test( heightDesktop ) ) {
				heightUnit = 'px';
			} else if ( /vh$/i.test( heightDesktop ) ) {
				heightUnit = 'vh';
			}
		} else if ( heightMode === 'fixed' ) {
			heightUnit = 'px';
		} else if ( heightMode === 'vh' ) {
			heightUnit = 'vh';
		}

		const toValueString = ( value ) =>
			value === 0 || typeof value === 'number'
				? String( value )
				: value || '';

		const contentTopValues = {
			desktop: toValueString( contentPaddingTopDesktop ),
			tablet: toValueString( contentPaddingTopTablet ),
			mobile: toValueString( contentPaddingTopMobile ),
		};

		const headingFontValues = {
			desktop: toValueString(
				headingFontSizeDesktop ?? headingFontSize
			),
			tablet: toValueString( headingFontSizeTablet ),
			mobile: toValueString( headingFontSizeMobile ),
		};

		const textFontValues = {
			desktop: toValueString(
				textFontSizeDesktop ?? textFontSize
			),
			tablet: toValueString( textFontSizeTablet ),
			mobile: toValueString( textFontSizeMobile ),
		};

		const headingMarginValues = {
			desktop: toValueString(
				headingMarginBottomDesktop ?? headingMarginBottom
			),
			tablet: toValueString( headingMarginBottomTablet ),
			mobile: toValueString( headingMarginBottomMobile ),
		};

		const textMarginValues = {
			desktop: toValueString(
				textMarginBottomDesktop ?? textMarginBottom
			),
			tablet: toValueString( textMarginBottomTablet ),
			mobile: toValueString( textMarginBottomMobile ),
		};

		const iconSizeValues = {
			desktop: toValueString( buttonIconSizeDesktop ),
			tablet: toValueString( buttonIconSizeTablet ),
			mobile: toValueString( buttonIconSizeMobile ),
		};

		const settingsContent = (
			<>
				<PanelBody
					title={ __( 'Slider Settings', 'croco-blocks' ) }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __( 'Show arrows', 'croco-blocks' ) }
						checked={ showArrows }
						onChange={ ( value ) =>
							setAttributes( { showArrows: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Show dots', 'croco-blocks' ) }
						checked={ showDots }
						onChange={ ( value ) =>
							setAttributes( { showDots: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Autoplay', 'croco-blocks' ) }
						checked={ autoplay }
						onChange={ ( value ) =>
							setAttributes( { autoplay: value } )
						}
					/>
					{ autoplay && (
						<SliderUnitControl
							label={ __(
								'Autoplay speed',
								'croco-blocks'
							) }
							value={ ( () => {
								const n =
									typeof autoplaySpeed === 'number'
										? autoplaySpeed
										: parseFloat( autoplaySpeed );
								return Number.isFinite( n ) ? n : 5000;
							} )() }
							unit="ms"
							units={ SLIDER_MS_UNITS }
							min={ 1000 }
							max={ 10000 }
							step={ 500 }
							onChange={ ( { value: v } ) =>
								setAttributes( {
									autoplaySpeed: Number.isFinite( v )
										? v
										: 5000,
								} )
							}
						/>
					) }
					<ToggleControl
						label={ __( 'Loop slides', 'croco-blocks' ) }
						checked={ loop }
						onChange={ ( value ) =>
							setAttributes( { loop: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Pause on hover', 'croco-blocks' ) }
						checked={ pauseOnHover }
						onChange={ ( value ) =>
							setAttributes( { pauseOnHover: value } )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Height & Layout', 'croco-blocks' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __( 'Height mode', 'croco-blocks' ) }
						value={ heightMode }
						options={ [
							{
								label: __(
									'Auto (content-based)',
									'croco-blocks'
								),
								value: 'auto',
							},
							{
								label: __(
									'Viewport height (vh)',
									'croco-blocks'
								),
								value: 'vh',
							},
							{
								label: __(
									'Fixed pixels',
									'croco-blocks'
								),
								value: 'fixed',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { heightMode: value } )
						}
					/>
					{ heightMode !== 'auto' && (
						<ResponsiveUnitControl
							label={ __(
								'Heights by breakpoint',
								'croco-blocks'
							) }
							values={ heightValues }
							unit={ heightUnit }
							units={ [
								{ value: 'vh', label: 'vh' },
								{ value: 'px', label: 'px' },
							] }
							onChange={ ( next ) => {
								setAttributes( {
									heightDesktop: next.values.desktop
										? `${ next.values.desktop }${ next.unit }`
										: '',
									heightTablet: next.values.tablet
										? `${ next.values.tablet }${ next.unit }`
										: '',
									heightMobile: next.values.mobile
										? `${ next.values.mobile }${ next.unit }`
										: '',
									heightMode:
										next.unit === 'vh'
											? 'vh'
											: 'fixed',
								} );
							} }
						/>
					) }
				</PanelBody>
				<PanelBody
					title={ __( 'Slides', 'croco-blocks' ) }
					initialOpen={ false }
				>
					<Button variant="primary" onClick={ addSlide }>
						{ __( 'Add slide', 'croco-blocks' ) }
					</Button>

					{ ! hasSlides && (
						<p className="cb-hero-slider-editor__help">
							{ __(
								'Add one or more slides. Each slide can have its own background image, heading, text, and a single call-to-action button.',
								'croco-blocks'
							) }
						</p>
					) }

					{ slides.map( ( slide, index ) => (
						<div
							className="cb-hero-slider-editor__slide"
							key={ slide.id || index }
						>
							<div className="cb-hero-slider-editor__slide-header">
								<h4>
									{ __( 'Slide', 'croco-blocks' ) }{ ' ' }
									{ index + 1 }
								</h4>
								<Button
									variant="secondary"
									isDestructive
									onClick={ () => removeSlide( index ) }
								>
									{ __( 'Remove', 'croco-blocks' ) }
								</Button>
							</div>

							<div className="cb-hero-slider-editor__field-group">
								<label className="cb-hero-slider-editor__label">
									{ __(
										'Background image',
										'croco-blocks'
									) }
								</label>
								<MediaPlaceholder
									onSelect={ ( media ) =>
										updateSlide( index, {
											imageId: media.id,
											imageUrl:
												media.sizes?.large?.url ||
												media.url,
											imageAlt: media.alt || '',
										} )
									}
									allowedTypes={ [ 'image' ] }
									multiple={ false }
									labels={ {
										title: __(
											'Background image',
											'croco-blocks'
										),
									} }
									mediaPreview={
										slide.imageUrl ? (
											<div className="cb-hero-slider-editor__image-preview">
												<img
													src={ slide.imageUrl }
													alt={
														slide.imageAlt || ''
													}
												/>
											</div>
										) : null
									}
								/>
							</div>

							<div className="cb-hero-slider-editor__field-group">
								<label className="cb-hero-slider-editor__label">
									{ __(
										'Image focal point',
										'croco-blocks'
									) }
								</label>
								<FocalPointPicker
									url={ slide.imageUrl }
									value={
										slide.focalPoint ||
										DEFAULT_SLIDE.focalPoint
									}
									onChange={ ( value ) =>
										updateSlide( index, {
											focalPoint: value,
										} )
									}
								/>
							</div>

							<div className="cb-hero-slider-editor__field-group">
								<label className="cb-hero-slider-editor__label">
									{ __( 'Heading', 'croco-blocks' ) }
								</label>
								<input
									type="text"
									value={ slide.heading || '' }
									onChange={ ( event ) =>
										updateSlide( index, {
											heading: event.target.value,
										} )
									}
									placeholder={ __(
										'Add heading…',
										'croco-blocks'
									) }
								/>
							</div>

							<div className="cb-hero-slider-editor__field-group">
								<label className="cb-hero-slider-editor__label">
									{ __( 'Text', 'croco-blocks' ) }
								</label>
								<input
									type="text"
									value={ slide.text || '' }
									onChange={ ( event ) =>
										updateSlide( index, {
											text: event.target.value,
										} )
									}
									placeholder={ __(
										'Add description…',
										'croco-blocks'
									) }
								/>
							</div>

							<div className="cb-hero-slider-editor__field-group">
								<label className="cb-hero-slider-editor__label">
									{ __(
										'Button label',
										'croco-blocks'
									) }
								</label>
								<input
									type="text"
									value={ slide.buttonLabel || '' }
									onChange={ ( event ) =>
										updateSlide( index, {
											buttonLabel:
												event.target.value,
										} )
									}
									placeholder={ __(
										'Learn more',
										'croco-blocks'
									) }
								/>
							</div>

							<div className="cb-hero-slider-editor__field-group">
								<label className="cb-hero-slider-editor__label">
									{ __(
										'Button URL',
										'croco-blocks'
									) }
								</label>
								<input
									type="url"
									value={ slide.buttonUrl || '' }
									onChange={ ( event ) =>
										updateSlide( index, {
											buttonUrl:
												event.target.value,
										} )
									}
									placeholder="https://"
								/>
							</div>

							<div className="cb-hero-slider-editor__field-group">
								<ToggleControl
									label={ __(
										'Open button link in new tab',
										'croco-blocks'
									) }
									checked={ slide.buttonNewTab || false }
									onChange={ ( value ) =>
										updateSlide( index, {
											buttonNewTab: value,
										} )
									}
								/>
							</div>
						</div>
					) ) }
				</PanelBody>
			</>
		);

		const stylesContent = (
			<>
				<PanelBody
					title={ __( 'Color', 'croco-blocks' ) }
					initialOpen={ true }
				>
					<div className="cb-hero-slider-control-group">
						<div className="cb-hero-slider-control-group-label">
							{ __( 'Text & heading', 'croco-blocks' ) }
						</div>
						<ColorOpacityControl
							label={ __( 'Text', 'croco-blocks' ) }
							color={ textColor }
							onChange={ ( value ) =>
								setAttributes( { textColor: value } )
							}
						/>
						<ColorOpacityControl
							label={ __( 'Heading', 'croco-blocks' ) }
							color={ headingColor }
							onChange={ ( value ) =>
								setAttributes( { headingColor: value } )
							}
						/>
					</div>

					<div className="cb-hero-slider-control-group">
						<div className="cb-hero-slider-control-group-label">
							{ __( 'Overlay', 'croco-blocks' ) }
						</div>
						<ColorOpacityControl
							label={ __( 'Overlay', 'croco-blocks' ) }
							color={ overlayColor }
							onChange={ ( value ) =>
								setAttributes( { overlayColor: value } )
							}
						/>
					</div>
					<ResponsiveUnitControl
						label={ __(
							'Content top spacing',
							'croco-blocks'
						) }
						values={ contentTopValues }
						unit={ contentPaddingTopUnit || 'px' }
						units={ [
							{ value: 'px', label: 'px' },
							{ value: 'vh', label: 'vh' },
							{ value: 'rem', label: 'rem' },
							{ value: 'em', label: 'em' },
						] }
						onChange={ ( next ) =>
							setAttributes( {
								contentPaddingTopDesktop:
									next.values.desktop !== ''
										? parseFloat(
												next.values.desktop
										  ) || 0
										: 0,
								contentPaddingTopTablet:
									next.values.tablet !== ''
										? parseFloat(
												next.values.tablet
										  ) || 0
										: 0,
								contentPaddingTopMobile:
									next.values.mobile !== ''
										? parseFloat(
												next.values.mobile
										  ) || 0
										: 0,
								contentPaddingTopUnit:
									next.unit || 'px',
							} )
						}
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Title & Text', 'croco-blocks' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __( 'Alignment', 'croco-blocks' ) }
						value={ contentAlign }
						options={ [
							{
								label: __( 'Left', 'croco-blocks' ),
								value: 'left',
							},
							{
								label: __( 'Center', 'croco-blocks' ),
								value: 'center',
							},
							{
								label: __( 'Right', 'croco-blocks' ),
								value: 'right',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { contentAlign: value } )
						}
					/>
					<ResponsiveUnitControl
						label={ __(
							'Title font size',
							'croco-blocks'
						) }
						values={ headingFontValues }
						unit={ headingFontSizeUnit || 'px' }
						units={ [
							{ value: 'px', label: 'px' },
							{ value: 'rem', label: 'rem' },
							{ value: 'em', label: 'em' },
						] }
						onChange={ ( next ) =>
							setAttributes( {
								headingFontSizeDesktop:
									next.values.desktop !== ''
										? parseFloat(
												next.values.desktop
										  ) || 0
										: 0,
								headingFontSizeTablet:
									next.values.tablet !== ''
										? parseFloat(
												next.values.tablet
										  ) || 0
										: 0,
								headingFontSizeMobile:
									next.values.mobile !== ''
										? parseFloat(
												next.values.mobile
										  ) || 0
										: 0,
								headingFontSizeUnit:
									next.unit || 'px',
								headingFontSize:
									next.values.desktop !== ''
										? parseFloat(
												next.values.desktop
										  ) || 0
										: 0,
							} )
						}
					/>
					<SliderUnitControl
						label={ __(
							'Title line height',
							'croco-blocks'
						) }
						value={
							headingLineHeightSetResolved
								? headingLineHeight
								: null
						}
						unit={ resolveHeroLineHeightUnit(
							headingLineHeightUnit
						) }
						units={ LINE_HEIGHT_UNITS }
						min={ headingLineHeightSliderBounds.min }
						max={ headingLineHeightSliderBounds.max }
						step={ headingLineHeightSliderBounds.step }
						emptyWhenUnset
						unsetSliderValue={
							resolveHeroLineHeightUnit(
								headingLineHeightUnit
							) === 'px'
								? undefined
								: 1.2
						}
						numberPlaceholder={
							resolveHeroLineHeightUnit(
								headingLineHeightUnit
							) === 'px'
								? '24'
								: '1.2'
						}
						onChange={ ( {
							value,
							unit,
							inputCleared,
						} ) => {
							if ( inputCleared ) {
								setAttributes( {
									headingLineHeightSet: false,
									headingLineHeight: 0,
									headingLineHeightUnit: '',
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
								headingLineHeightUnit ||
								LINE_HEIGHT_UNIT_DEFAULT;
							const nextU = [
								'px',
								'em',
								'rem',
							].includes( ( unit || '' ).toLowerCase() )
								? unit
								: LINE_HEIGHT_UNIT_DEFAULT;

							if ( ! headingLineHeightSetResolved ) {
								if ( v === 0 ) {
									if (
										nextU.toLowerCase() !==
										prevU.toLowerCase()
									) {
										setAttributes( {
											headingLineHeightUnit:
												nextU ===
												LINE_HEIGHT_UNIT_DEFAULT
													? ''
													: nextU,
										} );
									} else {
										setAttributes( {
											headingLineHeightSet: true,
											headingLineHeight: 0,
											headingLineHeightUnit: nextU,
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
									headingLineHeightSet: true,
									headingLineHeight: nextV,
									headingLineHeightUnit: nextU,
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
								headingLineHeightSet: true,
								headingLineHeight: nextV,
								headingLineHeightUnit: nextU,
							} );
						} }
					/>
					<ResponsiveUnitControl
						label={ __(
							'Title bottom spacing',
							'croco-blocks'
						) }
						values={ headingMarginValues }
						unit={ headingMarginBottomUnit || 'px' }
						units={ [
							{ value: 'px', label: 'px' },
							{ value: 'rem', label: 'rem' },
							{ value: 'em', label: 'em' },
						] }
						onChange={ ( next ) =>
							setAttributes( {
								headingMarginBottomDesktop:
									next.values.desktop !== ''
										? parseFloat(
												next.values.desktop
										  ) || 0
										: 0,
								headingMarginBottomTablet:
									next.values.tablet !== ''
										? parseFloat(
												next.values.tablet
										  ) || 0
										: 0,
								headingMarginBottomMobile:
									next.values.mobile !== ''
										? parseFloat(
												next.values.mobile
										  ) || 0
										: 0,
								headingMarginBottomUnit:
									next.unit || 'px',
								headingMarginBottom:
									next.values.desktop !== ''
										? parseFloat(
												next.values.desktop
										  ) || 0
										: 0,
							} )
						}
					/>
					<ResponsiveUnitControl
						label={ __(
							'Text font size',
							'croco-blocks'
						) }
						values={ textFontValues }
						unit={ textFontSizeUnit || 'px' }
						units={ [
							{ value: 'px', label: 'px' },
							{ value: 'rem', label: 'rem' },
							{ value: 'em', label: 'em' },
						] }
						onChange={ ( next ) =>
							setAttributes( {
								textFontSizeDesktop:
									next.values.desktop !== ''
										? parseFloat(
												next.values.desktop
										  ) || 0
										: 0,
								textFontSizeTablet:
									next.values.tablet !== ''
										? parseFloat(
												next.values.tablet
										  ) || 0
										: 0,
								textFontSizeMobile:
									next.values.mobile !== ''
										? parseFloat(
												next.values.mobile
										  ) || 0
										: 0,
								textFontSizeUnit:
									next.unit || 'px',
								textFontSize:
									next.values.desktop !== ''
										? parseFloat(
												next.values.desktop
										  ) || 0
										: 0,
							} )
						}
					/>
					<SliderUnitControl
						label={ __(
							'Text line height',
							'croco-blocks'
						) }
						value={
							textLineHeightSetResolved
								? textLineHeight
								: null
						}
						unit={ resolveHeroLineHeightUnit(
							textLineHeightUnit
						) }
						units={ LINE_HEIGHT_UNITS }
						min={ textLineHeightSliderBounds.min }
						max={ textLineHeightSliderBounds.max }
						step={ textLineHeightSliderBounds.step }
						emptyWhenUnset
						unsetSliderValue={
							resolveHeroLineHeightUnit(
								textLineHeightUnit
							) === 'px'
								? undefined
								: 1.2
						}
						numberPlaceholder={
							resolveHeroLineHeightUnit(
								textLineHeightUnit
							) === 'px'
								? '24'
								: '1.2'
						}
						onChange={ ( {
							value,
							unit,
							inputCleared,
						} ) => {
							if ( inputCleared ) {
								setAttributes( {
									textLineHeightSet: false,
									textLineHeight: 0,
									textLineHeightUnit: '',
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
								textLineHeightUnit ||
								LINE_HEIGHT_UNIT_DEFAULT;
							const nextU = [
								'px',
								'em',
								'rem',
							].includes( ( unit || '' ).toLowerCase() )
								? unit
								: LINE_HEIGHT_UNIT_DEFAULT;

							if ( ! textLineHeightSetResolved ) {
								if ( v === 0 ) {
									if (
										nextU.toLowerCase() !==
										prevU.toLowerCase()
									) {
										setAttributes( {
											textLineHeightUnit:
												nextU ===
												LINE_HEIGHT_UNIT_DEFAULT
													? ''
													: nextU,
										} );
									} else {
										setAttributes( {
											textLineHeightSet: true,
											textLineHeight: 0,
											textLineHeightUnit: nextU,
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
									textLineHeightSet: true,
									textLineHeight: nextV,
									textLineHeightUnit: nextU,
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
								textLineHeightSet: true,
								textLineHeight: nextV,
								textLineHeightUnit: nextU,
							} );
						} }
					/>
					<ResponsiveUnitControl
						label={ __(
							'Text bottom spacing',
							'croco-blocks'
						) }
						values={ textMarginValues }
						unit={ textMarginBottomUnit || 'px' }
						units={ [
							{ value: 'px', label: 'px' },
							{ value: 'rem', label: 'rem' },
							{ value: 'em', label: 'em' },
						] }
						onChange={ ( next ) =>
							setAttributes( {
								textMarginBottomDesktop:
									next.values.desktop !== ''
										? parseFloat(
												next.values.desktop
										  ) || 0
										: 0,
								textMarginBottomTablet:
									next.values.tablet !== ''
										? parseFloat(
												next.values.tablet
										  ) || 0
										: 0,
								textMarginBottomMobile:
									next.values.mobile !== ''
										? parseFloat(
												next.values.mobile
										  ) || 0
										: 0,
								textMarginBottomUnit:
									next.unit || 'px',
								textMarginBottom:
									next.values.desktop !== ''
										? parseFloat(
												next.values.desktop
										  ) || 0
										: 0,
							} )
						}
					/>
					<SliderUnitControl
						label={ __(
							'Content max width',
							'croco-blocks'
						) }
						value={ contentMaxWidth || 0 }
						unit="px"
						units={ SLIDER_PX_UNITS }
						min={ 400 }
						max={ 1600 }
						step={ 1 }
						onChange={ ( { value } ) =>
							setAttributes( {
								contentMaxWidth: value || 0,
							} )
						}
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Button', 'croco-blocks' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __( 'Alignment', 'croco-blocks' ) }
						value={ buttonAlign || 'left' }
						options={ [
							{
								label: __( 'Left', 'croco-blocks' ),
								value: 'left',
							},
							{
								label: __( 'Center', 'croco-blocks' ),
								value: 'center',
							},
							{
								label: __( 'Right', 'croco-blocks' ),
								value: 'right',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { buttonAlign: value } )
						}
					/>
					<SliderUnitControl
						label={ __(
							'Vertical padding',
							'croco-blocks'
						) }
						value={ buttonPaddingY || 0 }
						unit="px"
						units={ SLIDER_PX_UNITS }
						min={ 0 }
						max={ 40 }
						step={ 1 }
						onChange={ ( { value } ) =>
							setAttributes( {
								buttonPaddingY: value || 0,
							} )
						}
					/>
					<SliderUnitControl
						label={ __(
							'Horizontal padding',
							'croco-blocks'
						) }
						value={ buttonPaddingX || 0 }
						unit="px"
						units={ SLIDER_PX_UNITS }
						min={ 0 }
						max={ 80 }
						step={ 1 }
						onChange={ ( { value } ) =>
							setAttributes( {
								buttonPaddingX: value || 0,
							} )
						}
					/>
					<SliderUnitControl
						label={ __(
							'Top margin',
							'croco-blocks'
						) }
						value={ buttonMarginTop || 0 }
						unit="px"
						units={ SLIDER_PX_UNITS }
						min={ 0 }
						max={ 80 }
						step={ 1 }
						onChange={ ( { value } ) =>
							setAttributes( {
								buttonMarginTop: value || 0,
							} )
						}
					/>
					<SliderUnitControl
						label={ __(
							'Border radius',
							'croco-blocks'
						) }
						value={ buttonBorderRadius || 0 }
						unit="px"
						units={ SLIDER_PX_UNITS }
						min={ 0 }
						max={ 100 }
						step={ 1 }
						onChange={ ( { value } ) =>
							setAttributes( {
								buttonBorderRadius: value || 0,
							} )
						}
					/>
					<SliderUnitControl
						label={ __(
							'Border width',
							'croco-blocks'
						) }
						value={ buttonBorderWidth || 0 }
						unit="px"
						units={ SLIDER_PX_UNITS }
						min={ 0 }
						max={ 10 }
						step={ 1 }
						onChange={ ( { value } ) =>
							setAttributes( {
								buttonBorderWidth: value || 0,
							} )
						}
					/>
					<div className="cb-hero-slider-editor__field-group">
						<div className="cb-hero-slider-control-group-label">
							{ __( 'Colors', 'croco-blocks' ) }
						</div>
						<ColorOpacityControl
							label={ __(
								'Background',
								'croco-blocks'
							) }
							color={ buttonBgColor }
							onChange={ ( value ) =>
								setAttributes( {
									buttonBgColor: value,
								} )
							}
						/>
						<ColorOpacityControl
							label={ __(
								'Background (hover)',
								'croco-blocks'
							) }
							color={ buttonBgColorHover }
							onChange={ ( value ) =>
								setAttributes( {
									buttonBgColorHover: value,
								} )
							}
						/>
						<ColorOpacityControl
							label={ __( 'Text', 'croco-blocks' ) }
							color={ buttonTextColor }
							onChange={ ( value ) =>
								setAttributes( {
									buttonTextColor: value,
								} )
							}
						/>
						<ColorOpacityControl
							label={ __(
								'Text (hover)',
								'croco-blocks'
							) }
							color={ buttonTextColorHover }
							onChange={ ( value ) =>
								setAttributes( {
									buttonTextColorHover: value,
								} )
							}
						/>
						<ColorOpacityControl
							label={ __( 'Border', 'croco-blocks' ) }
							color={ buttonBorderColor }
							onChange={ ( value ) =>
								setAttributes( {
									buttonBorderColor: value,
								} )
							}
						/>
					</div>
					<div className="cb-hero-slider-editor__field-group">
						<label className="cb-hero-slider-editor__label">
							{ __( 'Button icon', 'croco-blocks' ) }
						</label>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) =>
									setAttributes( {
										buttonIconId: media.id,
										buttonIconUrl: media.url,
										buttonIconAlt:
											media.alt || '',
									} )
								}
								allowedTypes={ [ 'image' ] }
								value={ buttonIconId }
								render={ ( { open } ) => (
									<Button
										variant="secondary"
										onClick={ open }
									>
										{ buttonIconUrl
											? __(
													'Change icon',
													'croco-blocks'
												)
											: __(
													'Select icon',
													'croco-blocks'
												) }
									</Button>
								) }
							/>
						</MediaUploadCheck>
						{ buttonIconUrl && (
							<div className="cb-hero-slider-editor__image-preview">
								<img
									src={ buttonIconUrl }
									alt={ buttonIconAlt || '' }
								/>
								<Button
									isDestructive
									variant="link"
									onClick={ () =>
										setAttributes( {
											buttonIconId: 0,
											buttonIconUrl: '',
											buttonIconAlt: '',
										} )
									}
								>
									{ __(
										'Remove icon',
										'croco-blocks'
									) }
								</Button>
							</div>
						) }
					</div>
					<ResponsiveUnitControl
						label={ __(
							'Icon size by breakpoint',
							'croco-blocks'
						) }
						values={ iconSizeValues }
						unit="px"
						units={ [ { value: 'px', label: 'px' } ] }
						onChange={ ( next ) =>
							setAttributes( {
								buttonIconSizeDesktop:
									next.values.desktop !== ''
										? parseFloat(
												next.values.desktop
										  ) || 0
										: 0,
								buttonIconSizeTablet:
									next.values.tablet !== ''
										? parseFloat(
												next.values.tablet
										  ) || 0
										: 0,
								buttonIconSizeMobile:
									next.values.mobile !== ''
										? parseFloat(
												next.values.mobile
										  ) || 0
										: 0,
							} )
						}
					/>
					<SelectControl
						label={ __(
							'Button style',
							'croco-blocks'
						) }
						value={ buttonStyle || 'filled' }
						options={ [
							{
								label: __( 'Filled', 'croco-blocks' ),
								value: 'filled',
							},
							{
								label: __( 'Outline', 'croco-blocks' ),
								value: 'outline',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { buttonStyle: value } )
						}
					/>
					<ToggleControl
						label={ __(
							'Show button text',
							'croco-blocks'
						) }
						checked={
							typeof buttonShowText === 'boolean'
								? buttonShowText
								: true
						}
						onChange={ ( value ) =>
							setAttributes( { buttonShowText: value } )
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

				{ hasSlides ? (
					<ServerSideRender
						block={ metadata.name }
						attributes={ attributes }
					/>
				) : (
					<Placeholder
						icon="images-alt2"
						label={ __( 'CB Hero Slider', 'croco-blocks' ) }
						instructions={ __(
							'Use the block settings sidebar to add slides and configure the hero slider.',
							'croco-blocks'
						) }
					/>
				) }
			</div>
		);
	},

	save() {
		return null;
	},
} );
