export abstract class BaseAction {

    immediate: boolean = false;
    done: boolean = false;

    abstract step(deltaTime: number, target: any);
    abstract reset();
    abstract reverse();
    abstract end(target: any);
    abstract destroy();
}