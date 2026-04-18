const path = require( 'path' );
const wpConfig = require( '@wordpress/scripts/config/webpack.config' );

const sourcePath = process.env.WP_SOURCE_PATH || 'src/assets';

const adminEntry = path.resolve( __dirname, `${ sourcePath }/admin/index.js` );
const editorSharedEntry = path.resolve(
	__dirname,
	`${ sourcePath }/editor-shared/index.js`
);

function addAdminEntry( config ) {
	if ( Array.isArray( config ) ) {
		return config.map( ( c ) => addAdminEntry( c ) );
	}

	const { entry: originalEntry } = config;

	if ( typeof originalEntry === 'function' ) {
		return {
			...config,
			entry: () => {
				const base = originalEntry();
				return {
					...base,
					'admin/index': adminEntry,
					'editor-shared/index': editorSharedEntry,
				};
			},
		};
	}

	if (
		typeof originalEntry === 'object' &&
		originalEntry !== null &&
		! Array.isArray( originalEntry )
	) {
		return {
			...config,
			entry: {
				...originalEntry,
				'admin/index': adminEntry,
				'editor-shared/index': editorSharedEntry,
			},
		};
	}

	return config;
}

module.exports = addAdminEntry( wpConfig );
