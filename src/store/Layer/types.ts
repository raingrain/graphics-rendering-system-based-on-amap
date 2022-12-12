export interface Layer {

    // 每次开始编辑时给当前图层已经存在的矢量图形绑定监听事件
    // addEventListener?(): void;

    // 每次结束编辑时给当前图层已经存在的矢量图形移除监听事件
    removeEventListener?(): void;

    // 开始编辑图层
    startEditing(): void;

    // 停止编辑图层
    stopEditing(): void;

    // 打开高德地图编辑器
    openEditors?(): void;

    // 关闭高德地图编辑器
    closeEditors?(): void;

    // 删除单个矢量图形
    removeOneOverlay(e: any): void;

    // 删除当前图层内的全部矢量图形
    removeAll(): boolean;
}

