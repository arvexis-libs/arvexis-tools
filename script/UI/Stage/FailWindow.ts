import { _decorator, Component, Node } from 'cc';
import { SettleWindow } from './SettleWindow';
import { oops } from 'db://oops-framework/core/Oops';
import { ZhaoChaUIID } from '../../Common/ZhaoChaConfig';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/Stage/FailWindow')
export class FailWindow extends SettleWindow {
    start(): void {
        super.start();
    }

    getAnimPath(): string {
        return `anim/common/prefab/${this.config.FailAnim}`;
    }

    next(): void {
        console.log(`[zc] FailWindow, next`);
        oops.message.dispatchEvent(ZhaoChaEvent.RESTART, {});
        oops.gui.remove(ZhaoChaUIID.FailWindow);
    }
}