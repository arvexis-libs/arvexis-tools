import { _decorator, Component, Node } from 'cc';
import { TrZhaoChaStage } from '../../../../../script/game/schema/schema';
import { oops } from "db://oops-framework/core/Oops";
import { Label } from 'cc';
import { ZhaoChaMgr } from '../../Manager/ZhaoChaMgr';
import { ZhaoChaUIID } from '../../Common/ZhaoChaConfig';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
import { Sprite } from 'cc';
import { SpriteFrame } from 'cc';
import { FindList } from './FindList';
const { ccclass, property } = _decorator;


@ccclass('ZhaoCha/Stage/FindItem')
export class FindItem extends Component {
    @property(Sprite)
    sprite: Sprite = null!;

    @property(Label)
    label: Label = null!;

    @property(Number)
    id: Number = 0;

    start() {
        this.label.node.active = false;
        this.sprite.node.active = false;
        oops.message.on(ZhaoChaEvent.RESTART, this.onRestart, this);
    }

    protected onDestroy(): void {
        oops.message.off(ZhaoChaEvent.RESTART, this.onRestart, this);
    }

    async refresh(id: number) {
        this.id = id;
        const config = ZhaoChaMgr.getInstance().curItems.find(item => item.ItemId == id)!;
        if (!config) {
            console.error(`[zc] FindItem, refresh, config not found, id:${id}`);
            return;
        }

        // label
        this.label.string = config.Name;
        // img
        const coverImg = `Stage/${ZhaoChaMgr.getInstance().curStageId}/${config.Img}/spriteFrame`;
        const sp = await ZhaoChaMgr.getInstance().resourceManager.loadAsync(coverImg, SpriteFrame);
        this.sprite.spriteFrame = sp;
        // active
        this.label.node.active = true;
        this.sprite.node.active = true;
    }

    onRestart(): void {
        this.id = 0;
        this.label.node.active = false;
        this.sprite.node.active = false;
    }
}
