import { _decorator, Component, Node } from 'cc';
import { TrZhaoChaStage } from '../../../../../script/game/schema/schema';
import { oops } from "db://oops-framework/core/Oops";
import { Label } from 'cc';
import { ZhaoChaMgr } from '../../Manager/ZhaoChaMgr';
import { ZhaoChaUIID } from '../../Common/ZhaoChaUIConfig';
const { ccclass, property } = _decorator;


@ccclass('ZhaoCha/Stage')
export class Stage extends Component {
    @property(Label)
    title: Label = null!;

    @property(Node)
    content: Node = null!;

    @property(Node)
    loadNode: Node = null!;

    get config(): TrZhaoChaStage {
        return ZhaoChaMgr.getInstance().curConfig;
    }

    start() {
        this.title.string = this.config.Name;
        this.loadNode.active = false;
    }

    onClose(): void {
        console.log("[zc] UIZhaoCha, Stage onClose");
        oops.gui.remove(ZhaoChaUIID.Stage);
    }
}
