import {makeAutoObservable} from "mobx";
import {AMap, map} from "../layouts/MapPageLayout/MapContainer";

// 控件类型，初始化为null
type ControlType = AMap.Control | null;

class GaoDeControls {
    controlBar: ControlType = null;
    toolBar: ControlType = null;
    scale: ControlType = null;
    hawkEye: ControlType = null;
    location: ControlType = null;

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    setControlBar(config = {}) {
        const controlBar = new AMap.ControlBar({
            // 设置3D控件
            position: "RT",
            offset: [0, 0],
            ...config
        });
        this.controlBar && map.removeControl(this.controlBar);
        this.controlBar = controlBar;
        map.addControl(this.controlBar!);
    }

    setToolBar(config = {}) {
        const toolBar = new AMap.ToolBar({
            position: {
                bottom: "32vh",
                right: "2vh"
            },
            offset: [0, 0],
            ...config
        });
        this.toolBar && map.removeControl(this.toolBar);
        this.toolBar = toolBar;
        map.addControl(this.toolBar!);
    }

    setScale(config = {}) {
        const scale = new AMap.Scale({
            position: {
                right: "20vw",
                bottom: "1rem"
            },
            ...config
        });
        this.scale && map.removeControl(this.scale);
        this.scale = scale;
        map.addControl(this.scale!);
    }

    setHawkEye(config = {}) {
        const hawkEye = new AMap.HawkEye({
            autoMove: true,
            showRectangle: true,
            showButton: true,
            opened: true,
            mapStyle: "amap://styles/blue",
            width: "15vw",
            height: "30vh",
            offset: [0, 0],
            borderStyle: "solid none none solid",
            borderColor: "skyblue",
            borderWidth: "1px",
            ...config
        });
        this.hawkEye && map.removeControl(this.hawkEye);
        this.hawkEye = hawkEye;
        map.addControl(this.hawkEye!);
    }

    setLocation(config = {}) {
        const location = new AMap.Geolocation({
            position: "LB",
            showCircle: false,
            ...config
        });
        this.location && map.removeControl(this.location);
        this.location = location;
        map.addControl(this.location!);
    }

    initialControls() {
        this.setControlBar();
        this.setToolBar();
        this.setScale();
        this.setHawkEye();
        this.setLocation();
    }
}

export const gaoDeControls = new GaoDeControls();