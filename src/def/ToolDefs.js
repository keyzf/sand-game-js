// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Brushes from "../core/brush/Brushes";
import Tools from "../core/tool/Tools";
import BrushDefs from "./BrushDefs";
import ToolInfo from "../core/tool/ToolInfo";
import TemplateDefs from "./TemplateDefs";
import EntityFactories from "../core/entity/EntityFactories";

import _ASSET_ICON_POWDERS from './assets/tools/powder.svg'
import _ASSET_ICON_SOLID from './assets/tools/square-fill.svg'
import _ASSET_ICON_EFFECTS from './assets/tools/fire.svg'
import _ASSET_ICON_FLUIDS from './assets/tools/droplet-fill.svg'

/**
 *
 * @author Patrik Harag
 * @version 2024-05-19
 */
export default class ToolDefs {

    static DEFAULT_SIZE = 6;

    static CATEGORY_NONE = undefined;
    static CATEGORY_POWDER = 'powders';
    static CATEGORY_FLUIDS = 'fluids';
    static CATEGORY_SOLIDS = 'solids';
    static CATEGORY_EFFECTS = 'effects';
    static CATEGORY_BIOLOGICAL = 'biological';

    static DEFAULT_CATEGORY_DEFINITIONS = {};
    static {
        ToolDefs.DEFAULT_CATEGORY_DEFINITIONS[ToolDefs.CATEGORY_POWDER] = {
            displayName: 'Powders',
            icon: {
                svg: _ASSET_ICON_POWDERS
            },
            badgeStyle: {
                backgroundColor: '#d9bc7a',
            }
        };
        ToolDefs.DEFAULT_CATEGORY_DEFINITIONS[ToolDefs.CATEGORY_FLUIDS] = {
            displayName: 'Fluids',
            icon: {
                svg: _ASSET_ICON_FLUIDS
            },
            badgeStyle: {
                backgroundColor: '#6aa6bd',
            }
        };
        ToolDefs.DEFAULT_CATEGORY_DEFINITIONS[ToolDefs.CATEGORY_SOLIDS] = {
            displayName: 'Solids',
            icon: {
                svg: _ASSET_ICON_SOLID
            },
            badgeStyle: {
                backgroundColor: '#adadad',
            }
        };
        ToolDefs.DEFAULT_CATEGORY_DEFINITIONS[ToolDefs.CATEGORY_EFFECTS] = {
            displayName: 'Effects',
            icon: {
                svg: _ASSET_ICON_EFFECTS
            },
            badgeStyle: {
                backgroundColor: '#ff945b',
            }
        };
    }


    static NONE = Tools.actionTool(() => {}, new ToolInfo({
        codeName: 'none',
        displayName: 'None',
        category: ToolDefs.CATEGORY_NONE,
    }));

    static ERASE = Tools.roundBrushTool(BrushDefs.AIR, ToolDefs.DEFAULT_SIZE, new ToolInfo({
        codeName: 'erase',
        displayName: 'Erase',
        category: ToolDefs.CATEGORY_NONE,
        badgeStyle: {
            backgroundColor: '#e6e6e6',
            color: 'black'
        }
    }));

    static MOVE = Tools.moveTool(13, 2048, new ToolInfo({
        codeName: 'move',
        displayName: 'Move',
        category: ToolDefs.CATEGORY_NONE,
        badgeStyle: {
            backgroundColor: '#e6e6e6',
            color: 'black'
        }
    }));

    static FLIP_VERTICALLY = Tools.globalActionTool(sg => sg.graphics().flipVertically(), new ToolInfo({
        codeName: 'flip_vertically',
        displayName: 'Flip \u2195',
        category: ToolDefs.CATEGORY_NONE,
        badgeStyle: {
            backgroundColor: '#e6e6e6',
            color: 'black'
        }
    }));

    static FLIP_HORIZONTALLY = Tools.globalActionTool(sg => sg.graphics().flipHorizontally(), new ToolInfo({
        codeName: 'flip_horizontally',
        displayName: 'Flip \u2194',
        category: ToolDefs.CATEGORY_NONE,
        badgeStyle: {
            backgroundColor: '#e6e6e6',
            color: 'black'
        }
    }));

