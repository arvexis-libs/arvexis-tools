import { Component, Asset } from "cc";
import { _decorator } from "cc";
import { ZhaoChaConfig } from "../Common/ZhaoChaConfig";

import { oops } from "db://oops-framework/core/Oops";
import { AssetType } from "db://oops-framework/core/common/loader/ResLoader";
const { ccclass, property } = _decorator;

class AssetCache {
    resName: string = "";
    bundleName: string = "";
    type: AssetType<Asset> = null!;
    asset: Asset = null!;
}

@ccclass('ZhaoCha/Data/ResourceManager')
export class ResourceManager
{
    private cacheMap: Map<string, AssetCache> = new Map();

    @property(Number)
    private count: number = 0;
    
    /*  */
    // async loadAsync<T extends Asset>(resName: string): Promise<T>;
    async loadAsync<T extends Asset>(resName: string, type: AssetType<T>, bundleName: string = ""): Promise<T> {
        if (bundleName == "") bundleName = ZhaoChaConfig.bundleName;
        const key = this.getKey(resName, bundleName);
        if (this.cacheMap.has(key)) {
            let assetCache = this.cacheMap.get(key);
            return assetCache?.asset as T;
        } else {
            let res = await oops.res.loadAsync(bundleName, resName, type);
            this.cacheMap.set(key, {
                resName: resName,
                bundleName: bundleName,
                type: type,
                asset: res
            });
            this.count++;
            return res as T;
        }
    }

    /* key */
    private getKey(resName: string, bundleName: string): string {
        return `${resName}-${bundleName}`;
    }

    /*  */
    clear() {
        this.cacheMap.forEach((assetCache, key) => {
            oops.res.release(assetCache.resName, assetCache.bundleName);
            assetCache.asset.destroy();
        });
        this.cacheMap.clear();
        console.log(`[zc] ResourceManager clear, count: ${this.count}`);
        this.count = 0;
    }
}