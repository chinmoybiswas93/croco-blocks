import { Button } from '@wordpress/components';
import { useSelect, useDispatch, dispatch as wpDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	desktop as desktopIcon,
	tablet as tabletIcon,
	mobile as mobileIcon,
} from '@wordpress/icons';

const DEVICE_OPTIONS = [
	{
		value: 'Desktop',
		label: __( 'Desktop', 'croco-blocks' ),
		icon: desktopIcon,
	},
	{
		value: 'Tablet',
		label: __( 'Tablet', 'croco-blocks' ),
		icon: tabletIcon,
	},
	{
		value: 'Mobile',
		label: __( 'Mobile', 'croco-blocks' ),
		icon: mobileIcon,
	},
];

const DEVICE_MAP = {
	Desktop: 'desktop',
	Tablet: 'tablet',
	Mobile: 'mobile',
};

function getEditorDeviceType( select ) {
	const editor = select( 'core/editor' );
	if ( editor?.getDeviceType ) {
		return editor.getDeviceType();
	}
	if ( editor?.__experimentalGetPreviewDeviceType ) {
		return editor.__experimentalGetPreviewDeviceType();
	}
	const editPost = select( 'core/edit-post' );
	if ( editPost?.__experimentalGetPreviewDeviceType ) {
		return editPost.__experimentalGetPreviewDeviceType();
	}
	return 'Desktop';
}

function setEditorDeviceType( deviceType ) {
	try {
		const editor = wpDispatch( 'core/editor' );
		if ( editor?.setDeviceType ) {
			editor.setDeviceType( deviceType );
			return;
		}
		if ( editor?.__experimentalSetPreviewDeviceType ) {
			editor.__experimentalSetPreviewDeviceType( deviceType );
			return;
		}
	} catch ( e ) { /* store not available */ }

	try {
		const editPost = wpDispatch( 'core/edit-post' );
		if ( editPost?.__experimentalSetPreviewDeviceType ) {
			editPost.__experimentalSetPreviewDeviceType( deviceType );
		}
	} catch ( e ) { /* store not available */ }
}

export const DeviceSwitcher = ( { activeDevice, onChange } ) => {
	const editorDevice = useSelect(
		( select ) => getEditorDeviceType( select ),
		[]
	);

	const handleClick = ( option ) => {
		onChange( DEVICE_MAP[ option.value ] );
		setEditorDeviceType( option.value );
	};

	return (
		<div className="cb-device-switcher" role="group">
			{ DEVICE_OPTIONS.map( ( option ) => (
				<Button
					key={ option.value }
					className={
						'cb-device-switcher__btn' +
						( editorDevice === option.value
							? ' is-active'
							: '' )
					}
					icon={ option.icon }
					label={ option.label }
					showTooltip
					onClick={ () => handleClick( option ) }
				/>
			) ) }
		</div>
	);
};
