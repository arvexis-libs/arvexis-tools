/*
 * @Author: LiuGuoBing
 * @Description: A
 */

import { Collider2D } from 'cc';
import { Contact2DType } from 'cc';
import { _decorator, Component, Node, Vec3, EventTouch, UITransform, Camera, Canvas, Vec2 } from 'cc';
import { tween, Tween } from 'cc';
import { DropZone } from './DropZone';
import { TrZhaoChaDragItem } from '../../../../../script/game/schema/schema';
import { NodeHelper } from '../../../../../script/modules/Utils/NodeExtend/NodeHelper';
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/Game/Item/DragItem')
export class DragItem extends Component {
    @property({ type: Number, displayName: 'DragId' })
    dragId: number = 0;

    @property({ type: [Number], displayName: 'ZoneId' })
    bindZoneId: number[] = [];

    @property(Node)
    private targetNode: Node = null!;

    private isDragging: boolean = false;
    private startPosition: Vec3 = new Vec3();



    collider: Collider2D = null!;

    @property([DropZone])
    stayZone: DropZone[] = [];

    @property(DropZone)
    curZone: DropZone = null!;

    start() {
        this.initDragEvents();
    }

    init(config: TrZhaoChaDragItem, dragId: number) {
        this.dragId = dragId;
        this.bindZoneId = config.ItemId;
        this.node.name = `DragItem_${this.dragId}`;
    }

    onDestroy() {
        const node = this.targetNode || this.node;
        this.collider.off(Contact2DType.BEGIN_CONTACT, this.onTriggerEnter, this);
        this.collider.off(Contact2DType.END_CONTACT, this.onTriggerExit, this);
        node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    private initDragEvents() {
        const node = this.targetNode || this.node;
        this.collider = node.getComponent(Collider2D)!;
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onTriggerEnter, this);
        this.collider.on(Contact2DType.END_CONTACT, this.onTriggerExit, this);
        // 
        node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        // 
        node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        // 
        node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        // 
        node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTriggerEnter(self: Collider2D, other: Collider2D) {
        const zone = this.getOtherZone(other);
        if (!zone) return;
        this.stayZone.push(zone);
        console.log(`Enter, other: ${other.node.name}, ${this.stayZone.length}`);
    }

    onTriggerExit(self: Collider2D, other: Collider2D) {
        const zone = this.getOtherZone(other);
        if (!zone) return;
        this.stayZone = this.stayZone.filter(z => z !== zone);
        console.log(`Exit, other: ${other.node.name}, ${this.stayZone.length}`);
    }

    /** DropZoneDropZoneDropZone */
    getOtherZone(other: Collider2D): DropZone | null {
        let zone = other.node.getComponent(DropZone)!;
        if (zone) return zone;
        zone = NodeHelper.getComponentInParent(other.node, DropZone)!;
        return zone;
    }

    private onTouchStart(event: EventTouch) {
        this.isDragging = true;
        
        // 
        const node = this.targetNode || this.node;
        this.startPosition.set(node.position);
        console.log(`: ${this.startPosition}`);
    }

    private onTouchMove(event: EventTouch) {
        if (!this.isDragging) return;
        const node = this.targetNode || this.node;
        const touchPos = event.getUILocation();
        const newPos = new Vec3(touchPos.x, touchPos.y, node.position.z);
        node.setWorldPosition(newPos);
    }

    private onTouchEnd(event: EventTouch) {
        this.handleDragEnd();
    }

    private onTouchCancel(event: EventTouch) {
        this.handleDragEnd();
    }

    private handleDragEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        
        // 
        const isInTargetArea = this.checkIfInTargetArea();
        
        if (!isInTargetArea) {
            // 
            this.returnToStartPosition();
        } else {
            this.curZone.onItemEnter(this);
        }
        
        console.log(':', isInTargetArea);
    }


    /**
     * 
     * @returns 
     */
    private checkIfInTargetArea(): boolean {
        let filterZone: DropZone[] = [];
        
        if (this.bindZoneId.length == 0 || this.bindZoneId.includes(0))
        {
            filterZone = this.stayZone.filter(z => !z.isComplete);
        } else {
            for (const zone of this.stayZone) {
                if (!zone.isComplete && this.bindZoneId.includes(zone.itemId)) {
                    filterZone.push(zone);
                }
            }
        }
        if (filterZone.length > 0) {
            this.curZone = filterZone[0];
        }
        return filterZone.length > 0;
    }

    private returnToStartPosition() {
        const node = this.targetNode || this.node;
        
        // 
        tween(node)
            .to(0.3, { position: this.startPosition })
            .start();
            
        console.log(':', this.startPosition);
    }

    toString(): string {
        return `dragId: ${this.dragId}, bindZoneId: ${this.bindZoneId}`;
    }
} 