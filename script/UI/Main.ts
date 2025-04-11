import { _decorator, Node, Button } from "cc";
import { CCComp } from "db://oops-framework/module/common/CCComp";
import { tips } from "../../../../script/game/common/prompt/TipsManager";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ZhaoChaUIConfig, ZhaoChaUIID } from "../Base/ZhaoChaUIConfig";

const { ccclass, property } = _decorator;

export namespace FindFault {
    @ccclass('ZhaoCha/Main')
    export class Main extends CCComp {
        @property(Button)
        closeBtn: Button = null!;

        start() {
            console.log("[ZhaoCha] UIZhaoChaMain start");
            this.closeBtn.node.on(Button.EventType.CLICK, this.onClose, this);
        }
        reset(): void {
            // 
        }

        onClose(): void {
            console.log("[ZhaoCha] UIZhaoChaMain onClose");
            oops.gui.remove(ZhaoChaUIID.Main);
            ZhaoChaUIConfig.remove();
        }
    }
}