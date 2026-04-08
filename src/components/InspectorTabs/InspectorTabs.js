import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { AdvancedControls } from '../AdvancedControls/AdvancedControls';
import './InspectorTabs.scss';

const TABS = [
	{
		name: 'settings',
		title: __( 'Settings', 'croco-blocks' ),
	},
	{
		name: 'styles',
		title: __( 'Styles', 'croco-blocks' ),
	},
	{
		name: 'advanced',
		title: __( 'Advanced', 'croco-blocks' ),
	},
];

export const InspectorTabs = ( {
	attributes,
	setAttributes,
	settings,
	styles,
} ) => {
	return (
		<InspectorControls>
			<TabPanel
				className="croco-blocks-inspector-tabs"
				activeClass="is-active"
				initialTabName="settings"
				tabs={ TABS }
			>
				{ ( tab ) => (
					<div className="croco-blocks-inspector-tabs__content">
						{ tab.name === 'settings' && settings }
						{ tab.name === 'styles' && styles }
						{ tab.name === 'advanced' && (
							<AdvancedControls
								attributes={ attributes }
								setAttributes={ setAttributes }
							/>
						) }
					</div>
				) }
			</TabPanel>
		</InspectorControls>
	);
};
