import { _decorator, Component } from "cc";
import { CCComp } from "db://oops-framework/module/common/CCComp";
import { oops } from "db://oops-framework/core/Oops";
import { ZhaoChaConfig, ZhaoChaUIID } from "../../Common/ZhaoChaConfig";



const { ccclass, property } = _decorator;


@ccclass('ZhaoCha/Entry')
export class Entry extends Component {


    reset(): void {
        // 
    }

    onClick(): void {
        console.log("[zc] Entry onClick");
        // tips.confirm("111", () => {
        // }, "", () => {
        // }, "", false);
        ZhaoChaConfig.getInstance().init();
        oops.gui.open(ZhaoChaUIID.Main);
    }


}
