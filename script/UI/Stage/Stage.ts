import { _decorator, director, Component, Node } from 'cc';
import { Label, Prefab, instantiate } from 'cc';
import { TrZhaoChaSection, TrZhaoChaStage } from '../../../../../script/game/schema/schema';
import { oops } from "db://oops-framework/core/Oops";
import { ZhaoChaMgr } from '../../Manager/ZhaoChaMgr';
import { ZhaoChaUIID } from '../../Common/ZhaoChaConfig';
import { FindList } from './FindList';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
import { EventUtil } from 'db://assets/script/modules/Utils/NodeExtend/EventUtil';
import { ClickEffect } from './ClickEffect';
import { ItemBase } from '../../Game/Item/ItemBase';
const { ccclass, property } = _decorator;


@ccclass('ZhaoCha/Stage')
export class Stage extends Component {
    @property(Label)
    title: Label = null!;

    @property(Node)
    content: Node = null!;

    @property(Node)
    loadNode: Node = null!;

    @property(FindList)
    findList: FindList = null!;

    @property(ClickEffect)
    clickEffect: ClickEffect = null!;

    loadedStage: Node = null!;

    get stageConfig(): TrZhaoChaStage {
        return ZhaoChaMgr.getInstance().curStage;
    }

    get sectionConfig(): TrZhaoChaSection {
        return ZhaoChaMgr.getInstance().curSection;
    }

    start() {
        // loading 
        this.loadNode.active = true;
        //  
        oops.message.on(ZhaoChaEvent.COUNT_DOWN_END, this.onCountDownEnd, this);
        oops.message.on(ZhaoChaEvent.EXIT, this.onExit, this);
        oops.message.on(ZhaoChaEvent.WIN, this.onWin, this);
        oops.message.on(ZhaoChaEvent.RESTART, this.onRestart, this);
        oops.message.on(ZhaoChaEvent.SECTION_START, this.onSectionStart, this);
        // 
        this.startFirstSection();
    }

    onDestroy(): void {
        oops.message.off(ZhaoChaEvent.COUNT_DOWN_END, this.onCountDownEnd, this);
        oops.message.off(ZhaoChaEvent.EXIT, this.onExit, this);
        oops.message.off(ZhaoChaEvent.WIN, this.onWin, this);
        oops.message.off(ZhaoChaEvent.RESTART, this.onRestart, this);
        oops.message.off(ZhaoChaEvent.SECTION_START, this.onSectionStart, this);
    }

    startFirstSection(): void {
        ZhaoChaMgr.getInstance().setStageDefaultSection();
        oops.message.dispatchEvent(ZhaoChaEvent.SECTION_START, {});
    }

    async onSectionStart(): Promise<void> {
        // title
        this.title.string = `${this.stageConfig.Name} ${this.stageConfig.Title}`;
        // 
        const prefabUrl = `StagePrefab/${this.sectionConfig.SectionPrefab}`;
        const prefab = await ZhaoChaMgr.getInstance().resourceManager.loadAsync(prefabUrl, Prefab);
        if (prefab == null) {
            console.error(`[zc] Stage, start, prefab not found, prefabUrl:${prefabUrl}`);
            return;
        }
        // 
        this.loadedStage = instantiate(prefab);
        this.loadedStage.setParent(this.content);
        // // Item
        // const items = this.loadedStage.getComponentsInChildren(ItemBase);
        // for (const item of items) {
        //     item.init();
        // }
        // load
        this.loadNode.active = false;
        // 
        oops.message.dispatchEvent(ZhaoChaEvent.SECTION_LOADED, {});
        console.log(`[zc] SectionLoaded, Stage dispatchEvent`);
    }

    /*  */
    openCloseWindow(): void {
        console.log("[zc] UIZhaoCha, Stage openCloseWindow");
        oops.gui.open(ZhaoChaUIID.CloseWindow);
    }
    /*  */
    onCountDownEnd(): void {
        // this.onExit();
        oops.gui.open(ZhaoChaUIID.FailWindow);
    }

    /*  */
    onExit(): void {
        console.log("[zc] UIZhaoCha, Stage onExit");
        oops.gui.remove(ZhaoChaUIID.Stage);
    }

    /*  */
    onWin(): void {
        console.log("[zc] UIZhaoCha, Stage onWin");
        oops.gui.open(ZhaoChaUIID.WinWindow);
    }

    /**  */
    onRestart(): void {
        console.log("[zc] UIZhaoCha, Stage onRestart");
        if (this.loadedStage) {
            this.loadedStage.destroy();
            this.loadedStage = null!;
        }
        this.startFirstSection();
    }

    onClick(): void {
        console.log("[zc] UIZhaoCha, Stage onClick");
    }
}