    static SAND = Tools.roundBrushTool(BrushDefs.SAND, ToolDefs.DEFAULT_SIZE, new ToolInfo({
        codeName: 'sand',
        displayName: 'Sand',
        category: ToolDefs.CATEGORY_POWDER,
        badgeStyle: {
            backgroundColor: '#b7a643',
        }
    }));

    static SOIL = Tools.roundBrushTool(BrushDefs.SOIL, ToolDefs.DEFAULT_SIZE, new ToolInfo({
        codeName: 'soil',
        displayName: 'Soil',
        category: ToolDefs.CATEGORY_POWDER,
        badgeStyle: {
            backgroundColor: '#8e6848',
        }
    }));

    static GRAVEL = Tools.roundBrushTool(BrushDefs.GRAVEL, ToolDefs.DEFAULT_SIZE, new ToolInfo({
        codeName: 'gravel',
        displayName: 'Gravel',
        category: ToolDefs.CATEGORY_POWDER,
        badgeStyle: {
            backgroundColor: '#656565',
        }
    }));

    static COAL = Tools.roundBrushTool(BrushDefs.COAL, ToolDefs.DEFAULT_SIZE, new ToolInfo({
        codeName: 'coal',
        displayName: 'Coal',
        category: ToolDefs.CATEGORY_POWDER,
        badgeStyle: {
            backgroundColor: '#343434',
        }
    }));

    static THERMITE = Tools.roundBrushTool(BrushDefs.THERMITE, ToolDefs.DEFAULT_SIZE, new ToolInfo({
        codeName: 'thermite',
        displayName: 'Thermite',
        category: ToolDefs.CATEGORY_POWDER,
        badgeStyle: {
            backgroundColor: '#914e47',
        }
    }));

    static WALL = Tools.roundBrushTool(BrushDefs.WALL, ToolDefs.DEFAULT_SIZE, new ToolInfo({
        codeName: 'wall',
        displayName: 'Wall',
        category: ToolDefs.CATEGORY_SOLIDS,
        badgeStyle: {
            backgroundColor: '#383838',
        }
    }));

    static ROCK = Tools.roundBrushTool(BrushDefs.ROCK, ToolDefs.DEFAULT_SIZE, new ToolInfo({
        codeName: 'rock',
        displayName: 'Rock',
        category: ToolDefs.CATEGORY_SOLIDS,
        badgeStyle: {
            backgroundColor: '#383838',
        }
    }));

    static ROCK_TEMPLATES = Tools.templateSelectionTool([
        TemplateDefs.ROCK_SM,
        TemplateDefs.ROCK_MD,
        TemplateDefs.ROCK_LG
    ], new ToolInfo({
        codeName: 'rock_templates',
        displayName: 'Rock',
        category: ToolDefs.CATEGORY_SOLIDS,
        badgeStyle: {
            backgroundColor: '#383838',
        }
    }));

    static WOOD = Tools.roundBrushTool(BrushDefs.TREE_WOOD, ToolDefs.DEFAULT_SIZE, new ToolInfo({
        codeName: 'wood',
        displayName: 'Wood',
        category: ToolDefs.CATEGORY_SOLIDS,
        badgeStyle: {
            backgroundColor: '#573005',
        }
    }));

    static METAL = Tools.roundBrushToolForSolidBody(BrushDefs.METAL, ToolDefs.DEFAULT_SIZE, new ToolInfo({
        codeName: 'metal',
        displayName: 'Metal',
        category: ToolDefs.CATEGORY_SOLIDS,
        badgeStyle: {
            backgroundColor: '#7c7c7c',
        }
    }));

    static METAL_MOLTEN = Tools.roundBrushTool(BrushDefs.METAL_MOLTEN, ToolDefs.DEFAULT_SIZE, new ToolInfo({
        codeName: 'metal_molten',
        displayName: 'M. Metal',
        category: ToolDefs.CATEGORY_FLUIDS,
        badgeStyle: {
            backgroundColor: '#e67d00',
        }
    }));

