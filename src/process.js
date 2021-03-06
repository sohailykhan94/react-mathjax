"use strict";

var pendingScripts = [];
var pendingCallbacks = [];
var needsProcess = false;

/**
 * Process math in a script node using MathJax
 * @param {MathJax}  MathJax
 * @param {DOMNode}  script
 * @param {Function} callback
 */
function process(MathJax, script, callback) {
    pendingScripts.push(script);
    pendingCallbacks.push(callback);
    if (!needsProcess) {
        needsProcess = true;
        setTimeout(function () {
            return doProcess(MathJax);
        }, 0);
    }
}

function doProcess(MathJax) {
    MathJax.Hub.Queue(function () {
        var oldElementScripts = MathJax.Hub.elementScripts;
        MathJax.Hub.elementScripts = function (element) {
            return pendingScripts;
        };

        try {
            return MathJax.Hub.Process(null, function () {
                // Trigger all of the pending callbacks before clearing them
                // out.
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = pendingCallbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var callback = _step.value;

                        callback();
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                pendingScripts = [];
                pendingCallbacks = [];
                needsProcess = false;
            });
        } catch (e) {
            // IE8 requires `catch` in order to use `finally`
            throw e;
        } finally {
            MathJax.Hub.elementScripts = oldElementScripts;
        }
    });
}

module.exports = process;
