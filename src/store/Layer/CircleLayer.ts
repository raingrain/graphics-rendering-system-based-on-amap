import {makeAutoObservable} from "mobx";
import {AMap, map} from "../../component/MapScreen";
import {newPointContent} from "./PointLayer";
import {mapInfos} from "../MapInfos";
import {Layer} from "./types";

class CircleLayer implements Layer {

    circles: AMap.Circle[] = [];
    fixedPoint: AMap.Marker | null = null;
    toMouseCircle: AMap.Circle | null = null;
    editors: any[] = [];

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    createCircle() {
        if (this.fixedPoint && this.toMouseCircle) {
            const circle = new AMap.Circle({
                center: this.toMouseCircle.getCenter(),
                radius: this.toMouseCircle.getRadius(),
                strokeColor: "#1890ff",
                fillColor: "#1890ff"
            });
            circle.on("rightclick", this.removeOne);
            this.circles.push(circle);
            map.add(circle);
            this.removeToMouseCircle();
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

    createToMouseCircle(e: any) {
        this.removeToMouseCircle();
        if (this.fixedPoint) {
            this.toMouseCircle = new AMap.Circle({
                center: this.fixedPoint.getPosition()!,
                radius: e.lnglat.distance(this.fixedPoint.getPosition()!),
                strokeColor: "orange",
                strokeStyle: "dashed",
                fillColor: "orange"
            });
            this.toMouseCircle!.on("mousemove", this.createToMouseCircle);
            this.toMouseCircle!.on("click", this.createCircle);
            map.add(this.toMouseCircle!);
        }
    }

    removeFixedPoint() {
        if (this.fixedPoint) {
            map.remove(this.fixedPoint);
            this.fixedPoint = null;
        }
    }

    removeToMouseCircle() {
        if (this.toMouseCircle) {
            map.remove(this.toMouseCircle);
            this.toMouseCircle = null;
        }
    }

    startEditing() {
        mapInfos.setIsEditingAndChangeCursorStyle(true);
        map.on("click", this.createFixedPoint);
        map.on("mousemove", this.createToMouseCircle);
        map.on("click", this.createCircle);
    }

    stopEditing() {
        this.createCircle();
        mapInfos.setIsEditingAndChangeCursorStyle(false);
        map.off("click", this.createFixedPoint);
        map.off("mousemove", this.createToMouseCircle);
        map.off("click", this.createCircle);
    }

    openEditor() {
        this.circles.forEach((circle) => {
            const editor = new AMap.CircleEditor(map, circle);
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
        const index = this.circles.findIndex((circle) => circle === e.target);
        this.circles.splice(index, 1);
        map.remove(e.target);
    }

    removeAll() {
        if (!this.toMouseCircle && !this.fixedPoint && this.circles.length === 0 && this.editors.length === 0) {
            return false;
        } else {
            if (this.toMouseCircle) {
                map.remove(this.toMouseCircle);
                this.toMouseCircle = null;
            }
            if (this.fixedPoint) {
                map.remove(this.fixedPoint);
                this.fixedPoint = null;
            }
            if (this.circles.length !== 0) {
                map.remove(this.circles);
                this.circles = [];
            }
            if (this.editors.length !== 0) {
                this.closeEditor();
                this.editors = [];
            }
            return true;
        }
    }

}

export const circleLayer = new CircleLayer();