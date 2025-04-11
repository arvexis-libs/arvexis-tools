import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { LayerType, UIConfig } from "../../../../../extensions/oops-plugin-framework/assets/core/gui/layer/LayerManager";

/**  */
export enum ZhaoChaUIID {
    Main = 2000,
    Stage,
}



export class ZhaoChaConfig {
    static config: { [key: number]: UIConfig } = {
        [ZhaoChaUIID.Main]: { layer: LayerType.UI, prefab: "UIPrefab/Main/Main", bundle: "ZhaoCha" },
        [ZhaoChaUIID.Stage]: { layer: LayerType.UI, prefab: "UIPrefab/Stage/StageMain", bundle: "ZhaoCha" },
    }

    /**  */
    static bundleName = "ZhaoCha";

    static init() {
        oops.gui.addConfig(this.config);
    }

    static remove() {
        oops.gui.removeConfig(this.config);
    }
}