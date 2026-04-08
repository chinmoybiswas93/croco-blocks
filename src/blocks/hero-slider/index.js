import { registerBlockType } from '@wordpress/blocks';
import {
	useBlockProps,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	SelectControl,
	Button,
	FocalPointPicker,
	Placeholder,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ServerSideRender from '@wordpress/server-side-render';
import metadata from './block.json';
import './style.scss';
import './editor.scss';
import { InspectorTabs } from '../../components/inspector/InspectorTabs/InspectorTabs';
import { ResponsiveUnitControl } from '../../components/controls/ResponsiveUnitControl/ResponsiveUnitControl';
import { ColorOpacityControl } from '../../components/controls/ColorOpacityControl/ColorOpacityControl';

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

registerBlockType( metadata.name, {
	edit( { attributes, setAttributes } ) {
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
			textLineHeight,
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

		const blockProps = useBlockProps();

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
						<RangeControl
							label={ __(
								'Autoplay speed (ms)',
								'croco-blocks'
							) }
							min={ 1000 }
							max={ 10000 }
							step={ 500 }
							value={ autoplaySpeed || 5000 }
							onChange={ ( value ) =>
								setAttributes( { autoplaySpeed: value } )
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
					<RangeControl
						label={ __(
							'Title line height',
							'croco-blocks'
						) }
						min={ 0.8 }
						max={ 2 }
						step={ 0.05 }
						value={ headingLineHeight || 0 }
						onChange={ ( value ) =>
							setAttributes( {
								headingLineHeight: value || 0,
							} )
						}
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
					<RangeControl
						label={ __(
							'Text line height',
							'croco-blocks'
						) }
						min={ 0.8 }
						max={ 2 }
						step={ 0.05 }
						value={ textLineHeight || 0 }
						onChange={ ( value ) =>
							setAttributes( {
								textLineHeight: value || 0,
							} )
						}
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
					<RangeControl
						label={ __(
							'Content max width (px)',
							'croco-blocks'
						) }
						min={ 400 }
						max={ 1600 }
						value={ contentMaxWidth || 0 }
						onChange={ ( value ) =>
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
					<RangeControl
						label={ __(
							'Vertical padding (px)',
							'croco-blocks'
						) }
						min={ 0 }
						max={ 40 }
						value={ buttonPaddingY || 0 }
						onChange={ ( value ) =>
							setAttributes( {
								buttonPaddingY: value || 0,
							} )
						}
					/>
					<RangeControl
						label={ __(
							'Horizontal padding (px)',
							'croco-blocks'
						) }
						min={ 0 }
						max={ 80 }
						value={ buttonPaddingX || 0 }
						onChange={ ( value ) =>
							setAttributes( {
								buttonPaddingX: value || 0,
							} )
						}
					/>
					<RangeControl
						label={ __(
							'Top margin (px)',
							'croco-blocks'
						) }
						min={ 0 }
						max={ 80 }
						value={ buttonMarginTop || 0 }
						onChange={ ( value ) =>
							setAttributes( {
								buttonMarginTop: value || 0,
							} )
						}
					/>
					<RangeControl
						label={ __(
							'Border radius (px)',
							'croco-blocks'
						) }
						min={ 0 }
						max={ 100 }
						value={ buttonBorderRadius || 0 }
						onChange={ ( value ) =>
							setAttributes( {
								buttonBorderRadius: value || 0,
							} )
						}
					/>
					<RangeControl
						label={ __(
							'Border width (px)',
							'croco-blocks'
						) }
						min={ 0 }
						max={ 10 }
						value={ buttonBorderWidth || 0 }
						onChange={ ( value ) =>
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
