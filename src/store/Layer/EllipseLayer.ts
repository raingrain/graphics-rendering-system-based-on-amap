import {makeAutoObservable} from "mobx";
import {AMap, map} from "../../component/MapScreen";
import {newPointContent} from "./PointLayer";
import {mapInfos} from "../MapInfos";
import {Layer} from "./types";

class EllipseLayer implements Layer {

    ellipses: AMap.Ellipse[] = [];
    fixedPoint: AMap.Marker | null = null;
    toMouseEllipse: AMap.Ellipse | null = null;
    editors: any[] = [];

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    createEllipse() {
        if (this.fixedPoint && this.toMouseEllipse) {
            const ellipse = new AMap.Ellipse({
                center: this.toMouseEllipse.getCenter(),
                radius: this.toMouseEllipse.getRadius(),
                strokeColor: "#1890ff",
                fillColor: "#1890ff",
                draggable: true
            });
            ellipse.on("rightclick", this.removeOne);
            this.ellipses.push(ellipse);
            map.add(ellipse);
            this.removeToMouseEllipse();
            this.removeFixedPoint();
        }
    }

    createFixedPoint(e: any) {
        if (!this.fixedPoint) {
            this.fixedPoint = new AMap.Marker({
                map: map,
                position: e.lnglat,
                draggable: true,
                content: newPointContent
            } as AMap.MarkerOptions);
            map.add(this.fixedPoint!);
        }
    }

    removeFixedPoint() {
        if (this.fixedPoint) {
            map.remove(this.fixedPoint);
            this.fixedPoint = null;
        }
    }

    createToMouseEllipse(e: any) {
        this.removeToMouseEllipse();
        if (this.fixedPoint) {
            const longAxisPoint = new AMap.LngLat(e.lnglat.getLng(), this.fixedPoint.getPosition()!.getLat());
            const shortAxisPoint = new AMap.LngLat(this.fixedPoint.getPosition()!.getLng(), e.lnglat.getLat());
            const a = this.fixedPoint.getPosition()!.distance(longAxisPoint);
            const b = this.fixedPoint.getPosition()!.distance(shortAxisPoint);
            this.toMouseEllipse = new AMap.Ellipse({
                center: this.fixedPoint.getPosition()!,
                radius: [a, b],
                strokeColor: "orange",
                strokeStyle: "dashed",
                fillColor: "orange"
            });
            this.toMouseEllipse!.on("mousemove", this.createToMouseEllipse)
            this.toMouseEllipse!.on("click", this.createEllipse);
            map.add(this.toMouseEllipse!);
        }
    }

    removeToMouseEllipse() {
        if (this.toMouseEllipse) {
            map.remove(this.toMouseEllipse);
            this.toMouseEllipse = null;
        }
    }

    startEditing() {
        mapInfos.setIsEditingAndChangeCursorStyle(true);
        map.on("click", this.createFixedPoint);
        map.on("mousemove", this.createToMouseEllipse);
        map.on("click", this.createEllipse);
    }

    stopEditing() {
        this.createEllipse();
        mapInfos.setIsEditingAndChangeCursorStyle(false);
        map.off("click", this.createFixedPoint);
        map.off("mousemove", this.createToMouseEllipse);
        map.off("click", this.createEllipse);
    }

    openEditor() {
        this.ellipses.forEach((ellipse) => {
            const editor = new AMap.EllipseEditor(map, ellipse);
            editor.open();
            this.editors.push(editor);
        });
    }

    closeEditor() {
        this.editors.forEach((editor) => {
            editor.close();
        });
        this.editors = [];
    }

    removeOne(e: any) {
        const index = this.ellipses.findIndex((ellipse) => ellipse === e.target);
        this.ellipses.splice(index, 1);
        map.remove(e.target);
    }

    removeAll() {
        if (!this.toMouseEllipse && !this.fixedPoint && this.ellipses.length === 0 && this.editors.length === 0) {
            return false;
        } else {
            if (this.toMouseEllipse) {
                map.remove(this.toMouseEllipse);
                this.toMouseEllipse = null;
            }
            if (this.fixedPoint) {
                map.remove(this.fixedPoint);
                this.fixedPoint = null;
            }
            if (this.ellipses.length !== 0) {
                map.remove(this.ellipses);
                this.ellipses = [];
            }
            if (this.editors.length !== 0) {
                this.closeEditor();
                this.editors = [];
            }
            return true;
        }
    }
}

export const ellipseLayer = new EllipseLayer();