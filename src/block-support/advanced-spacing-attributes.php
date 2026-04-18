<?php
/**
 * Shared block.json attribute definitions for Advanced tab responsive spacing.
 * Merged for all `croco-blocks/*` blocks via BlockController.
 *
 * @package Croco_Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Attribute map matching advancedAttributes.js / former block.json entries.
 *
 * @return array<string, array{type: string, default: string|bool}>
 */
function croco_blocks_get_advanced_spacing_block_attributes() {
	return array(
		'cbPaddingTop'         => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbPaddingRight'       => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbPaddingBottom'      => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbPaddingLeft'        => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbPaddingTopTablet'   => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbPaddingTopMobile'  => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbPaddingRightTablet' => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbPaddingRightMobile' => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbPaddingBottomTablet' => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbPaddingBottomMobile' => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbPaddingLeftTablet'  => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbPaddingLeftMobile'  => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbPaddingUnit'        => array(
			'type'    => 'string',
			'default' => 'px',
		),
		'cbPaddingLinked'      => array(
			'type'    => 'boolean',
			'default' => false,
		),
		'cbMarginTop'          => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbMarginRight'        => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbMarginBottom'       => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbMarginLeft'         => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbMarginTopTablet'    => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbMarginTopMobile'    => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbMarginRightTablet'  => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbMarginRightMobile'  => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbMarginBottomTablet' => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbMarginBottomMobile' => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbMarginLeftTablet'   => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbMarginLeftMobile'   => array(
			'type'    => 'string',
			'default' => '',
		),
		'cbMarginUnit'         => array(
			'type'    => 'string',
			'default' => 'px',
		),
		'cbMarginLinked'       => array(
			'type'    => 'boolean',
			'default' => false,
		),
		'cbAdvancedBackgroundColor' => array(
			'type'    => 'string',
			'default' => '',
		),
	);
}
