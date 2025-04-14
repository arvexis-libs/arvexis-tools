import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/Stage/SettleWindowAnim')
export class SettleWindowAnim extends Component {

    onAnimPlayEnd: Function = null!;

    start() {

    }

    // onAnimPlayEnd(): void {
    //     console.log(`[zc] SettleWindowAnim, onAnimPlayEnd`);
    // }
}