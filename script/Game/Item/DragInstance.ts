/*
 * @Author: LiuGuoBing
 * @Description: 
 */
import { _decorator, Component, Node, UITransform, Prefab, instantiate, Collider2D, BoxCollider2D } from 'cc';
import { ZhaoChaMgr } from '../../Manager/ZhaoChaMgr';
const { ccclass, property } = _decorator;

@ccclass('DragDrop/Instance')
export class DragInstance extends Component {
    @property({ type: Number, displayName: 'ID', tooltip: 'zc_ID' })
    instanceId: number = 0;

    collider: Collider2D = null!;

    async start() {
        this.collider = this.node.getComponent(Collider2D)!;
        let width = 0;
        let height = 0;
        if (this.collider && (this.collider instanceof BoxCollider2D)) {
            width = (this.collider as BoxCollider2D).size.width;
            height = (this.collider as BoxCollider2D).size.height;
        } else {
            const uiTrans = this.node.getComponent(UITransform);
            if (uiTrans) {
                width = uiTrans.contentSize.width;
                height = uiTrans.contentSize.height;
            }
        }

        let list = ZhaoChaMgr.getInstance().getDragInstanceList(this.instanceId);
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            const prefab = await ZhaoChaMgr.getInstance().resourceManager
            .loadAsync(`Common/DragItem_${item.DragItemType}`, Prefab);
            const node = instantiate(prefab);
            this.node.addChild(node);
            const randomX = Math.random() * width - width / 2;
            const randomY = Math.random() * height - height / 2;
            node.setPosition(randomX, randomY);
        }
    }
}