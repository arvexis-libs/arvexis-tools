import { _decorator, Component, Node } from 'cc';
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
import { NodeHelper } from '../../../../../script/modules/Utils/NodeExtend/NodeHelper';
const { ccclass, property } = _decorator;


@ccclass('ZhaoCha/Stage')
export class Stage extends Component {
    @property(Label)
    title: Label = null!;

    @property(Node)
    content: Node = null!;

    @property(Node)
    loadNode: Node = null!;

    @property(Node)
    findListNode: Node = null!;

    @property(ClickEffect)
    clickEffect: ClickEffect = null!;

    @property(Label)
    progress: Label = null!;
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
        oops.message.on(ZhaoChaEvent.SECTION_FINISH, this.onSectionFinish, this);
        oops.message.on(ZhaoChaEvent.SECTION_CLEAN_START, this.onSectionCleanStart, this);
        oops.message.on(ZhaoChaEvent.SECTION_CLEAN_END, this.onSectionCleanEnd, this);
        // 
        this.startFirstSection();
    }

    onDestroy(): void {
        oops.message.off(ZhaoChaEvent.COUNT_DOWN_END, this.onCountDownEnd, this);
        oops.message.off(ZhaoChaEvent.EXIT, this.onExit, this);
        oops.message.off(ZhaoChaEvent.WIN, this.onWin, this);
        oops.message.off(ZhaoChaEvent.RESTART, this.onRestart, this);
        oops.message.off(ZhaoChaEvent.SECTION_START, this.onSectionStart, this);
        oops.message.off(ZhaoChaEvent.SECTION_FINISH, this.onSectionFinish, this);
        oops.message.off(ZhaoChaEvent.SECTION_CLEAN_START, this.onSectionCleanStart, this);
        oops.message.off(ZhaoChaEvent.SECTION_CLEAN_END, this.onSectionCleanEnd, this);
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
        const sectionNode = instantiate(prefab);
        sectionNode.setParent(this.content);
        // findList
        const findListPrefabUrl = `UIPrefab/Stage/FindList`;
        const findListPrefab = await ZhaoChaMgr.getInstance().resourceManager.loadAsync(findListPrefabUrl, Prefab);
        if (findListPrefab == null) {
            console.error(`[zc] Stage, start, findListPrefab not found, findListPrefabUrl:${findListPrefabUrl}`);
            return;
        }
        //  findList
        const findListNode = instantiate(findListPrefab);
        findListNode.setParent(this.findListNode);
        //  
        // load
        this.loadNode.active = false;
        // 
        console.log(`[zc] SectionLoaded, Stage dispatchEvent`);
        oops.message.dispatchEvent(ZhaoChaEvent.SECTION_LOADED, {});
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
        console.log("[zc] Stage onRestart");
        ZhaoChaMgr.getInstance().setStageDefaultSection();
        // 
        oops.message.dispatchEvent(ZhaoChaEvent.SECTION_CLEAN_START, {});
    }

    onSectionFinish(): void {
        ZhaoChaMgr.getInstance().setStageNextSection();
        // win
        if (!ZhaoChaMgr.getInstance().curSection) {
            console.log("[zc]Stage onSectionFinish, dispatchEvent WIN");
            oops.message.dispatchEvent(ZhaoChaEvent.WIN, {});
            return;
        }
        console.log(`[zc]Stage onSectionFinish, next section:${ZhaoChaMgr.getInstance().curSection.SectionId}`);
        // 
        oops.message.dispatchEvent(ZhaoChaEvent.SECTION_CLEAN_START, {});
    }

    onSectionCleanStart(): void {
        console.log("[zc] Stage onSectionCleanStart");
        // destroy loadedSection
        NodeHelper.destroyAllChild(this.content);
        // destroy findListNode
        NodeHelper.destroyAllChild(this.findListNode);
        // 
        oops.message.dispatchEvent(ZhaoChaEvent.SECTION_CLEAN_END, {});
    }

    onSectionCleanEnd(): void {
        console.log("[zc] Stage onSectionCleanEnd");
        oops.timer.scheduleOnce(() => {
            oops.message.dispatchEvent(ZhaoChaEvent.SECTION_START, {});
        }, 3);
    }
}
