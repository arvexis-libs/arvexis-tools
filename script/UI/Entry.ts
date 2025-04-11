import { _decorator } from "cc";
import { CCComp } from "db://oops-framework/module/common/CCComp";
import { tips } from "../../../../script/game/common/prompt/TipsManager";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { UIID } from "../../../../script/game/common/config/GameUIConfig";
import { ZhaoChaUIConfig, ZhaoChaUIID } from "../Base/ZhaoChaUIConfig";

const { ccclass, property } = _decorator;

export namespace ZhaoCha {
    @ccclass('ZhaoCha/Entry')
    export class Entry extends CCComp {
    
        start() {
            console.log("[ZhaoCha] Entry start");
        }

        reset(): void {
            // 
        }

        onClick(): void {
            console.log("[ZhaoCha] Entry onClick");
            // tips.confirm("111", () => {
            // }, "", () => {
            // }, "", false);
            ZhaoChaUIConfig.init();
            oops.gui.open(ZhaoChaUIID.Main);
        }
    }
}