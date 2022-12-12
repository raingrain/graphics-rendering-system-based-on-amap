import {makeAutoObservable} from "mobx";
import {map} from "../component/MapScreen";
import {pointLayer} from "./Layer/PointLayer";
import {polylineLayer} from "./Layer/PolylineLayer";
import {polygonLayer} from "./Layer/PolygonLayer";
import {rectLayer} from "./Layer/RectLayer";
import {circleLayer} from "./Layer/CircleLayer";
import {ellipseLayer} from "./Layer/EllipseLayer";

class MapInfos {
    isEditing = false;
    zoom = 13;
    centerPoint = [121.451170, 31.036050];
    mouseLngLat = [121.451170, 31.036050];

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    setIsEditingAndChangeCursorStyle(isEditing: boolean) {
        this.isEditing = isEditing;
        this.isEditing ? map.setDefaultCursor("crosshair") : map.setDefaultCursor("default");
    }

    removeAll() {
        return !(!pointLayer.removeAll() && !polylineLayer.removeAll() && !polygonLayer.removeAll() && !rectLayer.removeAll() && !circleLayer.removeAll() && !ellipseLayer.removeAll());
    }

    setZoom(zoom: number) {
        this.zoom = zoom;
    }

    setCenterPoint(centerPoint: [number, number]) {
        this.centerPoint = centerPoint;
    }

    setMouseLngLat(mouseLngLat: [number, number]) {
        this.mouseLngLat = mouseLngLat;
    }

    addMapInfosListener() {
        map.on("zoomchange", () => {
            this.setZoom(map.getZoom());
        });

        map.on("mousemove", (e) => {
            this.setMouseLngLat([e.lnglat.lng, e.lnglat.lat]);
        });

        map.on("zoomchange", () => {
            const center = map.getCenter();
            this.setCenterPoint([center.lng, center.lat]);
        });

        map.on("dragging", () => {
            const center = map.getCenter();
            this.setCenterPoint([center.lng, center.lat]);
        });
    }
}

export const mapInfos = new MapInfos();
