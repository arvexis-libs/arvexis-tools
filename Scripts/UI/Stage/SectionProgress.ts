import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { oops } from 'db://oops-framework/core/Oops';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
import { ZhaoChaMgr } from '../../Manager/ZhaoChaMgr';
const { ccclass, property } = _decorator;


@ccclass('ZhaoCha/Stage/SectionProgress')
export class SectionProgress extends Component {

    @property(Label)
    label: Label = null!;

    @property(Number)
    curCount: number = 0;

    @property(Number)
    maxCount: number = 0;

    protected onLoad(): void {
        oops.message.on(ZhaoChaEvent.SECTION_LOADED, this.onSectionLoaded, this);
        oops.message.on(ZhaoChaEvent.ITEM_FINISH, this.onItemFinish, this);
    }

    protected onDestroy(): void {
        oops.message.off(ZhaoChaEvent.SECTION_LOADED, this.onSectionLoaded, this);
        oops.message.off(ZhaoChaEvent.ITEM_FINISH, this.onItemFinish, this);
    }

    onSectionLoaded(): void {
        this.curCount = 0;
        this.maxCount = ZhaoChaMgr.getInstance().curItems.length;
        this.refreshProgress();
    }

    onItemFinish(): void {
        this.curCount++;
        this.refreshProgress();
        if (this.curCount >= this.maxCount) {
            console.log("[zc] SectionProgress, dispatchEvent SECTION_FINISH");
            oops.timer.scheduleOnce(() => {
                oops.message.dispatchEvent(ZhaoChaEvent.SECTION_FINISH, {});
            }, 0);
        }
    }

    refreshProgress(): void {
        this.label.string = `${this.curCount}/${this.maxCount}`;
    }
}