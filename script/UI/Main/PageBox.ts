import { _decorator, ScrollView, Vec3, Node } from "cc";
import { CCComp } from "db://oops-framework/module/common/CCComp";
import { SortedMap } from "../../../../../script/modules/Utils/CollectionExtend/SortedMap";
import { PagePanel } from "./PagePanel";
import { TrZhaoChaStage } from "../../../../../script/game/schema/schema";
import { ZhaoChaMgr } from "../../Manager/ZhaoChaMgr";
const { ccclass, property } = _decorator;

export enum ScrollDirection
{
    Right = 0,
    Center = 1, //  
    Left = 2,
}


@ccclass('ZhaoCha/PageBox/ViewConfig')
class ViewConfig
{
    @property(ScrollView)
    scrollView: ScrollView = null!;

    @property
    pagwSize: number = 1080;

    @property
    pageTotal: number = 3;

    @property
    scrollDirection: ScrollDirection = ScrollDirection.Center;

    @property({ type: [PagePanel], visible: true })
    pagePanels: (PagePanel | null)[] = [];
}

@ccclass('ZhaoCha/PageBox/PageConfig')
class PageConfig
{
    @property({type: Number, tooltip: ""})
    pageTotal: number = 3;

    @property({type: Number, tooltip: ""})
    curPage: number = 1;

    @property({type: Number, tooltip: ""})
    pageSize: number = 6;

    @property({type: Number, tooltip: ""})
    count: number = 0;

    @property({type: Boolean, tooltip: ""})
    isInit: boolean = false;

    pageData: Map<number, [TrZhaoChaStage]> = new Map();

    init() {
        if (this.isInit) return;
        // 
        const data = ZhaoChaMgr.getInstance().stageList;
        this.count = data.length;
        //  
        this.pageTotal = Math.ceil(this.count / this.pageSize);
        // push
        this.pageData.clear();
        for (let i = 0; i < this.count; i++) {
            const page = Math.floor(i / this.pageSize);
            let pageArr = this.pageData.get(page);
            if (!pageArr) {
                pageArr = [];
                this.pageData.set(page, pageArr);
            }
            pageArr.push(data[i]);
        }
        this.isInit = true;
    }
}



@ccclass('ZhaoCha/PageBox')
export class PageBox extends CCComp {

    @property(ViewConfig)
    viewConfig: ViewConfig = new ViewConfig();

    @property(PageConfig)
    pageConfig: PageConfig = new PageConfig();


    start() {
        this.viewConfig.scrollView.node.on(ScrollView.EventType.SCROLL_ENDED, this.onEnd, this);
        // 
        this.pageConfig.init();
        // 
        this.move();
    }

    reset(): void {

    }

    scrollDirectionString(dir: ScrollDirection): string {
        switch (dir) {
            case ScrollDirection.Right:
                return "Right";
            case ScrollDirection.Center:
                return "Center";
            case ScrollDirection.Left:
                return "Left";
        }
    }

    onEnd() {
        // 
        const currentOffset = this.viewConfig.scrollView.getScrollOffset();
        
        // 
        this.viewConfig.scrollDirection =  Math.abs(Math.round(currentOffset.x / this.viewConfig.pagwSize));

        this.move();
    }

    move() {
        // if (this.viewConfig.scrollDirection == ScrollDirection.Center)  return;
        const content = this.viewConfig.scrollView.content;
        if (!content) return;

        console.log(`[zc]move: ${this.scrollDirectionString(this.viewConfig.scrollDirection)}`);
        // panel
        this.viewConfig.pagePanels = [];
        for (let i = 0; i < content.children.length; i++) {
            const panel = content.children[i].getComponent(PagePanel);
            this.viewConfig.pagePanels.push(panel);
        }

        // 
        let childs = new SortedMap<number, PagePanel | null>();
        for (let i = 0; i < this.viewConfig.pagePanels.length; i++) {
            const panel = this.viewConfig.pagePanels[i];
            let siblingIndex = i + this.viewConfig.pageTotal * 2;
            //  0
            if (this.viewConfig.scrollDirection == ScrollDirection.Left && i == 0) {
                siblingIndex += this.viewConfig.pageTotal;
                // console.log(`[zc] ${panel?.node.name} -> ${siblingIndex}`);
            }

            //  N
            if (this.viewConfig.scrollDirection == ScrollDirection.Right && i == this.viewConfig.pagePanels.length - 1) {
                siblingIndex -= this.viewConfig.pageTotal;
                // console.log(`[zc] ${panel?.node.name} -> ${siblingIndex}`);
            }
            
            childs.set(siblingIndex, panel);
        }

        // 
        let viewIndex = 0;
        childs.forEach((panel, siblingIndex) => {
            if (!panel) return;
            // console.log(`[zc], siblingIndex:${siblingIndex}`);
            const pos = new Vec3((viewIndex - 1) * this.viewConfig.pagwSize, 0, 0);
            const node = panel.node;
            node.setPosition(pos);
            // node.name = `${viewIndex} - ${siblingIndex}`;
            node.setSiblingIndex(siblingIndex);
            viewIndex++;
        });

        // 
        this.viewConfig.scrollView.scrollToLeft();
        content.setPosition(new Vec3(0, 0, 0));

        //  
        this.pageConfig.curPage = this.getFinalPage(this.pageConfig.curPage + this.viewConfig.scrollDirection - 1);

        // 
        viewIndex = 0;
        childs.forEach((panel, siblingIndex) => {
            if (!panel) return;
            panel.refresh(viewIndex);
            viewIndex++;
        });
    }

    getFinalPage(page: number): number {
        if (page < 1) {
            page = this.pageConfig.pageTotal -page;
        }
        if (page > this.pageConfig.pageTotal) {
            page = page - this.pageConfig.pageTotal;
        }
        return page;
    }
}
