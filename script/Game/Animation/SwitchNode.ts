import { _decorator, Component, Node } from 'cc';
import { AnimationBase, AnimationType } from './AnimationBase';
import { NodeHelper } from '../../../../../script/modules/Utils/NodeExtend/NodeHelper';
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/Game/Animation/SwitchNode')
export class SwitchNode extends AnimationBase
{
    async next(): Promise<void> {
        if (this.isComplete()) return;
        this.animationType = AnimationType.SwitchNode;
        this.curIndex++;
        const showNodeName = this.animationQueue[this.curIndex];
        NodeHelper.showChildeNode(this.node, [showNodeName]);
    }

    isComplete(): boolean {
        let complete = (this.curIndex + 1) >= this.animationQueue.length;
        // console.log(`[zc] SwitchNode, complete:${complete},  curIndex:${this.curIndex}, animationQueue.length:${this.animationQueue.length}`);
        return complete;
    }
}