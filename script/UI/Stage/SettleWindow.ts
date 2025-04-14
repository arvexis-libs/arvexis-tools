import { _decorator, Component, Node } from 'cc';
import { TrZhaoChaStage } from '../../../../../script/game/schema/schema';
import { ZhaoChaMgr } from '../../Manager/ZhaoChaMgr';
import { Prefab, Animation } from 'cc';
import { instantiate } from 'cc';
import { SettleWindowAnim } from './SettleWindowAnim';
import { oops } from '../../../../../../extensions/oops-plugin-framework/assets/core/Oops';
const { ccclass, property } = _decorator;


@ccclass('ZhaoCha/Stage/SettleWindow')
export class SettleWindow extends Component {
    @property(Node)
    uiNode: Node = null!;

    @property(Node)
    animNode: Node = null!;

    /*  */
    config: TrZhaoChaStage = null!;

    start() {
        this.uiNode.active = false;
        this.animNode.active = false;
        this.config = ZhaoChaMgr.getInstance().curConfig;
        this.playAnim();
    }

    getAnimPath(): string {
        // return `StageAnim/${this.config.FailAnim}`;
        return "";
    }

    /*  */
    async playAnim(): Promise<void> {
        if (this.config.FailAnim == "")
        {
            console.log(`[zc] SettleWindow, playAnim, no anim`);
            this.showUI();
            return;
        }
        // 
        const pefab = await ZhaoChaMgr.getInstance().resourceManager.loadAsync(this.getAnimPath(), Prefab);
        const node = instantiate(pefab);
        node.parent = this.animNode;
        node.setPosition(0, 0, 0);

        // 
        const anim = node.getComponent(SettleWindowAnim)!;
        anim.onAnimPlayEnd = this.onAnimPlayEnd.bind(this);
        // 
        this.animNode.active = true;
    }
    /* UI */
    showUI(): void {
        this.uiNode.active = true;
        oops.timer.scheduleOnce(this.next.bind(this), 3);
    }

    /*  */
    next(): void {

    }

    onAnimPlayEnd(): void {
        console.log(`[zc] SettleWindow, onAnimPlayEnd`);
        this.showUI();
    }
}