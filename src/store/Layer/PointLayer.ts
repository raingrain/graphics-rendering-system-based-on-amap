import {makeAutoObservable} from "mobx";
import {AMap, map} from "../../component/MapScreen";
import {mapInfos} from "../MapInfos";
import {Layer} from "./types";

export const oldPointContent = `<div style="border: 2px solid white; border-radius: 50%; background-color: #1890ff; width: .75rem; height: .75rem; transform: translate(-50%, -50%)"></div>`;
export const newPointContent = `<div style="border: 2px solid white; border-radius: 50%; background-color: orange; width: 1rem; height: 1rem; transform: translate(-50%, -50%)"></div>`;

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
            map,
            position: e.lnglat,
            draggable: true,
            content: newPointContent,
            cursor: "move"
        });
        // 当前点变成默认点后还可以在拖拽或删除操作中变成编辑点
        point!.on("mousedown", this.changeDefaultPointToEditingPoint);
        point!.on("rightclick", this.removeOne);
        // 把之前的编辑点移除
        this.changeEditingPointToDefaultPoint();
        // 把当前点设置为编辑点
        this.editingPoint = point;
        // 加入已经创建好的点集中
        this.points.push(this.editingPoint!);
    }

    changeEditingPointToDefaultPoint() {
        // 如果存在编辑点，就把它变成默认点
        if (this.editingPoint) {
            this.editingPoint.setContent(oldPointContent);
            // 然后删除它
            this.editingPoint = null;
        }
    }

    // 按下鼠标时将默认点变成编辑点
    changeDefaultPointToEditingPoint(e: any) {
        // 如果之前有编辑点的话，就改变颜色
        this.changeEditingPointToDefaultPoint();
        // 然后把当前点变成点击点
        this.editingPoint = e.target;
        // 当前点样式设置为编辑点样式
        e.target.setContent(newPointContent);
    }

    allowDrag() {
        for (const point of this.points) {
            point.setDraggable(true);
            point.setCursor("move");
            point.on("mousedown", this.changeDefaultPointToEditingPoint);
        }
    }

    forbidDrag() {
        for (const point of this.points) {
            point.setDraggable(false);
            point.setCursor("default");
            point.off("mousedown", this.changeDefaultPointToEditingPoint);
        }
    }

    allowRemove() {
        for (const point of this.points) {
            point.on("rightclick", this.removeOne)
        }
    }

    forbidRemove() {
        for (const point of this.points) {
            point.off("rightclick", this.removeOne)
        }
    }

    startEditing() {
        mapInfos.setIsEditingAndChangeCursorStyle(true);
        this.allowDrag();
        this.allowRemove();
        map.on("click", this.createPoint);
    }

    stopEditing() {
        mapInfos.setIsEditingAndChangeCursorStyle(false);
        this.changeEditingPointToDefaultPoint();
        this.forbidDrag();
        this.forbidRemove();
        map.off("click", this.createPoint);
    }

    removeOne(e: any) {
        const index = this.points.findIndex((point) => point === e.target);
        this.points.splice(index, 1);
        map.remove(e.target);
    }

    removeAll() {
        if (this.points.length === 0) {
            return false;
        } else {
            map.remove(this.points);
            this.points = [];
            return true;
        }
    }
}

export const pointLayer = new PointLayer();