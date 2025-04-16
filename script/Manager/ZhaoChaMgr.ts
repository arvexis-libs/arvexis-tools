import { CCComp } from "db://oops-framework/module/common/CCComp";
import ConfigManager from "../../../../script/game/manager/Config/ConfigManager";
import { TrZhaoChaDragItem, TrZhaoChaItem, TrZhaoChaStage } from "../../../../script/game/schema/schema";
import { _decorator } from "cc";
import { ResourceManager } from "./ResourceManager";
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/Mgr')
export class ZhaoChaMgr extends CCComp {
    reset(): void {
        throw new Error("Method not implemented.");
    }
    private static _instance: ZhaoChaMgr;
    public static getInstance(): ZhaoChaMgr {
        if (!this._instance) {
            throw new Error("[zc] ZhaoChaMgr not found");
        }
        return this._instance;
    }
    @property(ResourceManager)
    public resourceManager: ResourceManager = new ResourceManager();

    onLoad(): void {
        ZhaoChaMgr._instance = this.node.getComponent(ZhaoChaMgr)!;
    }

    onDestroy(): void {
        // stage
        this._stageList = [];
        // resource
        this.resourceManager?.clear();
        this.resourceManager = null!;
    }

    //#region 
    private _stageList: TrZhaoChaStage[] = [];

    /** ID */
    public curStageId: number = 0;
    /**  */
    public get stageList(): TrZhaoChaStage[] {
        if (this._stageList.length == 0) {
            this._stageList = ConfigManager.tables.TbZhaoChaStage.getDataList();
        }
        return this._stageList;
    }

    /**  */
    public get curConfig(): TrZhaoChaStage {
        for (let i = 0; i < this._stageList.length; i++) {
            if (this._stageList[i].Id == this.curStageId) {
                return this._stageList[i];
            }
        }
        return null!;
    }
    /**
     * 
     */
    public get curItems(): TrZhaoChaItem[] {
        const items = ConfigManager.tables.TbZhaoChaItem.getDataList();
        return items.filter(item => item.Stage == this.curStageId);
    }
    //#endregion

    //#region 
    /**  */
    private get dragInstanceList(): TrZhaoChaDragItem[] {
        let list = ConfigManager.tables.TbZhaoChaDragItem.getDataList();
        list = list.filter(item => item.Stage == this.curStageId);
        return list;
    }
    /** ID */
    public getDragInstanceList(instanceId: number): TrZhaoChaDragItem[] {
        let list = this.dragInstanceList;
        list.filter(item => item.InstanceId == instanceId);
        return list;
    }
    //#endregion
}
