export declare abstract class BaseAction {
    immediate: boolean;
    done: boolean;
    abstract step(deltaTime: number, target: any): any;
    abstract reset(): any;
    abstract reverse(): any;
    abstract end(target: any): any;
    abstract destroy(): any;
}
