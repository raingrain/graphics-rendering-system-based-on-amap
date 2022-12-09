import {makeAutoObservable} from "mobx";
import {AMap, map} from "../component/MapScreen";
import {newPointContent} from "./PointLayer";
import {mapInfos} from "./MapInfos";

class PolylineLayer {
    // 已经绘制好的线集合
    polylines: AMap.Polyline[] = [];
    // 正在绘制的线中已经绘制好的部分
    newPolyline: AMap.Polyline | null = null;
    // 正在绘制的线中已经绘制好的部分的节点
    pointsOfNewPolyline: AMap.Marker[] = [];
    // 指向鼠标指针的线
    toMousePolyline: AMap.Polyline | null = null;
    // 线编辑器数组
    polylineEditors: any[] = [];

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    createPolyline() {
        this.removeToMousePolyline();
        // 当前绘制线转成已经绘制的线
        if (this.newPolyline) {
            const polyline = new AMap.Polyline({
                path: this.newPolyline.getPath(),
                strokeColor: "#1890ff",
                strokeWeight: 6,
                strokeOpacity: 1,
                extData: {
                    id: this.pointsOfNewPolyline.length + 1
                }
            });
            polyline.on("rightclick", this.removeAPolyline);
            this.polylines.push(polyline);
            map.add(polyline);
            // 清除当前绘制的线
            map.remove(this.newPolyline!);
            this.newPolyline = null;
            // 清除当前绘制线的点
            map.remove(this.pointsOfNewPolyline);
            this.pointsOfNewPolyline = [];
        }
    }

    createNewPolyline() {
        this.removeToMousePolyline();
        // 创建当前绘制线中已经绘制好的部分
        this.newPolyline && map.remove(this.newPolyline);
        this.newPolyline = new AMap.Polyline({
            path: this.pointsOfNewPolyline.map((point) => point.getPosition()!),
            strokeColor: "orange",
            strokeWeight: 3,
            strokeStyle: "solid"
        });
        map.add(this.newPolyline!);
    }

    createPointOfNew(e: any) {
        this.removeToMousePolyline();
        const point = new AMap.Marker({
            map: map,
            position: e.lnglat,
            draggable: true,
            content: newPointContent,
            extData: {
                id: this.pointsOfNewPolyline.length + 1
            }
        } as AMap.MarkerOptions);
        this.pointsOfNewPolyline.push(point);
        point.on("dragging", this.createNewPolyline);
        this.createNewPolyline();
    }

    createToMousePolyline(e: any) {
        this.removeToMousePolyline();
        if (this.pointsOfNewPolyline.length >= 1) {
            // 避免难以点击
            e.lnglat.setLng(this.pointsOfNewPolyline[this.pointsOfNewPolyline.length - 1].getPosition()!.lng < e.lnglat.lng ? e.lnglat.lng - 0.0001 : e.lnglat.lng + 0.0001);
            e.lnglat.setLat(this.pointsOfNewPolyline[this.pointsOfNewPolyline.length - 1].getPosition()!.lat < e.lnglat.lat ? e.lnglat.lat - 0.0001 : e.lnglat.lat + 0.0001);
            this.toMousePolyline = new AMap.Polyline({
                path: [this.pointsOfNewPolyline[this.pointsOfNewPolyline.length - 1].getPosition()!, e.lnglat!],
                strokeColor: "orange",
                strokeWeight: 5,
                strokeStyle: "dashed"
            });
            map.add(this.toMousePolyline!);
        }
    }

    removeToMousePolyline() {
        this.toMousePolyline && map.remove(this.toMousePolyline);
    }

    allowDrag() {
        this.polylines.forEach((polyline) => polyline.setDraggable(true));
    }

    forbidDrag() {
        this.polylines.forEach((polyline) => polyline.setDraggable(false));
    }

    allowRemove() {
        this.polylines.forEach((polyline) => polyline.on("rightclick", this.removeAPolyline));
    }

    forbidRemove() {
        this.polylines.forEach((polyline) => polyline.off("rightclick", this.removeAPolyline));
    }

    startEditing() {
        this.allowDrag();
        this.allowRemove()
        mapInfos.setIsEditingAndChangeCursorStyle(true);
        map.on("click", this.createPointOfNew);
        map.on("mousemove", this.createToMousePolyline);
        map.on("rightclick", this.createPolyline);
    }

    stopEditing() {
        this.createPolyline();
        this.forbidDrag();
        this.forbidRemove();
        mapInfos.setIsEditingAndChangeCursorStyle(false);
        map.off("click", this.createPointOfNew);
        map.off("mousemove", this.createToMousePolyline);
        map.off("rightclick", this.createPolyline);
    }

    openEditor() {
        this.polylines.forEach((polyline) => {
            const polylineEditor = new AMap.PolylineEditor(map, polyline);
            polylineEditor.open();
            this.polylineEditors.push(polylineEditor);
        });
    }

    closeEditor() {
        this.polylineEditors.forEach((polylineEditor) => {
            polylineEditor.close();
        });
        this.polylineEditors = [];
    }

    removeAPolyline(e: any) {
        const index = this.polylines.findIndex((polyline) => polyline === e.target);
        this.polylines.splice(index, 1);
        map.remove(e.target);
    }

    removeAllPolylines() {
        if (this.polylineEditors.length === 0 && this.polylines.length === 0 && this.pointsOfNewPolyline.length === 0 && !this.newPolyline && !this.toMousePolyline) {
            // 四个存储数据的变量都是空或者数组内没有数据才行
            return false;
        } else {
            if (this.polylineEditors.length !== 0) {
                this.closeEditor();
            }
            if (this.polylines.length !== 0) {
                map.remove(this.polylines);
                this.polylines = [];
            }
            if (this.pointsOfNewPolyline.length !== 0) {
                map.remove(this.pointsOfNewPolyline);
                this.pointsOfNewPolyline = [];
            }
            if (this.newPolyline) {
                map.remove(this.newPolyline);
                this.newPolyline = null;
            }
            if (this.toMousePolyline) {
                map.remove(this.toMousePolyline);
                this.toMousePolyline = null;
            }
            return true;
        }
    }

}

export const polylineLayer = new PolylineLayer();