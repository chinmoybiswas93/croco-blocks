import { useState } from '@wordpress/element';
import { Button, ButtonGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './ResponsiveAlignmentControl.scss';

const DEFAULT_VALUES = {
	desktop: 'left',
	tablet: '',
	mobile: '',
};

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

	const devices = [
		{
			name: 'desktop',
			label: __( 'Desktop', 'croco-blocks' ),
		},
		{
			name: 'tablet',
			label: __( 'Tablet', 'croco-blocks' ),
		},
		{
			name: 'mobile',
			label: __( 'Mobile', 'croco-blocks' ),
		},
	];

	const alignmentOptions = [
		{
			value: 'left',
			label: __( 'Left', 'croco-blocks' ),
			icon: 'editor-alignleft',
		},
		{
			value: 'center',
			label: __( 'Center', 'croco-blocks' ),
			icon: 'editor-aligncenter',
		},
		{
			value: 'right',
			label: __( 'Right', 'croco-blocks' ),
			icon: 'editor-alignright',
		},
	];

	const handleAlignmentChange = ( device, alignment ) => {
		const nextValues = {
			...currentValues,
			[ device ]: alignment,
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
				<ButtonGroup className="cb-responsive-alignment-control__align">
					{ alignmentOptions.map( ( option ) => (
						<Button
							key={ option.value }
							isSmall
							icon={ option.icon }
							variant={
								activeAlignment === option.value
									? 'primary'
									: 'secondary'
							}
							onClick={ () =>
								handleAlignmentChange(
									activeDevice,
									option.value
								)
							}
							aria-label={ option.label }
						/>
					) ) }
				</ButtonGroup>

				<ButtonGroup className="cb-responsive-alignment-control__devices">
					{ devices.map( ( device ) => (
						<Button
							key={ device.name }
							isSmall
							icon={
								device.name === 'desktop'
									? 'desktop'
									: device.name === 'tablet'
									? 'tablet'
									: 'smartphone'
							}
							variant={
								activeDevice === device.name
									? 'primary'
									: 'secondary'
							}
							onClick={ () =>
								setActiveDevice( device.name )
							}
							aria-label={ device.label }
						/>
					) ) }
				</ButtonGroup>
			</div>
		</div>
	);
};

