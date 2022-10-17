import {ControlPanel, Info} from "../ControlPanel/ControlPanel";
import {layers, setBuildingsLayer, setRoadNetLayer, setSatelliteLayer, setTrafficLayer} from "../../utils/setLayers";
import {mapFeaturesInfos} from "../../data/mapFeatures";
import React, {ChangeEvent} from "react";
import {mapStyles} from "../../data/mapStyles";
import {setHawkEye} from "../../utils/setControls";
import {map} from "../MapContainer/MapContainer";

function ControlPanels() {
    return (
        <>
            {/*地图图层设置面板*/}
            {/*设置图层，一个div包括input和label*/}
            {/*map实例的add()和remove()方法添加或删除覆盖物/图层，参数为单个覆盖物/图层或覆盖物/图层的数组且范围更广*/}
            {/*可以通过console.log(map.getLayers())来获取当前图层信息，或使用map.setLayers()来一次性替换图层*/}
            <ControlPanel
                title="Set Map-Layers"
                infos={layers}
                inputType="checkbox"
                defaultChecked={false}
                handleChange={(e, info) => {
                    switch (info.name) {
                        case "卫星图层":
                            setSatelliteLayer(e.target.checked);
                            break;
                        case "路网图层":
                            setRoadNetLayer(e.target.checked);
                            break;
                        case "路况图层":
                            setTrafficLayer(e.target.checked);
                            break;
                        case "楼块图层":
                            setBuildingsLayer(e.target.checked);
                            break;

                    }
                }}
            />
            {/*地图显示要素设置面板*/}
            <ControlPanel
                title="Set Map-Features"
                infos={mapFeaturesInfos}
                inputType="checkbox"
                handleChange={function (e: ChangeEvent<HTMLInputElement>, info: Info, infos: Info[]) {
                    if (e.target.checked && !info.isLoad) {
                        // 如果该复选框是被选中的，且mapFeatures中没有这个要素，就往mapFeatures中加这个数据
                        info.isLoad = true;
                    } else if (!e.target.checked && info.isLoad) {
                        // 如果该复选框是取消选中的，且mapFeatures中有这个要素，就往mapFeatures中移除这个数据
                        info.isLoad = false
                    }
                    // 往map实例中添加要显示的要素
                    const features: string[] = [];
                    infos.map((info) => {
                        if (info.isLoad) {
                            features.push(info.type as string);
                        }
                    })
                    map.setFeatures(features);
                    console.log("mapFeatures: ", map.getFeatures());
                }}
                defaultChecked={true}
            />
            {/*地图样式设置面板*/}
            <ControlPanel
                title="Set Map-Style"
                infos={mapStyles}
                inputType="radio"
                inputName="mapStyles"
                defaultChecked={(info) => info.type === "normal"}
                handleChange={function setMapStyle(e, info, infos) {
                    // 往map实例上添加样式
                    map.setMapStyle("amap://styles/" + info.type);
                    // setControl("HawkEye", {mapStyle: "amap://styles/" + mapStyle.style});
                    setHawkEye(map, {mapStyle: "amap://styles/" + info.type});
                }}
            />
        </>
    );
}

export default ControlPanels;