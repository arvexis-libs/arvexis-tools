import { _decorator } from "cc";
import { CCComp } from "db://oops-framework/module/common/CCComp";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ZhaoChaConfig, ZhaoChaUIID } from "../Common/ZhaoChaUIConfig";



const { ccclass, property } = _decorator;

namespace ZhaoCha {
    @ccclass('ZhaoCha/Entry')
    export class Entry extends CCComp {
    
        start() {
            console.log("[zc] Entry start");
        }

        reset(): void {
            // 
        }

        onClick(): void {
            console.log("[zc] Entry onClick");
            // tips.confirm("111", () => {
            // }, "", () => {
            // }, "", false);
            ZhaoChaConfig.init();
            oops.gui.open(ZhaoChaUIID.Main);
        }


    }
}