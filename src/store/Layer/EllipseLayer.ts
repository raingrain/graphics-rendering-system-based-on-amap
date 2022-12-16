import {makeAutoObservable} from "mobx";
import {AMap, map} from "../../layout/MapLayout/MapContainer";
import {editingPointContent, pointLayer} from "./PointLayer";
import {mapInfos} from "../MapInfos";
import {Layer} from "./types";
import {circleLayer} from "./CircleLayer";
import {rectLayer} from "./RectLayer";
import {polylineLayer} from "./PolylineLayer";
import {polygonLayer} from "./PolygonLayer";

class EllipseLayer implements Layer {

    ellipses: AMap.Ellipse[] = [];
    pointsOfEditing: AMap.Marker[] = [];
    toMouse: AMap.Ellipse | null = null;
    // 编辑模式
    isEditingMode = false;
    // 编辑器模式
    isEditorMode = false;
    // 正在打开编辑器的椭圆
    ellipseOpenEditor: AMap.Ellipse | null = null;

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    createDefault() {
        if (this.pointsOfEditing.length !== 0 && this.toMouse) {
            const ellipse = new AMap.Ellipse({
                center: this.toMouse.getCenter(),
                radius: this.toMouse.getRadius(),
                strokeColor: "#1890ff",
                fillColor: "#1890ff",
            });
            ellipse.setExtData({
                editor: new AMap.EllipseEditor(map, ellipse)
            })
            this.allowDefaultSomethingWhenStartEditing(ellipse);
            this.ellipses.push(ellipse);
            map.add(ellipse);
        }
        this.removeToMouse();
        this.removePointsOfEditing();
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
            this.pointsOfEditing.push(point);
            map.add(point);
        }
        if (this.pointsOfEditing.length === 2) {
            this.createDefault();
            this.removePointsOfEditing();
        }
    }

    createToMouse(e: any) {
        this.removeToMouse();
        if (this.pointsOfEditing.length !== 0) {
            const centerPosition = this.pointsOfEditing[0].getPosition()!;
            const longAxisPoint = new AMap.LngLat(e.lnglat.getLng(), centerPosition.getLat());
            const shortAxisPoint = new AMap.LngLat(centerPosition.getLng(), e.lnglat.getLat());
            const a = centerPosition.distance(longAxisPoint);
            const b = centerPosition.distance(shortAxisPoint);
            this.toMouse = new AMap.Ellipse({
                center: centerPosition,
                radius: [a, b],
                strokeColor: "orange",
                strokeStyle: "dashed",
                fillColor: "orange"
            });
            // 避免阻塞，实际上用只有长短轴之比很极端时才用的到
            this.toMouse!.on("mousemove", this.createToMouse)
            this.toMouse!.on("click", this.createDefault);
            this.toMouse!.on("rightclick", this.removePointsOfEditing);
            this.toMouse!.on("rightclick", this.removeToMouse);
            map.add(this.toMouse!);
        }
    }

    allowDefaultSomethingWhenStartEditing(ellipse: AMap.Ellipse) {
        ellipse.setDraggable(true);
        ellipse.on("rightclick", this.removeOneOverlay);
        ellipse.on("click", this.createPointOfEditing);
        ellipse.on("mousemove", this.createToMouse);
    }

    forbidDefaultSomethingWhenStopEditing(ellipse: AMap.Ellipse) {
        ellipse.setDraggable(false);
        ellipse.off("rightclick", this.removeOneOverlay);
        ellipse.off("click", this.createPointOfEditing);
        ellipse.off("mousemove", this.createToMouse);
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
        circleLayer.circles.forEach((circle) => {
            circle.on("click", this.createPointOfEditing);
            circle.on("mousemove", this.createToMouse);
            circle.on("rightclick", this.removePointsOfEditing);
            circle.on("rightclick", this.removeToMouse);
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
        circleLayer.circles.forEach((circle) => {
            circle.off("click", this.createPointOfEditing);
            circle.off("mousemove", this.createToMouse);
            circle.off("rightclick", this.removePointsOfEditing);
            circle.off("rightclick", this.removeToMouse);
        })
    }

    allowSomethingWhenStartEditing() {
        this.ellipses.forEach((ellipse) => this.allowDefaultSomethingWhenStartEditing(ellipse));
        this.allowMapSomethingWhenStartEditing();
    }

    forbidSomethingWhenStopEditing() {
        this.ellipses.forEach((ellipse) => this.forbidDefaultSomethingWhenStopEditing(ellipse));
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
        this.ellipseOpenEditor = e.target;
    }

    closeEditor() {
        if (this.ellipseOpenEditor) {
            this.ellipseOpenEditor.getExtData().editor.close();
            this.ellipseOpenEditor = null;
        }
    }

    openEditors() {
        this.allowSomethingWhenOpenEditors();
        if (this.isEditingMode) {
            this.stopEditing();
            this.isEditingMode = false;
        }
        this.isEditorMode = true;
        this.ellipses.forEach((ellipse) => ellipse.on("click", this.openEditor));
    }

    closeEditors() {
        this.forbidSomethingWhenCloseEditors();
        this.closeEditor();
        this.isEditorMode = false;
        this.ellipses.forEach((ellipse) => ellipse.off("click", this.openEditor));
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
        if (this.ellipses.length !== 0) {
            map.remove(this.ellipses);
            this.ellipses = [];
        }
    }

    removeOneOverlay(e: any) {
        const index = this.ellipses.findIndex((ellipse) => ellipse === e.target);
        this.ellipses.splice(index, 1);
        map.remove(e.target);
    }

    removeAll() {
        if (!this.toMouse && this.pointsOfEditing.length === 0 && this.ellipses.length === 0) {
            return false;
        } else {
            this.closeEditor();
            this.removeToMouse();
            this.removePointsOfEditing()
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

export const ellipseLayer = new EllipseLayer();