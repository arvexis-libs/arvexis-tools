/*
 * @Author: LiuGuoBing
 * @Description: B
 */

import { _decorator, Component, Node, UITransform, Vec3, Sprite, Color } from 'cc';
import { DragItem } from './DragItem';
const { ccclass, property } = _decorator;

@ccclass('DragDrop/Zone')
export class DropZone extends Component {
    @property({ type: Number, displayName: 'ZoneId' })
    zoneId: number = 0;

    onItemEnter(item: DragItem)
    {
        console.log(`DropZone, onItemEnter, item: ${item.toString()}`);
    }
} 