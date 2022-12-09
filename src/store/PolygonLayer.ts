import {makeAutoObservable} from "mobx";
import {AMap, map} from "../component/MapScreen";
import {mapInfos} from "./MapInfos";
import {newPointContent} from "./PointLayer";

class PolygonLayer {
    polygons: AMap.Polygon[] = [];
    newPolygon: AMap.Polygon | null = null;
    pointsOfNewPolygon: AMap.Marker[] = [];
    toMousePolyline: AMap.Polyline[] = [];
    polygonEditors: any[] = [];

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    createPolygon() {
        this.removeToMousePolyline();
        if (this.newPolygon) {
            const polygon = new AMap.Polygon({
                path: this.newPolygon.getPath(),
                fillColor: "#1890ff",
                strokeColor: "#1890ff"
            } as AMap.PolygonOptions);
            polygon.on("rightclick", this.removeAPolygon);
            this.polygons.push(polygon);
            map.add(polygon);
            map.remove(this.newPolygon);
            this.newPolygon = null;
            map.remove(this.pointsOfNewPolygon);
            this.pointsOfNewPolygon = [];
        }
    }

    createNewPolygon() {
        this.removeToMousePolyline();
        this.newPolygon && map.remove(this.newPolygon);
        this.newPolygon = new AMap.Polygon({
            path: this.pointsOfNewPolygon.map((point) => point.getPosition()!),
            fillColor: "orange",
            strokeColor: "orange"
        } as AMap.PolygonOptions);
        map.add(this.newPolygon!);
    }

    collectPoints(e: any) {
        this.removeToMousePolyline();
        const point = new AMap.Marker({
            map: map,
            position: e.lnglat,
            draggable: true,
            content: newPointContent,
            extData: {
                id: this.pointsOfNewPolygon.length + 1
            }
        } as AMap.MarkerOptions);
        this.pointsOfNewPolygon.push(point);
        this.createNewPolygon();
    }

    createToMousePolyline(e: any) {
        this.removeToMousePolyline();
        if (this.pointsOfNewPolygon.length >= 1) {
            // 避免难以点击
            e.lnglat.setLng(this.pointsOfNewPolygon[0].getPosition()!.lng < e.lnglat.lng ? e.lnglat.lng - 0.0001 : e.lnglat.lng + 0.0001);
            e.lnglat.setLat(this.pointsOfNewPolygon[0].getPosition()!.lat < e.lnglat.lat ? e.lnglat.lat - 0.0001 : e.lnglat.lat + 0.0001);
            this.toMousePolyline[0] = new AMap.Polyline({
                path: [this.pointsOfNewPolygon[0].getPosition()!, e.lnglat!],
                strokeColor: "orange",
                strokeWeight: 5,
                strokeStyle: "dashed"
            });
            e.lnglat.setLng(this.pointsOfNewPolygon[this.pointsOfNewPolygon.length - 1].getPosition()!.lng < e.lnglat.lng ? e.lnglat.lng - 0.0001 : e.lnglat.lng + 0.0001);
            e.lnglat.setLat(this.pointsOfNewPolygon[this.pointsOfNewPolygon.length - 1].getPosition()!.lat < e.lnglat.lat ? e.lnglat.lat - 0.0001 : e.lnglat.lat + 0.0001);
            this.toMousePolyline[1] = new AMap.Polyline({
                path: [this.pointsOfNewPolygon[this.pointsOfNewPolygon.length - 1].getPosition()!, e.lnglat!],
                strokeColor: "orange",
                strokeWeight: 5,
                strokeStyle: "dashed"
            });
            map.add(this.toMousePolyline);
        }
    }

    removeToMousePolyline() {
        this.toMousePolyline && map.remove(this.toMousePolyline);
    }

    startEditing() {
        mapInfos.setIsEditingAndChangeCursorStyle(true);
        map.on("click", this.collectPoints);
        map.on("mousemove", this.createToMousePolyline);
        map.on("rightclick", this.createPolygon);
    }

    stopEditing() {
        this.createPolygon();
        mapInfos.setIsEditingAndChangeCursorStyle(false);
        map.off("click", this.collectPoints);
        map.off("mousemove", this.createToMousePolyline);
        map.off("rightclick", this.createPolygon);
    }

    openPolygonEditor() {
        this.polygons.forEach((polygon) => {
            const polygonEditor = new AMap.PolylineEditor(map, polygon);
            polygonEditor.open();
            this.polygonEditors.push(polygonEditor);
        });
    }

    closePolygonEditor() {
        this.polygonEditors.forEach((polygonEditor) => {
            polygonEditor.close();
        });
        this.polygonEditors = [];
    }

    removeAPolygon(e: any) {
        const index = this.polygons.findIndex((point) => point === e.target);
        this.polygons.splice(index, 1);
        map.remove(e.target);
    }

    removeAllPolygons() {
        if (!this.newPolygon && this.pointsOfNewPolygon.length === 0 && this.toMousePolyline.length === 0 && this.polygons.length === 0 && this.polygonEditors.length === 0) {
            return false;
        } else {
            if (this.newPolygon) {
                map.remove(this.newPolygon);
                this.newPolygon = null;
            }
            if (this.pointsOfNewPolygon.length !== 0) {
                map.remove(this.pointsOfNewPolygon);
                this.pointsOfNewPolygon = [];
            }
            if (this.toMousePolyline.length !== 0) {
                map.remove(this.toMousePolyline);
                this.toMousePolyline = [];
            }
            if (this.polygons.length !== 0) {
                map.remove(this.polygons);
                this.polygons = [];
            }
            if (this.polygonEditors.length !== 0) {
                this.closePolygonEditor();
                this.polygonEditors = [];
            }
            return true;
        }
    }

}

export const polygonLayer = new PolygonLayer();