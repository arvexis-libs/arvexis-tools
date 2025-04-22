import { _decorator, Component, Node } from 'cc';
import { oops } from "db://oops-framework/core/Oops";
import { ZhaoChaMgr } from '../../Manager/ZhaoChaMgr';
import { macro } from 'cc';
import { Label } from 'cc';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
import { InvalidClick } from './InvalidClick';
import { InvalidDrag } from './InvalidDrag';
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/Stage/CountDown')
export class CountDown extends Component {
    @property(Label)
    timeLabel: Label = null!;

    @property(Number)
    interval: number = 1;

    @property(Number)
    limitTime: number = 1000;


    nextFunc: Function | null = null;

    @property(Boolean)
    isActive: boolean = true;

    @property(InvalidClick)
    invalidClick: InvalidClick = null!;

    @property(InvalidDrag)
    invalidDrag: InvalidDrag = null!;

    @property(Boolean)
    isReged: boolean = false;

    start() {
        oops.message.on(ZhaoChaEvent.RESTART, this.onRestart, this);
        oops.message.on(ZhaoChaEvent.SECTION_LOADED, this.onSectionLoaded, this);
        // console.log(`[zc] CountDown, start`);
    }

    protected onDestroy(): void {
        oops.message.off(ZhaoChaEvent.RESTART, this.onRestart, this);
        oops.message.off(ZhaoChaEvent.SECTION_LOADED, this.onSectionLoaded, this);
        this.stop();
    }

    onSectionLoaded(): void {
        this.reg();
        // LIMIT_TIME
        this.limitTime = ZhaoChaMgr.getInstance().curStage.LimitTime;
        console.log(`[zc] CountDown, onSectionLoaded, LimitTime:${this.limitTime}`);
        this.refresh();
        // active
        this.isActive = true;
    }

    reg() {
        if (this.isReged) return;
        this.isReged = true;
        this.nextFunc = this.next.bind(this);
        // event
        oops.message.on(ZhaoChaEvent.RESUME, this.onResume, this);
        oops.message.on(ZhaoChaEvent.CONTINUE, this.onContinue, this);
        // timer
        oops.timer.schedule(this.nextFunc, this.interval, macro.REPEAT_FOREVER, 0)!;
        // invalidClick
        this.invalidClick.onTrigger = this.onInvalidClick.bind(this);
        // invalidDrag
        this.invalidDrag.onTrigger = this.onInvalidDrag.bind(this);
    }

    stop() {
        // event
        oops.message.off(ZhaoChaEvent.RESUME, this.onResume, this);
        // oops.message.off(ZhaoChaEvent.RESTART, this.onRestart, this);
        oops.message.off(ZhaoChaEvent.CONTINUE, this.onContinue, this);
        // timer
        oops.timer.unschedule(this.nextFunc);
        // invalidClick
        this.invalidClick.onTrigger = null!;
        // invalidDrag
        this.invalidDrag.onTrigger = null!;
        this.isReged = false;
        console.log(`[zc] CountDown, stop, LimitTime:${this.limitTime}`);
    }

    next() {
        if (!this.isActive) return;
        this.limitTime--;
        if (this.limitTime < 0) this.limitTime = 0;
        this.refresh();
        if (this.limitTime <= 0) {
            this.stop();
            oops.message.dispatchEvent(ZhaoChaEvent.COUNT_DOWN_END, {});
        }
        // console.log(`[zc] CountDown, refresh, LimitTime:${this.limitTime}`);
    }

    refresh() {
        this.timeLabel.string = `:${this.limitTime}`;
    }

    onResume(): void {
        this.isActive = false;
    }

    onContinue(): void {
        this.isActive = true;
    }

    onRestart(): void {
        this.stop();
        this.limitTime = ZhaoChaMgr.getInstance().curStage.LimitTime;
        console.log(`[zc] CountDown, onRestart, LimitTime:${this.limitTime}`);
        this.refresh();
        this.onContinue();
        this.reg();
    }

    onInvalidClick(): void {
        this.limitTime -= ZhaoChaMgr.getInstance().curStage.InvalidClick;
    }

    onInvalidDrag(): void {
        this.limitTime -= ZhaoChaMgr.getInstance().curStage.InvalidDrag;
    }
}