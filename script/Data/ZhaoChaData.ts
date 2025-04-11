import ConfigManager from "../../../../script/game/manager/Config/ConfigManager";
import { TrZhaoChaStage } from "../../../../script/game/schema/schema";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;


export class ZhaoChaData {
    private static _instance: ZhaoChaData;
    private _stageList: TrZhaoChaStage[] = [];

    constructor() {
        this._stageList = ConfigManager.tables.TbZhaoChaStage.getDataList();
    }

    public static getInstance(): ZhaoChaData {
        if (!this._instance) {
            this._instance = new ZhaoChaData();
        }
        return this._instance;
    }

    public get stageList(): TrZhaoChaStage[] {
        return this._stageList;
    }
}
