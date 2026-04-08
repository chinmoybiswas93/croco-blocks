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

const DEFAULT_OPTIONS = [
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

export const AlignmentControl = ( {
	label,
	value,
	onChange,
	options = DEFAULT_OPTIONS,
	isBlock = true,
	__nextHasNoMarginBottom = true,
} ) => {
	return (
		<ToggleGroupControl
			label={ label }
			value={ value }
			onChange={ onChange }
			isBlock={ isBlock }
			__nextHasNoMarginBottom={ __nextHasNoMarginBottom }
		>
			{ options.map( ( option ) => (
				<ToggleGroupControlOptionIcon
					key={ option.value }
					value={ option.value }
					icon={ option.icon }
					label={ option.label }
				/>
			) ) }
		</ToggleGroupControl>
	);
};
