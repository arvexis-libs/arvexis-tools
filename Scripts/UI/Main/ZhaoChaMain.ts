import { _decorator, Node, Button } from "cc";
import { CCComp } from "db://oops-framework/module/common/CCComp";
import { tips } from "../../../../../script/game/common/prompt/TipsManager";
import { oops } from "db://oops-framework/core/Oops";
import ConfigManager from "../../../../../script/game/manager/Config/ConfigManager";
import { TrZhaoChaStage } from "../../../../../script/game/schema/schema";

import { ZhaoChaMgr } from "../../Manager/ZhaoChaMgr";
import { ZhaoChaConfig, ZhaoChaUIID } from "../../Common/ZhaoChaConfig";
const { ccclass, property } = _decorator;

namespace ZhaoCha {
    @ccclass('ZhaoCha/Main')
    export class ZhaoChaMain extends CCComp {
        @property(Button)
        closeBtn: Button = null!;

        start() {
            console.log("[zc] UIZhaoChaMain start");
            this.closeBtn.node.on(Button.EventType.CLICK, this.onClose, this);
        }
        reset(): void {
            // 
        }

        onClose(): void {
            console.log("[zc] UIZhaoChaMain onClose");
            oops.gui.remove(ZhaoChaUIID.Main);
        }
    }
}