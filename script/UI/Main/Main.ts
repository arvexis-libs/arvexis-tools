import { _decorator, Node, Button } from "cc";
import { CCComp } from "db://oops-framework/module/common/CCComp";
import { tips } from "../../../../../script/game/common/prompt/TipsManager";
import { oops } from "../../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ZhaoChaUIConfig, ZhaoChaUIID } from "../../Base/ZhaoChaUIConfig";
import ConfigManager from "../../../../../script/game/manager/Config/ConfigManager";
import { TrZhaoChaStage } from "../../../../../script/game/schema/schema";

import { ZhaoChaData } from "../../Data/ZhaoChaData";
const { ccclass, property } = _decorator;

namespace ZhaoCha {
    @ccclass('ZhaoCha/Main')
    export class Main extends CCComp {
        @property(Button)
        closeBtn: Button = null!;

        start() {
            console.log("[ZhaoCha] UIZhaoChaMain start");
            this.closeBtn.node.on(Button.EventType.CLICK, this.onClose, this);

            const zhaoChaData = ZhaoChaData.getInstance();
            console.log(`[ZhaoCha] UIZhaoChaMain start, zhaoChaData: ${zhaoChaData.stageList.length}`);
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