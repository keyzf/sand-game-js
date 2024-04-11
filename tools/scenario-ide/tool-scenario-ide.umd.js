/* Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.SandGameJS_ScenarioIDE = {}));
})(this, (function (exports) { 'use strict';

    const INITIAL = 
`const BrushDefs = window.SandGameJS.BrushDefs;
const Brushes = window.SandGameJS.Brushes;
const ToolDefs = window.SandGameJS.ToolDefs;
const Tools = window.SandGameJS.Tools;
const Scenes = window.SandGameJS.Scenes;

const mySandBrush = Brushes.colorRandomize(10, Brushes.color(229, 112, 24, BrushDefs.SAND));
const mySandTool = Tools.roundBrushTool(mySandBrush, ToolDefs.DEFAULT_SIZE, ToolDefs.SAND.getInfo().derive({
    badgeStyle: {
        backgroundColor: 'rgb(229, 112, 24)',
    }
}));

function buildScene(sandGame) {
    sandGame.graphics().drawRectangle(100, 100, 200, 120, mySandBrush);
}

return {
    scene: {
        init: buildScene
    },
    tools: [
        ToolDefs.ERASE,
        ToolDefs.MOVE,
        mySandTool,
        ToolDefs.SOIL,
        ToolDefs.GRAVEL,
        ToolDefs.WALL,
    ],
    disableSizeChange: true,
    disableSceneSelection: true
}
`;

    /**
     *
     * @author Patrik Harag
     * @version 2024-04-11
     */
    function init(root, externalConfig) {
        const scenarioIDERoot = document.createElement('div');
        scenarioIDERoot.classList.add('scenario-ide');

        // control panel

        const controlPanel = document.createElement('div');
        controlPanel.classList.add('control-panel');
        scenarioIDERoot.appendChild(controlPanel);

        // -- code area

        const codeMirror = CodeMirror(controlPanel, {
            lineNumbers: true,
            tabSize: 4,
            value: '',
            mode: 'javascript'
        });
        setTimeout(function() {
            codeMirror.getDoc().setValue(INITIAL);
        }, 0);
        
        controlPanel.ondrop = function(e) {
            e.preventDefault();

            let reader = new FileReader();
            let file = e.dataTransfer.files[0];

            reader.onload = function(event) {
                codeMirror.getDoc().setValue(event.target.result);
            };
            reader.readAsText(file);

            return false;
        };

        // -- button

        const button = document.createElement('button');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Refresh';
        controlPanel.appendChild(button);

        // -- checkbox

        const formCheck = document.createElement("div");
        formCheck.className = "form-check form-check-inline";

        const debugCheckbox = document.createElement("input");
        debugCheckbox.type = "checkbox";
        debugCheckbox.className = "form-check-input";
        debugCheckbox.id = "palette-designer-check";

        const label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = "palette-designer-check";
        label.textContent = "debug: true";

        formCheck.appendChild(debugCheckbox);
        formCheck.appendChild(label);

        controlPanel.appendChild(formCheck);

        // result panel

        const resultPanel = document.createElement('div');
        resultPanel.classList.add('result-panel');

        const sandGameWrapper = document.createElement('div');
        sandGameWrapper.classList.add('sand-game-wrapper');
        resultPanel.appendChild(sandGameWrapper);

        const sandGameOutput = document.createElement('div');
        sandGameOutput.classList.add('sand-game-output');
        resultPanel.appendChild(sandGameOutput);

        scenarioIDERoot.appendChild(resultPanel);

        //

        root.appendChild(scenarioIDERoot);

        //

        button.onclick = function() {
            const debug = debugCheckbox.checked;
            const code = codeMirror.getDoc().getValue();
            _evaluate(sandGameWrapper, sandGameOutput, code, externalConfig, debug);
        };
    }

    function _clean(sandGameWrapper, sandGameOutput) {
        sandGameWrapper.innerHTML = '';
        sandGameOutput.innerHTML = '';
    }

    function _evaluate(sandGameWrapper, sandGameOutput, code, externalConfig, debug) {
        _clean(sandGameWrapper, sandGameOutput);

        try {
            const config = eval("(function(){" + code + "})();");

            if (typeof config !== "object") {
                throw 'Unexpected result type: ' + typeof config;
            }

            config.version = externalConfig.sgjs.version;
            config.debug = debug;

            _showSandGame(sandGameWrapper, sandGameOutput, config);
            
        } catch (error) {
            // Display any errors that occurred during evaluation
            sandGameOutput.innerText = "Error: " + error.message;
            console.error(error);
        }
    }

    function _showSandGame(sandGameWrapper, sandGameOutput, config) {
        const sandGameRoot = document.createElement('div');
        sandGameWrapper.appendChild(sandGameRoot);

        const SandGameJS = window.SandGameJS;
        if (SandGameJS !== undefined) {
            try {
                SandGameJS.init(sandGameRoot, config);
            } catch (e) {
                sandGameOutput.innerText = "Error: " + e.message;
                console.error(e);
            }
        } else {
            sandGameRoot.innerHTML = '<p style="color: red; font-weight: bold;">Failed to load the SandGameJS.</p>';
        }
    }

    exports.init = init;
    Object.defineProperty(exports, '__esModule', { value: true });
}));