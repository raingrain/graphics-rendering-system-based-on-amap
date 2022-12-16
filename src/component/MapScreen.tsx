import {useEffect} from "react";

import AMapLoader from "@amap/amap-jsapi-loader";
import "@amap/amap-jsapi-types";

import {features} from "./ToolSet/GaoDeFeaturesTool";


import {message} from "antd";

import {BottomInfoPanel} from "./BottomInfoPanel";
import {useStore} from "../store";

import {observer} from "mobx-react-lite";
import {Sidebar} from "./Sidebar";


let AMap: any;
let map: AMap.Map;

const MapScreen = observer(() => {

    const {mapInfos, gaoDeLayers, gaoDeControls} = useStore();

    const [messageApi, contextHolder] = message.useMessage();

    // 只在初次挂载后渲染地图
    useEffect(() => {
        // 创建地图
        // 想重新加载地图可以再次调用这个函数
        // 销毁地图使用map && map.destroy();
        // 申请好的Web端开发者Key，首次调用 load 时必填
        AMapLoader.load({
            key: "2aae3c0f124d7e3d0058ddb5183c7583",
            // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            version: "2.0",
            // 需要使用的的控件列表，如比例尺'AMap.Scale'等
            plugins: ["AMap.ControlBar", "AMap.ToolBar", "AMap.Scale", "AMap.HawkEye", "AMap.PolylineEditor", "AMap.PolygonEditor", "AMap.RectangleEditor", "AMap.CircleEditor", "AMap.EllipseEditor", "AMap.BezierCurveEditor", "AMap.MouseTool", "AMap.RangingTool", "AMap.Geolocation"]
        }).then((_AMap) => {
            AMap = _AMap;
            // 根据ID以及初始化配置对象加载地图
            map = new AMap.Map("container", {
                // 是否为3D地图模式
                // viewMode: "3D",
                viewMode: "2D",
                // 初始化地图缩放级别
                zoom: mapInfos.zoom,
                // 初始化地图中心点位置，十进制经纬度
                center: mapInfos.centerPoint,
                // 旋转角是否可以调整
                rotateEnable: true,
                // 旋转角角度
                rotation: 0,
                // 俯仰角是否可以调整
                pitchEnable: true,
                // 俯仰角角度
                pitch: 45,
                // 是否显示室内地图
                showIndoorMap: true,
                // 是否监控地图容器尺寸变化
                resizeEnable: true,
                // 地图显示要素
                features: features.map((feature) => feature.type),
                // 初始化地图样式
                mapStyle: "amap://styles/blue",
                // 是否显示文字标记
                showLabel: true
            });

            mapInfos.addMapInfosListener();

            gaoDeLayers.initialLayers();

            gaoDeControls.initialControls();

            // 地图中心点centerMark标记
            map.add(new AMap.Marker({
                position: map.getCenter()
            }));

            setTimeout(() => {
                messageApi.loading({
                    content: "地图加载中",
                    duration: 2
                });
                setTimeout(() => {
                    messageApi.destroy();
                    messageApi.success({
                        content: "地图已加载",
                        duration: 2
                    });
                }, 2000);
            }, 0);

        }).catch(error => {
            console.log(error);
        });
    }, []);

    return (
        <div style={{position: "absolute", "inset": "50px 0 0"}}>
            <Sidebar/>
            {contextHolder}
            {/*地图容器，需要一个ID*/}
            <div id="container" style={{position: "absolute", inset: "0 0 1.5rem 2rem"}}></div>
            <BottomInfoPanel />
        </div>
    );
});


export {MapScreen, AMap, map};
