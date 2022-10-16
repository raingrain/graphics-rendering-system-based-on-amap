import {AMap} from "../../component/MapContainer/MapContainer";
import {ControlsType} from "./ControlsType";

let Scale: ControlsType = null;

export function setScale(map: AMap.Map, config = {}) {
    // 设置比例尺控件
    Scale !== null && map.removeControl(Scale);
    Scale = new AMap.Scale({
        position: {
            right: "20vw",
            bottom: "30px"
        },
        ...config
    });
    map.addControl(Scale!);
}