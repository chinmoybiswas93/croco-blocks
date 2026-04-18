import { useState, useMemo } from '@wordpress/element';
import { SelectControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { link, linkOff } from '@wordpress/icons';
import { DeviceSwitcher } from '../../ui/DeviceSwitcher/DeviceSwitcher';
import {
	SPACING_SIDES,
	SPACING_UNITS,
	getSpacingAttrKey,
	getSpacingUnitKey,
	getSpacingLinkedKey,
	parseSpacingValue,
	formatSpacingValue,
} from '../../../utils/spacingKeys';
import './ResponsiveSpacingControl.scss';

/**
 * @param {Object} props
 * @param {string} props.label
 * @param {'padding'|'margin'} props.mode
 * @param {Object} props.attributes
 * @param {Function} props.setAttributes
 */
export const ResponsiveSpacingControl = ( {
	label,
	mode,
	attributes,
	setAttributes,
} ) => {
	const unitKey = getSpacingUnitKey( mode );
	const linkedKey = getSpacingLinkedKey( mode );
	const unit = attributes[ unitKey ] || 'px';
	const linked = !! attributes[ linkedKey ];

	const [ device, setDevice ] = useState( 'desktop' );

	const sideLabels = useMemo(
		() => ( {
			Top: __( 'Top', 'croco-blocks' ),
			Right: __( 'Right', 'croco-blocks' ),
			Bottom: __( 'Bottom', 'croco-blocks' ),
			Left: __( 'Left', 'croco-blocks' ),
		} ),
		[]
	);

	const getValueForSide = ( side ) => {
		const k = getSpacingAttrKey( mode, side, device );
		return attributes[ k ] ?? '';
	};

	const setAllSides = ( formatted ) => {
		const patch = {};
		for ( const s of SPACING_SIDES ) {
			patch[ getSpacingAttrKey( mode, s, device ) ] = formatted;
		}
		setAttributes( patch );
	};

	const handleNumericChange = ( side, raw ) => {
		const numStr =
			raw === undefined || raw === null ? '' : String( raw ).trim();
		const formatted = formatSpacingValue( numStr, unit, mode );
		if ( linked ) {
			setAllSides( formatted );
			return;
		}
		setAttributes( {
			[ getSpacingAttrKey( mode, side, device ) ]: formatted,
		} );
	};

	const handleUnitChange = ( newUnit ) => {
		const patch = { [ unitKey ]: newUnit };
		const devs = [ 'desktop', 'tablet', 'mobile' ];
		for ( const d of devs ) {
			for ( const side of SPACING_SIDES ) {
				const key = getSpacingAttrKey( mode, side, d );
				const raw = attributes[ key ];
				if ( raw === undefined || raw === null || String( raw ).trim() === '' ) {
					patch[ key ] = formatSpacingValue( '0', newUnit, mode );
					continue;
				}
				const { num } = parseSpacingValue( raw );
				patch[ key ] = formatSpacingValue( num, newUnit, mode );
			}
		}
		setAttributes( patch );
	};

	const toggleLinked = () => {
		const next = ! linked;
		if ( next ) {
			let source = '';
			for ( const s of SPACING_SIDES ) {
				const v = getValueForSide( s );
				if ( v && String( v ).trim() !== '' ) {
					source = v;
					break;
				}
			}
			const { num } = parseSpacingValue( source );
			const val = formatSpacingValue( num, unit, mode );
			const patch = { [ linkedKey ]: true };
			for ( const s of SPACING_SIDES ) {
				patch[ getSpacingAttrKey( mode, s, device ) ] = val;
			}
			setAttributes( patch );
		} else {
			setAttributes( { [ linkedKey ]: false } );
		}
	};

	const displayNumForSide = ( side ) => {
		const raw = linked ? getValueForSide( 'Top' ) : getValueForSide( side );
		const { num } = parseSpacingValue( raw );
		if ( num === '' ) {
			return '0';
		}
		if ( mode === 'padding' ) {
			const p = parseFloat( num );
			if ( Number.isFinite( p ) && p < 0 ) {
				return '0';
			}
		}
		return num;
	};

	return (
		<div className="cb-responsive-spacing">
			<div className="cb-responsive-spacing__header">
				<span className="cb-responsive-spacing__title">{ label }</span>
				<div className="cb-responsive-spacing__header-right">
					<DeviceSwitcher
						activeDevice={ device }
						onChange={ setDevice }
					/>
					<SelectControl
						className="cb-responsive-spacing__unit"
						value={ unit }
						options={ SPACING_UNITS }
						onChange={ handleUnitChange }
						label={ __( 'Unit', 'croco-blocks' ) }
						hideLabelFromVision
					/>
				</div>
			</div>

			<div className="cb-responsive-spacing__track" role="group">
				<div className="cb-responsive-spacing__track-inputs">
					{ SPACING_SIDES.map( ( side, index ) => {
						const disabled =
							linked && index > 0;
						const num = displayNumForSide( side );
						return (
							<div
								key={ side }
								className="cb-responsive-spacing__track-cell"
							>
								<input
									className="cb-responsive-spacing__input-native"
									type="number"
									step="any"
									min={ mode === 'padding' ? 0 : undefined }
									value={ num }
									disabled={ disabled }
									aria-disabled={ disabled }
									onChange={ ( e ) =>
										handleNumericChange(
											side,
											e.target.value
										)
									}
									aria-label={ sideLabels[ side ] }
								/>
							</div>
						);
					} ) }
				</div>
				<div className="cb-responsive-spacing__track-link">
					<Button
						className="cb-responsive-spacing__link-btn"
						variant="secondary"
						onClick={ toggleLinked }
						icon={ linked ? linkOff : link }
						label={
							linked
								? __( 'Unlink sides', 'croco-blocks' )
								: __( 'Link sides', 'croco-blocks' )
						}
						showTooltip
					/>
				</div>
			</div>

			<div
				className="cb-responsive-spacing__labels"
				aria-hidden="true"
			>
				{ SPACING_SIDES.map( ( side ) => (
					<span
						key={ side }
						className="cb-responsive-spacing__label-text"
					>
						{ sideLabels[ side ] }
					</span>
				) ) }
				<span className="cb-responsive-spacing__label-spacer" />
			</div>
		</div>
	);
};
