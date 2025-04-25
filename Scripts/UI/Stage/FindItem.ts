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
import { Color } from 'cc';
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
        this.label.node.active = true;
        this.sprite.node.active = false;
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
        // labelcolor"#26282E"
        this.label.color = new Color("#26282E");
        // img
        const coverImg = `Stage/${ZhaoChaMgr.getInstance().curStage.Id}/${config.Img}/spriteFrame`;
        const sp = await ZhaoChaMgr.getInstance().resourceManager.loadAsync(coverImg, SpriteFrame);
        if (!this || !this.sprite) return;
        this.sprite.spriteFrame = sp;
        // active
        this.label.node.active = true;
        this.sprite.node.active = true;
    }
}
