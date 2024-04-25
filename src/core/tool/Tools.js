// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import ToolInfo from "./ToolInfo";
import RoundBrushTool from "./RoundBrushTool";
import RoundBrushToolForSolidBody from "./RoundBrushToolForSolidBody";
import PointBrushTool from "./PointBrushTool";
import MeteorTool from "./MeteorTool";
import InsertElementAreaTool from "./InsertElementAreaTool";
import InsertRandomSceneTool from "./InsertRandomSceneTool";
import ActionTool from "./ActionTool";
import MoveTool from "./MoveTool";
import TemplateSelectionFakeTool from "./TemplateSelectionFakeTool";
import GlobalActionTool from "./GlobalActionTool";
import InsertEntityTool from "./InsertEntityTool";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-20
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
        return new PointBrushTool(Tools.#info(info), [{ dx: 0, dy: 0, brush: brush }]);
    }

    /**
     *
     * @param points {{dx: number, dy: number, brush: Brush}[]}
     * @param info {ToolInfo|object|undefined}
     * @return {Tool}
     */
    static multiPointBrushTool(points, info) {
        return new PointBrushTool(Tools.#info(info), points);
    }

    /**
     *
     * @param meteor {Brush}
     * @param meteorFromLeft {Brush}
     * @param meteorFromRight {Brush}
     * @param info {ToolInfo|object|undefined}
     * @return {Tool}
     */
    static meteorTool(meteor, meteorFromLeft, meteorFromRight, info) {
        return new MeteorTool(Tools.#info(info), meteor, meteorFromLeft, meteorFromRight);
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
            const scene = scenes[0];
            const elementArea = InsertElementAreaTool.asElementArea(scene);
            const serializedEntitiesOrNull = scene.createEntities();
            const serializedEntities = serializedEntitiesOrNull !== null ? serializedEntitiesOrNull : [];
            return new InsertElementAreaTool(Tools.#info(info), elementArea, serializedEntities, handler);
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
     * @param size {number}
     * @param solidBodyMaxArea {number}
     * @param info {ToolInfo|object|undefined}
     * @return {Tool}
     */
    static moveTool(size, solidBodyMaxArea, info) {
        return new MoveTool(Tools.#info(info), size, solidBodyMaxArea);
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

    /**
     *
     * @param entityFactory {function(x:number, y:number, elementArea:ElementArea, random:DeterministicRandom, processorContext:ProcessorContext):object}
     * @param info {ToolInfo|object|undefined}
     * @return {Tool}
     */
    static insertEntityTool(entityFactory, info) {
        return new InsertEntityTool(Tools.#info(info), entityFactory);
    }
}
