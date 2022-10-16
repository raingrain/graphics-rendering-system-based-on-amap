import {setSatelliteLayer} from "./setSatelliteLayer";
import {setRoadNetLayer} from "./setRoadNetLayer";
import {setTrafficLayer} from "./setTrafficLayer";
import {setBuildingsLayer} from "./setBuildingsLayer";

export function initialLayers() {
    setSatelliteLayer(false);
    setRoadNetLayer(false);
    setTrafficLayer(false);
    setBuildingsLayer(false);
}
