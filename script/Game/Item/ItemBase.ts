import { Collider2D } from 'cc';
import { NodeEventType } from 'cc';
import { BoxCollider2D } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { oops } from 'db://oops-framework/core/Oops';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
import { Vec2 } from 'cc';
import { UITransform } from 'cc';
import { Size } from 'cc';
import { ZhaoChaMgr } from '../../Manager/ZhaoChaMgr';
import { NodeHelper } from '../../../../../script/modules/Utils/NodeExtend/NodeHelper';
import { Stage } from '../../UI/Stage/Stage';
import { instantiate } from 'cc';
import { Prefab } from 'cc';
import { Talk } from '../Talk/Talk';
import { AnimationBase, AnimationType } from '../Animation/AnimationBase';
import { TrZhaoChaItem } from '../../../../../script/game/schema/schema';
import { ShowCircle } from '../Animation/ShowCircle';
import { SwitchNode } from '../Animation/SwitchNode';
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/Game/Item/ItemBase')
export class ItemBase extends Component {
    @property(Number)
    itemId: number = 0;

    @property(Collider2D)
    private _collider: Collider2D = null!;

    @property(String)
    nodeName: string = "";

    config: TrZhaoChaItem = null!;

    start() {
        // nodeName
        if (this.nodeName == "") {
            this.nodeName = this.node.name;
        }
        // // collider
        // if (!this.collider) {
        //     this.collider = this.node.getComponent(Collider2D)!;
        // }
        // if (!this.collider) {
        //     console.error(`[zc] ItemBase,[${this.node.name}], collider is null`);
        //     return;
        // }

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.MOUSE_DOWN, this.onClick, this);
        // config
        this.config = ZhaoChaMgr.getInstance().curItems.find(item => item.ItemId == this.itemId)!;
        if (!this.config) {
            console.error(`[zc], config not found, id:${this.itemId}`);
            return;
        }
        this.onStart();
    }

    onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.MOUSE_DOWN, this.onClick, this);
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

    /*  */
    get size(): Size {
        return this.node.getComponent(UITransform)!.contentSize;
    }

    async showTalk(): Promise<void> {
        if (!this.config) {
            console.error(`[zc] ItemBase, showTalk, config is null`);
            return;
        }

        if (this.config.TalkText == "") {
            console.log(`[zc] ClickItem, showTalk, config.Tip is empty, id:${this.itemId}`);
            return;
        }

        const stage = NodeHelper.getComponentInParent(this.node, Stage);
        if (!stage) {
            console.error(`[zc] ClickItem, showTalk, stage not found`);
            return;
        }

        const prefab = await ZhaoChaMgr.getInstance().resourceManager.loadAsync(`Common/Talk`, Prefab);
        const node = instantiate(prefab);
        stage.content.addChild(node);
        node.setWorldPosition(this.node.worldPosition);
        node.name = `talk_${this.itemId}`;
        const talk = node.getComponent(Talk)!;
        talk.setText(this.config.TalkText, this.config.TalkTime, this.config.TalkDirection, this.size);
    }

    //#region 
    @property(AnimationBase)
    animation: AnimationBase = null!;

    get getAnimation(): AnimationBase | null {
        if (this.animation) return this.animation;
        if (!this.config) {
            console.error(`[zc] ItemBase, getAnimation, config is null`);
            return null!;
        }
        switch (this.config.AnimationType) 
        {
            case AnimationType.ShowCircle:
                this.animation = this.node.addComponent(ShowCircle)!;
                break;
            case AnimationType.SwitchNode:
                this.animation = this.node.addComponent(SwitchNode)!;
                this.animation.animationQueue = NodeHelper.getChildsName(this.node);
                break;
        }
        return this.animation;
    }
    //#endregion

    get isComplete(): boolean
    {
        return this.getAnimation?.isComplete() ?? false;
    }

    get getCollider(): Collider2D {
        if (this._collider) return this._collider;
        this._collider = this.node.getComponent(Collider2D)!;
        return this._collider;
    }
}