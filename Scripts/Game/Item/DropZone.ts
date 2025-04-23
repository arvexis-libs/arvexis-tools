/*
 * @Author: LiuGuoBing
 * @Description: B
 */

import { _decorator, Component, Node, UITransform, Vec3, Sprite, Color, RigidBody2D } from 'cc';
import { DragItem } from './DragItem';
import { ItemBase } from './ItemBase';
import { oops } from 'db://oops-framework/core/Oops';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
import { RigidBodyGroup } from '../../../../../script/modules/Utils/NodeExtend/RigidBodyGroup';
const { ccclass, property } = _decorator;


@ccclass('ZhaoCha/Game/Item/DropZone')
export class DropZone extends ItemBase {
    getColliderGroup(): number {
        return (Number)(RigidBodyGroup.DropZone);
    }

    async onItemEnter(item: DragItem)
    {
        console.log(`DropZone, onItemEnter, item: ${item.toString()}`);
        if (this.isComplete) return;
        // animation
        await this.getAnimation?.next();
        // show talk
        await super.showTalk();
        // event
        oops.message.dispatchEvent(ZhaoChaEvent.ITEM_FINISH, this.itemId);
        // node destroy
        item.node.destroy();
    }
} 