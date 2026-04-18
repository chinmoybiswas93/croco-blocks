import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

const { blocks: initialBlocks, version } = window.crocoBlocksData || {};

const DASHICON_MAP = {
	menu: 'dashicons-menu',
	'images-alt2': 'dashicons-images-alt2',
	'block-default': 'dashicons-block-default',
};

const App = () => {
	const [ blocks, setBlocks ] = useState( initialBlocks || [] );
	const [ saving, setSaving ] = useState( false );
	const [ notice, setNotice ] = useState( null );

	const handleToggle = useCallback(
		async ( slug, isActive ) => {
			const updated = blocks.map( ( block ) =>
				block.slug === slug ? { ...block, active: isActive } : block
			);

			setBlocks( updated );
			setSaving( true );
			setNotice( null );

			try {
				const activeSlugs = updated
					.filter( ( b ) => b.active )
					.map( ( b ) => b.slug );

				await apiFetch( {
					path: '/croco-blocks/v1/settings',
					method: 'POST',
					data: { active_blocks: activeSlugs },
				} );

				setNotice( {
					status: 'success',
					message: __( 'Settings saved.', 'croco-blocks' ),
				} );
			} catch {
				setBlocks( blocks );
				setNotice( {
					status: 'error',
					message: __( 'Failed to save settings.', 'croco-blocks' ),
				} );
			} finally {
				setSaving( false );
			}
		},
		[ blocks ]
	);

	const activeCount = blocks.filter( ( b ) => b.active ).length;

	return (
		<div className="croco-blocks-admin">
			<div className="croco-blocks-admin__header">
				<div className="croco-blocks-admin__header-inner">
					<div className="croco-blocks-admin__brand">
						<span className="croco-blocks-admin__logo dashicons dashicons-screenoptions" aria-hidden="true" />
						<span className="croco-blocks-admin__brand-text">
							{ __( 'Croco Blocks', 'croco-blocks' ) }
						</span>
						<span className="croco-blocks-admin__version">{ version }</span>
					</div>
				</div>
			</div>

			<div className="croco-blocks-admin__body">
				<div className="croco-blocks-admin__layout">
					{ /* Main content — card grid */ }
					<main className="croco-blocks-admin__main">
						<div className="croco-blocks-admin__section-header">
							<h2>{ __( 'Blocks', 'croco-blocks' ) }</h2>
							<p className="croco-blocks-admin__subtitle">
								{ activeCount } / { blocks.length }{ ' ' }
								{ __( 'blocks active', 'croco-blocks' ) }
							</p>
						</div>

						<div className="croco-blocks-admin__grid">
							{ blocks.map( ( block ) => (
								<div
									key={ block.slug }
									className={ `croco-blocks-admin__card${
										block.active ? '' : ' croco-blocks-admin__card--disabled'
									}` }
								>
									<div className="croco-blocks-admin__card-top">
										<div className="croco-blocks-admin__card-icon">
											<span
												className={ `dashicons ${
													DASHICON_MAP[ block.icon ] || 'dashicons-block-default'
												}` }
											/>
										</div>
										<div className="croco-blocks-admin__card-toggle">
											<label className="croco-blocks-admin__switch">
												<input
													type="checkbox"
													checked={ block.active }
													onChange={ ( e ) =>
														handleToggle( block.slug, e.target.checked )
													}
													disabled={ saving }
												/>
												<span className="croco-blocks-admin__switch-track" aria-hidden="true" />
											</label>
										</div>
									</div>
									<div className="croco-blocks-admin__card-info">
										<h3 className="croco-blocks-admin__card-title">
											{ block.title }
										</h3>
										{ block.description && (
											<p className="croco-blocks-admin__card-desc">
												{ block.description }
											</p>
										) }
									</div>
								</div>
							) ) }
						</div>
					</main>

					{ /* Sidebar */ }
					<aside className="croco-blocks-admin__sidebar">
						<div className="croco-blocks-admin__sidebar-box">
							<h3>{ __( 'Getting Started', 'croco-blocks' ) }</h3>
							<p>
								{ __(
									'Toggle blocks on or off to control which ones are available in the editor. Disabled blocks will not be registered.',
									'croco-blocks'
								) }
							</p>
						</div>

						<div className="croco-blocks-admin__sidebar-box">
							<h3>{ __( 'Overview', 'croco-blocks' ) }</h3>
							<ul className="croco-blocks-admin__sidebar-stats">
								<li>
									<span className="croco-blocks-admin__stat-label">
										{ __( 'Total Blocks', 'croco-blocks' ) }
									</span>
									<span className="croco-blocks-admin__stat-value">
										{ blocks.length }
									</span>
								</li>
								<li>
									<span className="croco-blocks-admin__stat-label">
										{ __( 'Active', 'croco-blocks' ) }
									</span>
									<span className="croco-blocks-admin__stat-value croco-blocks-admin__stat-value--active">
										{ activeCount }
									</span>
								</li>
								<li>
									<span className="croco-blocks-admin__stat-label">
										{ __( 'Inactive', 'croco-blocks' ) }
									</span>
									<span className="croco-blocks-admin__stat-value croco-blocks-admin__stat-value--inactive">
										{ blocks.length - activeCount }
									</span>
								</li>
							</ul>
						</div>

						<div className="croco-blocks-admin__sidebar-box croco-blocks-admin__sidebar-box--accent">
							<h3>{ __( 'Need Help?', 'croco-blocks' ) }</h3>
							<p>
								{ __(
									'Visit our documentation or contact support for assistance with block configuration.',
									'croco-blocks'
								) }
							</p>
						</div>
					</aside>
				</div>
			</div>

			{ notice && (
				<div
					className={ `croco-blocks-admin__toast croco-blocks-admin__toast--${ notice.status }` }
					role="status"
				>
					<span className="croco-blocks-admin__toast-text">{ notice.message }</span>
					<button
						type="button"
						className="croco-blocks-admin__toast-dismiss"
						onClick={ () => setNotice( null ) }
						aria-label={ __( 'Dismiss', 'croco-blocks' ) }
					>
						&times;
					</button>
				</div>
			) }
		</div>
	);
};

export default App;
