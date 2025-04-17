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


@ccclass('DragDrop/Zone')
export class DropZone extends ItemBase {



    onStart(): void {
        super.onStart();
        // this.colliderGroup
        const group = (Number)(RigidBodyGroup.DropZone);
        const preGroup = this.getCollider.group;
        this.getCollider.group = group;
        this.getCollider.node.getComponent(RigidBody2D)!.group = group;
        console.log(`[zc] DropZone, ${this.node.name}, preGroup: ${preGroup} -> group:${this.getCollider.group}`);
    }

    onItemEnter(item: DragItem)
    {
        console.log(`DropZone, onItemEnter, item: ${item.toString()}`);
        if (this.isComplete) return;
        // animation
        this.getAnimation?.next();
        // event
        oops.message.dispatchEvent(ZhaoChaEvent.ITEM_CLICK, this.itemId);
        // talk
        super.showTalk();
        // drag destroy
        item.node.destroy();
    }
} 