    static WATER = Tools.roundBrushTool(BrushDefs.WATER, ToolDefs.DEFAULT_SIZE, new ToolInfo({
        codeName: 'water',
        displayName: 'Water',
        category: ToolDefs.CATEGORY_FLUIDS,
        badgeStyle: {
            backgroundColor: '#0487ba',
        }
    }));

    static OIL = Tools.roundBrushTool(BrushDefs.OIL, ToolDefs.DEFAULT_SIZE, new ToolInfo({
        codeName: 'oil',
        displayName: 'Oil',
        category: ToolDefs.CATEGORY_FLUIDS,
        badgeStyle: {
            backgroundColor: 'rgb(36,26,1)',
        }
    }));

    static FIRE = Tools.roundBrushTool(Brushes.temperatureOrBrush(50, BrushDefs.FIRE), ToolDefs.DEFAULT_SIZE, new ToolInfo({
        codeName: 'fire',
        displayName: 'Fire',
        category: ToolDefs.CATEGORY_EFFECTS,
        badgeStyle: {
            backgroundColor: '#ff5900',
        }
    }));

    static METEOR = Tools.meteorTool(BrushDefs.METEOR, BrushDefs.METEOR_FROM_LEFT, BrushDefs.METEOR_FROM_RIGHT, new ToolInfo({
        codeName: 'meteor',
        displayName: 'Meteor',
        category: ToolDefs.CATEGORY_EFFECTS,
        badgeStyle: {
            backgroundColor: '#ff5900',
        }
    }));

    static EFFECT_TEMP_MINUS = Tools.roundBrushTool(Brushes.concat(BrushDefs.EFFECT_TEMP_0, BrushDefs.EFFECT_EXTINGUISH),
            ToolDefs.DEFAULT_SIZE, new ToolInfo({

        codeName: 'effect_temp_minus',
        displayName: '°C −',
        category: ToolDefs.CATEGORY_EFFECTS,
        badgeStyle: {
            backgroundColor: '#63cffa',
        }
    }));

    static EFFECT_TEMP_PLUS = Tools.roundBrushTool(BrushDefs.EFFECT_TEMP_200, ToolDefs.DEFAULT_SIZE, new ToolInfo({
        codeName: 'effect_temp_plus',
        displayName: '°C +',
        category: ToolDefs.CATEGORY_EFFECTS,
        badgeStyle: {
            backgroundColor: '#fa9b4e',
        }
    }));

    static EFFECT_TEMP_PLUS2 = Tools.roundBrushTool(BrushDefs.EFFECT_TEMP_255, ToolDefs.DEFAULT_SIZE, new ToolInfo({
        codeName: 'effect_temp_plus2',
        displayName: '°C ⧺',
        category: ToolDefs.CATEGORY_EFFECTS,
        badgeStyle: {
            backgroundColor: '#fa9b4e',
        }
    }));

    /** @type Tool[] */
    static DEFAULT_TOOLS = [
        this.ERASE,
        this.MOVE,
        this.SAND,
        this.SOIL,
        this.GRAVEL,
        this.COAL,
        this.THERMITE,
        this.WALL,
        this.ROCK_TEMPLATES,
        this.METAL,
        this.WATER,
        this.OIL,
        this.METAL_MOLTEN,
        this.FIRE,
        this.METEOR,
        this.EFFECT_TEMP_MINUS,
        this.EFFECT_TEMP_PLUS,
        this.EFFECT_TEMP_PLUS2
    ];

    static BIRD = Tools.insertEntityTool(EntityFactories.birdFactory, new ToolInfo({
        codeName: 'bird',
        displayName: 'Bird',
        category: ToolDefs.CATEGORY_BIOLOGICAL,
    }));

    static BUTTERFLY = Tools.insertEntityTool(EntityFactories.butterflyFactory, new ToolInfo({
        codeName: 'butterfly',
        displayName: 'Butterfly',
        category: ToolDefs.CATEGORY_BIOLOGICAL,
    }));

    static FISH = Tools.insertEntityTool(EntityFactories.fishFactory, new ToolInfo({
        codeName: 'fish',
        displayName: 'Fish',
        category: ToolDefs.CATEGORY_BIOLOGICAL,
    }));

