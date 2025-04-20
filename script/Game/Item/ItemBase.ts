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
import { SwitchSpine } from '../Animation/SwitchSpine';
import { PolygonCollider2D } from 'cc';
import { RigidBodyGroup } from '../../../../../script/modules/Utils/NodeExtend/RigidBodyGroup';
import { RigidBody2D } from 'cc';
import { SpineAnimUtil } from '../../../../../script/modules/Utils/SpineExtend/SpineAnimUtil';
import { EventMouse } from 'cc';
import { EmptyAnimation } from '../Animation/EmptyAnimation';
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/Game/Item/ItemBase')
export class ItemBase extends Component {
    @property(Number)
    itemId: number = 0;

    @property(String)
    nodeName: string = "";

    config: TrZhaoChaItem = null!;

    start() {
        // nodeName
        if (this.nodeName == "") {
            this.nodeName = this.node.name;
        }
        // collider
        this.initCollider();
        // event
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
    onClick(event: EventMouse): void {
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

    /**
     * 
     * @description 
     */
    async showTalk(): Promise<void> {
        // 
        if (!this.config) {
            console.error(`[zc] ItemBase, showTalk, config is null`);
            return;
        }

        // 
        if (this.config.TalkText == "") {
            console.log(`[zc] ClickItem, showTalk, config.Tip is empty, id:${this.itemId}`);
            return;
        }

        // 
        const stage = NodeHelper.getComponentInParent(this.node, Stage);
        if (!stage) {
            console.error(`[zc] ClickItem, showTalk, stage not found`);
            return;
        }

        // 
        const prefab = await ZhaoChaMgr.getInstance().resourceManager.loadAsync(`Common/Talk`, Prefab);
        // 
        const node = instantiate(prefab);
        // 
        stage.content.addChild(node);
        // 
        node.setWorldPosition(this.node.worldPosition);
        // 
        node.name = `talk_${this.itemId}`;
        // Talk
        const talk = node.getComponent(Talk)!;
        talk.setText(this.config.TalkText, this.config.TalkTime, this.config.TalkDirection, this.size);
    }

    //#region 
    @property(AnimationBase)
    private animation: AnimationBase = null!;

    get getAnimation(): AnimationBase | null {
        if (this.animation) return this.animation;
        if (!this.config) {
            console.error(`[zc] ItemBase, getAnimation, config is null`);
            return null!;
        }
        switch (this.config.AnimationType) 
        {
            case AnimationType.Empty:
                this.animation = this.node.addComponent(EmptyAnimation)!;
                break;
            case AnimationType.ShowCircle:
                this.animation = this.node.addComponent(ShowCircle)!;
                break;
            case AnimationType.SwitchNode:
                this.animation = this.node.addComponent(SwitchNode)!;
                this.animation.animationQueue = NodeHelper.getChildsName(this.node);
                break;
            case AnimationType.SwicthSpine:
                this.animation = this.node.addComponent(SwitchSpine)!;
                this.animation.animationQueue = this.getSpineAnimUtil?.getAnimNames ?? [];
                break;
        }
        return this.animation;
    }

    private spineAnimUtil: SpineAnimUtil = null!;

    get getSpineAnimUtil(): SpineAnimUtil | null {
        if (this.spineAnimUtil) return this.spineAnimUtil;
        this.spineAnimUtil = this.node.getComponentInChildren(SpineAnimUtil)!;
        this.spineAnimUtil.clickSwitch = false;
        return this.spineAnimUtil;
    }
    //#endregion

    get isComplete(): boolean
    {
        return this.getAnimation?.isComplete() ?? true;
    }

    //#region 
    @property(Collider2D)
    private _collider: Collider2D = null!;

    private _rigidBody: RigidBody2D = null!;

    getColliderGroup(): number {
        return (Number)(RigidBodyGroup.Default);
    }

    get getCollider(): Collider2D {
        return this._collider;
    }

    get getRigidBody(): RigidBody2D {
        return this._rigidBody;
    }

    initCollider(): void {
        // collider
        if (!this._collider) {
            this._collider = this.node.getComponentInChildren(Collider2D)!;
        }
        if (!this._collider) {
            // todo: 
            let polygonCollider: PolygonCollider2D = this.node.addComponent(PolygonCollider2D);
            this._collider = polygonCollider;
            // polygonCollider
            const nodeSize = polygonCollider.node.size;
            const halfWidth = nodeSize.width / 2;
            const halfHeight = nodeSize.height / 2;
            // 
            polygonCollider.points = [
                new Vec2(-halfWidth, -halfHeight),
                new Vec2(halfWidth, -halfHeight),
                new Vec2(halfWidth, halfHeight),
                new Vec2(-halfWidth, halfHeight)
            ];
        }
        // rigidBody
        if (!this._rigidBody) {
            this._rigidBody = this.getCollider.node.getComponent(RigidBody2D)!;
        }
        if (!this._rigidBody) {
            this._rigidBody = this.getCollider.node.addComponent(RigidBody2D);
        }
        this.getRigidBody.enabledContactListener = true;
        // group
        const group = this.getColliderGroup();
        this.getCollider.group = group;
        this.getRigidBody.group = group;
        // this.getCollider.node.getComponent(RigidBody2D)!.group = group;
    }


    //#endregion
}