import React, {useEffect, useRef} from "react";

import AMapLoader from "@amap/amap-jsapi-loader";
import "@amap/amap-jsapi-types";
import {mapFeatures} from "../../data/mapFeatures.js";

import {initialControls} from "../../utils/setControls";
import {initialLayers} from "../../utils/setLayers";

import "./MapContainer.scss";
import {OperationPanel} from "../ControlPanels/OperationPanel";
import {setRandomZoom} from "../../utils/setMapProperties/setRandomZoom";
import {setRandomCenter} from "../../utils/setMapProperties/setRandomCenter";
import {EditMarKer} from "../EditMarker/EditMarKer";
import {EditText} from "../EditText/EditText";


let panel: React.RefObject<HTMLDivElement>;
// declare
let AMap: any;
let map: AMap.Map;

function MapContainer() {

    // 地图实例

    // AMap = {};

    // 控制面板标签
    panel = useRef<HTMLDivElement>(null);



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
                center: [121.451101, 31.03606],
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

            // 地图中心点centerMark标记
            map.add(new AMap.Marker({
                position: map.getCenter()
                // position: [121.443333, 31.037778]
            }));
        }).catch(error => {
            console.log(error);
        });
    }

    // 鼠标经纬度标签
    let mouseLngLat = useRef<HTMLSpanElement>(null);

    // 地图层级标签
    let zoom = useRef<HTMLSpanElement>(null);

    // 地图中心标签
    let center = useRef<HTMLSpanElement>(null);

    let mapZoomState = useRef<HTMLSpanElement>(null);
    let mapDragState = useRef<HTMLSpanElement>(null);
    let mapMoveState = useRef<HTMLSpanElement>(null);
    let mouseState = useRef<HTMLSpanElement>(null);


    // 给地图绑定事件
    function addEventListeners() {
        map.on("complete", function logMap() {
            console.log("地图已加载");
        });

        map.on('movestart', function  mapMovestart() {
            mapMoveState.current!.innerText = "地图移动开始"
            console.log('地图移动开始');
        });
        map.on('mapmove', function  mapMove() {
            mapMoveState.current!.innerText = "地图正在移动"
            console.log('地图正在移动');
        });

        map.on("moveend", function logCenter() {
            mapMoveState.current!.innerText = "地图移动结束"
            center.current!.innerText = `(${map.getCenter().lng.toFixed(6)}, ${map.getCenter().lat.toFixed(6)})`;
            console.log("地图移动结束");
        });

        map.on('zoomstart', function mapZoomStart() {
            mapZoomState.current!.innerText = "地图缩放开始"
            console.log('缩放开始');
        });
        map.on('zoomchange',function  mapZoom() {
            mapZoomState.current!.innerText = "地图正在缩放"
            console.log('正在缩放');
        });

        map.on("zoomend", function logZoom() {
            mapZoomState.current!.innerText = "地图缩放结束"
            zoom.current!.innerText = `${map.getZoom()}`;
            console.log('缩放结束');
        });

        map.on("click", function logLongitudeAndLatitudeOfMouse(e) {
            mouseState.current!.innerText = "您单击了地图";
            mouseLngLat.current!.innerText = `(${e.lnglat.getLng()}, ${e.lnglat.getLat()})`;
        });
        map.on("dbclick", function logLongitudeAndLatitudeOfMouse(e) {
            mouseState.current!.innerText = "您双击了地图";
            mouseLngLat.current!.innerText = `(${e.lnglat.getLng()}, ${e.lnglat.getLat()})`;
        })

        map.on('mousemove', function showInfoMove() {
            mouseState.current!.innerText = "您移动了鼠标";
            console.log("您移动了您的鼠标！");
        });

        map.on('rightclick', function showInfoMove() {
            mouseState.current!.innerText = "您右键单击了地图";
            console.log("您移动了您的鼠标！");
        });
        map.on('dragstart', function showInfoDragstart() {
            mapDragState.current!.innerText = "开始拖拽地图";
            console.log("开始拖拽地图");
        });
        map.on('dragging', function showInfoDragging() {
            mapDragState.current!.innerText = "正在拖拽地图";
            console.log("正在拖拽地图");
        });
        map.on('dragend', function showInfoDragend() {
            mapDragState.current!.innerText = "停止拖拽地图";
            console.log("停止拖拽地图");
        });
    }


    return (
        <div className="map-screen">
            {/*地图容器，需要一个ID*/}
            <div id="container" className="map"></div>
            {/*控制面板*/}
            <div className="panel flex flex-col" ref={panel}>
                <h1 className="text-center">Control Panel</h1>
                {/*地图信息面板*/}
                <div className="map-info-panel flex flex-col justify-start items-start">
                    <div>地图层级: <span ref={zoom}>13</span></div>
                    <div>鼠标经纬度: <span ref={mouseLngLat}>(121.443333, 31.037778)</span></div>
                    <div>地图中心点: <span ref={center}>(121.443333, 31.037778)</span></div>
                    <div>地图移动状态：<span ref={mapMoveState}></span></div>
                    <div>地图拖拽状态：<span ref={mapDragState}></span></div>
                    <div>地图缩放状态：<span ref={mapZoomState}></span></div>
                    <div>鼠标操作状态：<span ref={mouseState}></span></div>

                </div>
                {/*地图层级设置按钮*/}
                <button className="mapPanel-labelAndButton rounded-2xl m-2" onClick={setRandomZoom}>随机设置地图层级</button>
                {/*地图中心设置按钮*/}
                <button className="mapPanel-labelAndButton rounded-2xl m-2" onClick={setRandomCenter}>随机设置地图中心点</button>
                <EditText/>
                <EditMarKer/>
                <OperationPanel />
            </div>
        </div>
    );
}

export {MapContainer, AMap, map, panel};
