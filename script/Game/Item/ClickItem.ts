import { _decorator } from 'cc';
import { ItemBase } from './ItemBase';
import { oops } from 'db://oops-framework/core/Oops';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/Game/Item/ClickItem')
export class ClickItem extends ItemBase {

    onClick(): void {
        if (this.isComplete) {
            console.log(`[zc] ClickItem, onClick, name:${this.nodeName}, id:${this.itemId}, isComplete`);
            return;
        }
        super.onClick();
        console.log(`[zc] ClickItem, onClick, name:${this.nodeName}, id:${this.itemId}`);
        oops.message.dispatchEvent(ZhaoChaEvent.ITEM_CLICK, this.itemId);
        this.getAnimation?.next();
        super.showTalk();
    }
}