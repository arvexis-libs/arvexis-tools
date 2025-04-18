import { _decorator, Component, Node } from 'cc';
import { AnimationBase, AnimationType } from './AnimationBase';
import { NodeHelper } from '../../../../../script/modules/Utils/NodeExtend/NodeHelper';
const { ccclass, property } = _decorator;

@ccclass('SwitchSpine')
export class SwitchSpine extends AnimationBase {
    async next(): Promise<void> {
        if (this.isComplete()) return;
        this.animationType = AnimationType.SwicthSpine;
        this.curIndex++;
        const showName = this.animationQueue[this.curIndex];
        
    }

    isComplete(): boolean {
        let complete = (this.curIndex + 1) >= this.animationQueue.length;
        // console.log(`[zc] SwitchNode, complete:${complete},  curIndex:${this.curIndex}, animationQueue.length:${this.animationQueue.length}`);
        return complete;
    }
}