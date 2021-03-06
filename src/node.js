'use strict';

var React = require('react');
var process = require('./process');

/**
 * React component to render maths using mathjax
 * @type {ReactClass}
 */
var MathJaxNode = React.createClass({
    displayName: 'MathJaxNode',

    propTypes: {
        inline: React.PropTypes.bool,
        children: React.PropTypes.node.isRequired,
        onRender: React.PropTypes.func
    },

    contextTypes: {
        MathJax: React.PropTypes.object
    },

    getDefaultProps: function getDefaultProps() {
        return {
            inline: false,
            onRender: function onRender() {}
        };
    },


    /**
     * Render the math once the node is mounted
     */
    componentDidMount: function componentDidMount() {
        this.typeset(true);
    },


    /**
     * Update the jax, force update if the display mode changed
     */
    componentDidUpdate: function componentDidUpdate(prevProps) {
        var forceUpdate = prevProps.inline != this.props.inline;
        this.typeset(true);
    },


    /**
     * Prevent update when the tex has not changed
     */
    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.children != this.props.children || nextProps.inline != this.props.inline || nextContext.MathJax != this.context.MathJax;
    },


    /**
     * Clear the math when unmounting the node
     */
    componentWillUnmount: function componentWillUnmount() {
        this.clear();
    },


    /**
     * Clear the jax
     */
    clear: function clear() {
        var MathJax = this.context.MathJax;


        if (!this.script || !MathJax) {
            return;
        }

        var jax = MathJax.Hub.getJaxFor(this.script);
        if (jax) {
            jax.Remove();
        }
    },


    /**
     * Update math in the node.
     * @param {Boolean} forceUpdate
     */
    typeset: function typeset(forceUpdate) {
        var _this = this;

        var MathJax = this.context.MathJax;
        var _props = this.props,
            children = _props.children,
            onRender = _props.onRender;


        if (!MathJax) {
            return;
        }

        var text = children;

        if (forceUpdate) {
            this.clear();
        }

        if (!forceUpdate && this.script) {
            MathJax.Hub.Queue(function () {
                var jax = MathJax.Hub.getJaxFor(_this.script);
                if (jax) {
									jax.Text(text, onRender)
								} else {
                    var script = _this.setScriptText(text);
                    process(MathJax, script, onRender);
                }
            });
        } else {
            var script = this.setScriptText(text);
            process(MathJax, script, onRender);
        }
    },


    /**
     * Create a script
     * @param  {String} text
     * @return {DOMNode} script
     */
    setScriptText: function setScriptText(text) {
        var inline = this.props.inline;


        if (!this.script) {
            this.script = document.createElement('script');
            this.script.type = 'math/tex; ' + (inline ? '' : 'mode=display');
            this.refs.node.appendChild(this.script);
        }

        if ('text' in this.script) {
            // IE8, etc
            this.script.text = text;
        } else {
            this.script.textContent = text;
        }

        return this.script;
    },
    render: function render() {
        return React.createElement('span', { ref: 'node' });
    }
});

module.exports = MathJaxNode;
