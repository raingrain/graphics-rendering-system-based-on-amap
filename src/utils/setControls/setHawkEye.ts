import {AMap} from "../../component/MapContainer/MapContainer";
import {ControlsType} from "./ControlsType";

let HawkEye: ControlsType = null;

export function setHawkEye(map: AMap.Map, config = {}) {
    HawkEye !== null && map.removeControl(HawkEye);
    HawkEye = new AMap.HawkEye({
        autoMove: true,
        showRectangle: true,
        showButton: true,
        opened: true,
        mapStyle: "amap://styles/normal",
        width: "15vw",
        height: "30vh",
        offset: [0, 0],
        borderStyle: "solid none none solid",
        borderColor: "skyblue",
        borderWidth: "1px",
        ...config
    });
    map.addControl(HawkEye!);
}