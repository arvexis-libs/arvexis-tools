import { UITransform } from 'cc';
import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { oops } from 'db://oops-framework/core/Oops';
import { ZhaoChaEvent } from '../../Common/ZhaoChaEvent';
import { Vec2 } from 'cc';
import { Vec3 } from 'cc';
import { Size } from 'cc';
const { ccclass, property } = _decorator;


enum TalkDirection {
    Right = 0,
    Left = 1,
    Top = 2,
    Bottom = 3,
}

@ccclass('ZhaoCha/Stage/Talk')
export class Talk extends Component {

    @property(Number)
    minHeight: number = 0;

    @property({ type: Number })
    dir: TalkDirection = TalkDirection.Right;

    @property(Label)
    text: Label = null!;

    destroyNodeFunction: Function = null!;

    @property(UITransform)
    bgTrs: UITransform = null!;

    @property(UITransform)
    dotTrs: UITransform = null!;

    itemSize: Size = new Size(0, 0);

    protected start(): void {
        oops.message.on(ZhaoChaEvent.RESTART, this.destroyNode, this);
    }

    protected onDestroy(): void {
        oops.message.off(ZhaoChaEvent.RESTART, this.destroyNode, this);
        oops.timer.unschedule(this.destroyNodeFunction);
        this.text?.node?.off(Node.EventType.SIZE_CHANGED, this.onSizeChanged, this);
    }

    /**
     * 
     * @param text 
     * @param time 3
     * @param dir /
     * @param size 
     */
    setText(text: string, time: number, dir: TalkDirection, size: Size): void {
        this.dir = dir;
        this.itemSize = size;
        // 
        this.text.node.on(Node.EventType.SIZE_CHANGED, this.onSizeChanged, this);
        console.log(`[zc] Talk, setText, dir:${dir}, size:${size}`);
        // 150
        const offsetWidth = size.width > 150 ? size.width / 2 : size.width;
        // UITransform
        const nodeTrs = this.node.getComponent(UITransform)!;
        // 
        switch (this.dir) {
            case TalkDirection.Right:
                this.bgTrs.anchorX = 0;
                this.text.node.getComponent(UITransform)!.anchorX = 0;
                this.dotTrs.anchorX = 1;
                this.dotTrs.node.scale_x = 1;
                this.dotTrs.node.setPosition(-5, -5, 0);
                nodeTrs.anchorX = 0;
                // 
                this.node.setPosition(this.node.position.add(new Vec3(offsetWidth, 0, 0)));
                break;
            case TalkDirection.Left:
                this.bgTrs.anchorX = 1;
                this.text.node.getComponent(UITransform)!.anchorX = 1;
                this.dotTrs.anchorX = 1;
                this.dotTrs.node.scale_x = -1;
                this.dotTrs.node.setPosition(5, -5, 0);
                nodeTrs.anchorX = 1;
                // 
                this.node.setPosition(this.node.position.add(new Vec3(-offsetWidth, 0, 0)));
                break;
        }
        // 
        this.text.string = text;
        // 
        this.destroyNodeFunction = this.destroyNode.bind(this);
        // 3
        if (time < 3) {
            time = 3;
        }
        // 
        oops.timer.scheduleOnce(this.destroyNodeFunction, time);
    }

    get calHeight(): number {
        const height = this.text.node.getComponent(UITransform)!.height;
        if (height < this.minHeight) {
            console.log(`[zc] Talk, calHeight, height:${height}, minHeight:${this.minHeight}`);
            return this.minHeight;
        }
        console.log(`[zc] Talk, calHeight, height:${height}`);
        return height;
    }

    destroyNode(): void {
        this.node.destroy();
        console.log(`[zc] Talk, destroyNode`);
    }

    onSizeChanged(): void {
        const trs = this.node.getComponent(UITransform)!;
        trs.height = this.calHeight;
        switch (this.dir) {
            case TalkDirection.Top:
                this.node.setWorldPosition(this.node.worldPosition.add(new Vec3(-trs.width / 2, trs.height + this.itemSize.height / 2 + 20, 0)));
                this.dotTrs.anchorX = 1;
                this.dotTrs.node.scale_x = 1;
                this.dotTrs.node.setPosition(trs.width / 2, -trs.height - 5, 0);
                this.dotTrs.node.angle_z = 90;
                break;
            case TalkDirection.Bottom:
                this.node.setWorldPosition(this.node.worldPosition.add(new Vec3(-trs.width / 2, -this.itemSize.height - 20, 0)));
                this.dotTrs.anchorX = 1;
                this.dotTrs.node.scale_x = 1;
                this.dotTrs.node.setPosition(trs.width / 2, 5, 0);
                this.dotTrs.node.angle_z = 270;
                break;
        }
        console.log(`[zc] Talk, onSizeChanged, dir:${this.dir}, width:${trs.width}, height:${trs.height}`);
    }
}