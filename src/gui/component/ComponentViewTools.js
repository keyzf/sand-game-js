// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import DomBuilder from "../DomBuilder";
import Component from "./Component";
import ActionDialogTemplateSelection from "../action/ActionDialogTemplateSelection";
import ToolDefs from "../../def/ToolDefs";
import TemplateSelectionFakeTool from "../../core/tool/TemplateSelectionFakeTool";
import GlobalActionTool from "../../core/tool/GlobalActionTool";
import SelectionFakeTool from "../../core/tool/SelectionFakeTool";

/**
 *
 * @author Patrik Harag
 * @version 2024-05-07
 */
export default class ComponentViewTools extends Component {

    /** @type Tool[] */
    #tools;
    /** @type boolean */
    #importEnabled;

    /**
     * @param tools {Tool[]}
     * @param importEnabled {boolean}
     */
    constructor(tools, importEnabled = false) {
        super();
        this.#tools = tools;
        this.#importEnabled = importEnabled;
    }

    createNode(controller) {
        let buttons = [];

        const initButton = (button, tool) => {
            button.addEventListener('click', () => {
                this.#selectTool(tool, controller);
            });

            controller.getToolManager().addOnPrimaryToolChanged(newTool => {
                if (newTool === tool) {
                    button.classList.add('selected');
                } else {
                    button.classList.remove('selected');
                }
            });

            // initial select
            if (tool === controller.getToolManager().getPrimaryTool()) {
                button.classList.add('selected');
            }

            controller.getToolManager().addOnInputDisabledChanged(disabled => {
                button.disabled = disabled;
            });
        }

        for (let tool of this.#tools) {
            let codeName = tool.getInfo().getCodeName();
            let displayName = tool.getInfo().getDisplayName();
            let badgeStyle = tool.getInfo().getBadgeStyle();

            if (tool instanceof SelectionFakeTool) {

                const ulContent = [];
                for (const innerTool of tool.getTools()) {
                    let innerCodeName = innerTool.getInfo().getCodeName();
                    let innerDisplayName = innerTool.getInfo().getDisplayName();
                    let innerBadgeStyle = innerTool.getInfo().getBadgeStyle();

                    const innerLabel = DomBuilder.span(innerDisplayName, {
                        class: 'btn btn-secondary btn-sand-game-tool ' + codeName,
                        style: innerBadgeStyle,
                    })
                    const innerToolAttributes = {
                        class: 'dropdown-item',
                    };
                    const innerButton = DomBuilder.button(innerLabel, innerToolAttributes);
                    initButton(innerButton, innerTool);
                    ulContent.push(DomBuilder.element('li', null, innerButton));
                }

                const button = DomBuilder.div({ class: 'dropdown' }, [
                    DomBuilder.button(displayName, {
                        class: 'btn btn-secondary btn-sand-game-tool dropdown-toggle ' + codeName,
                        style: badgeStyle,
                        'data-bs-toggle': 'dropdown',
                        'aria-expanded': 'false'
                    }),
                    DomBuilder.element('ul', {
                        class: 'dropdown-menu'
                    }, ulContent)
                ]);

                buttons.push(button);

            } else {
                const attributes = {
                    class: 'btn btn-secondary btn-sand-game-tool ' + codeName,
                    style: badgeStyle
                };
                const button = DomBuilder.button(displayName, attributes);
                initButton(button, tool);
                buttons.push(button);
            }
        }

        return DomBuilder.div({ class: 'sand-game-tools' }, buttons);
    }

    #selectTool(tool, controller) {
        if (tool instanceof TemplateSelectionFakeTool) {
            let additionalInfo = null;
            if (this.#importEnabled) {
                additionalInfo = DomBuilder.div(null, [
                    DomBuilder.par(null, ""),
                    DomBuilder.par(null, "You can also create your own template using an image. See the Import button.")
                ]);
            }
            const action = new ActionDialogTemplateSelection(tool.getTemplateDefinitions(), additionalInfo);
            action.performAction(controller);
        } else if (tool instanceof GlobalActionTool) {
            const handler = tool.getHandler();
            const sandGame = controller.getSandGame();
            if (sandGame !== null) {
                handler(sandGame);
            }
        } else {
            controller.getToolManager().setPrimaryTool(tool);
            controller.getToolManager().setSecondaryTool(ToolDefs.ERASE);
        }
    }
}
