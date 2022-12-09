import {createContext, useContext} from "react";

import {mapInfos} from "./MapInfos";
import {gaoDeControls} from "./GaoDeControls";
import {gaoDeLayers} from "./GaoDeLayers";
import {pointLayer} from "./PointLayer";
import {polylineLayer} from "./PolylineLayer";
import {polygonLayer} from "./PolygonLayer";

class Store {
    mapInfos = mapInfos;
    gaoDeControls = gaoDeControls;
    gaoDeLayers = gaoDeLayers;
    pointLayer = pointLayer;
    polylineLayer = polylineLayer;
    polygonLayer = polygonLayer;
}

export const store = new Store();

export function useStore() {
    const context = createContext(store);
    return useContext(context);
}