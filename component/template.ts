namespace canvas2d.Template {

    var classMap: { [name: string]: any } = {};
    var parser: DOMParser;

    export interface IRenderNode {
        sprite: any;
        attrs: { name: string; value: string; }[];
        children: IRenderNode[];
    }

    /**
     * Parse template string to XML node and create render node.
     */
    export function render(template: string) {
        if (!parser) {
            parser = new DOMParser;
        }

        let doc = parser.parseFromString(template, 'text/xml');
        let err = doc.documentElement.querySelector('parsererror');

        if (err != null) {
            console.error('Parsing failed:', err);
            return;
        }

        return _createRenderNode(doc.documentElement);
    }

    function _createRenderNode(node: HTMLElement) {
        let Class = _getClass(node.nodeName);
        let sprite = new Class();
        let attrs: { name: string; value: string; }[] = [];
        let children: IRenderNode[] = [];

        attrs.slice.call(node.attributes).forEach(attr => {
            attrs.push({ name: attr.name, value: attr.value });
        });

        if (node.childNodes.length) {
            attrs.slice.call(node.childNodes).forEach(child => {
                if (child.nodeType === 1) {
                    children.push(_createRenderNode(child));
                }
            });
        }

        return { sprite, attrs, children };
    }

    function _getClass(name: string) {
        let context: any = window;

        if (classMap[name] && typeof classMap[name] === 'function') {
            return classMap[name];
        }

        let path = name.split(/\W/);

        path.forEach(key => {
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
}