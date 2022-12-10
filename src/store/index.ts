import {createContext, useContext} from "react";

import {mapInfos} from "./MapInfos";
import {gaoDeControls} from "./GaoDeControls";
import {gaoDeLayers} from "./GaoDeLayers";
import {pointLayer} from "./Layer/PointLayer";
import {polylineLayer} from "./Layer/PolylineLayer";
import {polygonLayer} from "./Layer/PolygonLayer";
import {rectLayer} from "./Layer/RectLayer";
import {circleLayer} from "./Layer/CircleLayer";
import {ellipseLayer} from "./Layer/EllipseLayer";

class Store {
    mapInfos = mapInfos;
    gaoDeControls = gaoDeControls;
    gaoDeLayers = gaoDeLayers;
    pointLayer = pointLayer;
    polylineLayer = polylineLayer;
    polygonLayer = polygonLayer;
    rectLayer = rectLayer;
    circleLayer = circleLayer;
    ellipseLayer = ellipseLayer;
}

export const store = new Store();

export function useStore() {
    const context = createContext(store);
    return useContext(context);
}