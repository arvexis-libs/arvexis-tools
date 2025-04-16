/*
 * @Author: LiuGuoBing
 * @Description: A
 */

import { Collider2D } from 'cc';
import { Contact2DType } from 'cc';
import { _decorator, Component, Node, Vec3, EventTouch, UITransform, Camera, Canvas, Vec2 } from 'cc';
import { tween, Tween } from 'cc';
import { DropZone } from './DropZone';
const { ccclass, property } = _decorator;

@ccclass('DragDrop/Item')
export class DraggableItem extends Component {
    @property({ type: Number, displayName: 'DragId' })
    dragId: number = 0;

    @property({ type: Number, displayName: 'ZoneId' })
    bindZoneId: number = 0;

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
        const zone = other.node.getComponent(DropZone)!;
        if (!zone) return;
        this.stayZone.push(zone);
        console.log(`Enter, other: ${other.node.name}, ${this.stayZone.length}`);
    }

    onTriggerExit(self: Collider2D, other: Collider2D) {
        const zone = other.node.getComponent(DropZone)!;
        if (!zone) return;
        this.stayZone = this.stayZone.filter(z => z !== zone);
        console.log(`Exit, other: ${other.node.name}, ${this.stayZone.length}`);
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
        if (this.bindZoneId == 0)
        {
            this.curZone = this.stayZone[0];
            return this.stayZone.length > 0;
        } else {
            for (const zone of this.stayZone) {
                if (zone.zoneId == this.bindZoneId) {
                    this.curZone = zone;
                    return true;
                }
            }
            return false;
        }
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