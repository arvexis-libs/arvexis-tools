import { oops } from "db://oops-framework/core/Oops";
import { LayerType, UIConfig } from "db://oops-framework/core/gui/layer/LayerManager";

/**  */
export enum ZhaoChaUIID {
    Manager = 3000,
    Main,
    EntryPanel,
    Stage,
    CloseWindow,
    FailWindow,
    WinWindow,
}



export class ZhaoChaConfig {
    private  _isInit = false;
    private static _instance: ZhaoChaConfig | null = null;

    id: number = 0;

    public static getInstance(): ZhaoChaConfig {
        if (!ZhaoChaConfig._instance) {
            console.log(`[zc] Creating new ZhaoChaConfig instance`);
            ZhaoChaConfig._instance = new ZhaoChaConfig();
        }
        return ZhaoChaConfig._instance;
    }

    constructor() {
        this.id = Math.floor(Math.random() * 1000000);
        console.log(`[zc] ZhaoChaConfig constructor, id: ${this.id}`);
    }


    config: { [key: number]: UIConfig } = {
        [ZhaoChaUIID.Manager]: { layer: LayerType.UI, prefab: "UIPrefab/Main/ZhaoChaManager", bundle: "ZhaoCha" },
        [ZhaoChaUIID.Main]: { layer: LayerType.UI, prefab: "UIPrefab/Main/ZhaoChaMain", bundle: "ZhaoCha" },
        [ZhaoChaUIID.EntryPanel]: { layer: LayerType.UI, prefab: "UIPrefab/Entry/EntryPanel", bundle: "ZhaoCha" },
        [ZhaoChaUIID.Stage]: { layer: LayerType.UI, prefab: "UIPrefab/Stage/StageMain", bundle: "ZhaoCha" },
        [ZhaoChaUIID.CloseWindow]: { layer: LayerType.UI, prefab: "UIPrefab/Settle/CloseWindow", bundle: "ZhaoCha" },
        [ZhaoChaUIID.FailWindow]: { layer: LayerType.UI, prefab: "UIPrefab/Settle/FailWindow", bundle: "ZhaoCha" },
        [ZhaoChaUIID.WinWindow]: { layer: LayerType.UI, prefab: "UIPrefab/Settle/WinWindow", bundle: "ZhaoCha" },
    }

    /**  */
    bundleName = "ZhaoCha";

    init() {
        if (this._isInit) return;

        // console.log(`[zc] ZhaoChaConfig init, id: ${this.id}`);

        oops.gui.addConfig(this.config);
        this._isInit = true;
    }

    remove() {
        oops.gui.removeConfig(this.config);
        this._isInit = false;
        // console.log(`[zc] ZhaoChaConfig remove, id: ${this.id}`);
    }
}