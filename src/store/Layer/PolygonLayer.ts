import {makeAutoObservable} from "mobx";
import {AMap, map} from "../../component/MapScreen";
import {mapInfos} from "../MapInfos";
import {editingPointContent} from "./PointLayer";
import {Layer} from "./types";

class PolygonLayer implements Layer {

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    // 已经绘制好的面集合
    polygons: AMap.Polygon[] = [];
    // 正在绘制的面中已经绘制好的部分
    editing: AMap.Polygon | null = null;
    // 正在绘制的面中已经绘制好的部分的节点
    pointsOfEditing: AMap.Marker[] = [];
    // 指向鼠标指针的两条线
    toMouse: AMap.Polyline[] = [];
    // 编辑模式
    isEditingMode = false;
    // 编辑器模式
    isEditorMode = false;
    // 正在打开编辑器的面
    polygonOpenEditor: AMap.Polygon | null = null;

    createDefault() {
        if (this.pointsOfEditing.length !== 0 && this.editing) {
            const polygon = new AMap.Polygon({
                path: this.editing.getPath(),
                fillColor: "#1890ff",
                strokeColor: "#1890ff"
            });
            polygon.setExtData({
                editor: new AMap.PolygonEditor(map, polygon)
            });
            this.allowDefaultSomethingWhenStartEditing(polygon);
            this.polygons.push(polygon);
            map.add(polygon);
        }
        this.removeEditing();
        this.removeToMouse();
        this.removePointsOfEditing();
    }

    createEditing() {
        this.removeToMouse();
        this.editing && map.remove(this.editing);
        this.editing = new AMap.Polygon({
            path: this.pointsOfEditing.map((point) => point.getPosition()!),
            fillColor: "orange",
            strokeColor: "orange"
        });
        // 可以在上面创建新的点
        this.editing!.on("click", this.createPointOfEditing);
        // 指向鼠标的线可以在上面移动
        this.editing!.on("mousemove", this.createToMouse);
        // 可以在上面右键完成创建
        this.editing!.on("rightclick", this.createDefault);
        map.add(this.editing!);
    }

    createPointOfEditing(e: any) {
        this.removeToMouse();
        const point = new AMap.Marker({
            position: e.lnglat,
            draggable: true,
            content: editingPointContent
        });
        this.pointsOfEditing.push(point);
        map.add(point);
        // 编辑的面延长
        this.createEditing();
        // 正在创建时点可以被拖动，然后线被改变
        point.on("dragging", this.createEditing);
        // 可以在点上创建点
        point.on("click", this.createPointOfEditing);
        // 指向鼠标的线不会被阻塞
        point.on("mousemove", this.createToMouse);
        // 右击可以删除点
        point.on("rightclick", this.removePointOfEditing);
        // 地图上双击就先创建一个点，再结束编辑
        point.on("dblclick", this.createDefault);
    }

    removePointOfEditing(e: any) {
        const index = this.pointsOfEditing.findIndex((point) => point === e.target);
        this.pointsOfEditing.splice(index, 1);
        map.remove(e.target);
        this.createEditing();
    }

    createToMouse(e: any) {
        this.removeToMouse();
        if (this.pointsOfEditing.length >= 1) {
            // 多边形起点到鼠标
            this.toMouse[0] = new AMap.Polyline({
                path: [this.pointsOfEditing[0].getPosition()!, e.lnglat!],
                strokeColor: "orange",
                strokeStyle: "dashed"
            });
            // 取消阻塞感
            this.toMouse[0].on("click", this.createPointOfEditing);
            // 让鼠标能在虚线上滑动
            this.toMouse[0].on("mousemove", this.createToMouse);
            // 只有一个点时就是删除起点和虚线，不然就是删除虚线并创建存在的线。
            this.toMouse[0].on("rightclick", this.createDefault);
            // 最新的点到鼠标
            this.toMouse[1] = new AMap.Polyline({
                path: [this.pointsOfEditing[this.pointsOfEditing.length - 1].getPosition()!, e.lnglat!],
                strokeColor: "orange",
                strokeStyle: "dashed"
            });
            this.toMouse[1].on("click", this.createPointOfEditing);
            this.toMouse[1].on("mousemove", this.createToMouse);
            this.toMouse[1].on("rightclick", this.createDefault);
            map.add(this.toMouse);
        }
    }

