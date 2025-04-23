import { _decorator } from 'cc';
import { ItemBase } from './ItemBase';
import { oops } from 'db://oops-framework/core/Oops';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
import { EventMouse } from 'cc';
import { InvalidClick } from '../../UI/Stage/InvalidClick';
import { NodeHelper } from '../../../../../script/modules/Utils/NodeExtend/NodeHelper';
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/Game/Item/ClickItem')
export class ClickItem extends ItemBase {
    private _invalidClick: InvalidClick = null!;
    get invalidClick(): InvalidClick {
        if (!this._invalidClick) this._invalidClick = NodeHelper.getComponentInParent(this.node, InvalidClick)!;
        return this._invalidClick;
    }

    async onClick(event: EventMouse): Promise<void> {
        this.invalidClick.remove(event.getUILocation()); // 
        // console.log(`[zc] click, ClickItem, ${event.getUILocation().x}, ${event.getUILocation().y}`);
        if (this.isComplete) {
            console.log(`[zc] ClickItem, onClick, name:${this.nodeName}, id:${this.itemId}, isComplete`);
            return;
        }
        await super.onClick(event);
        await this.getAnimation?.next();
        // show talk
        await super.showTalk();
        // event
        oops.message.dispatchEvent(ZhaoChaEvent.ITEM_FINISH, this.itemId);
    }
}