import {map} from "../../component/MapContainer/MapContainer";

export function setRandomZoom() {
    // zoom范围假定为[11,18]
    map.setZoom(Math.floor(Math.random() * 7) + 11);
}