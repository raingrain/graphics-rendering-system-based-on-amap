import {makeAutoObservable} from "mobx";
import {AMap, map} from "../../component/MapScreen";
import {mapInfos} from "../MapInfos";
import {newPointContent} from "./PointLayer";
import {Layer} from "./types";

class PolygonLayer implements Layer {
    polygons: AMap.Polygon[] = [];
    newPolygon: AMap.Polygon | null = null;
    pointsOfNewPolygon: AMap.Marker[] = [];
    toMousePolyline: AMap.Polyline[] = [];
    editors: any[] = [];

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
            polygon.on("rightclick", this.removeOne);
            this.polygons.push(polygon);
            map.add(polygon);
            this.removeToMousePolyline()
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
        this.newPolygon!.on("mousemove", this.createToMousePolyline);
        this.newPolygon!.on("click", this.collectPoints);
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
            this.toMousePolyline[0] = new AMap.Polyline({
                path: [this.pointsOfNewPolygon[0].getPosition()!, e.lnglat!],
                strokeColor: "orange",
                strokeWeight: 5,
                strokeStyle: "dashed"
            });
            this.toMousePolyline[0].on("mousemove", this.createToMousePolyline);
            this.toMousePolyline[0].on("click", this.collectPoints);
            this.toMousePolyline[0].on("rightclick", this.createPolygon);
            this.toMousePolyline[1] = new AMap.Polyline({
                path: [this.pointsOfNewPolygon[this.pointsOfNewPolygon.length - 1].getPosition()!, e.lnglat!],
                strokeColor: "orange",
                strokeWeight: 5,
                strokeStyle: "dashed"
            });
            this.toMousePolyline[1].on("mousemove", this.createToMousePolyline);
            this.toMousePolyline[1].on("click", this.collectPoints);
            this.toMousePolyline[1].on("rightclick", this.createPolygon);
            map.add(this.toMousePolyline);
        }
    }

    removeToMousePolyline() {
        if (this.toMousePolyline) {
            map.remove(this.toMousePolyline);
            this.toMousePolyline = [];
        }
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

    openEditor() {
        this.polygons.forEach((polygon) => {
            const Editor = new AMap.PolylineEditor(map, polygon);
            Editor.open();
            this.editors.push(Editor);
        });
    }

    closeEditor() {
        this.editors.forEach((editor) => {
            editor.close();
        });
        this.editors = [];
    }

    removeOne(e: any) {
        const index = this.polygons.findIndex((point) => point === e.target);
        this.polygons.splice(index, 1);
        map.remove(e.target);
    }

    removeAll() {
        if (!this.newPolygon && this.pointsOfNewPolygon.length === 0 && this.toMousePolyline.length === 0 && this.polygons.length === 0 && this.editors.length === 0) {
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
            if (this.editors.length !== 0) {
                this.closeEditor();
                this.editors = [];
            }
            return true;
        }
    }

}

export const polygonLayer = new PolygonLayer();