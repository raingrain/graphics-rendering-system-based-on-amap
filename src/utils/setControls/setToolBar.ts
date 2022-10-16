import {AMap} from "../../component/MapContainer/MapContainer";
import {ControlsType} from "./ControlsType";

let ToolBar: ControlsType = null;

export function setToolBar(map: AMap.Map, config = {}) {
    // 设置缩放控件
    ToolBar !== null && map.removeControl(ToolBar);
    ToolBar = new AMap.ToolBar({
        position: {
            bottom: "35vh",
            right: "10px"
        },
        offset: [0, 0],
        ...config
    });
    map.addControl(ToolBar!);
}