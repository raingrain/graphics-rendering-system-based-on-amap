import {AMap, map} from "../../component/MapContainer/MapContainer";
import {LayersType} from "./LayersType";

let Buildings: LayersType = null;

export function setBuildingsLayer(isShow: boolean) {
    Buildings === null ? Buildings = new AMap.Buildings({
        // 楼块的高度系数因子，默认为 1，也就是正常高度
        heightFactor: 1,
        // 楼块侧面颜色
        wallColor: "gray",
        // 楼块顶面颜色
        roofColor: "white",
        // 图层缩放等级范围
        zooms: [0, 20],
        // 图层的透明度
        opacity: 1,
        // 图层是否可见
        visible: true,
        // 图层的层级
        zIndex: 11
    }) : isShow ? map.addLayer(Buildings) : map.removeLayer(Buildings);
}