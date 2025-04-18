import { _decorator, Component, Node } from 'cc';
import { AnimationBase, AnimationType } from './AnimationBase';
import { NodeHelper } from '../../../../../script/modules/Utils/NodeExtend/NodeHelper';
import { ItemBase } from '../Item/ItemBase';
const { ccclass, property } = _decorator;

@ccclass('SwitchSpine')
export class SwitchSpine extends AnimationBase {
    async next(): Promise<void> {
        if (this.isComplete()) return;
        this.animationType = AnimationType.SwicthSpine;
        this.curIndex++;
        const showName = this.animationQueue[this.curIndex];
        const item = this.node.getComponent(ItemBase)!;
        item.getSpineAnimUtil?.setAnimByName(showName);
    }

    isComplete(): boolean {
        let complete = (this.curIndex + 1) >= this.animationQueue.length;
        // console.log(`[zc] SwitchNode, complete:${complete},  curIndex:${this.curIndex}, animationQueue.length:${this.animationQueue.length}`);
        return complete;
    }
}