import { useState } from '@wordpress/element';
import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { DeviceSwitcher } from '../../ui/DeviceSwitcher/DeviceSwitcher';

const DEFAULT_VALUES = {
	desktop: '',
	tablet: '',
	mobile: '',
};

export const ResponsiveUnitControl = ( {
	label,
	values = {},
	unit = 'px',
	units = [
		{ value: 'px', label: 'px' },
		{ value: 'vh', label: 'vh' },
		{ value: 'rem', label: 'rem' },
		{ value: 'em', label: 'em' },
	],
	min,
	max,
	step = 1,
	onChange,
} ) => {
	const [ activeDevice, setActiveDevice ] = useState( 'desktop' );

	const currentValues = {
		...DEFAULT_VALUES,
		...values,
	};

	const handleValueChange = ( device, rawValue ) => {
		let numeric = '';

		if ( rawValue !== '' ) {
			const parsed = parseFloat( rawValue );
			numeric = Number.isNaN( parsed ) ? '' : String( parsed );
		}

		const nextValues = {
			...currentValues,
			[ device ]: numeric,
		};

		if ( typeof onChange === 'function' ) {
			onChange( {
				values: nextValues,
				unit,
			} );
		}
	};

	const handleUnitChange = ( event ) => {
		const nextUnit = event?.target?.value || unit;

		if ( typeof onChange === 'function' ) {
			onChange( {
				values: currentValues,
				unit: nextUnit,
			} );
		}
	};

	const activeValue = currentValues[ activeDevice ];

	return (
		<div className="cb-responsive-unit-control">
			<div className="cb-responsive-unit-control__header">
				{ label && (
					<div className="cb-responsive-unit-control__label">
						{ label }
					</div>
				) }
				<DeviceSwitcher
					activeDevice={ activeDevice }
					onChange={ setActiveDevice }
				/>
			</div>
			<div className="cb-responsive-unit-control__input-wrapper">
				<TextControl
					className="cb-responsive-unit-control__input"
					type="number"
					min={ min }
					max={ max }
					step={ step }
					value={ activeValue }
					onChange={ ( value ) =>
						handleValueChange( activeDevice, value )
					}
				/>
				<select
					className="cb-responsive-unit-control__unit-select"
					value={ unit }
					onChange={ handleUnitChange }
					aria-label={ __( 'Unit', 'croco-blocks' ) }
				>
					{ units.map( ( option ) => (
						<option
							key={ option.value }
							value={ option.value }
						>
							{ option.label }
						</option>
					) ) }
				</select>
			</div>
		</div>
	);
};
