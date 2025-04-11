import { Label } from 'cc';
import { Sprite } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { TrZhaoChaStage } from '../../../../../script/game/schema/schema';
import { CCComp } from '../../../../../../extensions/oops-plugin-framework/assets/module/common/CCComp';
const { ccclass, property } = _decorator;

/*  */
@ccclass('StageCover')
export class StageCover extends CCComp {
    reset(): void {
        throw new Error('Method not implemented.');
    }

    @property(Sprite)
    sprite: Sprite = null!;

    @property(Label)
    label: Label = null!;

    start() {

    }

    refresh(stage: TrZhaoChaStage) {
        if (!stage)
        {
            this.node.active = false;
            return;
        }
        this.label.string = stage.Name;
        // this.sprite.spriteFrame = stage.cover;
        this.node.active = true;
    }
}