import {makeAutoObservable} from "mobx";
import {AMap, map} from "../component/MapScreen";
import {mapInfos} from "./MapInfos";

export const oldPointContent = `<div style="border: 2px solid white; border-radius: 50%; background-color: #1890ff; width: 15px; height: 15px; transform: translate(-50%, -50%)"></div>`;
export const newPointContent = `<div style="border: 2px solid white; border-radius: 50%; background-color: orange; width: 15px; height: 15px; transform: translate(-50%, -50%)"></div>`;

class PointLayer {
    // 已经绘制的点集
    points: AMap.Marker[] = [];

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    createAPoint(e: any) {
        this.changeNewPointToOldPoint();
        const point = new AMap.Marker({
            map: map,
            position: e.lnglat,
            draggable: true,
            content: newPointContent,
            extData: {
                id: this.points.length + 1
            }
        } as AMap.MarkerOptions);
        point.on("rightclick", this.removeAPoint);
        this.points.push(point);
    }

    changeNewPointToOldPoint() {
        this.points.length !== 0 && this.points.at(-1)?.setContent(oldPointContent);
    }

    allowDrag() {
        this.points.forEach((point) => point.setDraggable(true));
    }

    forbidDrag() {
        this.points.forEach((point) => point.setDraggable(false));
    }

    allowRemove() {
        this.points.forEach((point) => point.on("rightclick", this.removeAPoint));
    }

    forbidRemove() {
        this.points.forEach((point) => point.off("rightclick", this.removeAPoint));
    }

    startEditing() {
        mapInfos.setIsEditingAndChangeCursorStyle(true);
        this.allowDrag();
        this.allowRemove();
        map.on("click", this.createAPoint);
    }

    stopEditing() {
        mapInfos.setIsEditingAndChangeCursorStyle(false);
        this.changeNewPointToOldPoint();
        this.forbidDrag();
        this.forbidRemove();
        map.off("click", this.createAPoint);
    }

    removeAPoint(e: any) {
        const index = this.points.findIndex((point) => point === e.target);
        this.points.splice(index, 1);
        map.remove(e.target);
    }

    removeAllPoints() {
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