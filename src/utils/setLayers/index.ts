import {Satellite, setSatelliteLayer} from "./setSatelliteLayer";
import {RoadNet, setRoadNetLayer} from "./setRoadNetLayer";
import {Traffic, setTrafficLayer} from "./setTrafficLayer";
import {Buildings, setBuildingsLayer} from "./setBuildingsLayer";
import {initialLayers} from "./initialLayers";

const layers = [
    {
        name: "卫星图层",
        type: Satellite
    },
    {
        name: "路网图层",
        type: RoadNet
    },
    {
        name: "路况图层",
        type: Traffic
    },
    {
        name: "楼块图层",
        type: Buildings
    }
];

export {layers, setSatelliteLayer, setRoadNetLayer, setTrafficLayer, setBuildingsLayer, initialLayers};