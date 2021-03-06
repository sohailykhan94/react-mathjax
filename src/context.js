'use strict';

/* global MathJax */
var React = require('react');
var loadScript = require('load-script');

var DEFAULT_SCRIPT = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML';

var DEFAULT_OPTIONS = {
    tex2jax: {
        inlineMath: []
    },
    showMathMenu: false,
    showMathMenuMSIE: false,
		CommonHTML: {
	    scale: 105
	  }
};

/**
 * Context for loading mathjax
 * @type {[type]}
 */
var MathJaxContext = React.createClass({
    displayName: 'MathJaxContext',

    propTypes: {
        children: React.PropTypes.node.isRequired,
        script: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.oneOf([false])]),
        options: React.PropTypes.object
    },

    childContextTypes: {
        MathJax: React.PropTypes.object
    },

    getDefaultProps: function getDefaultProps() {
        return {
            script: DEFAULT_SCRIPT,
            options: DEFAULT_OPTIONS
        };
    },
    getInitialState: function getInitialState() {
        return {
            loaded: false
        };
    },
    getChildContext: function getChildContext() {
        return {
            MathJax: typeof MathJax == 'undefined' ? undefined : MathJax
        };
    },
    componentDidMount: function componentDidMount() {
        var script = this.props.script;


        if (!script) {
            return this.onLoad();
        }

        loadScript(script, this.onLoad);
    },
    onLoad: function onLoad(err) {
        var options = this.props.options;

        MathJax.Hub.Config(options);

        this.setState({
            loaded: true
        });
    },
    render: function render() {
        var children = this.props.children;

        return React.Children.only(children);
    }
});

module.exports = MathJaxContext;
