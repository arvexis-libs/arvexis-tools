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

    protected start(): void {
        oops.message.on(ZhaoChaEvent.RESTART, this.destroyNode, this);
    }

    protected onDestroy(): void {
        oops.message.off(ZhaoChaEvent.RESTART, this.destroyNode, this);
        oops.timer.unschedule(this.destroyNodeFunction);
        this.text?.node?.off(Node.EventType.SIZE_CHANGED, this.onSizeChanged, this);
    }

    setText(text: string, time: number, dir: TalkDirection, size: Size): void {
        this.dir = dir;
        this.text.node.on(Node.EventType.SIZE_CHANGED, this.onSizeChanged, this);
        // anchor
        const nodeTrs = this.node.getComponent(UITransform)!;
        switch (this.dir) {
            case TalkDirection.Right:
                this.bgTrs.anchorX = 0;
                this.text.node.getComponent(UITransform)!.anchorX = 0;
                this.dotTrs.anchorX = 1;
                this.dotTrs.node.scale_x = 1;
                this.dotTrs.node.setPosition(-5, -5, 0);
                nodeTrs.anchorX = 0;
                
                this.node.setPosition(this.node.position.add(new Vec3(size.width, 0, 0)));
                break;
            case TalkDirection.Left:
                this.bgTrs.anchorX = 1;
                this.text.node.getComponent(UITransform)!.anchorX = 1;
                this.dotTrs.anchorX = 1;
                this.dotTrs.node.scale_x = -1;
                this.dotTrs.node.setPosition(5, -5, 0);
                nodeTrs.anchorX = 1;
                this.node.setPosition(this.node.position.add(new Vec3(-size.width, 0, 0)));
                break;
        }
        // text
        this.text.string = text;
        // this.node.getComponent(UITransform)!.height = this.calHeight;
        // timer
        this.destroyNodeFunction = this.destroyNode.bind(this);
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
        console.log(`[zc] Talk, onSizeChanged`);
        this.node.getComponent(UITransform)!.height = this.calHeight;
    }
}