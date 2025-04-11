import { _decorator, Component, Node } from 'cc';
import { ItemBase } from './ItemBase';
import { ShowCircle } from './ShowCircle';
const { ccclass, property } = _decorator;

@ccclass('ZhaoCha/Game/Item/ClickItem')
export class ClickItem extends ItemBase {

    showCircle: ShowCircle = null!;
    onStart(): void {
        if (!this.showCircle) {
            this.showCircle = this.node.getComponent(ShowCircle)!;
        }
    }

    onClick(): void {
        super.onClick();
        // console.log(`[zc] ClickItem, onClick, name:${this.nodeName}, id:${this.itemId}`);
        this.showCircle.show();
    }
}