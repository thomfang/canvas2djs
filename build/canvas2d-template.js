var canvas2d;
(function (canvas2d) {
    var Template;
    (function (Template) {
        var classMap = {};
        var parser;
        /**
         * Parse template string to XML node and create render node.
         */
        function render(template) {
            if (!parser) {
                parser = new DOMParser;
            }
            var doc = parser.parseFromString(template, 'text/xml');
            var err = doc.documentElement.querySelector('parsererror');
            if (err != null) {
                console.error('Parsing failed:', err);
                return;
            }
            return _createRenderNode(doc.documentElement);
        }
        Template.render = render;
        function _createRenderNode(node) {
            var Class = _getClass(node.nodeName);
            var sprite = new Class();
            var attrs = [];
            var children = [];
            attrs.slice.call(node.attributes).forEach(function (attr) {
                attrs.push({ name: attr.name, value: attr.value });
            });
            if (node.childNodes.length) {
                attrs.slice.call(node.childNodes).forEach(function (child) {
                    if (child.nodeType === 1) {
                        children.push(_createRenderNode(child));
                    }
                });
            }
            return { sprite: sprite, attrs: attrs, children: children };
        }
        function _getClass(name) {
            var context = window;
            if (classMap[name] && typeof classMap[name] === 'function') {
                return classMap[name];
            }
            var path = name.split(/\W/);
            path.forEach(function (key) {
                if (context[key] == null) {
                    throw new Error(name + ': class not found');
                }
                context = context[key];
            });
            if (typeof context !== 'function') {
                throw new Error(name + ': is not a class');
            }
            classMap[name] = context;
            return context;
        }
    })(Template = canvas2d.Template || (canvas2d.Template = {}));
})(canvas2d || (canvas2d = {}));
//# sourceMappingURL=canvas2d-template.js.map