/// <reference path="sprite" />
/// <reference path="textlabel" />

namespace canvas2d.Layout {

    var classMap: { [index: string]: Function } = {};

    export interface ILayoutNode {
        class: string | Function;
        attrs?: { [name: string]: any };
        id?: string;
        children?: ILayoutNode[];
    }

    /**
     * 解析节点生成layoutTree
     * @param  node 自定义的html标签
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
     * 根据layoutNode树创建sprite树
     */
    export function createByLayoutTree(layoutTree: ILayoutNode) {
        return _createSpirte(layoutTree);
    }
    
    /**
     * 注册标签名
     */
    export function registerTag(tagName: string, spriteClass: Function) {
        if (classMap[tagName]) {
            console.warn(`"${tagName}" was override to`, spriteClass);
        }
        classMap[tagName] = spriteClass;
    }

    function _createSpirte(layoutNode: ILayoutNode, rootNode?: ILayoutNode) {
        let Class = _getClass(layoutNode.class);
        let sprite = new Class(layoutNode.attrs);

        if (layoutNode.id && rootNode) {
            rootNode[layoutNode.id] = sprite;
        }

        rootNode = rootNode || sprite;

        if (layoutNode.children) {
            layoutNode.children.forEach(childOptions => {
                sprite.addChild(_createSpirte(childOptions, rootNode));
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
            console.error(`Could not parse attrs string "${attrsValue}"`);
            throw e;
        }
        return fn();
    }

    registerTag('c2d:sprite', Sprite);
    registerTag('c2d:textlabel', TextLabel);
}

