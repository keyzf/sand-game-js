// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import ToolDefs from "./def/ToolDefs.js";

/**
 *
 * @version 2024-04-20
 * @author Patrik Harag
 */
export default class Analytics {

    static EVENT_NAME = 'app_sand_game_js';
    static FEATURE_APP_INITIALIZED = 'initialized';
    static FEATURE_SCENARIO_COMPLETED = 's_completed';
    static FEATURE_RENDERER_FALLBACK = 'renderer_fallback';

    // options bar
    static FEATURE_PAUSE = 'pause';
    static FEATURE_DRAW_PRIMARY = 'draw_primary';
    static FEATURE_DRAW_SECONDARY = 'draw_secondary';
    static FEATURE_DRAW_TERTIARY = 'draw_tertiary';
    static FEATURE_DRAW_LINE = 'draw_line';
    static FEATURE_DRAW_RECT = 'draw_rect';
    static FEATURE_DRAW_FLOOD = 'draw_flood';
    static FEATURE_STATUS_DISPLAYED = 'status_displayed';
    static FEATURE_OPTIONS_DISPLAYED = 'options_displayed';
    static FEATURE_RENDERER_PIXELATED = 'renderer_pixelated';
    static FEATURE_RENDERER_SHOW_CHUNKS = 'renderer_show_chunks';
    static FEATURE_RENDERER_SHOW_HEATMAP = 'renderer_show_heatmap';
    static FEATURE_CANVAS_SIZE_CHANGE = 'canvas_size_change';
    static FEATURE_SWITCH_SCENE = 'switch_scene';
    static FEATURE_RESTART_SCENE = 'restart_scene';
    static FEATURE_SWITCH_SCALE = 'switch_scale';
    static FEATURE_IO_EXPORT = 'io_export';
    static FEATURE_IO_IMPORT = 'io_import';
    static FEATURE_IO_IMAGE_TEMPLATE = 'io_image_template';

    static #USED_FEATURES = new Set();


    static triggerToolUsed(tool) {
        // Note: better feature name would be tool_xxx, but we will keep backward compatibility

        const category = tool.getInfo().getCategory();
        if (category === ToolDefs.CATEGORY_BRUSH || category === ToolDefs.CATEGORY_ENTITY) {
            const feature = 'brush_' + tool.getInfo().getCodeName();
            Analytics.triggerFeatureUsed(feature);
        } else if (category === ToolDefs.CATEGORY_TEMPLATE) {
            Analytics.triggerFeatureUsed('brush_template');
        }
    }

    static triggerFeatureUsed(feature) {
        if (!Analytics.#USED_FEATURES.has(feature)) {
            // report only the first usage
            Analytics.#USED_FEATURES.add(feature);
            Analytics.#report({
                'app_sand_game_js_feature': feature
            });
        }
    }

    static #report(properties) {
        if (typeof gtag === 'function') {
            try {
                gtag('event', Analytics.EVENT_NAME, properties);
            } catch (e) {
                console.warn(e);
            }
        }
        // console.log('event: ' + Analytics.EVENT_NAME + ' = ' + JSON.stringify(properties));
    }
}
