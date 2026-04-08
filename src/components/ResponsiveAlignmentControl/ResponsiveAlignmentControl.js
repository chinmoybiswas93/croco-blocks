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
	desktop as desktopIcon,
	tablet as tabletIcon,
	mobile as mobileIcon,
} from '@wordpress/icons';
import './ResponsiveAlignmentControl.scss';

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

const DEVICE_OPTIONS = [
	{
		value: 'desktop',
		label: __( 'Desktop', 'croco-blocks' ),
		icon: desktopIcon,
	},
	{
		value: 'tablet',
		label: __( 'Tablet', 'croco-blocks' ),
		icon: tabletIcon,
	},
	{
		value: 'mobile',
		label: __( 'Mobile', 'croco-blocks' ),
		icon: mobileIcon,
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
			{ label && (
				<div className="cb-responsive-alignment-control__label">
					{ label }
				</div>
			) }

			<div className="cb-responsive-alignment-control__row">
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

				<ToggleGroupControl
					className="cb-responsive-alignment-control__devices"
					value={ activeDevice }
					onChange={ setActiveDevice }
					__nextHasNoMarginBottom
				>
					{ DEVICE_OPTIONS.map( ( option ) => (
						<ToggleGroupControlOptionIcon
							key={ option.value }
							value={ option.value }
							icon={ option.icon }
							label={ option.label }
						/>
					) ) }
				</ToggleGroupControl>
			</div>
		</div>
	);
};
