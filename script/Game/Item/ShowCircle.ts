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
        // console.log(`[zc] ShowCircle 1, show, name:${this.prefabName}`);
        const prefab = await ZhaoChaMgr.getInstance().resourceManager.loadAsync(`Common/${this.prefabName}`, Prefab);
        this.circleNode = instantiate(prefab);
        this.node.addChild(this.circleNode);
        //    width > height:width height width < height:height width
        let boxSize = this.node.uiTransform.contentSize;
        let circleSize = this.circleNode.uiTransform.contentSize;
        let ratio = 1;
        if (boxSize.width > boxSize.height) {
            ratio = circleSize.width / circleSize.height;
            this.circleNode.uiTransform.setContentSize(boxSize.width, boxSize.width * ratio);
        } else {
            ratio = circleSize.height / circleSize.width;
            this.circleNode.uiTransform.setContentSize(boxSize.height, boxSize.height * ratio);
        }

        this.circleNode.setPosition(0, 0);
    }

    remove(): void {
        if (!this.circleNode) return;
        this.circleNode.destroy();
        this.circleNode = null!;
    }
}