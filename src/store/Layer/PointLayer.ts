import {makeAutoObservable} from "mobx";
import {AMap, map} from "../../layouts/MapPageLayout/MapContainer";
import {mapInfos} from "../MapInfos";
import {Layer} from "./types";
import {polylineLayer} from "./PolylineLayer";
import {polygonLayer} from "./PolygonLayer";
import {rectLayer} from "./RectLayer";
import {ellipseLayer} from "./EllipseLayer";
import {circleLayer} from "./CircleLayer";

export const defaultPointContent = `<div style="border: 2px solid white; border-radius: 50%; background-color: #1890ff; width: .75rem; height: .75rem; transform: translate(-50%, -50%)"></div>`;
export const editingPointContent = `<div style="border: 2px solid white; border-radius: 50%; background-color: orange; width: 1rem; height: 1rem; transform: translate(-50%, -50%)"></div>`;
export const locationPointContent = `<div style="border: 2px solid white; border-radius: 50%; background-color: red; width: 1rem; height: 1rem; transform: translate(-50%, -50%)"></div>`;


class PointLayer implements Layer {

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    // 已经绘制的点集
    points: AMap.Marker[] = [];
    // 当前正在编辑的点
    editingPoint: AMap.Marker | null = null;
    // 是否正在编辑该图层
    isEditingMode = false;

    createDefault(e: any) {
        const point = new AMap.Marker({
            position: e.lnglat,
            content: editingPointContent
        });
        // 当前点变成默认点后还可以在拖拽或删除操作中变成编辑点
        this.allowDefaultSomethingWhenStartEditing(point);
        // 把之前的编辑点移除
        this.turnEditingPointIntoDefaultPoint();
        // 把当前点设置为编辑点
        this.editingPoint = point;
        // 加入已经创建好的点集中
        this.points.push(this.editingPoint!);
        // 加入到地图上
        map.add(point);
    }

    turnEditingPointIntoDefaultPoint() {
        // 如果存在编辑点，就把它变成默认点
        if (this.editingPoint) {
            this.editingPoint.setContent(defaultPointContent);
            // 然后删除它
            this.editingPoint = null;
        }
    }

    // 按下鼠标时将默认点变成编辑点
    turnDefaultPointIntoEditingPointWhenMouseDownOnPoint(e: any) {
        // 如果之前有编辑点的话，就改变颜色
        this.turnEditingPointIntoDefaultPoint();
        // 然后把当前点变成点击点
        this.editingPoint = e.target;
        // 当前点样式设置为编辑点样式
        e.target.setContent(editingPointContent);
    }

    allowDefaultSomethingWhenStartEditing(point: AMap.Marker) {
        point.setDraggable(true);
        point.setCursor("move");
        point.on("mousedown", this.turnDefaultPointIntoEditingPointWhenMouseDownOnPoint);
        point.on("rightclick", this.removeOneOverlay);
    }

    forbidDefaultSomethingWhenStopEditing(point: AMap.Marker) {
        point.setDraggable(false);
        point.setCursor("default");
        point.off("mousedown", this.turnDefaultPointIntoEditingPointWhenMouseDownOnPoint);
        point.off("rightclick", this.removeOneOverlay);
    }

    allowMapSomethingWhenStartEditing() {
        mapInfos.setIsEditingAndChangeCursorStyle(true);
        map.on("click", this.createDefault);
        polylineLayer.polylines.forEach((polyline) => {
            polyline.on("click", this.createDefault);
        });
        polygonLayer.polygons.forEach((polygon) => {
            polygon.on("click", this.createDefault);
        });
        rectLayer.rects.forEach((rect) => {
            rect.on("click", this.createDefault);
        });
        circleLayer.circles.forEach((circle) => {
            circle.on("click", this.createDefault);
        });
        ellipseLayer.ellipses.forEach((ellipse) => {
            ellipse.on("click", this.createDefault);
        });
    }

    forbidMapSomethingWhenStopEditing() {
        mapInfos.setIsEditingAndChangeCursorStyle(false);
        map.off("click", this.createDefault);
        polylineLayer.polylines.forEach((polyline) => {
            polyline.off("click", this.createDefault);
        });
        polygonLayer.polygons.forEach((polygon) => {
            polygon.off("click", this.createDefault);
        });
        rectLayer.rects.forEach((rect) => {
            rect.off("click", this.createDefault);
        });
        circleLayer.circles.forEach((circle) => {
            circle.off("click", this.createDefault);
        });
        ellipseLayer.ellipses.forEach((ellipse) => {
            ellipse.off("click", this.createDefault);
        });
    }

    allowSomethingWhenStartEditing() {
        this.points.forEach((point) => this.allowDefaultSomethingWhenStartEditing(point));
        this.allowMapSomethingWhenStartEditing();
    }

    forbidSomethingWhenStopEditing() {
        this.points.forEach((point) => this.forbidDefaultSomethingWhenStopEditing(point));
        this.forbidMapSomethingWhenStopEditing();
    }

    startEditing() {
        this.isEditingMode = true;
        this.allowSomethingWhenStartEditing();
    }

    stopEditing() {
        this.isEditingMode = false;
        // 不要忘记把正在编辑点变成默认点
        this.turnEditingPointIntoDefaultPoint();
        this.forbidSomethingWhenStopEditing();
    }

    removeEditingPoint() {
        if (this.editingPoint) {
            map.remove(this.editingPoint);
            this.editingPoint = null;
        }
    }

    removeAllOverlays() {
        if (this.points.length !== 0) {
            map.remove(this.points);
            this.points = [];
        }
    }

    removeOneOverlay(e: any) {
        // 在点集数组中删除
        const index = this.points.findIndex((point) => point === e.target);
        this.points.splice(index, 1);
        map.remove(e.target);
        // 如果它是正在编辑的元素，将正在编辑元素设置为空
        if (e.target === this.editingPoint) {
            this.removeEditingPoint();
        }
    }

    removeAll() {
        if (!this.editingPoint && this.points.length === 0) {
            return false;
        } else {
            this.removeEditingPoint();
            this.removeAllOverlays();
            return true;
        }
    }

    closeLayer() {
        if (this.isEditingMode) {
            this.stopEditing();
        }
    }
}

export const pointLayer = new PointLayer();