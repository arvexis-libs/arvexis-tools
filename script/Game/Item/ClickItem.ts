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

    onStart(): void {
        if (!this.showCircle) {
            this.showCircle = this.node.addComponent(ShowCircle)!;
        }
    }

    onClick(): void {
        if (this.isComplete) return;
        super.onClick();
        // console.log(`[zc] ClickItem, onClick, name:${this.nodeName}, id:${this.itemId}`);
        oops.message.dispatchEvent(ZhaoChaEvent.ITEM_CLICK, this.itemId);
        this.showCircle.show();
        super.showTalk();
        this.isComplete = true;
    }
}