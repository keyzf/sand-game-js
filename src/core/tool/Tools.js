// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import ToolInfo from "./ToolInfo";
import RoundBrushTool from "./RoundBrushTool";
import RoundBrushToolForSolidBody from "./RoundBrushToolForSolidBody";
import PointBrushTool from "./PointBrushTool";
import Point2BrushTool from "./Point2BrushTool";
import MeteorTool from "./MeteorTool";
import InsertElementAreaTool from "./InsertElementAreaTool";
import InsertRandomSceneTool from "./InsertRandomSceneTool";
import ActionTool from "./ActionTool";
import MoveTool from "./MoveTool";
import TemplateSelectionFakeTool from "./TemplateSelectionFakeTool";
import GlobalActionTool from "./GlobalActionTool";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-08
 */
export default class Tools {

    static #info(info) {
        if (info instanceof ToolInfo) {
            return info;
        }
        if (info === undefined) {
            return ToolInfo.NOT_DEFINED;
        }
        if (typeof info === 'object') {
            return new ToolInfo(info);
        }
        throw 'Incorrect tool info type: ' + (typeof info);
    }

    /**
     *
     * @param brush
     * @param size
     * @param info {ToolInfo|object|undefined}
     * @return {Tool}
     */
    static roundBrushTool(brush, size, info) {
        return new RoundBrushTool(Tools.#info(info), brush, size);
    }

    /**
     *
     * @param brush
     * @param size
     * @param info {ToolInfo|object|undefined}
     * @return {Tool}
     */
    static roundBrushToolForSolidBody(brush, size, info) {
        return new RoundBrushToolForSolidBody(Tools.#info(info), brush, size);
    }

    /**
     *
     * @param brush
     * @param info {ToolInfo|object|undefined}
     * @return {Tool}
     */
    static pointBrushTool(brush, info) {
        return new PointBrushTool(Tools.#info(info), brush);
    }

    // TODO: generalize
    /**
     *
     * @param brush1
     * @param brush2
     * @param info {ToolInfo|object|undefined}
     * @return {Tool}
     */
    static point2BrushTool(brush1, brush2, info) {
        return new Point2BrushTool(Tools.#info(info), brush1, brush2);
    }

    /**
     *
     * @param info {ToolInfo|object|undefined}
     * @return {Tool}
     */
    static meteorTool(info) {
        return new MeteorTool(Tools.#info(info));
    }

    /**
     *
     * @param scenes
     * @param handler
     * @param info {ToolInfo|object|undefined}
     * @return {Tool}
     */
    static insertScenesTool(scenes, handler, info) {
        if (scenes.length === 1) {
            const elementArea = InsertElementAreaTool.asElementArea(scenes[0]);
            return new InsertElementAreaTool(Tools.#info(info), elementArea, handler);
        } else {
            return new InsertRandomSceneTool(Tools.#info(info), scenes, handler);
        }
    }

    /**
     *
     * @param handler
     * @param info {ToolInfo|object|undefined}
     * @return {Tool}
     */
    static actionTool(handler, info) {
        return new ActionTool(Tools.#info(info), handler);
    }

    /**
     *
     * @param handler {function(SandGame|null)}
     * @param info {ToolInfo|object|undefined}
     * @return {Tool}
     */
    static globalActionTool(handler, info) {
        return new GlobalActionTool(Tools.#info(info), handler);
    }

    /**
     *
     * @param size
     * @param info {ToolInfo|object|undefined}
     * @return {Tool}
     */
    static moveTool(size, info) {
        return new MoveTool(Tools.#info(info), size);
    }

    /**
     *
     * @param templateDefinitions
     * @param info {ToolInfo|object|undefined}
     * @return {Tool}
     */
    static templateSelectionTool(templateDefinitions, info) {
        return new TemplateSelectionFakeTool(Tools.#info(info), templateDefinitions);
    }
}
