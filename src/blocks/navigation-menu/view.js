/**
 * Front-end behavior for CB Navigation toggle menu.
 *
 * Handles:
 * - Hamburger open/close of off-canvas panel.
 * - ESC key to close.
 * - Simple accordion behavior for submenus inside the off-canvas menu.
 */

const initCbNavigationToggle = () => {
	const navs = document.querySelectorAll(
		'nav.cb-navigation.cb-navigation--has-toggle'
	);

	navs.forEach( ( nav ) => {
		const toggleButton = nav.querySelector(
			'.cb-navigation__toggle-button'
		);
		const offcanvas = nav.querySelector( '.cb-navigation__offcanvas' );

		if ( ! toggleButton || ! offcanvas ) {
			return;
		}

		const openNav = () => {
			nav.classList.add( 'cb-navigation--is-open' );
			toggleButton.setAttribute( 'aria-expanded', 'true' );
			offcanvas.setAttribute( 'aria-hidden', 'false' );
			document.body.classList.add( 'cb-navigation-offcanvas-open' );
		};

		const closeNav = () => {
			nav.classList.remove( 'cb-navigation--is-open' );
			toggleButton.setAttribute( 'aria-expanded', 'false' );
			offcanvas.setAttribute( 'aria-hidden', 'true' );
			document.body.classList.remove( 'cb-navigation-offcanvas-open' );
		};

		toggleButton.addEventListener( 'click', () => {
			if ( nav.classList.contains( 'cb-navigation--is-open' ) ) {
				closeNav();
			} else {
				openNav();
			}
		} );

		document.addEventListener( 'keydown', ( event ) => {
			if ( event.key === 'Escape' ) {
				if ( nav.classList.contains( 'cb-navigation--is-open' ) ) {
					closeNav();
				}
			}
		} );

		// Accordion behavior for submenus inside the off-canvas menu.
		const offcanvasMenu = offcanvas.querySelector(
			'.cb-navigation__list--offcanvas'
		);

		if ( offcanvasMenu ) {
			const parentLinks = offcanvasMenu.querySelectorAll(
				'.menu-item-has-children > a'
			);

			parentLinks.forEach( ( link ) => {
				const parentItem = link.closest( '.menu-item-has-children' );
				const submenu = parentItem
					? parentItem.querySelector( '.sub-menu' )
					: null;

				if ( ! submenu ) {
					return;
				}

				// Initialize collapsed state.
				submenu.style.display = 'none';
				link.setAttribute( 'aria-expanded', 'false' );

				link.addEventListener( 'click', ( event ) => {
					event.preventDefault();

					const isOpen = parentItem.classList.toggle( 'is-open' );
					link.setAttribute(
						'aria-expanded',
						isOpen ? 'true' : 'false'
					);
					submenu.style.display = isOpen ? 'block' : 'none';
				} );
			} );
		}
	} );
};

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initCbNavigationToggle );
} else {
	initCbNavigationToggle();
}

