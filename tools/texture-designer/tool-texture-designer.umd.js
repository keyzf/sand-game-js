/* Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.SandGameJS_TextureDesigner = {}));
})(this, (function (exports) { 'use strict';

    var sandGame;
    var Brushes;
    var BrushDefs;

    const INITIAL =
`return Brushes.join([
    Brushes.color(155, 155, 155, BrushDefs.WALL),
    Brushes.colorNoise([
        { seed: 40, factor: 40, threshold: 0.4, force: 0.75 },
        { seed: 40, factor: 20, threshold: 0.5, force: 0.4 },
        { seed: 40, factor: 10, threshold: 0.4, force: 0.2 },
        { seed: 40, factor: 5, threshold: 0.4, force: 0.1 },
    ], 135, 135, 135),
    Brushes.colorNoise([
        { seed: 41, factor: 10, threshold: 0.4, force: 0.4 },
        { seed: 41, factor: 6, threshold: 0.3, force: 0.3 },
        { seed: 41, factor: 4, threshold: 0.5, force: 0.3 },
    ], 130, 130, 130)
]);
`;

    /**
     *
     * @author Patrik Harag
     * @version 2024-04-13
     */
    function init(root, externalConfig) {
        const sandGameRoot = document.createElement("div");
        sandGameRoot.className = "sand-game-root";
        root.appendChild(sandGameRoot);

        const controls = document.createElement("div");
        controls.className = "controls";
        root.appendChild(controls);

        const codeMirror = CodeMirror(controls, {
            lineNumbers: true,
            tabSize: 4,
            value: '',
            mode: 'javascript'
        });
        setTimeout(function() {
            codeMirror.getDoc().setValue(INITIAL);
            evaluate();
        }, 0);

        const evaluateButton = document.createElement("button");
        evaluateButton.className = "btn btn-primary";
        evaluateButton.textContent = "Evaluate";
        controls.appendChild(evaluateButton);

        const resultPre = document.createElement("pre");
        const resultDiv = document.createElement("div");
        resultDiv.className = 'result';
        resultDiv.appendChild(resultPre);
        controls.appendChild(resultDiv);

        function evaluate() {
            evaluateCode(codeMirror, resultPre)
        }

        evaluateButton.onclick = evaluate;

        // init drag and drop
        root.ondrop = function(e) {
            e.preventDefault();

            let reader = new FileReader();
            let file = e.dataTransfer.files[0];
            reader.onload = function(event) {
                codeMirror.getDoc().setValue(event.target.result);
                evaluate();
            };
            reader.readAsText(file);

            return false;
        };

        const SandGameJS = window.SandGameJS;

        if (SandGameJS !== undefined) {

            const config = {
                version: externalConfig.sgjs.version,
                debug: false,
                scene: {
                    init: (s) => {
                        sandGame = s;
                    }
                },
                autoStart: false,
                tools: [],
                primaryTool: SandGameJS.ToolDefs.NONE,
                secondaryTool: SandGameJS.ToolDefs.NONE,
                tertiaryTool: SandGameJS.ToolDefs.NONE,
                disableImport: true,
                disableExport: true,
                disableSceneSelection: true,
                disableStartStop: true,
                disableRestart: true
            };

            const controller = SandGameJS.init(sandGameRoot, config);
            controller.addOnInitialized(s => {
                // handle size change etc.
                sandGame = s;
            });

            Brushes = SandGameJS.Brushes;
            BrushDefs = SandGameJS.BrushDefs;

        } else {
            sandGameRoot.innerHTML = '<p style="color: red; font-weight: bold;">Failed to load the game.</p>';
        }
    }

    function evaluateCode(codeMirror, resultPre) {
        const code = codeMirror.getDoc().getValue();

        try {
            const result = eval("(function(){" + code + "})();");

            if (typeof result === "object") {
                sandGame.graphics().fill(result);
            } else {
                throw 'Wrong result: ' + typeof result;
            }

        } catch (error) {
            // Display any errors that occurred during evaluation
            resultPre.innerText = "Error: " + error;
        }
    }

    exports.init = init;
    Object.defineProperty(exports, '__esModule', { value: true });
}));