    /** @type Tool[] */
    static TEST_TOOLS = [
        Tools.pointBrushTool(BrushDefs.GRASS, new ToolInfo({
            codeName: 'grass',
            displayName: 'Grass',
            category: ToolDefs.CATEGORY_BIOLOGICAL,
        })),
        Tools.pointBrushTool(BrushDefs.TREE, new ToolInfo({
            codeName: 'tree',
            displayName: 'Tree',
            category: ToolDefs.CATEGORY_BIOLOGICAL,
        })),
        ToolDefs.BIRD,
        ToolDefs.BUTTERFLY,
        ToolDefs.FISH,
        Tools.actionTool((x, y, graphics) => {
            graphics.entities().assignWaypoint(x, y);
        }, new ToolInfo({
            codeName: 'entity_waypoint',
            displayName: 'Waypoint',
            category: ToolDefs.CATEGORY_BIOLOGICAL,
        })),
        Tools.roundBrushTool(BrushDefs.EFFECT_BURNT, ToolDefs.DEFAULT_SIZE, new ToolInfo({
            codeName: 'effect_burnt',
            displayName: 'Burnt',
            category: ToolDefs.CATEGORY_EFFECTS,
        })),
        Tools.roundBrushTool(BrushDefs.EFFECT_NOISE_SM, ToolDefs.DEFAULT_SIZE, new ToolInfo({
            codeName: 'effect_noise_sm',
            displayName: 'Noise SM',
            category: ToolDefs.CATEGORY_EFFECTS,
        })),
        Tools.roundBrushTool(BrushDefs.EFFECT_NOISE_MD, ToolDefs.DEFAULT_SIZE, new ToolInfo({
            codeName: 'effect_noise_md',
            displayName: 'Noise MD',
            category: ToolDefs.CATEGORY_EFFECTS,
        })),
        Tools.roundBrushTool(BrushDefs.EFFECT_NOISE_LG, ToolDefs.DEFAULT_SIZE, new ToolInfo({
            codeName: 'effect_noise_lg',
            displayName: 'Noise LG',
            category: ToolDefs.CATEGORY_EFFECTS,
        })),
        Tools.roundBrushTool(BrushDefs.EFFECT_TEMP_0, ToolDefs.DEFAULT_SIZE, new ToolInfo({
            codeName: 'effect_temp_0',
            displayName: 'Temp 0',
            category: ToolDefs.CATEGORY_EFFECTS,
        })),
        Tools.roundBrushTool(BrushDefs.EFFECT_TEMP_127, ToolDefs.DEFAULT_SIZE, new ToolInfo({
            codeName: 'effect_temp_127',
            displayName: 'Temp 127',
            category: ToolDefs.CATEGORY_EFFECTS,
        })),
        Tools.roundBrushTool(BrushDefs.EFFECT_TEMP_200, ToolDefs.DEFAULT_SIZE, new ToolInfo({
            codeName: 'effect_temp_200',
            displayName: 'Temp 200',
            category: ToolDefs.CATEGORY_EFFECTS,
        })),
        Tools.roundBrushTool(BrushDefs.EFFECT_TEMP_255, ToolDefs.DEFAULT_SIZE, new ToolInfo({
            codeName: 'effect_temp_255',
            displayName: 'Temp 255',
            category: ToolDefs.CATEGORY_EFFECTS,
        })),
        Tools.roundBrushTool(BrushDefs.ASH, ToolDefs.DEFAULT_SIZE, new ToolInfo({
            codeName: 'ash',
            displayName: 'Ash',
            category: ToolDefs.CATEGORY_POWDER,
        }))
    ];

    static _LIST = {};
    static {
        for (const tool of [ToolDefs.NONE, ...ToolDefs.DEFAULT_TOOLS, ...ToolDefs.TEST_TOOLS]) {
            ToolDefs._LIST[tool.getInfo().getCodeName()] = tool;
        }
    }

    static byCodeName(codeName) {
        const tool = ToolDefs._LIST[codeName];
        if (tool !== undefined) {
            return tool;
        }
        return null;
    }
}
