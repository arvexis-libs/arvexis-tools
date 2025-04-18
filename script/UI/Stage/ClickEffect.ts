import { _decorator, Component, Node, Animation } from 'cc';
import { EventUtil } from '../../../../../script/modules/Utils/NodeExtend/EventUtil';
import { NodeHelper } from '../../../../../script/modules/Utils/NodeExtend/NodeHelper';
import { Stage } from './Stage';
import { EventMouse } from 'cc';
import { Prefab } from 'cc';
import { ZhaoChaMgr } from '../../Manager/ZhaoChaMgr';
import { instantiate } from 'cc';
import { AnimationUtil } from '../../../../../script/modules/Utils/NodeExtend/AnimationUtil';
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

    start() {
        const stage = NodeHelper.getComponentInParent(this.node, Stage);
        this.effectName = stage?.config.ClickEffect || "";
        // config
        if (this.effectName == "") {
            console.log(`[zc] UIZhaoCha, effectName is empty`);
            return;
        }
        // eventUtil
        this.eventUtil.onClick = this.onClick.bind(this);
    }

    protected onDestroy(): void {
        this.eventUtil.onClick = null!;
    }

    get showNodesNum(): number {
        return this.instanceNodes.length - this.hideNodes.length;
    }

    async onClick(event: EventMouse): Promise<void> {
        event.preventSwallow = true; // 
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


