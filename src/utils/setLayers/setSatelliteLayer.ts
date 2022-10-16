import {AMap, map} from "../../component/MapContainer/MapContainer";
import {LayersType} from "./LayersType";

let Satellite: LayersType = null;

export function setSatelliteLayer(isShow: boolean) {
    Satellite === null ? Satellite = new AMap.TileLayer.Satellite() : isShow ? map.addLayer(Satellite) : map.removeLayer(Satellite);
}