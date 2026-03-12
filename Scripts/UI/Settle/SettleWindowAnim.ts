import { _decorator, Component, Node } from 'cc';
import { AnimationUtil } from '../../../../../script/modules/Utils/NodeExtend/AnimationUtil';
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/Stage/SettleWindowAnim')
export class SettleWindowAnim extends Component {

    onAnimPlayEnd: Function = null!;


    start(): void {
        const animUtil = this.node.getComponent(AnimationUtil)!;
        if (!animUtil) {
            console.error(`[zc] SettleWindowAnim, animUtil is null`);
            return;
        }
        animUtil.onTriggerEvent = this.onTriggerEvent.bind(this);
    }

    onTriggerEvent(node: Node, event: string) {
        if (event == "playEnd") {
            this.onAnimPlayEnd?.();
        }
    }

    protected onDestroy(): void {
        this.onAnimPlayEnd = null!;
    }
}