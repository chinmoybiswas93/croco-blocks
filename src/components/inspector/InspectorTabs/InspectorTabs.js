import { InspectorControls } from '@wordpress/block-editor';
import { Icon, TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { cog, brush, settings } from '@wordpress/icons';
import { AdvancedControls } from '../AdvancedControls/AdvancedControls';
import './InspectorTabs.scss';

const TABS = [
	{
		name: 'settings',
		title: (
			<>
				<Icon icon={ cog } />
				<span>{ __( 'General', 'croco-blocks' ) }</span>
			</>
		),
	},
	{
		name: 'styles',
		title: (
			<>
				<Icon icon={ brush } />
				<span>{ __( 'Style', 'croco-blocks' ) }</span>
			</>
		),
	},
	{
		name: 'advanced',
		title: (
			<>
				<Icon icon={ settings } />
				<span>{ __( 'Advanced', 'croco-blocks' ) }</span>
			</>
		),
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
