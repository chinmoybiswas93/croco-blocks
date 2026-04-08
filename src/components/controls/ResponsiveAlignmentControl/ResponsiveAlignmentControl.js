import { useState } from '@wordpress/element';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	alignLeft,
	alignCenter,
	alignRight,
} from '@wordpress/icons';
import { DeviceSwitcher } from '../../ui/DeviceSwitcher/DeviceSwitcher';

const DEFAULT_VALUES = {
	desktop: 'left',
	tablet: '',
	mobile: '',
};

const ALIGNMENT_OPTIONS = [
	{
		value: 'left',
		label: __( 'Left', 'croco-blocks' ),
		icon: alignLeft,
	},
	{
		value: 'center',
		label: __( 'Center', 'croco-blocks' ),
		icon: alignCenter,
	},
	{
		value: 'right',
		label: __( 'Right', 'croco-blocks' ),
		icon: alignRight,
	},
];

export const ResponsiveAlignmentControl = ( {
	label,
	values = {},
	onChange,
} ) => {
	const [ activeDevice, setActiveDevice ] = useState( 'desktop' );

	const currentValues = {
		...DEFAULT_VALUES,
		...values,
	};

	const handleAlignmentChange = ( alignment ) => {
		const nextValues = {
			...currentValues,
			[ activeDevice ]: alignment,
		};

		if ( typeof onChange === 'function' ) {
			onChange( nextValues );
		}
	};

	const activeAlignment = currentValues[ activeDevice ] || 'left';

	return (
		<div className="cb-responsive-alignment-control">
			<div className="cb-responsive-alignment-control__header">
				{ label && (
					<div className="cb-responsive-alignment-control__label">
						{ label }
					</div>
				) }
				<DeviceSwitcher
					activeDevice={ activeDevice }
					onChange={ setActiveDevice }
				/>
			</div>

			<ToggleGroupControl
				className="cb-responsive-alignment-control__align"
				value={ activeAlignment }
				onChange={ handleAlignmentChange }
				isBlock
				__nextHasNoMarginBottom
			>
				{ ALIGNMENT_OPTIONS.map( ( option ) => (
					<ToggleGroupControlOptionIcon
						key={ option.value }
						value={ option.value }
						icon={ option.icon }
						label={ option.label }
					/>
				) ) }
			</ToggleGroupControl>
		</div>
	);
};
