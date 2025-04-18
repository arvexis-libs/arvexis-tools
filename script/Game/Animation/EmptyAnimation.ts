import { _decorator, Component, Node } from 'cc';
import { AnimationBase, AnimationType } from './AnimationBase';
import { NodeHelper } from '../../../../../script/modules/Utils/NodeExtend/NodeHelper';
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/Game/Animation/EmptyAnimation')
export class EmptyAnimation extends AnimationBase
{
    async next(): Promise<void> {
        if (this.isComplete()) return;
        this.animationType = AnimationType.Empty;
        this.curIndex++;
    }

    isComplete(): boolean {
        return this.curIndex > 0;
    }
}