const path = require( 'path' );
const wpConfig = require( '@wordpress/scripts/config/webpack.config' );

const adminEntry = path.resolve( __dirname, 'src/admin/index.js' );

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
			},
		};
	}

	return config;
}

module.exports = addAdminEntry( wpConfig );
