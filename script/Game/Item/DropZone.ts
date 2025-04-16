/*
 * @Author: LiuGuoBing
 * @Description: B
 */

import { _decorator, Component, Node, UITransform, Vec3, Sprite, Color } from 'cc';
import { DragItem } from './DragItem';
import { ItemBase } from './ItemBase';
import { oops } from 'db://oops-framework/core/Oops';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
const { ccclass, property } = _decorator;

@ccclass('DragDrop/Zone')
export class DropZone extends ItemBase {

    onItemEnter(item: DragItem)
    {
        console.log(`DropZone, onItemEnter, item: ${item.toString()}`);
        if (this.isComplete) return;
        oops.message.dispatchEvent(ZhaoChaEvent.ITEM_CLICK, this.itemId);
        super.showTalk();
        this.isComplete = true;
    }
} 