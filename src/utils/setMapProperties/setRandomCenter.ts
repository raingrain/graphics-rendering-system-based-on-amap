import {map} from "../../component/MapContainer/MapContainer";

export function setRandomCenter() {
    // 经度范围[121.138398, 121.728226]
    let lng = 121.138398 + Math.floor(Math.random() * 589828) / 1e6;
    // 纬度范围[30.972688, 31.487611]
    let lat = 30.972688 + Math.floor(Math.random() * 514923) / 1e6;
    // 设置地图中心点
    map.setCenter([lng, lat]);
}