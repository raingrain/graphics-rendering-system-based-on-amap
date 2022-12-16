import {makeAutoObservable} from "mobx";
import {AMap, map} from "../../layout/MapPageLayout/MapContainer";
import {editingPointContent, pointLayer} from "./PointLayer";
import {mapInfos} from "../MapInfos";
import {Layer} from "./types";
import {rectLayer} from "./RectLayer";
import {ellipseLayer} from "./EllipseLayer";
import {polylineLayer} from "./PolylineLayer";
import {polygonLayer} from "./PolygonLayer";

class CircleLayer implements Layer {

    circles: AMap.Circle[] = [];
    pointsOfEditing: AMap.Marker[] = [];
    toMouse: AMap.Circle | null = null;
    // 编辑模式
    isEditingMode = false;
    // 编辑器模式
    isEditorMode = false;
    // 正在打开编辑器的圆
    circleOpenEditor: AMap.Circle | null = null;

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    createDefault() {
        if (this.pointsOfEditing.length !== 0 && this.toMouse) {
            const circle = new AMap.Circle({
                center: this.toMouse.getCenter(),
                radius: this.toMouse.getRadius(),
                strokeColor: "#1890ff",
                fillColor: "#1890ff"
            });
            circle.setExtData({
                editor: new AMap.CircleEditor(map, circle)
            })
            this.allowDefaultSomethingWhenStartEditing(circle!);
            this.circles.push(circle);
            map.add(circle);
        }
        this.removePointsOfEditing();
        this.removeToMouse();
    }

    createPointOfEditing(e: any) {
        if (this.pointsOfEditing.length < 2) {
            const point = new AMap.Marker({
                position: e.lnglat,
                draggable: true,
                content: editingPointContent
            });
            // 指向鼠标的矩形不会被阻塞
            point.on("mousemove", this.createToMouse);
            // 可以在点上创建点
            point.on("click", this.createPointOfEditing);
            // 删除圆心可以取消创建
            point.on("rightclick", this.removePointsOfEditing);
            point.on("rightclick", this.removeToMouse);
            this.pointsOfEditing.push(point)
            map.add(point);
        }
        // 不像多边形的线的点数是不确定的，两点可以确定一个圆
        if (this.pointsOfEditing.length === 2) {
            this.createDefault();
            this.removePointsOfEditing();
        }
    }

    createToMouse(e: any) {
        this.removeToMouse();
        if (this.pointsOfEditing.length !== 0) {
            this.toMouse = new AMap.Circle({
                center: this.pointsOfEditing[0].getPosition()!,
                radius: e.lnglat.distance(this.pointsOfEditing[0].getPosition()!),
                strokeColor: "orange",
                strokeStyle: "dashed",
                fillColor: "orange"
            });
            this.toMouse!.on("mousemove", this.createToMouse);
            this.toMouse!.on("click", this.createDefault);
            this.toMouse!.on("rightclick", this.removePointsOfEditing);
            this.toMouse!.on("rightclick", this.removeToMouse);
            map.add(this.toMouse!);
        }
    }

    allowDefaultSomethingWhenStartEditing(circle: AMap.Circle) {
        circle.setDraggable(true);
        circle.on("click", this.createPointOfEditing);
        circle.on("mousemove", this.createToMouse);
        circle.on("rightclick", this.removeOneOverlay);
    }

    forbidDefaultSomethingWhenStopEditing(circle: AMap.Circle) {
        circle.setDraggable(false);
        circle.off("rightclick", this.removeOneOverlay);
        circle.off("click", this.createPointOfEditing);
        circle.off("mousemove", this.createToMouse);
    }

    allowMapSomethingWhenStartEditing() {
        mapInfos.setIsEditingAndChangeCursorStyle(true);
        map.on("click", this.createPointOfEditing);
        map.on("mousemove", this.createToMouse);
        // 只创建定点时右键直接删除
        map.on("rightclick", this.removePointsOfEditing);
        map.on("rightclick", this.removeToMouse);
        pointLayer.points.forEach((point) => {
            point.on("click", this.createPointOfEditing);
            point.on("mousemove", this.createToMouse);
            point.on("rightclick", this.removePointsOfEditing);
            point.on("rightclick", this.removeToMouse);
        })
        polylineLayer.polylines.forEach((polyline) => {
            polyline.on("click", this.createPointOfEditing);
            polyline.on("mousemove", this.createToMouse);
            polyline.on("rightclick", this.removePointsOfEditing);
            polyline.on("rightclick", this.removeToMouse);
        })
        polygonLayer.polygons.forEach((polygon) => {
            polygon.on("click", this.createPointOfEditing);
            polygon.on("mousemove", this.createToMouse);
            polygon.on("rightclick", this.removePointsOfEditing);
            polygon.on("rightclick", this.removeToMouse);
        })
        rectLayer.rects.forEach((rect) => {
            rect.on("click", this.createPointOfEditing);
            rect.on("mousemove", this.createToMouse);
            rect.on("rightclick", this.removePointsOfEditing);
            rect.on("rightclick", this.removeToMouse);
        })
        ellipseLayer.ellipses.forEach((ellipse) => {
            ellipse.on("click", this.createPointOfEditing);
            ellipse.on("mousemove", this.createToMouse);
            ellipse.on("rightclick", this.removePointsOfEditing);
            ellipse.on("rightclick", this.removeToMouse);
        })
    }

