import { DomBuilder } from "./DomBuilder";
import { Action } from "./Action";
import { ComponentViewTemplateSelection } from "./ComponentViewTemplateSelection";

/**
 *
 * @author Patrik Harag
 * @version 2023-08-19
 */
export class ActionDialogTemplateSelection extends Action {

    performAction(sandGameControls) {
        let templatesComponent = new ComponentViewTemplateSelection();

        let dialog = new DomBuilder.BootstrapDialog();
        dialog.setHeaderContent('Templates');
        dialog.setBodyContent(DomBuilder.div({ class: 'sand-game-component' }, [
            DomBuilder.par(null, "Select a template"),
            templatesComponent.createNode(sandGameControls),
            DomBuilder.par(null, ""),
            DomBuilder.par(null, "You can also create your own template using an image. See the Import button.")
        ]));
        dialog.addCloseButton('Close');
        dialog.show(sandGameControls.getDialogAnchor());
    }
}