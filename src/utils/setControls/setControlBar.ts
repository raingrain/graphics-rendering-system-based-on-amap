import {AMap} from "../../component/MapContainer/MapContainer";
import {ControlsType} from "./ControlsType";

let ControlBar: ControlsType = null;

export function setControlBar(map: AMap.Map, config = {}) {
    ControlBar !== null && map.removeControl(ControlBar);
    ControlBar = new AMap.ControlBar({
        // 设置3D控件
        position: {
            right: "0px",
            top: "0px"
        },
        showControlButton: true,
        offset: [0, 0],
        ...config
    });
    map.addControl(ControlBar!);
}