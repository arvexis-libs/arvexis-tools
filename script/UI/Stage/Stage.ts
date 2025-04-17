import { _decorator, Component, Node } from 'cc';
import { TrZhaoChaStage } from '../../../../../script/game/schema/schema';
import { oops } from "db://oops-framework/core/Oops";
import { Label } from 'cc';
import { ZhaoChaMgr } from '../../Manager/ZhaoChaMgr';
import { ZhaoChaUIID } from '../../Common/ZhaoChaConfig';
import { FindList } from './FindList';
import { Prefab } from 'cc';
import { instantiate } from 'cc';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
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
        // title
        this.title.string = `${this.config.Name} ${this.config.Title}`;
        // 
        const prefabUrl = `StagePrefab/${this.config.Prefab}`;
        const prefab = await ZhaoChaMgr.getInstance().resourceManager.loadAsync(prefabUrl, Prefab);
        if (!prefab) {
            console.error(`[zc] Stage, start, prefab not found, prefabUrl:${prefabUrl}`);
            return;
        }
        // 
        const node = instantiate(prefab);
        node.setParent(this.content);
        // load
        this.loadNode.active = false;
    }

    onDestroy(): void {
        oops.message.off(ZhaoChaEvent.COUNT_DOWN_END, this.onCountDownEnd, this);
        oops.message.off(ZhaoChaEvent.EXIT, this.onExit, this);
        oops.message.off(ZhaoChaEvent.WIN, this.onWin, this);
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

    onWin(): void {
        console.log("[zc] UIZhaoCha, Stage onWin");
        oops.gui.open(ZhaoChaUIID.WinWindow);
    }
}
