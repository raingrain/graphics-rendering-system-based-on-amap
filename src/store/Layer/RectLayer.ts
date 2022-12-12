import {makeAutoObservable} from "mobx";
import {AMap, map} from "../../component/MapScreen";
import {editingPointContent} from "./PointLayer";
import {mapInfos} from "../MapInfos";
import {Layer} from "./types";

class RectLayer implements Layer {

    rects: AMap.Rectangle[] = [];
    // 两个定点
    pointsOfEditing: AMap.Marker[] = [];
    // 到鼠标的矩形
    toMouse: AMap.Rectangle | null = null;
    // 编辑模式
    isEditingMode = false;
    // 编辑器模式
    isEditorMode = false;
    // 正在打开编辑器的面
    rectOpenEditor: AMap.Rectangle | null = null;

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    createDefault() {
        if (this.pointsOfEditing.length != 0 && this.toMouse) {
            const rect = new AMap.Rectangle({
                bounds: this.toMouse.getBounds(),
                strokeColor: "#1890ff",
                fillColor: "#1890ff"
            });
            rect.setExtData({
                editor: new AMap.RectangleEditor(map, rect)
            })
            this.allowDefaultSomethingWhenStartEditing(rect);
            this.rects.push(rect);
            map.add(rect);
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
            // 删除定点可以取消创建
            point.on("rightclick", this.removePointsOfEditing);
            point.on("rightclick", this.removeToMouse);
            this.pointsOfEditing.push(point)
            map.add(point);
        }
        // 不像多边形的线的点数是不确定的，两点可以确定一个矩形
        if (this.pointsOfEditing.length === 2) {
            this.createDefault();
            this.removePointsOfEditing();
        }
    }

    createToMouse(e: any) {
        this.removeToMouse();
        if (this.pointsOfEditing.length !== 0) {
            // 找到西南点和东北点
            let southWest;
            let northEast;
            // 矩形定点的坐标
            const fixedPointLngLat = this.pointsOfEditing[0].getPosition()!;
            if (e.lnglat.lng >= fixedPointLngLat.getLng() && e.lnglat.getLat() >= fixedPointLngLat.getLat()) {
                southWest = fixedPointLngLat;
                northEast = e.lnglat;
            } else if (e.lnglat.lng <= fixedPointLngLat.getLng() && e.lnglat.getLat() <= fixedPointLngLat.getLat()) {
                southWest = e.lnglat;
                northEast = fixedPointLngLat;
            } else if (e.lnglat.lng < fixedPointLngLat.getLng() && e.lnglat.getLat() > fixedPointLngLat.getLat()) {
                southWest = new AMap.LngLat(e.lnglat.getLng(), fixedPointLngLat.getLat());
                northEast = new AMap.LngLat(fixedPointLngLat.getLng(), e.lnglat.getLat());
            } else {
                southWest = new AMap.LngLat(fixedPointLngLat.getLng(), e.lnglat.getLat());
                northEast = new AMap.LngLat(e.lnglat.getLng(), fixedPointLngLat.getLat());
            }
            // 边界数组
            const bounds = new AMap.Bounds(southWest, northEast);
            this.toMouse = new AMap.Rectangle({
                bounds,
                strokeColor: "orange",
                strokeStyle: "dashed",
                fillColor: "orange"
            });
            this.toMouse!.on("mousemove", this.createToMouse)
            this.toMouse!.on("click", this.createPointOfEditing);
            // 只创建定点时右键直接删除
            this.toMouse!.on("rightclick", this.removePointsOfEditing);
            this.toMouse!.on("rightclick", this.removeToMouse);
            map.add(this.toMouse!);
        }
    }

    allowDefaultSomethingWhenStartEditing(rect: AMap.Rectangle) {
        rect.setDraggable(true);
        rect.on("rightclick", this.removeOneOverlay);
        rect.on("click", this.createPointOfEditing);
        rect.on("mousemove", this.createToMouse);
    }

    forbidDefaultSomethingWhenStopEditing(rect: AMap.Rectangle) {
        rect.setDraggable(false);
        rect.off("rightclick", this.removeOneOverlay);
        rect.off("click", this.createPointOfEditing);
        rect.off("mousemove", this.createToMouse);
    }

    allowMapSomethingWhenStartEditing() {
        mapInfos.setIsEditingAndChangeCursorStyle(true);
        map.on("click", this.createPointOfEditing);
        map.on("mousemove", this.createToMouse);
        // 只创建定点时右键直接删除
        map.on("rightclick", this.removePointsOfEditing);
        map.on("rightclick", this.removeToMouse);
    }

    forbidMapSomethingWhenStopEditing() {
        mapInfos.setIsEditingAndChangeCursorStyle(false);
        map.off("click", this.createPointOfEditing);
        map.off("mousemove", this.createToMouse);
        map.off("rightclick", this.removePointsOfEditing);
        map.off("rightclick", this.removeToMouse);
    }

    allowSomethingWhenStartEditing() {
        this.rects.forEach((rect) => this.allowDefaultSomethingWhenStartEditing(rect));
        this.allowMapSomethingWhenStartEditing();
    }

    forbidSomethingWhenStopEditing() {
        this.rects.forEach((rect) => this.forbidDefaultSomethingWhenStopEditing(rect));
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
        this.rectOpenEditor = e.target;
    }

    closeEditor() {
        if (this.rectOpenEditor) {
            this.rectOpenEditor.getExtData().editor.close();
            this.rectOpenEditor = null;
        }
    }

    openEditors() {
        this.allowSomethingWhenOpenEditors();
        if (this.isEditingMode) {
            this.stopEditing();
            this.isEditingMode = false;
        }
        this.isEditorMode = true;
        this.rects.forEach((rect) => rect.on("click", this.openEditor));
    }

    closeEditors() {
        this.forbidSomethingWhenCloseEditors();
        this.closeEditor();
        this.isEditorMode = false;
        this.rects.forEach((rect) => rect.off("click", this.openEditor));
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
        if (this.rects.length !== 0) {
            map.remove(this.rects);
            this.rects = [];
        }
    }

    removeOneOverlay(e: any) {
        const index = this.rects.findIndex((rect) => rect === e.target);
        this.rects.splice(index, 1);
        map.remove(e.target);
    }

    removeAll() {
        if (!this.toMouse && this.pointsOfEditing.length === 0 && this.rects.length === 0) {
            return false;
        } else {
            this.closeEditor();
            this.removeToMouse();
            this.removePointsOfEditing();
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

export const rectLayer = new RectLayer();