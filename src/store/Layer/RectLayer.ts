import {makeAutoObservable} from "mobx";
import {AMap, map} from "../../component/MapScreen";
import {editingPointContent} from "./PointLayer";
import {mapInfos} from "../MapInfos";
import {Layer} from "./types";

class RectLayer implements Layer {

    rects: AMap.Rectangle[] = [];
    fixedPoint: AMap.Marker | null = null;
    toMouseRect: AMap.Rectangle | null = null;
    editors: any[] = [];

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    createRect() {
        if (this.fixedPoint && this.toMouseRect) {
            const rect = new AMap.Rectangle({
                bounds: this.toMouseRect.getBounds(),
                strokeColor: "#1890ff",
                fillColor: "#1890ff"
            });
            rect.on("rightclick", this.removeOne);
            this.rects.push(rect);
            map.add(rect);
            this.removeToMouseRect();
            this.removeFixedPoint();
        }
    }

    createFixedPoint(e: any) {
        if (!this.fixedPoint) {
            this.fixedPoint = new AMap.Marker({
                map: map,
                position: e.lnglat,
                draggable: true,
                content: editingPointContent
            } as AMap.MarkerOptions);
            map.add(this.fixedPoint!);
        }
    }

    createToMouseRect(e: any) {
        this.removeToMouseRect();
        if (this.fixedPoint) {
            let southWest;
            let northEast;
            if (e.lnglat.lng >= this.fixedPoint.getPosition()!.lng && e.lnglat.lat >= this.fixedPoint.getPosition()!.lat) {
                southWest = this.fixedPoint.getPosition()!;
                northEast = e.lnglat;
            } else if (e.lnglat.lng <= this.fixedPoint.getPosition()!.lng && e.lnglat.lat <= this.fixedPoint.getPosition()!.lat) {
                southWest = e.lnglat;
                northEast = this.fixedPoint.getPosition()!;
            } else if (e.lnglat.lng < this.fixedPoint.getPosition()!.lng && e.lnglat.lat > this.fixedPoint.getPosition()!.lat) {
                southWest = new AMap.LngLat(e.lnglat.lng, this.fixedPoint.getPosition()!.lat);
                northEast = new AMap.LngLat(this.fixedPoint.getPosition()!.lng, e.lnglat.lat);
            } else {
                southWest = new AMap.LngLat(this.fixedPoint.getPosition()!.lng, e.lnglat.lat);
                northEast = new AMap.LngLat(e.lnglat.lng, this.fixedPoint.getPosition()!.lat);
            }
            const bounds = new AMap.Bounds(southWest, northEast);
            this.toMouseRect = new AMap.Rectangle({
                bounds: bounds,
                strokeColor: "orange",
                strokeStyle: "dashed",
                fillColor: "orange"
            });
            this.toMouseRect!.on("mousemove", this.createToMouseRect)
            this.toMouseRect!.on("click", this.createRect);
            map.add(this.toMouseRect!);
        }
    }

    removeFixedPoint() {
        if (this.fixedPoint) {
            map.remove(this.fixedPoint);
            this.fixedPoint = null;
        }
    }

    removeToMouseRect() {
        if (this.toMouseRect) {
            map.remove(this.toMouseRect);
            this.toMouseRect = null;
        }
    }

    startEditing() {
        mapInfos.setIsEditingAndChangeCursorStyle(true);
        map.on("click", this.createFixedPoint);
        map.on("mousemove", this.createToMouseRect);
        map.on("click", this.createRect);
    }

    stopEditing() {
        this.createRect();
        mapInfos.setIsEditingAndChangeCursorStyle(false);
        map.off("click", this.createFixedPoint);
        map.off("mousemove", this.createToMouseRect);
        map.off("click", this.createRect);
    }

    openEditor() {
        this.rects.forEach((rect) => {
            const rectEditor = new AMap.RectangleEditor(map, rect);
            rectEditor.open();
            this.editors.push(rectEditor);
        });
    }

    closeEditor() {
        this.editors.forEach((editor) => {
            editor.close();
        });
        this.editors = [];
    }

    removeOne(e: any) {
        const index = this.rects.findIndex((rect) => rect === e.target);
        this.rects.splice(index, 1);
        map.remove(e.target);
    }

    removeAll() {
        if (!this.toMouseRect && !this.fixedPoint && this.rects.length === 0 && this.editors.length === 0) {
            return false;
        } else {
            if (this.toMouseRect) {
                map.remove(this.toMouseRect);
                this.toMouseRect = null;
            }
            if (this.fixedPoint) {
                map.remove(this.fixedPoint);
                this.fixedPoint = null;
            }
            if (this.rects.length !== 0) {
                map.remove(this.rects);
                this.rects = [];
            }
            if (this.editors.length !== 0) {
                this.closeEditor();
                this.editors = [];
            }
            return true;
        }
    }

}

export const rectLayer = new RectLayer();