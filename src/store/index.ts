import {createContext, useContext} from "react";

import {mapInfos} from "./MapInfos";
import {mapControls} from "./MapControls";
import {mapLayers} from "./MapLayers";
import {pointLayer} from "./PointLayer";
import {polylineLayer} from "./PolylineLayer";
import {polygonLayer} from "./PolygonLayer";

class Store {
    mapInfos = mapInfos;
    mapControls = mapControls;
    mapLayers = mapLayers;
    pointLayer = pointLayer;
    polylineLayer = polylineLayer;
    polygonLayer = polygonLayer;
}

export const store = new Store();

export function useStore() {
    const context = createContext(store);
    return useContext(context);
}