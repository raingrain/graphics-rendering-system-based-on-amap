import {makeAutoObservable} from "mobx";
import {AMap, map} from "../../component/MapScreen";
import {mapInfos} from "../MapInfos";
import {Layer} from "./types";

export const defaultPointContent = `<div style="border: 2px solid white; border-radius: 50%; background-color: #1890ff; width: .75rem; height: .75rem; transform: translate(-50%, -50%)"></div>`;
export const editingPointContent = `<div style="border: 2px solid white; border-radius: 50%; background-color: orange; width: 1rem; height: 1rem; transform: translate(-50%, -50%)"></div>`;

class PointLayer implements Layer {

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    // 已经绘制的点集
    points: AMap.Marker[] = [];
    // 当前正在编辑的点
    editingPoint: AMap.Marker | null = null;

    createPoint(e: any) {
        const point = new AMap.Marker({
            position: e.lnglat,
            content: editingPointContent
        });
        // 当前点变成默认点后还可以在拖拽或删除操作中变成编辑点
        this.allowEditingAndRemove(point);
        // 把之前的编辑点移除
        this.turnEditingPointIntoDefaultPoint();
        // 把当前点设置为编辑点
        this.editingPoint = point;
        // 加入已经创建好的点集中
        this.points.push(this.editingPoint!);
        // 加入到地图上
        map.add(point)
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

    allowEditingAndRemove(point: AMap.Marker) {
        point.setDraggable(true);
        point.setCursor("move");
        point.on("mousedown", this.turnDefaultPointIntoEditingPointWhenMouseDownOnPoint);
        point.on("rightclick", this.removeOne);
    }

    banEditingAndRemove(point: AMap.Marker) {
        point.setDraggable(false);
        point.setCursor("default");
        point.off("mousedown", this.turnDefaultPointIntoEditingPointWhenMouseDownOnPoint);
        point.off("rightclick", this.removeOne);
    }

    addAllEventListener() {
        this.points.forEach((point) => this.allowEditingAndRemove(point));
        map.on("click", this.createPoint);
    }

    removeAllEventListener() {
        this.points.forEach((point) => this.banEditingAndRemove(point));
        map.off("click", this.createPoint);
    }

    startEditing() {
        mapInfos.setIsEditingAndChangeCursorStyle(true);
        this.addAllEventListener();
    }

    stopEditing() {
        mapInfos.setIsEditingAndChangeCursorStyle(false);
        this.turnEditingPointIntoDefaultPoint();
        this.removeAllEventListener();
        console.log(this.editingPoint, this.points);
    }

    removeOne(e: any) {
        const index = this.points.findIndex((point) => point === e.target);
        this.points.splice(index, 1);
        map.remove(e.target);
        if (this.editingPoint && e.target === this.editingPoint) {
            map.remove(this.editingPoint);
            this.editingPoint = null;
        }
    }

    removeAll() {
        if (this.points.length === 0 && !this.editingPoint) {
            return false;
        } else {
            if (this.points.length !== 0) {
                map.remove(this.points);
                this.points = [];
            }
            if (this.editingPoint) {
                map.remove(this.editingPoint);
                this.editingPoint = null;
            }
            return true;
        }
    }
}

export const pointLayer = new PointLayer();