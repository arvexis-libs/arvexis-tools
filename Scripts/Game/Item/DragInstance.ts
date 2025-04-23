/*
 * @Author: LiuGuoBing
 * @Description: 
 */
import { _decorator, Component, Node, UITransform, Prefab, instantiate, Collider2D, BoxCollider2D } from 'cc';
import { ZhaoChaMgr } from '../../Manager/ZhaoChaMgr';
import { DragItem } from './DragItem';
import { oops } from 'db://oops-framework/core/Oops';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
const { ccclass, property } = _decorator;

@ccclass('DragDrop/Instance')
export class DragInstance extends Component {
    @property({ type: Number, displayName: 'ID', tooltip: 'zc_ID' })
    instanceId: number = 0;

    collider: Collider2D = null!;

    protected onLoad(): void {
        oops.message.on(ZhaoChaEvent.SECTION_LOADED, this.onSectionLoaded, this);
        oops.message.on(ZhaoChaEvent.SECTION_CLEAN_START, this.onSectionCleanStart, this);
    }

    protected onSectionCleanStart(): void {
        oops.message.off(ZhaoChaEvent.SECTION_LOADED, this.onSectionLoaded, this);
    }

    protected onDestroy(): void {
        oops.message.off(ZhaoChaEvent.SECTION_CLEAN_START, this.onSectionCleanStart, this);
        oops.message.off(ZhaoChaEvent.SECTION_LOADED, this.onSectionLoaded, this);
    }

    async onSectionLoaded() {
        let config = ZhaoChaMgr.getInstance().getDragInstanceList(this.instanceId);
        if (!config) {
            console.error(`[zc]DragInstance: ID ${this.instanceId} `);
            return;
        }
        this.collider = this.node.getComponent(Collider2D)!;
        if (!this.collider) {
            console.error(`[zc]DragInstance: ID ${this.instanceId} `);
            return;
        }
        // 
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
        for (let i = 0; i < config.Num; i++) {
            const prefab = await ZhaoChaMgr.getInstance().resourceManager
            .loadAsync(`Common/DragItem_${config.DragItemType}`, Prefab);
            const node = instantiate(prefab);
            this.node.addChild(node);
            const randomX = Math.random() * width - width / 2;
            const randomY = Math.random() * height - height / 2;
            node.setPosition(randomX, randomY);
            // init
            const dragItem = node.getComponent(DragItem)!;
            dragItem.init(config, this.instanceId * 100 + i);
        }
        this.node.name = `DragInstance_${this.instanceId}`;
    }
}