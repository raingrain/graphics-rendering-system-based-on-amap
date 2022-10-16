import React, {ChangeEvent, useEffect, useRef} from "react";

import AMapLoader from "@amap/amap-jsapi-loader";
import "@amap/amap-jsapi-types";

import {mapStyles} from "../../data/mapStyles.js";
import {mapFeatures, mapFeaturesName} from "../../data/mapFeatures.js";

import {setHawkEye,initialControls} from "../../utils/setControls";
import {setSatelliteLayer, setRoadNetLayer, setTrafficLayer, setBuildingsLayer, initialLayers} from "../../utils/setLayers";

import "./MapContainer.scss";


let panel: React.RefObject<HTMLDivElement>;
// declare
let AMap: any;
let map: AMap.Map;

function MapContainer() {

    // 地图实例

    // AMap = {};

    // 控制面板标签
    panel = useRef<HTMLDivElement>(null);

    // 鼠标经纬度标签
    let mouseLngLat = useRef<HTMLSpanElement>(null);

    // 地图层级标签
    let zoom = useRef<HTMLSpanElement>(null);

    // 地图中心标签
    let center = useRef<HTMLSpanElement>(null);

    // 只在初次挂载后渲染地图
    useEffect(() => {
        loadMap();
    }, []);

    // 创建地图
    // 想重新加载地图可以再次调用这个函数
    // 销毁地图使用map && map.destroy();
    function loadMap() {
        // 申请好的Web端开发者Key，首次调用 load 时必填
        AMapLoader.load({
            key: "2aae3c0f124d7e3d0058ddb5183c7583",
            // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            version: "2.0",
            // 需要使用的的控件列表，如比例尺'AMap.Scale'等
            plugins: ["AMap.ControlBar", "AMap.ToolBar", "AMap.Scale", "AMap.HawkEye"]
        }).then((_AMap) => {
            AMap = _AMap;
            // 根据ID以及初始化配置对象加载地图
            map = new AMap.Map("container", {
                // 是否为3D地图模式
                viewMode: "3D",
                // 初始化地图缩放级别
                zoom: 13,
                // 初始化地图中心点位置，十进制经纬度
                center: [121.443333, 31.037778],
                // 旋转角是否可以调整
                rotateEnable: true,
                // 旋转角角度
                rotation: -15,
                // 俯仰角是否可以调整
                pitchEnable: true,
                // 俯仰角角度
                pitch: 45,
                // 是否显示室内地图
                showIndoorMap: true,
                // 是否监控地图容器尺寸变化
                resizeEnable: true,
                // 地图显示要素
                features: mapFeatures,
                // 初始化地图样式
                mapStyle: "amap://styles/normal",
                // 是否显示文字标记
                showLabel: true
            });

            addEventListeners();

            initialLayers();

            initialControls();

            console.log(map.getCenter());

            // 地图中心点centerMark标记
            map.add(new AMap.Marker({
                position: map.getCenter()
                // position: [121.443333, 31.037778]
            }));
        }).catch(error => {
            console.log(error);
        });
    }

    // 给地图绑定事件
    function addEventListeners() {
        map.on("complete", function logMap() {
            console.log("地图已加载");
        });

        map.on("moveend", function logCenter() {
            center.current!.innerText = `(${map.getCenter().lng.toFixed(6)}, ${map.getCenter().lat.toFixed(6)})`;
        });

        map.on("zoomend", function logZoom() {
            zoom.current!.innerText = `${map.getZoom()}`;
        });

        map.on("click", function logLongitudeAndLatitudeOfMouse(e) {
            mouseLngLat.current!.innerText = `(${e.lnglat.getLng()}, ${e.lnglat.getLat()})`;
        });
    }

    return (
        <div className="map-screen">
            {/*地图容器，需要一个ID*/}
            <div id="container" className="map"></div>
            {/*控制面板*/}
            <div className="panel" ref={panel}>
                <h1>Control Panel</h1>
                {/*地图信息面板*/}
                <div className="map-info-panel">
                    <div>地图层级: <span ref={zoom}>13</span></div>
                    <div>鼠标经纬度: <span ref={mouseLngLat}>(121.443333, 31.037778)</span></div>
                    <div>地图中心点: <span ref={center}>(121.443333, 31.037778)</span></div>
                </div>
                {/*地图层级设置按钮*/}
                <button onClick={function setRandomZoom() {
                    // zoom范围假定为[11,18]
                    map.setZoom(Math.floor(Math.random() * 7) + 11);
                }}>随机设置地图层级
                </button>
                {/*地图中心设置按钮*/}
                <button onClick={function setRandomCenter() {
                    // 经度范围[121.138398, 121.728226]
                    let lng = 121.138398 + Math.floor(Math.random() * 589828) / 1e6;
                    // 纬度范围[30.972688, 31.487611]
                    let lat = 30.972688 + Math.floor(Math.random() * 514923) / 1e6;
                    // 设置地图中心点
                    map.setCenter([lng, lat]);
                }}>随机设置地图中心点
                </button>
                {/*地图图层设置面板*/}
                <div className="map-layers-panel">
                    <h3>Set Map-Layers</h3>
                    {/*设置图层，一个div包括input和label*/}
                    {/*map实例的add()和remove()方法添加或删除覆盖物/图层，参数为单个覆盖物/图层或覆盖物/图层的数组且范围更广*/}
                    {/*可以通过console.log(map.getLayers())来获取当前图层信息，或使用map.setLayers()来一次性替换图层*/}
                    <div>
                        <input
                            type="checkbox"
                            id="setSatelliteLayer"
                            onChange={(e) => setSatelliteLayer(e.target.checked)}
                            defaultChecked={false}
                        />
                        <label htmlFor="setSatelliteLayer">卫星图层</label>
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="setRoadNetLayer"
                            onChange={(e) => setRoadNetLayer(e.target.checked)}
                            // onChange={function setRoadNetLayer(e: ChangeEvent<HTMLInputElement>) {
                            //     setLayer("RoadNet", e.target.checked);
                            // }}
                            defaultChecked={false}
                        />
                        <label htmlFor="setRoadNetLayer">路网图层</label>
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="setTrafficLayer"
                            onChange={(e) => setTrafficLayer(e.target.checked)}
                            // onChange={function setTrafficLayer(e: ChangeEvent<HTMLInputElement>) {
                            //     setLayer("Traffic", e.target.checked);
                            // }}
                            defaultChecked={false}
                        />
                        <label htmlFor="setTrafficLayer">路况图层</label>
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="setBuildingsLayer"
                            onChange={(e) => setBuildingsLayer(e.target.checked)}
                            // onChange={function setTrafficLayer(e: ChangeEvent<HTMLInputElement>) {
                            //     setLayer("Buildings", e.target.checked);
                            // }}
                            defaultChecked={false}
                        />
                        <label htmlFor="setBuildingsLayer">楼块图层</label>
                    </div>
                </div>
                {/*地图显示要素设置面板*/}
                <div className="map-features-panel">
                    <h3>Set Map-Features</h3>
                    {
                        mapFeatures.map((mapFeature, index) =>
                            <div key={mapFeature}>
                                <input
                                    type="checkbox"
                                    name="mapFeatures"
                                    id={mapFeature}
                                    value={mapFeature}
                                    onChange={function (e: ChangeEvent<HTMLInputElement>) {
                                        if (e.target.checked && !mapFeatures.includes(e.target.value)) {
                                            // 如果该复选框是被选中的，且mapFeatures中没有这个要素，就往mapFeatures中加这个数据
                                            mapFeatures.push(e.target.value);
                                        } else if (!e.target.checked && mapFeatures.includes(e.target.value)) {
                                            // 如果该复选框是取消选中的，且mapFeatures中有这个要素，就往mapFeatures中移除这个数据
                                            mapFeatures.splice(mapFeatures.indexOf(e.target.value), 1);
                                        }
                                        // 往map实例中添加要显示的要素
                                        map.setFeatures(mapFeatures);
                                        console.log("mapFeatures: ", map.getFeatures());
                                    }}
                                    // 默认显示全部要素
                                    defaultChecked={true}
                                />
                                {/*显示对应的要素中文名字*/}
                                <label htmlFor={mapFeature}>{mapFeaturesName[index]}</label>
                            </div>
                        )
                    }
                </div>
                {/*地图样式设置面板*/}
                <div className="map-styles-panel">
                    <h3>Set Map-Style</h3>
                    {
                        // 一个div包裹一个单选框和对应的label组成一个样式选择器
                        mapStyles.map((mapStyle) =>
                            // 用英文名字作为key
                            <div key={mapStyle.style}>
                                <input
                                    type="radio"
                                    name="mapStyle"
                                    id={mapStyle.style}
                                    value={mapStyle.style}
                                    onClick={function setMapStyle() {
                                        // 往map实例上添加样式
                                        map.setMapStyle("amap://styles/" + mapStyle.style);
                                        // setControl("HawkEye", {mapStyle: "amap://styles/" + mapStyle.style});
                                        setHawkEye(map, {mapStyle: "amap://styles/" + mapStyle.style});
                                    }}
                                    defaultChecked={mapStyle.style === "normal"}
                                />
                                {/*label显示对应中文名字*/}
                                <label htmlFor={mapStyle.style}>{mapStyle.name}</label>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export {MapContainer, AMap, map, panel};
