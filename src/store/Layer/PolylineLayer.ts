import {makeAutoObservable} from "mobx";
import {AMap, map} from "../../component/MapScreen";
import {editingPointContent} from "./PointLayer";
import {mapInfos} from "../MapInfos";
import {Layer} from "./types";

class PolylineLayer implements Layer {

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    // 已经绘制好的线集合
    polylines: AMap.Polyline[] = [];
    // 正在绘制的线中已经绘制好的部分
    editing: AMap.Polyline | null = null;
    // 正在绘制的线中已经绘制好的部分的节点
    pointsOfEditing: AMap.Marker[] = [];
    // 指向鼠标指针的线
    toMouse: AMap.Polyline | null = null;
    // 编辑模式
    isEditingMode = false;
    // 编辑器模式
    isEditorMode = false;
    // 正在打开编辑器的线
    polylineOpenEditor: AMap.Polyline | null = null;

    createDefault() {
        // 当前绘制线转成已经绘制的线
        if (this.editing) {
            const polyline = new AMap.Polyline({
                path: this.editing.getPath(),
                strokeColor: "#1890ff",
                strokeWeight: 5
            });
            polyline.setExtData({
                editor: new AMap.PolylineEditor(map, polyline)
            });
            this.allowDefaultSomethingWhenStartEditing(polyline);
            this.polylines.push(polyline);
            map.add(polyline);
        }
        // 清除正在编辑的元素
        this.removeEditing();
        this.removeToMouse();
        this.removePointsOfEditing();
    }

    // 创建当前绘制线中已经绘制好的部分
    createEditing() {
        // 两个点才画线
        if (this.pointsOfEditing.length > 1) {
            // 先移除指向鼠标的线
            this.removeToMouse();
            // 把之前正在编辑的线移除变成新的
            this.removeEditing();
            this.editing = new AMap.Polyline({
                path: this.pointsOfEditing.map((point) => point.getPosition()!),
                strokeColor: "orange",
                strokeStyle: "solid",
                strokeWeight: 5
            });
            // 可以在上面创建新的点
            this.editing!.on("click", this.createPointOfEditing);
            // 指向鼠标的线可以在上面移动
            this.editing!.on("mousemove", this.createToMouse);
            // 可以在上面右键完成创建
            this.editing!.on("rightclick", this.createDefault);
            map.add(this.editing!);
        }
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
        // 编辑的线延长
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
        if (this.pointsOfEditing.length !== 0) {
            this.toMouse = new AMap.Polyline({
                path: [this.pointsOfEditing[this.pointsOfEditing.length - 1].getPosition()!, e.lnglat!],
                strokeColor: "orange",
                strokeStyle: "dashed",
                strokeWeight: 5
            });
            // 取消阻塞感
            this.toMouse!.on("click", this.createPointOfEditing);
            // 让鼠标能在虚线上滑动
            this.toMouse!.on("mousemove", this.createToMouse);
            // 只有一个点时就是删除起点和虚线，不然就是删除虚线并创建存在的线。
            this.toMouse!.on("rightclick", this.createDefault);
            map.add(this.toMouse!);
        }
    }

    allowDefaultSomethingWhenStartEditing(polyline: AMap.Polyline) {
        polyline.setDraggable(true);
        polyline.on("rightclick", this.removeOneOverlay);
        polyline.on("click", this.createPointOfEditing);
        polyline.on("mousemove", this.createToMouse);
    }

    forbidDefaultSomethingWhenStopEditing(polyline: AMap.Polyline) {
        polyline.setDraggable(false);
        polyline.off("rightclick", this.removeOneOverlay);
        polyline.off("click", this.createPointOfEditing);
        polyline.off("mousemove", this.createToMouse);
    }

    allowMapSomethingWhenStartEditing() {
        mapInfos.setIsEditingAndChangeCursorStyle(true);
        // 保证第一个点可以被创建
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
        this.polylines.forEach((polyline) => this.allowDefaultSomethingWhenStartEditing(polyline));
        this.allowMapSomethingWhenStartEditing();
    }

    forbidSomethingWhenStopEditing() {
        this.polylines.forEach((polyline) => this.forbidDefaultSomethingWhenStopEditing(polyline));
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
        this.polylineOpenEditor = e.target;
    }

    closeEditor() {
        if (this.polylineOpenEditor) {
            this.polylineOpenEditor.getExtData().editor.close();
            this.polylineOpenEditor = null;
        }
    }

    openEditors() {
        this.allowSomethingWhenOpenEditors();
        if (this.isEditingMode) {
            this.stopEditing();
            this.isEditingMode = false;
        }
        this.isEditorMode = true;
        this.polylines.forEach((polyline) => polyline.on("click", this.openEditor));
    }

    closeEditors() {
        this.forbidSomethingWhenCloseEditors();
        this.closeEditor();
        this.isEditorMode = false;
        this.polylines.forEach((polyline) => polyline.off("click", this.openEditor));
    }

    removeEditing() {
        if (this.editing) {
            map.remove(this.editing);
            this.editing = null;
        }
    }

    removeToMouse() {
        if (this.toMouse) {
            map.remove(this.toMouse);
            this.toMouse = null;
        }
    }

    removePointsOfEditing() {
        if (this.pointsOfEditing.length !== 0) {
            map.remove(this.pointsOfEditing);
            this.pointsOfEditing = [];
        }
    }

    removeAllOverlays() {
        if (this.polylines.length !== 0) {
            map.remove(this.polylines);
            this.polylines = [];
        }
    }

    removeOneOverlay(e: any) {
        const index = this.polylines.findIndex((polyline) => polyline === e.target);
        this.polylines.splice(index, 1);
        map.remove(e.target);
    }

    removeAll() {
        if (!this.editing && !this.toMouse && this.pointsOfEditing.length === 0 && this.polylines.length === 0) {

            return false;
        } else {
            this.closeEditor();
            this.removeEditing();
            this.removeToMouse();
            this.removePointsOfEditing();
            this.removeAllOverlays();
            return true;
        }
    }

}

export const polylineLayer = new PolylineLayer();