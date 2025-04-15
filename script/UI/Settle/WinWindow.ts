import { _decorator, Component, Node } from 'cc';
import { oops } from 'db://oops-framework/core/Oops';
import { SettleWindow } from './SettleWindow';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
import { ZhaoChaUIID } from '../../Common/ZhaoChaConfig';
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/Stage/WinWindow')
export class WinWindow extends SettleWindow {
    start(): void {
        super.start();
        oops.message.dispatchEvent(ZhaoChaEvent.RESUME, {});
    }

    getAnimPath(): string {
        return `Anim/Common/Prefab/${this.config.WinAnim}`;
    }

    next(): void {
        console.log(`[zc] FailWindow, next`);
        oops.message.dispatchEvent(ZhaoChaEvent.EXIT, {});
        oops.gui.remove(ZhaoChaUIID.WinWindow);
    }
}