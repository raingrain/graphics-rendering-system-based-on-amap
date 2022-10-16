import {AMap, map} from "../../component/MapContainer/MapContainer";
import {LayersType} from "./LayersType";

let RoadNet: LayersType = null;

export function setRoadNetLayer(isShow: boolean) {
    RoadNet === null ? RoadNet = new AMap.TileLayer.RoadNet() : isShow ? map.addLayer(RoadNet) : map.removeLayer(RoadNet);
}