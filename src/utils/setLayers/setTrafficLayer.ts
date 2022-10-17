import {AMap, map} from "../../component/MapContainer/MapContainer";
import {LayersType} from "./LayersType";

export let Traffic: LayersType = null;

export function setTrafficLayer(isShow: boolean) {
    Traffic === null ? Traffic = new AMap.TileLayer.Traffic() : isShow ? map.addLayer(Traffic) : map.removeLayer(Traffic);
}