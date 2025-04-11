import { _decorator, Component, Node } from 'cc';
import { ZhaoChaMgr } from '../../Manager/ZhaoChaMgr';
import { Prefab } from 'cc';
import { instantiate } from 'cc';
const { ccclass, property } = _decorator;

/*  */
@ccclass('ZhaoCha/Game/Item/ShowCircle')
export class ShowCircle extends Component {

    @property(String)
    prefabName: string = "circle";

    @property(Node)
    circleNode: Node = null!;

    async show(): Promise<void> {
        if (this.circleNode) return;
        console.log(`[zc] ShowCircle 1, show, name:${this.prefabName}`);
        const prefab = await ZhaoChaMgr.getInstance().resourceManager.loadAsync(`common/${this.prefabName}`, Prefab);
        console.log(`[zc] ShowCircle 2, show, name:${this.prefabName}`);
        this.circleNode = instantiate(prefab);
        this.node.addChild(this.circleNode);
    }

    remove(): void {
        if (!this.circleNode) return;
        this.circleNode.destroy();
    }
}