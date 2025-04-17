import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**  */
export enum AnimationType {
    None = 0,
    /*  */
    ShowCircle = 1,
    /*  */
    SwitchNode = 2,
    /* spine */
    SwicthSpineAnimation = 3
}

@ccclass('ZhaoCha/Game/Animation/AnimationBase')
export class AnimationBase extends Component {

    @property(String)
    animationQueue: string[] = [];

    animationType: AnimationType = AnimationType.None;

    @property({type: Number})
    curIndex: number = 0;

    async next(): Promise<void> {
        
    }

    isComplete(): boolean {
        return true;
    }
}