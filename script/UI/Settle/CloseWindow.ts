import { _decorator, Component, Node } from 'cc';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
import { oops } from 'db://oops-framework/core/Oops';
import { ZhaoChaUIID } from '../../Common/ZhaoChaConfig';
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/Stage/CloseWindow')
export class CloseWindow extends Component {
    start() {
        oops.message.dispatchEvent(ZhaoChaEvent.RESUME, {});
    }

    onRestart(): void {
        oops.message.dispatchEvent(ZhaoChaEvent.RESTART, {});
        this.close();
    }

    onExit(): void {
        oops.message.dispatchEvent(ZhaoChaEvent.EXIT, {});
        this.close();
    }

    onContinue(): void {
        oops.message.dispatchEvent(ZhaoChaEvent.CONTINUE, {});
        this.close();
    }

    close(): void {
        oops.gui.remove(ZhaoChaUIID.CloseWindow);
    }
}