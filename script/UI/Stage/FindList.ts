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
const { ccclass, property } = _decorator;


@ccclass('ZhaoCha/Stage/FindList')
export class FindList extends Component {

    @property([FindItem])
    items: FindItem[] = [];

    configs: TrZhaoChaItem[] = [];

    @property(ScrollView)
    scrollView: ScrollView = null!;

    @property(Node)
    contentNode: Node = null!;

    @property(Label)
    progress: Label = null!;

    start() {
        oops.message.on(ZhaoChaEvent.ITEM_CLICK, this.onItemClick, this);
        oops.message.on(ZhaoChaEvent.RESTART, this.onRestart, this);
        this.loadItems();
    }

    onDestroy(): void {
        oops.message.off(ZhaoChaEvent.ITEM_CLICK, this.onItemClick, this);
        oops.message.off(ZhaoChaEvent.RESTART, this.onRestart, this);
        console.log("[zc] FindList, onDestroy");
    }

    async loadItems() {
        // prefab
        const prefab = await ZhaoChaMgr.getInstance().resourceManager.loadAsync(`UIPrefab/Stage/FindItem`, Prefab);
        // item
        this.configs = ZhaoChaMgr.getInstance().curItems;
        this.items = [];
        for (let i = 0; i < this.configs.length; i++) {
            const node = instantiate(prefab);
            node.setParent(this.contentNode);
            const findItem = node.getComponent(FindItem)!;
            this.items.push(findItem);
        }
        // 
        this.scrollView.scrollToLeft();
        // 
        this.refreshProgress(0);
    }

    async onItemClick(event: string, ...args: any) {
        const id = parseInt(args);
        const item = this.freeItem;
        if (!item) {
            console.log("[zc] FindList, onItemClick, item");
            return;
        }
        // console.log(`[zc] FindList, onItemClick, id:${id}`);
        await item.refresh(id);
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
        // 
        this.refreshProgress(findNum);
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
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id == 0) {
                return this.items[i];
            }
        }
        return null!;
    }

    get count(): number {
        if (!this.configs) return 0;
        return this.configs.length;
    }

    onRestart(): void {
        this.refreshProgress(0);
    }

    refreshProgress(findNum: number): void {
        this.progress.string = `${findNum}/${this.count}`;
        if (findNum >= this.count) {
            oops.message.dispatchEvent(ZhaoChaEvent.WIN, {});
        }
    }
}
