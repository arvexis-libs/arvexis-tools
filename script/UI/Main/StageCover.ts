import { Label } from 'cc';
import { Sprite } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { TrZhaoChaStage } from '../../../../../script/game/schema/schema';
import { CCComp } from '../../../../../../extensions/oops-plugin-framework/assets/module/common/CCComp';
import { oops } from '../../../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { SpriteFrame } from 'cc';
import { ZhaoChaMgr } from '../../Manager/ZhaoChaMgr';
import { ZhaoChaConfig, ZhaoChaUIID } from '../../Common/ZhaoChaUIConfig';
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

    config: TrZhaoChaStage = null!;

    start() {
        // this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
    }

    refresh(config: TrZhaoChaStage) {
        if (!config)
        {
            this.node.active = false;
            console.log(`[zc]StageCover refresh, stage is null. ${this.label.string}`);
            return;
        }
        this.config = config;
        this.label.string = config.Name;
        const coverImg = `StageCover/${config.CoverImg}/spriteFrame`;

        this.node.active = true;
        oops.res.loadAsync<SpriteFrame>(ZhaoChaConfig.bundleName, coverImg).then((sp)=>{
            this.sprite.spriteFrame = sp;
            if (config.Id == 1)
            {
                console.log(`[zc][spriteFrame]coverImg:${coverImg}`);
            }
        });
    }

    onClick(): void {
        console.log(`[zc]StageCover onClick, stage: ${this.config.Id} - ${this.config.Name}`);
        ZhaoChaMgr.getInstance().curStageId = this.config.Id;
        oops.gui.open(ZhaoChaUIID.Stage);
    }
}