import { _decorator, ScrollView, Vec3, Node } from "cc";
import { CCComp } from "db://oops-framework/module/common/CCComp";
import { PageBox, ScrollDirection } from "./PageBox";
import { Label } from "cc";
import { StageCover } from "./StageCover";
import { TrZhaoChaStage } from "../../../../../script/game/schema/schema";
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/PagePanel/ViewConfig')
class ViewConfig {
    @property(Node)
    page: Node = null!;

    @property(Node)
    content: Node = null!;
}

@ccclass('ZhaoCha/PagePanel')
export class PagePanel extends CCComp {
    @property(Number)
    index: number = 0;

    @property(Number)
    page: number = 0;

    @property(Node)
    pageBoxNode: Node = null!;

    @property(ViewConfig)
    viewConfig: ViewConfig = new ViewConfig();

    reset(): void {
        throw new Error("Method not implemented.");
    }

    get pageBox(): PageBox {
        return this.pageBoxNode.getComponent(PageBox)!;
    }

    refresh(viewIndex: number): void {
        const prePage = this.page;
        this.index = viewIndex;
        const page = this.pageBox.pageConfig.curPage + this.index - 1;
        this.page = this.pageBox.getFinalPage(page);
        if (prePage == this.page) return;
        console.log(`[ZhaoCha]PagePanel refresh, index:${this.index}, page: ${prePage} -> ${this.page}`);
        this.viewConfig.page.getComponent(Label)!.string = this.page.toString();

        const pageData = this.pageBox.pageConfig.pageData.get(this.page - 1);
        if (!pageData) 
        {
            console.error(`[ZhaoCha]pageData is null, page: ${this.page - 1}`);
            return;
        }
        for (let i = 0; i < pageData.length; i++) {
            
            const cover = this.viewConfig.content.children[i].getComponent(StageCover)!;
            let stage : TrZhaoChaStage = null!;
            if (i < pageData.length)
            {
                stage = pageData[i];
            }
            cover.refresh(stage);
        }
    }
}