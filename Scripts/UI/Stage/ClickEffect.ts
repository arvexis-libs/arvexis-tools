import { _decorator, Component, Node, Animation } from 'cc';
import { EventUtil } from '../../../../../script/modules/Utils/NodeExtend/EventUtil';
import { NodeHelper } from '../../../../../script/modules/Utils/NodeExtend/NodeHelper';
import { Stage } from './Stage';
import { EventMouse } from 'cc';
import { Prefab } from 'cc';
import { ZhaoChaMgr } from '../../Manager/ZhaoChaMgr';
import { instantiate } from 'cc';
import { AnimationUtil } from '../../../../../script/modules/Utils/NodeExtend/AnimationUtil';
import { InvalidClick } from './InvalidClick';
import { oops } from 'db://oops-framework/core/Oops';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/Stage/ClickEffect')
export class ClickEffect extends Component {
    @property(EventUtil)
    eventUtil: EventUtil = null!;

    @property(String)
    effectName: string = "";

    @property(Number)
    maxShowNum: number = 3;

    prefab: Prefab = null!;

    instanceNodes: Node[] = [];

    hideNodes: Node[] = [];


    private _invalidClick: InvalidClick = null!;
    get invalidClick(): InvalidClick {
        if (!this._invalidClick) this._invalidClick = NodeHelper.getComponentInParent(this.node, InvalidClick)!;
        return this._invalidClick;
    }

    onLoad() {
        oops.message.on(ZhaoChaEvent.SECTION_LOADED, this.onSectionLoaded, this);
    }

    protected onDestroy(): void {
        oops.message.off(ZhaoChaEvent.SECTION_LOADED, this.onSectionLoaded, this);
        this.eventUtil.onClick = null!;
    }

    get showNodesNum(): number {
        return this.instanceNodes.length - this.hideNodes.length;
    }

    onSectionLoaded(): void {
        const stage = NodeHelper.getComponentInParent(this.node, Stage)!;
        this.effectName = stage.stageConfig.ClickEffect || "";
        // config
        if (this.effectName == "") {
            console.log(`[zc] UIZhaoCha, effectName is empty`);
            this.node.active = false;
            return;
        }
        // eventUtil
        this.eventUtil.onClick = this.onClick.bind(this);
        this.node.active = true;
    }

    async onClick(event: EventMouse): Promise<void> {
        event.preventSwallow = true; // 
        // console.log(`[zc] click, ClickEffect, ${event.getUILocation().x}, ${event.getUILocation().y}`);
        if (this.showNodesNum >= this.maxShowNum) return;
        let node: Node = null!;
        if (this.hideNodes.length > 0) {
            node = this.hideNodes.shift()!;
        } else {
            // prefab
            if (!this.prefab) {
                await this.loadPrefab();
            }
            // prefab
            node = instantiate(this.prefab);
            node.setParent(this.node);
            this.instanceNodes.push(node);
            node.name = `ClickEffect_${this.instanceNodes.length}`;
            // console.log(`[zc] UIZhaoCha, ClickEffect,[${node.name}], onClick`);
        }
        this.invalidClick.add(event.getUILocation()); // 
        this.hideNodes.remove(node);
        const animationUtil = node.getComponent(AnimationUtil)!;
        animationUtil.onTriggerEvent = this.onTriggerEvent.bind(this);
        node.active = true;
        node.setWorldPosition(event.getUILocation().x, event.getUILocation().y, 0);
        node.getComponent(Animation)?.play();
    }

    async loadPrefab(): Promise<void> {
        const prefabUrl = `Common/${this.effectName}`;
        this.prefab = await ZhaoChaMgr.getInstance().resourceManager.loadAsync(prefabUrl, Prefab);
    }

    onTriggerEvent(node: Node, event: string): void {
        // console.log(`[zc] UIZhaoCha, onTriggerEvent,[${node.name}], [${event}]`);
        node.active = false;
        this.hideNodes.push(node);
    }
}


