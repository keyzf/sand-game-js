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

    const MODE_CONFIG_DEFINITION = 'config-definition';
    const MODE_SCENARIO_BUILDER_UMD = 'scenario-builder-umd';
    const MODE_SCENARIO_UMD = 'scenario-umd';

    /** @type {Controller|null} */
    let controller = null;

    /**
     *
     * @author Patrik Harag
     * @version 2024-04-18
     */
    function init(root, externalConfig) {
        const scenarioIDERoot = document.createElement('div');
        scenarioIDERoot.classList.add('scenario-ide');

        // control panel

        const controlPanel = document.createElement('div');
        controlPanel.classList.add('control-panel');
        scenarioIDERoot.appendChild(controlPanel);

        // -- combobox

        const comboBox = document.createElement("select");
        comboBox.className = "form-select";
        comboBox.id = "comboBox";

        const option1 = document.createElement("option");
        option1.value = MODE_CONFIG_DEFINITION;
        option1.textContent = "Config definition";
        comboBox.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = MODE_SCENARIO_BUILDER_UMD;
        option2.textContent = "SandSagaScenarioBuilder UMD";
        comboBox.appendChild(option2);

        const option3 = document.createElement("option");
        option3.value = MODE_SCENARIO_UMD;
        option3.textContent = "SandSaga UMD";
        comboBox.appendChild(option3);

        controlPanel.appendChild(comboBox);

        // -- code area

        const codeMirror = CodeMirror(controlPanel, {
            lineNumbers: true,
            tabSize: 4,
            value: '',
            mode: 'javascript'
        });
        setTimeout(function() {
            const savedCode = localstorageGetCode();
            let initialCode = INITIAL;
            if (localstorageIsAutosaveEnabled() && savedCode !== null) {
                initialCode = savedCode;
            }
            codeMirror.getDoc().setValue(initialCode);
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

        // -- debug checkbox

        const formCheckDebug = document.createElement("div");
        formCheckDebug.className = "form-check form-check-inline";

        const debugCheckbox = document.createElement("input");
        debugCheckbox.type = "checkbox";
        debugCheckbox.className = "form-check-input";
        debugCheckbox.id = "palette-designer-check-debug";

        const debugLabel = document.createElement("label");
        debugLabel.className = "form-check-label";
        debugLabel.htmlFor = "palette-designer-check-debug";
        debugLabel.textContent = "Set 'debug: true'";

        formCheckDebug.appendChild(debugCheckbox);
        formCheckDebug.appendChild(debugLabel);

        controlPanel.appendChild(formCheckDebug);

        // -- save

        if (window.localStorage !== undefined) {
            const formCheckSave = document.createElement("div");
            formCheckSave.className = "form-check form-check-inline";

            const saveCheckbox = document.createElement("input");
            saveCheckbox.type = "checkbox";
            saveCheckbox.className = "form-check-input";
            saveCheckbox.id = "palette-designer-check-save";
            saveCheckbox.checked = localstorageIsAutosaveEnabled();
            saveCheckbox.addEventListener('change', (event) => {
                localstorageSetAutosave(saveCheckbox.checked);
                if (saveCheckbox.checked === false) {
                    localstorageSetCode(null);
                } else if (saveCheckbox.checked === true) {
                    localstorageSetCode(codeMirror.getDoc().getValue());
                }
            });

            const saveLabel = document.createElement("label");
            saveLabel.className = "form-check-label";
            saveLabel.htmlFor = "palette-designer-check-save";
            saveLabel.textContent = "Autosave";

            formCheckSave.appendChild(saveCheckbox);
            formCheckSave.appendChild(saveLabel);

            controlPanel.appendChild(formCheckSave);
        }

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
            const mode = comboBox.value;

            if (localstorageIsAutosaveEnabled()) {
                localstorageSetCode(code);
            }

            _evaluate(sandGameWrapper, sandGameOutput, mode, code, externalConfig, debug);
        };
    }

    function _clean(sandGameWrapper, sandGameOutput) {
        if (controller !== null) {
            controller.close();
        }
        sandGameWrapper.innerHTML = '';
        sandGameOutput.innerHTML = '';
    }

    function _evaluate(sandGameWrapper, sandGameOutput, mode, code, externalConfig, debug) {
        _clean(sandGameWrapper, sandGameOutput);

        function enhanceConfig(config) {
            config.version = externalConfig.sgjs.version;
            config.debug = debug;
            config.disableGlobalShortcuts = true;
        }

        try {
            if (mode === MODE_CONFIG_DEFINITION) {

                const config = eval("(function(){" + code + "})();");

                if (typeof config !== "object") {
                    throw 'Unexpected result type: ' + typeof config;
                }

                enhanceConfig(config);
                _showSandGame(window.SandGameJS, sandGameWrapper, sandGameOutput, config);

            } else if (mode === MODE_SCENARIO_BUILDER_UMD) {
                eval(code);

                if (window.SandSagaScenarioBuilder === undefined) {
                    throw 'SandSagaScenarioBuilder not found';
                }
                if (window.SandSagaScenarioBuilder.createConfig === undefined) {
                    throw 'SandSagaScenarioBuilder.createConfig() not found';
                }

                const config = window.SandSagaScenarioBuilder.createConfig();

                if (typeof config !== "object") {
                    throw 'Unexpected result type: ' + typeof config;
                }

                enhanceConfig(config);
                _showSandGame(window.SandGameJS, sandGameWrapper, sandGameOutput, config);

            } else if (mode === MODE_SCENARIO_UMD) {
                eval(code);

                if (window.SandSaga === undefined) {
                    throw 'SandSaga not found';
                }
                if (window.SandSaga.init === undefined) {
                    throw 'SandSaga.init() not found';
                }

                const config = {};
                enhanceConfig(config);
                _showSandGame(window.SandSaga, sandGameWrapper, sandGameOutput, config);

            } else {
                throw 'Mode not supported: ' + mode;
            }

        } catch (error) {
            // Display any errors that occurred during evaluation
            sandGameOutput.innerText = "Error: " + error;
            console.error(error);
        } finally {
            sandGameOutput.scrollIntoView(false);
        }
    }

    function _showSandGame(runner, sandGameWrapper, sandGameOutput, config) {
        const sandGameRoot = document.createElement('div');
        sandGameWrapper.appendChild(sandGameRoot);

        const SandGameJS = window.SandGameJS;
        if (SandGameJS !== undefined) {
            try {
                controller = runner.init(sandGameRoot, config);
            } catch (e) {
                sandGameOutput.innerText = "Error: " + e;
                console.error(e);
            }
        } else {
            sandGameRoot.innerHTML = '<p style="color: red; font-weight: bold;">Failed to load the SandGameJS.</p>';
        }
    }

    function localstorageIsAutosaveEnabled() {
        if (window.localStorage !== undefined) {
            return localStorage.getItem('scenario-ide_enable-autosave') === 'true';
        }
        return null;
    }

    function localstorageSetAutosave(autosave) {
        if (window.localStorage !== undefined) {
            localStorage.setItem('scenario-ide_enable-autosave', '' + autosave);
        }
    }

    function localstorageSetCode(code) {
        if (window.localStorage !== undefined) {
            if (code === null) {
                localStorage.removeItem('scenario-ide_code');
            } else {
                localStorage.setItem('scenario-ide_code', code);
            }
        }
    }

    function localstorageGetCode() {
        if (window.localStorage !== undefined) {
            return localStorage.getItem('scenario-ide_code');
        }
    }

    exports.init = init;
    Object.defineProperty(exports, '__esModule', { value: true });
}));