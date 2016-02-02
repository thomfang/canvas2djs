namespace canvas2d {
    
    var classMap: { [name: string]: any } = {};
    var parser: DOMParser;
    
    interface IRenderNode {
        sprite: any;
        attrs: { name: string; value: string; }[];
        children: IRenderNode[];
    }
    
    export class Template {
        
        render(template: string) {
            if (!parser) {
                parser = new DOMParser;
            }
            
            let doc = parser.parseFromString(template, 'text/xml');
            let err = doc.documentElement.querySelector('parsererror');
            
            if (err != null) {
                return console.error('Parsing failed:', err);
            }
            
            
        }
        
        private _createRenderNode(node: HTMLElement) {
            let Class = this._getClass(node.nodeName);
            let sprite = new Class();
            let attrs: { name: string; value: string; }[] = [];
            let children: IRenderNode[] = [];
            
            attrs.slice.call(node.attributes).forEach(attr => {
                attrs.push({ name: attr.name, value: attr.value });
            });
            
            if (node.childNodes.length) {
                attrs.slice.call(node.childNodes).forEach(child => {
                    if (child.nodeType === 1) {
                        children.push(this._createRenderNode(child));
                    }
                });
            }
            
            return { sprite, attrs, children };
        }
        
        private _getClass(name: string) {
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
}