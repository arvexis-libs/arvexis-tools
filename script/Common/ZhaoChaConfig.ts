import { oops } from "db://oops-framework/core/Oops";
import { LayerType, UIConfig } from "db://oops-framework/core/gui/layer/LayerManager";

/**  */
export enum ZhaoChaUIID {
    Main = 2000,
    EntryPanel,
    Stage,
    CloseWindow,
    FailWindow,
    WinWindow,
}



export class ZhaoChaConfig {
    private static _isInit = false;
    static config: { [key: number]: UIConfig } = {
        [ZhaoChaUIID.Main]: { layer: LayerType.UI, prefab: "UIPrefab/Main/Main", bundle: "ZhaoCha" },
        [ZhaoChaUIID.EntryPanel]: { layer: LayerType.UI, prefab: "UIPrefab/Entry/EntryPanel", bundle: "ZhaoCha" },
        [ZhaoChaUIID.Stage]: { layer: LayerType.UI, prefab: "UIPrefab/Stage/StageMain", bundle: "ZhaoCha" },
        [ZhaoChaUIID.CloseWindow]: { layer: LayerType.UI, prefab: "UIPrefab/Stage/CloseWindow", bundle: "ZhaoCha" },
        [ZhaoChaUIID.FailWindow]: { layer: LayerType.UI, prefab: "UIPrefab/Stage/FailWindow", bundle: "ZhaoCha" },
        [ZhaoChaUIID.WinWindow]: { layer: LayerType.UI, prefab: "UIPrefab/Stage/WinWindow", bundle: "ZhaoCha" },
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
        this._isInit = false;
    }
}