import { _decorator, Component, Node } from 'cc';
import { ItemBase } from './ItemBase';
import { ShowCircle } from './ShowCircle';
import { oops } from 'db://oops-framework/core/Oops';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
import { Talk } from '../Talk/Talk';
import { ZhaoChaMgr } from '../../Manager/ZhaoChaMgr';
import { Prefab } from 'cc';
import { instantiate } from 'cc';
import { Stage } from '../../UI/Stage/Stage';
import { NodeHelper } from '../../../../../script/modules/Utils/NodeExtend/NodeHelper';
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

        const stage = NodeHelper.getComponentInParent(this.node, Stage);
        if (!stage) {
            console.error(`[zc] ClickItem, showTalk, stage not found`);
            return;
        }

        const prefab = await ZhaoChaMgr.getInstance().resourceManager.loadAsync(`Common/Talk`, Prefab);
        const node = instantiate(prefab);
        stage.content.addChild(node);
        node.setWorldPosition(this.node.worldPosition);
        node.name = `talk_${this.itemId}`;
        const talk = node.getComponent(Talk)!;
        talk.setText(config.TalkText, config.TalkTime, config.TalkDirection, this.size);
    }
}