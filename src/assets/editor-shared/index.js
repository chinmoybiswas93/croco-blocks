/**
 * Shared editor-only styles for components used by multiple blocks.
 * Loaded once via block.json editorStyle to avoid duplicating the same CSS in every block bundle.
 *
 * Block edit modules import shared controls from `components/controls/<Name>/` and `@wordpress/components` as needed.
 */
import '../components/inspector/InspectorTabs/InspectorTabs.scss';
import '../components/ui/DeviceSwitcher/DeviceSwitcher.scss';
import '../components/controls/ResponsiveAlignmentControl/ResponsiveAlignmentControl.scss';
import '../components/controls/ResponsiveUnitControl/ResponsiveUnitControl.scss';
import '../components/controls/SliderUnitControl/SliderUnitControl.scss';
import '../components/controls/ColorOpacityControl/ColorOpacityControl.scss';
import '../components/controls/ResponsiveSpacingControl/ResponsiveSpacingControl.scss';
import '../components/controls/BorderControls/BorderControls.scss';
