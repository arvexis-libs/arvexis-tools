import { _decorator, director, Component, Node } from 'cc';
import { Label, Prefab, instantiate } from 'cc';
import { TrZhaoChaStage } from '../../../../../script/game/schema/schema';
import { oops } from "db://oops-framework/core/Oops";
import { ZhaoChaMgr } from '../../Manager/ZhaoChaMgr';
import { ZhaoChaUIID } from '../../Common/ZhaoChaConfig';
import { FindList } from './FindList';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
import { EventUtil } from 'db://assets/script/modules/Utils/NodeExtend/EventUtil';
import { ClickEffect } from './ClickEffect';
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

    get config(): TrZhaoChaStage {
        return ZhaoChaMgr.getInstance().curConfig;
    }

    async start() {
        // loading 
        this.loadNode.active = true;
        // 
        oops.message.on(ZhaoChaEvent.COUNT_DOWN_END, this.onCountDownEnd, this);
        oops.message.on(ZhaoChaEvent.EXIT, this.onExit, this);
        oops.message.on(ZhaoChaEvent.WIN, this.onWin, this);
        oops.message.on(ZhaoChaEvent.RESTART, this.onRestart, this);
        // title
        this.title.string = `${this.config.Name} ${this.config.Title}`;
        // 
        await this.load();
        // load
        this.loadNode.active = false;
    }

    /*  */
    async load(): Promise<void> {
        const prefabUrl = `StagePrefab/${this.config.Prefab}`;
        const prefab = await ZhaoChaMgr.getInstance().resourceManager.loadAsync(prefabUrl, Prefab);
        if (prefab == null) {
            console.error(`[zc] Stage, start, prefab not found, prefabUrl:${prefabUrl}`);
            return;
        }
        // 
        this.loadedStage = instantiate(prefab);
        this.loadedStage.setParent(this.content);
    }

    onDestroy(): void {
        oops.message.off(ZhaoChaEvent.COUNT_DOWN_END, this.onCountDownEnd, this);
        oops.message.off(ZhaoChaEvent.EXIT, this.onExit, this);
        oops.message.off(ZhaoChaEvent.WIN, this.onWin, this);
        oops.message.off(ZhaoChaEvent.RESTART, this.onRestart, this);
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
        this.load();
    }

    onClick(): void {
        console.log("[zc] UIZhaoCha, Stage onClick");
    }
}
