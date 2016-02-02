/// <reference path="../src/sprite.ts" />
/// <reference path="../src/textlabel.ts" />
/// <reference path="../src/bmfontlabel.ts" />

namespace canvas2d.Layout {

    var classMap: { [index: string]: Function } = {};

    export interface ILayoutNode {
        class: string | Function;
        attrs?: { [name: string]: any };
        id?: string;
        children?: ILayoutNode[];
    }

    /**
     * @param  node html tree
     */
    export function parseToLayoutTree(htmlNode: any) {
        let layoutNode: ILayoutNode = {
            'class': htmlNode.getAttribute('class') || htmlNode.tagName.toLowerCase(),
            'id': htmlNode.getAttribute('id'),
        };
        let attrsString = htmlNode.getAttribute('attrs');

        layoutNode.attrs = attrsString ? _parseString(attrsString) : null;
        layoutNode.children = Array.prototype.slice.call(htmlNode.children).map(child => parseToLayoutTree(child));

        return layoutNode;
    }

    /**
     * create sprite tree by layout tree
     */
    export function create(layoutTree: ILayoutNode, context?: any) {
        return _createSpirte(layoutTree, context);
    }
    
    /**
     * register tag name for class of sprite
     */
    export function registerTag(tagName: string, spriteClass: Function) {
        if (classMap[tagName]) {
            console.warn(`"${tagName}" was override to`, spriteClass);
        }
        classMap[tagName] = spriteClass;
    }

    function _createSpirte(layoutNode: ILayoutNode, context?: any) {
        let Class = _getClass(layoutNode.class);
        let sprite = new Class(layoutNode.attrs);

        if (layoutNode.id && context) {
            context[layoutNode.id] = sprite;
        }

        context = context || sprite;

        if (layoutNode.children) {
            layoutNode.children.forEach(childOptions => {
                sprite.addChild(_createSpirte(childOptions, context));
            });
        }

        return sprite;
    }

    function _getClass(classname: string | Function) {
        if (typeof classname === 'function') {
            return classname;
        }

        let namespace: string = <string>classname;

        if (classMap[namespace]) {
            return classMap[namespace];
        }

        let context: any = window;
        let path = namespace.split(/\W/);

        path.forEach(key => {
            if (context[key] == null) {
                throw new Error(namespace + ': class not found');
            }

            context = context[key];
        });

        if (typeof context !== 'function') {
            throw new Error(namespace + ': is not a class');
        }
        if (!(context instanceof Sprite)) {
            throw new Error(namespace + ': invalid sprite class');
        }

        classMap[namespace] = context;

        return context;
    }

    function _parseString(attrsValue: string) {
        try {
            var fn = new Function('return (' + attrsValue + ')');
        }
        catch (e) {
            console.error(`Could not parse attrs string "${attrsValue}"`, e);
        }
        return fn();
    }

    registerTag('sprite', Sprite);
    registerTag('text', TextLabel);
    registerTag('fontlabel', BMFontLabel);
}

