import {RoundBrushTool} from "./tool/RoundBrushTool";
import {PointBrushTool} from "./tool/PointBrushTool";
import {Point2BrushTool} from "./tool/Point2BrushTool";
import {MeteorTool} from "./tool/MeteorTool";
import {InsertElementAreaTool} from "./tool/InsertElementAreaTool";
import {InsertRandomSceneTool} from "./tool/InsertRandomSceneTool";
import {ActionTool} from "./tool/ActionTool";
import {MoveTool} from "./tool/MoveTool";

/**
 *
 * @author Patrik Harag
 * @version 2023-12-28
 */
export class Tools {

    static roundBrushTool(info, brush, size) {
        return new RoundBrushTool(info, brush, size);
    }

    static pointBrushTool(info, brush) {
        return new PointBrushTool(info, brush);
    }

    static point2BrushTool(info, brush1, brush2) {
        return new Point2BrushTool(info, brush1, brush2);
    }

    static meteorTool(info) {
        return new MeteorTool(info);
    }

    static insertScenesTool(info, scenes, handler) {
        if (scenes.length === 1) {
            const elementArea = InsertElementAreaTool.asElementArea(scenes[0]);
            return new InsertElementAreaTool(info, elementArea, handler);
        } else {
            return new InsertRandomSceneTool(info, scenes, handler);
        }
    }

    static actionTool(info, handler) {
        return new ActionTool(info, handler);
    }

    static moveTool(info, size) {
        return new MoveTool(info, size);
    }
}
