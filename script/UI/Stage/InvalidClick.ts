import { Vec2 } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { TimeUtility } from '../../../../../script/game/gameplay/Utility/TimeUtility';
const { ccclass, property } = _decorator;

class ClickInfo {
    pos: Vec2 = new Vec2();
    time: number = 0;

    constructor(pos: Vec2) {
        this.pos = pos;
        this.time = TimeUtility.GetTimeStampMs();
    }
}

@ccclass('ZhaoCha/Stage/InvalidClick')
export class InvalidClick extends Component {
    private queue: ClickInfo[] = [];

    private removeQueue: ClickInfo[] = [];
    
    /**  */
    @property(Number)
    timeout: number = 100;
    /**  */
    public onTrigger: Function = null!;

    @property(Number)
    get queueCount(): number {
        return this.queue.length;
    }

    add(pos: Vec2): void {
        this.queue.push(new ClickInfo(pos));
        // console.log(`[zc] invalidClick, add, ${pos.x}, ${pos.y}`);
    }

    remove(pos: Vec2): void {
        this.removeQueue.push(new ClickInfo(pos));
        // console.log(`[zc] invalidClick, remove, ${pos.x}, ${pos.y}`);
    }

    protected update(dt: number): void {
        const now = TimeUtility.GetTimeStampMs();
        let invalidClick: ClickInfo = null!;
        let diff = 0;
        for (let i = 0; i < this.queue.length; i++) {
            const q = this.queue[i];
            diff = now - q.time;
            if (diff > this.timeout) {
                // removeQueue
                const index = this.removeQueue.findIndex(r=>r.pos.x == q.pos.x && r.pos.y == q.pos.y);
                if (index == -1) {
                    invalidClick = q;
                } else {
                    this.removeQueue.splice(index, 1);
                }
                this.queue.splice(i, 1);
                break;
            }
        }
        if (invalidClick) {
            // console.log(`[zc] invalidClick, , ${invalidClick.pos.x}, ${invalidClick.pos.y}, diff:${diff}`);
            this.onTrigger?.();
        }
    }
}