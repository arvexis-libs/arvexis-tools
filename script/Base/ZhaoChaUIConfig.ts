import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { LayerType, UIConfig } from "../../../../../extensions/oops-plugin-framework/assets/core/gui/layer/LayerManager";

/**  */
export enum ZhaoChaUIID {
    Main = 2000,
}



export class ZhaoChaUIConfig {
    static config: { [key: number]: UIConfig } = {
        [ZhaoChaUIID.Main]: { layer: LayerType.UI, prefab: "UIPrefab/Main", bundle: "ZhaoCha" },
    }

    static init() {
        oops.gui.addConfig(this.config);
    }

    static remove() {
        oops.gui.removeConfig(this.config);
    }
}