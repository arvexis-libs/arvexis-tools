import { Collider2D } from 'cc';
import { NodeEventType } from 'cc';
import { BoxCollider2D } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/Game/Item/ItemBase')
export class ItemBase extends Component {
    @property(Number)
    itemId: number = 0;

    @property(Collider2D)
    collider: Collider2D = null!;

    @property(String)
    nodeName: string = "";
    
    /**  */
    @property(Boolean)
    isComplete: boolean = false;

    start() {
        // nodeName
        if (this.nodeName == "") {
            this.nodeName = this.node.name;
        }
        // collider
        if (!this.collider) {
            this.collider = this.node.getComponent(Collider2D)!;
        }
        if (!this.collider) {
            console.error(`[zc] ItemBase,[${this.node.name}], collider is null`);
            return;
        }

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.MOUSE_DOWN, this.onClick, this);
        this.onStart();
    }

    update(deltaTime: number) {

    }
    /* onStart */
    onStart(): void {
    }

    onTouchStart(): void {
        // console.log("[zc] ItemBase, onTouchStart");
    }

    onTouchEnd(): void {
        // console.log("[zc] ItemBase, onTouchEnd");
    }

    /*  */
    onClick(): void {
        // to 
    }

    /*   */
    complete(): void {
        // console.log(`[zc] ItemBase, complete, name:${this.nodeName}, id:${this.itemId}`);
    }
}