    allowDefaultSomethingWhenStartEditing(polygon: AMap.Polygon) {
        polygon.setDraggable(true);
        polygon.on("rightclick", this.removeOneOverlay);
        polygon.on("click", this.createPointOfEditing);
        polygon.on("mousemove", this.createToMouse);
    }

    forbidDefaultSomethingWhenStopEditing(polygon: AMap.Polygon) {
        polygon.setDraggable(false);
        polygon.off("rightclick", this.removeOneOverlay);
        polygon.off("click", this.createPointOfEditing);
        polygon.off("mousemove", this.createToMouse);
    }

    allowMapSomethingWhenStartEditing() {
        mapInfos.setIsEditingAndChangeCursorStyle(true);
        map.on("click", this.createPointOfEditing);
        map.on("mousemove", this.createToMouse);
        map.on("rightclick", this.createDefault);
    }

    forbidMapSomethingWhenStopEditing() {
        mapInfos.setIsEditingAndChangeCursorStyle(false);
        map.off("click", this.createPointOfEditing);
        map.off("mousemove", this.createToMouse);
        map.off("rightclick", this.createDefault);
    }

    allowSomethingWhenStartEditing() {
        this.polygons.forEach((polygon) => this.allowDefaultSomethingWhenStartEditing(polygon));
        this.allowMapSomethingWhenStartEditing();
    }

    forbidSomethingWhenStopEditing() {
        this.polygons.forEach((polygon) => this.forbidDefaultSomethingWhenStopEditing(polygon));
        this.forbidMapSomethingWhenStopEditing();
    }

    startEditing() {
        if (this.isEditorMode) {
            this.closeEditors();
            this.isEditorMode = false;
        }
        this.isEditingMode = true;
        this.allowSomethingWhenStartEditing();
    }

    stopEditing() {
        this.isEditingMode = false;
        this.createDefault();
        this.forbidSomethingWhenStopEditing();
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
        this.polygonOpenEditor = e.target;
    }

    closeEditor() {
        if (this.polygonOpenEditor) {
            this.polygonOpenEditor.getExtData().editor.close();
            this.polygonOpenEditor = null;
        }
    }

    openEditors() {
        this.allowSomethingWhenOpenEditors();
        if (this.isEditingMode) {
            this.stopEditing();
            this.isEditingMode = false;
        }
        this.isEditorMode = true;
        this.polygons.forEach((polygon) => polygon.on("click", this.openEditor));
    }

    closeEditors() {
        this.forbidSomethingWhenCloseEditors();
        this.closeEditor();
        this.isEditorMode = false;
        this.polygons.forEach((polygon) => polygon.off("click", this.openEditor));
    }

    removeEditing() {
        if (this.editing) {
            map.remove(this.editing);
            this.editing = null;
        }
    }

    removePointsOfEditing() {
        if (this.pointsOfEditing.length !== 0) {
            map.remove(this.pointsOfEditing);
            this.pointsOfEditing = [];
        }
    }

    removeToMouse() {
        if (this.toMouse.length !== 0) {
            map.remove(this.toMouse);
            this.toMouse = [];
        }
    }

    removeAllOverlays() {
        if (this.polygons.length !== 0) {
            map.remove(this.polygons);
            this.polygons = [];
        }
    }

    removeOneOverlay(e: any) {
        const index = this.polygons.findIndex((point) => point === e.target);
        this.polygons.splice(index, 1);
        map.remove(e.target);
    }

    removeAll() {
        if (!this.editing && this.pointsOfEditing.length === 0 && this.toMouse.length === 0 && this.polygons.length === 0) {
            return false;
        } else {
            this.closeEditor();
            this.removeEditing();
            this.removePointsOfEditing();
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

export const polygonLayer = new PolygonLayer();