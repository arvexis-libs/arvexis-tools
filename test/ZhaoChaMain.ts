import { DynamicAtlasManager, _decorator, macro, profiler } from 'cc';
import { DEBUG, JSB } from 'cc/env';
import { oops } from 'db://oops-framework/core/Oops';
import { Root } from 'db://oops-framework/core/Root';
import { ecs } from 'db://oops-framework/libs/ecs/ECS';
import { sys } from 'cc';
import { smc } from 'db://assets/script/game/common/ecs/SingletonModuleComp';
import { Initialize } from 'db://assets/script/game/initialize/Initialize';
import { UIConfigData } from 'db://assets/script/game/common/config/GameUIConfig';
import { Entry } from '../script/UI/Entry/Entry';
import { ZhaoChaConfig, ZhaoChaUIID } from '../script/Common/ZhaoChaConfig';


const { ccclass, property } = _decorator;

macro.CLEANUP_IMAGE_CACHE = false;
DynamicAtlasManager.instance.enabled = true;
DynamicAtlasManager.instance.maxFrameSize = 512;

@ccclass('ZhaoChaMain')
export class ZhaoChaMain extends Root {
    start() {
        //if (DEBUG) profiler.showStats();
        if(sys.isNative){
            profiler.hideStats();
        }
    }

    protected run() {
        smc.initialize = ecs.getEntity<Initialize>(Initialize);
        if (JSB) {
            //oops.gui.toast("");
        }
    }

    protected initGui() {
        oops.gui.init(UIConfigData);
		oops.message.on("InitResComplete", this.onInitResComplete, this);
    }

    private onInitResComplete(event: string, ...args: any) {
        ZhaoChaConfig.getInstance().init();
        oops.gui.open(ZhaoChaUIID.EntryPanel);
    }
}