import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/Stage/InvalidDrag')
export class InvalidDrag extends Component {
    public onTrigger: Function = null!;
}