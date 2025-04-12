import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { LayerType, UIConfig } from "../../../../../extensions/oops-plugin-framework/assets/core/gui/layer/LayerManager";

/**  */
export enum ZhaoChaUIID {
    Main = 2000,
    EntryPanel,
    Stage,
}



export class ZhaoChaConfig {
    private static _isInit = false;
    static config: { [key: number]: UIConfig } = {
        [ZhaoChaUIID.Main]: { layer: LayerType.UI, prefab: "UIPrefab/Main/Main", bundle: "ZhaoCha" },
        [ZhaoChaUIID.EntryPanel]: { layer: LayerType.UI, prefab: "UIPrefab/Entry/EntryPanel", bundle: "ZhaoCha" },
        [ZhaoChaUIID.Stage]: { layer: LayerType.UI, prefab: "UIPrefab/Stage/StageMain", bundle: "ZhaoCha" },
    }

    /**  */
    static bundleName = "ZhaoCha";

    static init() {
        if (this._isInit) return;
        oops.gui.addConfig(this.config);
        this._isInit = true;
    }

    static remove() {
        oops.gui.removeConfig(this.config);
    }
}