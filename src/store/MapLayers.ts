import {makeAutoObservable} from "mobx";
import {AMap} from "../component/MapScreen";

// 单个图层的类型，初始化为null
type LayerType = AMap.TileLayer | AMap.BuildingLayer | null;

class MapLayers {
    // 卫星图层
    satellite: LayerType = null;
    // 路网图层
    roadNet: LayerType = null;
    // 路况图层
    traffic: LayerType = null;
    // 楼块图层
    buildings: LayerType = null;
    // 图层数据
    layersData = [
        {
            zhName: "卫星图层",
            type: this.satellite
        },
        {
            zhName: "路网图层",
            type: this.roadNet
        },
        {
            zhName: "路况图层",
            type: this.traffic
        },
        {
            zhName: "楼块图层",
            type: this.buildings
        }
    ];

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    setSatellite(config = {}) {
        this.satellite = new AMap.TileLayer.Satellite(config);
    }

    setRoadNet(config = {}) {
        this.roadNet = new AMap.TileLayer.RoadNet(config);
    }

    setTraffic(config = {}) {
        this.traffic = new AMap.TileLayer.Traffic(config);
    }

    setBuildings(config = {}) {
        this.buildings = new AMap.Buildings({
            // 楼块的高度系数因子，默认为 1，也就是正常高度
            heightFactor: 1,
            // 楼块侧面颜色
            wallColor: "gray",
            // 楼块顶面颜色
            roofColor: "white",
            // 图层缩放等级范围
            zooms: [0, 20],
            // 图层的透明度
            opacity: 1,
            // 图层是否可见
            visible: true,
            // 图层的层级
            zIndex: 11,
            ...config
        });
    }

    initialLayers() {
        this.setSatellite();
        this.setRoadNet();
        this.setTraffic();
        this.setBuildings();
    }
}

export const mapLayers = new MapLayers();