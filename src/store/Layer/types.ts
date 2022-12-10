export interface Layer {

    // 每次开始编辑当前图层时允许已创建的矢量图形拖拽
    allowDrag?(): void;

    // 每次结束编辑当前图层时禁止已创建的矢量图形拖拽
    forbidDrag?(): void;

    // 每次开始编辑当前图层时允许已创建的矢量图形被单个删除
    allowRemove?(): void;

    // 每次结束编辑当前图层时禁止已创建的矢量图形被单个删除
    forbidRemove?(): void;

    // 开始编辑图层
    startEditing(): void;

    // 停止编辑图层
    stopEditing(): void;

    // 打开高德地图编辑器
    openEditor?(): void;

    // 关闭高德地图编辑器
    closeEditor?(): void;

    // 删除单个矢量图形
    removeOne(e: any): void;

    // 删除当前图层内的全部矢量图形
    removeAll(): boolean;
}

