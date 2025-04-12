import { _decorator, Component, Node } from 'cc';
import { ItemBase } from './ItemBase';
import { ShowCircle } from './ShowCircle';
import { oops } from 'db://oops-framework/core/Oops';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/Game/Item/ClickItem')
export class ClickItem extends ItemBase {

    showCircle: ShowCircle = null!;
    onStart(): void {
        if (!this.showCircle) {
            this.showCircle = this.node.getComponent(ShowCircle)!;
        }
    }

    onClick(): void {
        if (this.isComplete) return;
        super.onClick();
        // console.log(`[zc] ClickItem, onClick, name:${this.nodeName}, id:${this.itemId}`);
        oops.message.dispatchEvent(ZhaoChaEvent.ITEM_CLICK, this.itemId);
        this.showCircle.show();
        this.isComplete = true;
    }
}