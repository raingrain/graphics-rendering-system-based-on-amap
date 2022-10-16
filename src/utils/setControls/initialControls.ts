import {map} from "../../component/MapContainer/MapContainer";
import {setControlBar} from "./setControlBar";
import {setToolBar} from "./setToolBar";
import {setScale} from "./setScale";
import {setHawkEye} from "./setHawkEye";

// 初始化地图控件
export function initialControls() {
    setControlBar(map);
    setToolBar(map);
    setScale(map);
    setHawkEye(map);
}