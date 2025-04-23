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
    @property(Number)
    private id: number = 0;

    private cacheMap: Map<string, AssetCache> = new Map();

    private count: number = 0;

    constructor(id: number) {
        this.id = id;
    }
    
    /*  */
    // async loadAsync<T extends Asset>(resName: string): Promise<T>;
    async loadAsync<T extends Asset>(resName: string, type: AssetType<T>, bundleName: string = ""): Promise<T> {
        if (bundleName == "") bundleName = ZhaoChaConfig.getInstance().bundleName;
        const key = this.getKey(resName, bundleName);
        if (this.cacheMap.has(key)) {
            let assetCache = this.cacheMap.get(key)!;
            if (assetCache && assetCache.asset) {
                // console.log(`[zc] ResourceManager loadAsync, from cache, id: ${this.id}, resName: ${resName}, bundleName: ${bundleName}`);
                return assetCache.asset as T;
            } else {
                console.error(`[zc] ResourceManager loadAsync, assetCache is null or asset is null, resName: ${resName}, bundleName: ${bundleName}`);
                return null!;
            }
        } else {
            let res = await oops.res.loadAsync(bundleName, resName, type);
            this.cacheMap.set(key, {
                resName: resName,
                bundleName: bundleName,
                type: type,
                asset: res
            });
            // console.log(`[zc] ResourceManager loadAsync, id: ${this.id}, resName: ${resName}, bundleName: ${bundleName}, count: ${this.count}`);
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
            // assetCache.asset.destroy();
        });
        this.cacheMap.clear();
        console.log(`[zc] ResourceManager clear, count: ${this.count}`);
        this.count = 0;
    }
}