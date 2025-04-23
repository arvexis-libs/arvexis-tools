import { _decorator, Component, Node } from 'cc';
import { TrZhaoChaItem, TrZhaoChaStage } from '../../../../../script/game/schema/schema';
import { oops } from "db://oops-framework/core/Oops";
import { Label } from 'cc';
import { ZhaoChaMgr } from '../../Manager/ZhaoChaMgr';
import { ZhaoChaUIID } from '../../Common/ZhaoChaConfig';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
import { Prefab } from 'cc';
import { instantiate } from 'cc';
import { FindItem } from './FindItem';
import { ScrollView } from 'cc';
import { Vec2 } from 'cc';
import { NodeHelper } from '../../../../../script/modules/Utils/NodeExtend/NodeHelper';
import { Stage } from './Stage';
const { ccclass, property } = _decorator;


@ccclass('ZhaoCha/Stage/FindList')
export class FindList extends Component {

    items: FindItem[] = [];

    configs: TrZhaoChaItem[] = [];

    @property(ScrollView)
    scrollView: ScrollView = null!;

    @property(Node)
    contentNode: Node = null!;



    onLoad() {
        console.log("[zc] FindList, onLoad");
        oops.message.on(ZhaoChaEvent.SECTION_LOADED, this.onSectionLoaded, this);
    }

    onDestroy(): void {
        oops.message.off(ZhaoChaEvent.SECTION_LOADED, this.onSectionLoaded, this);
        oops.message.off(ZhaoChaEvent.ITEM_FINISH, this.onItemFinish, this);
        oops.message.off(ZhaoChaEvent.SECTION_CLEAN_START, this.onSectionCleanStart, this);
        console.log("[zc] FindList, onDestroy");
    }

    onSectionLoaded(): void {
        console.log("[zc] FindList, onSectionLoaded");
        oops.message.on(ZhaoChaEvent.ITEM_FINISH, this.onItemFinish, this);
        oops.message.on(ZhaoChaEvent.SECTION_CLEAN_START, this.onSectionCleanStart, this);
        this.loadItems();
    }

    onSectionCleanStart(): void {
        // 
        NodeHelper.destroyAllChild(this.contentNode);
        this.items = [];
        oops.message.off(ZhaoChaEvent.ITEM_FINISH, this.onItemFinish, this);
        oops.message.off(ZhaoChaEvent.SECTION_CLEAN_START, this.onSectionCleanStart, this);
    }

    async loadItems() {
        // prefab
        const prefab = await ZhaoChaMgr.getInstance().resourceManager.loadAsync(`UIPrefab/Stage/FindItem`, Prefab);
        // item
        this.configs = ZhaoChaMgr.getInstance().curItems;
        for (let i = 0; i < this.configs.length; i++) {
            const node = instantiate(prefab);
            node.setParent(this.contentNode);
            const findItem = node.getComponent(FindItem)!;
            this.items.push(findItem);
        }
        // 
        this.scrollView.scrollToLeft();
    }

    async onItemFinish(event: string, ...args: any) {
        const id = parseInt(args);
        const item = this.freeItem;
        if (!item) {
            console.log("[zc] FindList, onItemClick, item");
            return;
        }
        console.log(`[zc] FindList, onItemFinish, id:${id}`);
        await item.refresh(id);
        try {
            // 
            const findNum = this.findItems.length;
            const scrollStep = 5;
            if (findNum < scrollStep) {
                this.scrollView.scrollToTopLeft();
            } else {
                // scrollStep  100
                const scrollX = findNum / scrollStep * 100;
                this.scrollView.scrollTo(new Vec2(scrollX, 0), 0);
            }
        } catch (e) {
            console.error("[zc] FindList, onItemFinish, error", e);
        }
    }
    /**
     * item
     */
    get findItems(): FindItem[] {
        let arr: FindItem[] = [];
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id != 0) {
                arr.push(this.items[i]);
            }
        }
        return arr;
    }

    /**
     * item
     */
    get freeItem(): FindItem {
        if (!this.items) return null!;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id == 0) {
                return this.items[i];
            }
        }
        return null!;
    }

    get curCount(): number {
        if (!this.configs) return 0;
        return this.configs.length;
    }
}
