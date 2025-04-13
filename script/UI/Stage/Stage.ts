import { _decorator, Component, Node } from 'cc';
import { TrZhaoChaStage } from '../../../../../script/game/schema/schema';
import { oops } from "db://oops-framework/core/Oops";
import { Label } from 'cc';
import { ZhaoChaMgr } from '../../Manager/ZhaoChaMgr';
import { ZhaoChaUIID } from '../../Common/ZhaoChaConfig';
import { FindList } from './FindList';
import { Prefab } from 'cc';
import { instantiate } from 'cc';
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
        this.title.string = this.config.Name;
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

    onClose(): void {
        console.log("[zc] UIZhaoCha, Stage onClose");
        this.findList.clean();
        oops.gui.remove(ZhaoChaUIID.Stage);
    }
}
