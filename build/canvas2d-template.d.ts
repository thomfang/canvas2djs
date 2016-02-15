declare namespace canvas2d.Template {
    interface IRenderNode {
        sprite: any;
        attrs: {
            name: string;
            value: string;
        }[];
        children: IRenderNode[];
    }
    /**
     * Parse template string to XML node and create render node.
     */
    function render(template: string): {
        sprite: any;
        attrs: {
            name: string;
            value: string;
        }[];
        children: IRenderNode[];
    };
}
