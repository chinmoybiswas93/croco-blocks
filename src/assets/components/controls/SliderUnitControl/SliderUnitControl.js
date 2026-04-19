import { useId, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Snap numeric display to step and trim float noise (consistent decimals in the input).
 * Zero is returned as "0" so controlled number inputs show and accept 0 (empty string hides 0).
 *
 * @param {number} n
 * @param {number} step
 * @return {string}
 */
export function formatSliderNumberForStep( n, step ) {
	if ( ! Number.isFinite( n ) ) {
		return '';
	}
	if ( n === 0 ) {
		return '0';
	}
	const stepStr = String( step );
	const decLen = stepStr.includes( '.' )
		? stepStr.split( '.' )[ 1 ].length
		: 0;
	if ( decLen === 0 ) {
		return String( Math.round( n ) );
	}
	const snapped = Math.round( n / step ) * step;
	const rounded = parseFloat( snapped.toFixed( Math.min( decLen + 2, 8 ) ) );
	return String( rounded );
}

/**
 * Horizontal range + number input + unit select (shared typography pattern).
 *
 * @param {Object}   props
 * @param {string}   props.label
 * @param {number|null|undefined} props.value Numeric value; use null/undefined when unset (theme default). 0 is a valid value when set.
 * @param {string}   props.unit
 * @param {Array<{value: string, label: string}>} props.units
 * @param {number}   props.min
 * @param {number}   props.max
 * @param {number}   props.step
 * @param {function} props.onChange    ( { value: number, unit: string } ) => void
 * @param {string}   [props.help]
 * @param {boolean}  [props.allowNegative]
 * @param {string}   [props.numberPlaceholder] Shown when the number field is empty (e.g. suggested default).
 * @param {number}   [props.unsetSliderValue] When value is 0 and zero is outside the slider range, show this value on the range input only (stored value stays 0 until the user moves the slider).
 * @param {boolean}  [props.emptyWhenUnset] When true, show an empty number field when value is null or undefined (not when value is 0).
 * @param {number}   [props.inputMin] Optional min for the number field only (defaults: no `min` when allowNegative, else 0). Range still uses `min`.
 * @param {number}   [props.inputMax] Optional max for the number field only. Omit for no upper cap (range keeps `max` for the slider only).
 */
export function SliderUnitControl( {
	label,
	value,
	unit,
	units = [],
	min = 0,
	max = 100,
	step = 1,
	onChange,
	help,
	allowNegative = false,
	numberPlaceholder,
	unsetSliderValue,
	emptyWhenUnset = false,
	inputMin,
	inputMax,
} ) {
	const inputId = useId();
	const [ numberFocused, setNumberFocused ] = useState( false );
	const [ numberDraft, setNumberDraft ] = useState( '' );
	const unset = value === null || value === undefined;
	const num = unset
		? 0
		: ( () => {
				if ( typeof value === 'number' && ! Number.isNaN( value ) ) {
					return value;
				}
				const p = parseFloat( String( value ).replace( ',', '.' ) );
				return Number.isFinite( p ) ? p : 0;
		  } )();
	const safeUnit = unit || ( units[ 0 ]?.value ?? '' );

	const clampedForRange = ( n ) => {
		if ( Number.isNaN( n ) ) {
			return min;
		}
		return Math.min( max, Math.max( min, n ) );
	};

	const sliderDisplayed =
		num === 0
			? ( () => {
					if ( min <= 0 && max >= 0 ) {
						return 0;
					}
					if (
						typeof unsetSliderValue === 'number' &&
						Number.isFinite( unsetSliderValue )
					) {
						return clampedForRange( unsetSliderValue );
					}
					return min;
			  } )()
			: clampedForRange( num );

	const displayString =
		emptyWhenUnset && unset
			? ''
			: formatSliderNumberForStep( num, step );

	/** While typing decimals (e.g. `0.05`), avoid parsing each keystroke — that collapses `0.` to `0`. */
	const numberInputValue = numberFocused ? numberDraft : displayString;

	const rangeProgressPercent =
		max === min
			? 0
			: Math.min(
					100,
					Math.max(
						0,
						( ( sliderDisplayed - min ) / ( max - min ) ) * 100
					)
			  );

	/** Range thumb stays within [min, max]. */
	const setValueFromRange = ( next ) => {
		let n =
			typeof next === 'number'
				? next
				: parseFloat( String( next ).replace( ',', '.' ) );
		if ( Number.isNaN( n ) ) {
			n = min;
		}
		if ( ! allowNegative && n < 0 ) {
			n = 0;
		}
		n = clampedForRange( n );
		if ( typeof onChange === 'function' ) {
			onChange( { value: n, unit: safeUnit } );
		}
	};

	const applyInputClamps = ( n ) => {
		let out = n;
		if ( Number.isNaN( out ) ) {
			out = 0;
		}
		if ( ! allowNegative && out < 0 ) {
			out = 0;
		}
		if ( allowNegative && typeof inputMin === 'number' && out < inputMin ) {
			out = inputMin;
		}
		if ( typeof inputMax === 'number' && Number.isFinite( inputMax ) && out > inputMax ) {
			out = inputMax;
		}
		return out;
	};

	/** Number field: not capped to range max unless `inputMax` is set. */
	const setValueFromInput = ( next ) => {
		let n =
			typeof next === 'number'
				? next
				: parseFloat( String( next ).replace( ',', '.' ) );
		n = applyInputClamps( n );
		if ( typeof onChange === 'function' ) {
			onChange( { value: n, unit: safeUnit } );
		}
	};

	const handleUnitChange = ( event ) => {
		const nextUnit = event?.target?.value ?? safeUnit;
		if ( typeof onChange === 'function' ) {
			onChange( { value: num, unit: nextUnit } );
		}
	};

	/**
	 * Parse the visible field text for stepping; fall back to stored `num` when empty or incomplete.
	 *
	 * @param {string} raw
	 * @return {number}
	 */
	const parseForStep = ( raw ) => {
		if ( raw === '' || raw === null || raw === undefined ) {
			return num;
		}
		const normalized = String( raw ).replace( ',', '.' ).trim();
		if (
			normalized === '' ||
			normalized === '-' ||
			normalized === '.' ||
			normalized === '-.' ||
			/^-?\d+\.$/.test( normalized )
		) {
			return num;
		}
		const p = parseFloat( normalized );
		return Number.isFinite( p ) ? p : num;
	};

	/** `type="text"` has no native step keys; mirror `<input type="number">` ArrowUp / ArrowDown. */
	const handleNumberKeyDown = ( event ) => {
		if ( event.key !== 'ArrowUp' && event.key !== 'ArrowDown' ) {
			return;
		}
		if ( event.ctrlKey || event.metaKey || event.altKey ) {
			return;
		}
		event.preventDefault();
		const base = parseForStep( numberFocused ? numberDraft : displayString );
		const dir = event.key === 'ArrowUp' ? 1 : -1;
		const delta = step * ( event.shiftKey ? 10 : 1 );
		const next = applyInputClamps( base + dir * delta );
		setValueFromInput( next );
		setNumberDraft( formatSliderNumberForStep( next, step ) );
	};

	return (
		<div className="cb-slider-unit-control">
			{ label && (
				<div className="cb-slider-unit-control__label">{ label }</div>
			) }
			<div className="cb-slider-unit-control__row">
				<input
					className="cb-slider-unit-control__range"
					type="range"
					min={ min }
					max={ max }
					step={ step }
					value={ sliderDisplayed }
					style={ {
						'--cb-slider-range-progress': `${ rangeProgressPercent }%`,
					} }
					onChange={ ( e ) =>
						setValueFromRange( parseFloat( e.target.value ) )
					}
					aria-label={ label || __( 'Adjust value', 'croco-blocks' ) }
				/>
				<div className="cb-slider-unit-control__input-wrap">
					<input
						id={ inputId }
						className="cb-slider-unit-control__native-number"
						type="text"
						inputMode="decimal"
						autoComplete="off"
						value={ numberInputValue }
						placeholder={ numberPlaceholder }
						aria-label={
							label
								? `${ label } (${ __( 'value', 'croco-blocks' ) })`
								: __( 'Value', 'croco-blocks' )
						}
						onFocus={ () => {
							setNumberFocused( true );
							setNumberDraft( displayString );
						} }
						onBlur={ ( e ) => {
							setNumberFocused( false );
							const raw = e.target.value;
							if ( raw === '' || raw === null ) {
								return;
							}
							const normalized = String( raw )
								.replace( ',', '.' )
								.trim();
							if ( normalized === '' ) {
								return;
							}
							/* Incomplete typing — restore last saved number */
							if (
								normalized === '-' ||
								normalized === '.' ||
								normalized === '-.' ||
								/^-?\d+\.$/.test( normalized )
							) {
								if ( typeof onChange === 'function' ) {
									onChange( { value: num, unit: safeUnit } );
								}
								return;
							}
							const parsed = parseFloat( normalized );
							if ( Number.isNaN( parsed ) ) {
								if ( typeof onChange === 'function' ) {
									onChange( { value: num, unit: safeUnit } );
								}
								return;
							}
							setValueFromInput( parsed );
						} }
						onChange={ ( e ) => {
							const raw = e.target.value;
							setNumberDraft( raw );
							if ( raw === '' || raw === null ) {
								if ( typeof onChange === 'function' ) {
									const payload = { value: 0, unit: safeUnit };
									if ( emptyWhenUnset ) {
										payload.inputCleared = true;
									}
									onChange( payload );
								}
								return;
							}
							/* Defer numeric commit until blur so `0.` / `0.0` stay editable */
						} }
						onKeyDown={ handleNumberKeyDown }
					/>
					<select
						className="cb-slider-unit-control__unit-select"
						value={ safeUnit }
						onChange={ handleUnitChange }
						aria-label={ __( 'Unit', 'croco-blocks' ) }
					>
						{ units.map( ( opt, i ) => (
							<option
								key={ `${ opt.label }-${ i }` }
								value={ opt.value }
							>
								{ opt.label }
							</option>
						) ) }
					</select>
				</div>
			</div>
			{ help && (
				<p className="cb-slider-unit-control__help">{ help }</p>
			) }
		</div>
	);
}
