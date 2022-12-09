// 事件类型
import {ChangeEvent} from "react";

// 样式按钮图标
import {MapLayerToolIcon} from "../../../assets/Icon";
// 导入气泡卡片控件
import {Popover} from "antd";
import styled from "styled-components";

// 图层相关属性和方法
import {useStore} from "../../../store";
import {map} from "../../MapScreen";
import {ControlButton} from "../index";


export const MapLayerTool = () => {
    return (
        <div>
            <Popover
                placement="bottom"
                content={<PopoverContent />}
                title={<PopoverTitle />}
                trigger="click"
            >
                <ControlButton><MapLayerToolIcon size="24" /></ControlButton>
            </Popover>
        </div>
    );
};


// 气泡卡片标题
const PopoverTitle = () => {
    return <h1 className="text-center">地图图层选择器</h1>;
};

// 气泡卡片内容
const PopoverContent = () => {

    const {mapLayers} = useStore();

    function handleChange(e: ChangeEvent<HTMLInputElement>, layerZhName: string) {
        switch (layerZhName) {
            case "卫星图层":
                e.target.checked ? map.addLayer(mapLayers.satellite!) : map.removeLayer(mapLayers.satellite!);
                break;
            case "路网图层":
                e.target.checked ? map.addLayer(mapLayers.roadNet!) : map.removeLayer(mapLayers.roadNet!);
                // setRoadNetLayer(e.target.checked);
                break;
            case "路况图层":
                e.target.checked ? map.addLayer(mapLayers.traffic!) : map.removeLayer(mapLayers.traffic!);
                // setTrafficLayer(e.target.checked);
                break;
            case "楼块图层":
                e.target.checked ? map.addLayer(mapLayers.buildings!) : map.removeLayer(mapLayers.buildings!);
                // setBuildingsLayer(e.target.checked);
                break;
        }
        // 可以通过console.log(map.getLayers())来获取当前图层信息，或使用map.setLayers()来一次性替换图层
    }

    return (
        <Content>
            {
                mapLayers.layersData.map((layer) => {
                    return (
                        <label key={layer.zhName}>
                            <input
                                type="checkbox"
                                name="layer"
                                defaultChecked={false}
                                onChange={(e) => handleChange(e, layer.zhName)}
                            />
                            {layer.zhName}
                        </label>
                    );
                })
            }
        </Content>
    );
};

const Content = styled.div`
    display: flex;
    flex-direction: column;
    
    label {
        width: 100%;
        padding: 0 20%;
        display: flex;
        justify-content: space-between;
    }
`;