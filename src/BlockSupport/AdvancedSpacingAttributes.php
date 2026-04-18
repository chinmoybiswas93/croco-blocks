<?php
/**
 * Shared block.json attribute definitions for Advanced tab responsive spacing.
 *
 * @package Croco_Blocks
 */

namespace CrocoBlocks\BlockSupport;

class AdvancedSpacingAttributes {

	/**
	 * Attribute map matching advancedAttributes.js / former block.json entries.
	 *
	 * @return array<string, array{type: string, default: string|bool}>
	 */
	public static function get_block_attributes() {
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
			'cbBorderStyle'             => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderTop'               => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRight'             => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderBottom'            => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderLeft'              => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderTopTablet'         => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderTopMobile'         => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRightTablet'       => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRightMobile'       => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderBottomTablet'      => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderBottomMobile'      => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderLeftTablet'        => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderLeftMobile'        => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderUnit'              => array(
				'type'    => 'string',
				'default' => 'px',
			),
			'cbBorderLinked'            => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'cbBorderColor'             => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderHoverStyle'        => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderHoverTop'          => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderHoverRight'        => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderHoverBottom'       => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderHoverLeft'         => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderHoverTopTablet'    => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderHoverTopMobile'    => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderHoverRightTablet'  => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderHoverRightMobile'  => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderHoverBottomTablet' => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderHoverBottomMobile' => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderHoverLeftTablet'   => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderHoverLeftMobile'   => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderHoverUnit'         => array(
				'type'    => 'string',
				'default' => 'px',
			),
			'cbBorderHoverLinked'       => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'cbBorderHoverColor'        => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusTop'         => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusRight'       => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusBottom'      => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusLeft'        => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusTopTablet'   => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusTopMobile'   => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusRightTablet' => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusRightMobile' => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusBottomTablet' => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusBottomMobile' => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusLeftTablet'  => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusLeftMobile'  => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusUnit'        => array(
				'type'    => 'string',
				'default' => 'px',
			),
			'cbBorderRadiusLinked'      => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'cbBorderRadiusHoverTop'    => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusHoverRight'  => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusHoverBottom' => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusHoverLeft'   => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusHoverTopTablet' => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusHoverTopMobile' => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusHoverRightTablet' => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusHoverRightMobile' => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusHoverBottomTablet' => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusHoverBottomMobile' => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusHoverLeftTablet' => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusHoverLeftMobile' => array(
				'type'    => 'string',
				'default' => '',
			),
			'cbBorderRadiusHoverUnit'   => array(
				'type'    => 'string',
				'default' => 'px',
			),
			'cbBorderRadiusHoverLinked' => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'cbInstanceKey'             => array(
				'type'    => 'string',
				'default' => '',
			),
		);
	}
}
