import { _decorator, Component, Node } from 'cc';
import { ItemBase } from './ItemBase';
import { ShowCircle } from './ShowCircle';
import { oops } from 'db://oops-framework/core/Oops';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
import { Talk } from '../Talk/Talk';
import { ZhaoChaMgr } from '../../Manager/ZhaoChaMgr';
import { Prefab } from 'cc';
import { instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/Game/Item/ClickItem')
export class ClickItem extends ItemBase {

    showCircle: ShowCircle = null!;

    talk: Talk = null!;

    onStart(): void {
        if (!this.showCircle) {
            this.showCircle = this.node.addComponent(ShowCircle)!;
        }
    }

    onRestart(): void {
        super.onRestart();
        this.showCircle.remove();
    }

    onClick(): void {
        if (this.isComplete) return;
        super.onClick();
        // console.log(`[zc] ClickItem, onClick, name:${this.nodeName}, id:${this.itemId}`);
        oops.message.dispatchEvent(ZhaoChaEvent.ITEM_CLICK, this.itemId);
        this.showCircle.show();
        this.showTalk();
        this.isComplete = true;
    }

    async showTalk(): Promise<void> {
        const config = ZhaoChaMgr.getInstance().curItems.find(item => item.ItemId == this.itemId)!;
        if (!config) {
            console.error(`[zc] ClickItem, showTalk, config not found, id:${this.itemId}`);
            return;
        }

        if (config.TalkText == "") {
            console.log(`[zc] ClickItem, showTalk, config.Tip is empty, id:${this.itemId}`);
            return;
        }

        const prefab = await ZhaoChaMgr.getInstance().resourceManager.loadAsync(`common/talk`, Prefab);
        const node = instantiate(prefab);
        this.node.addChild(node);

        const talk = node.getComponent(Talk)!;
        talk.setText(config.TalkText, config.TalkTime, config.TalkDirection, this.size);
    }
}