    forbidMapSomethingWhenStopEditing() {
        mapInfos.setIsEditingAndChangeCursorStyle(false);
        map.off("click", this.createPointOfEditing);
        map.off("mousemove", this.createToMouse);
        map.off("rightclick", this.removePointsOfEditing);
        map.off("rightclick", this.removeToMouse);
        pointLayer.points.forEach((point) => {
            point.off("click", this.createPointOfEditing);
            point.off("mousemove", this.createToMouse);
            point.off("rightclick", this.removePointsOfEditing);
            point.off("rightclick", this.removeToMouse);
        })
        polylineLayer.polylines.forEach((polyline) => {
            polyline.off("click", this.createPointOfEditing);
            polyline.off("mousemove", this.createToMouse);
            polyline.off("rightclick", this.removePointsOfEditing);
            polyline.off("rightclick", this.removeToMouse);
        })
        polygonLayer.polygons.forEach((polygon) => {
            polygon.off("click", this.createPointOfEditing);
            polygon.off("mousemove", this.createToMouse);
            polygon.off("rightclick", this.removePointsOfEditing);
            polygon.off("rightclick", this.removeToMouse);
        })
        rectLayer.rects.forEach((rect) => {
            rect.off("click", this.createPointOfEditing);
            rect.off("mousemove", this.createToMouse);
            rect.off("rightclick", this.removePointsOfEditing);
            rect.off("rightclick", this.removeToMouse);
        })
        ellipseLayer.ellipses.forEach((ellipse) => {
            ellipse.off("click", this.createPointOfEditing);
            ellipse.off("mousemove", this.createToMouse);
            ellipse.off("rightclick", this.removePointsOfEditing);
            ellipse.off("rightclick", this.removeToMouse);
        })
    }

    allowSomethingWhenStartEditing() {
        this.circles.forEach((circle) => this.allowDefaultSomethingWhenStartEditing(circle));
        this.allowMapSomethingWhenStartEditing();
    }

    forbidSomethingWhenStopEditing() {
        this.circles.forEach((circle) => this.forbidDefaultSomethingWhenStopEditing(circle));
        this.forbidMapSomethingWhenStopEditing();
    }

    startEditing() {
        if (this.isEditorMode) {
            this.closeEditors();
            this.isEditorMode = false;
        }
        this.isEditingMode = true;
        this.allowSomethingWhenStartEditing()
    }

    stopEditing() {
        this.isEditingMode = false;
        this.createDefault();
        this.forbidSomethingWhenStopEditing()
    }

    allowMapSomethingWhenOpenEditors() {
        mapInfos.setIsEditingAndChangeCursorStyle(true);
    }

    forbidMapSomethingWhenCloseEditors() {
        mapInfos.setIsEditingAndChangeCursorStyle(false);
    }

    allowSomethingWhenOpenEditors() {
        this.allowMapSomethingWhenOpenEditors();
    }

    forbidSomethingWhenCloseEditors() {
        this.forbidMapSomethingWhenCloseEditors();
    }

    openEditor(e: any) {
        this.closeEditor();
        e.target.getExtData().editor.open();
        this.circleOpenEditor = e.target;
    }

    closeEditor() {
        if (this.circleOpenEditor) {
            this.circleOpenEditor.getExtData().editor.close();
            this.circleOpenEditor = null;
        }
    }

    openEditors() {
        this.allowSomethingWhenOpenEditors();
        if (this.isEditingMode) {
            this.stopEditing();
            this.isEditingMode = false;
        }
        this.isEditorMode = true;
        this.circles.forEach((circle) => circle.on("click", this.openEditor));
    }

    closeEditors() {
        this.forbidSomethingWhenCloseEditors();
        this.closeEditor();
        this.isEditorMode = false;
        this.circles.forEach((circle) => circle.off("click", this.openEditor));
    }

    removePointsOfEditing() {
        if (this.pointsOfEditing.length !== 0) {
            map.remove(this.pointsOfEditing);
            this.pointsOfEditing = [];
        }
    }

    removeToMouse() {
        if (this.toMouse) {
            map.remove(this.toMouse);
            this.toMouse = null;
        }
    }

    removeAllOverlays() {
        if (this.circles.length !== 0) {
            map.remove(this.circles);
            this.circles = [];
        }
    }

    removeOneOverlay(e: any) {
        const index = this.circles.findIndex((circle) => circle === e.target);
        this.circles.splice(index, 1);
        map.remove(e.target);
    }

    removeAll() {
        if (!this.toMouse && this.pointsOfEditing.length === 0 && this.circles.length === 0) {
            return false;
        } else {
            this.closeEditor();
            this.removePointsOfEditing()
            this.removeToMouse();
            this.removeAllOverlays();
            return true;
        }
    }

    closeLayer() {
        if (this.isEditingMode) {
            this.stopEditing();
        }
        if (this.isEditorMode) {
            this.closeEditors();
        }
    }

}

export const circleLayer = new CircleLayer();