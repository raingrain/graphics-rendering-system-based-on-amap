// 样式按钮图标
import {GaoDeFeaturesToolIcon} from "../../../assets/Icon";
// 导入气泡卡片控件
import {Popover} from "antd";
import styled from "styled-components";

// 事件类型
import {ChangeEvent} from "react";

// 地图实例
import {map} from "../../../layout/MapPageLayout/MapContainer";
// 要素类类型
import {Feature} from "./types";
import {ControlButton} from "../OverlayTool";

// 地图要素及其对应的中文名
export const features: Feature[] = [
    {
        zhName: "区域面",
        type: "bg",
        isLoad: true
    },
    {
        zhName: "道路",
        type: "road",
        isLoad: true
    },
    {
        zhName: "建筑物",
        type: "building",
        isLoad: true
    },
    {
        zhName: "标注",
        type: "point",
        isLoad: true
    }
];

export const GaoDeFeaturesTool = () => {
    return (
        <div style={{
            // position: "absolute",
            // right: "1rem",
            // top: "25vh"
        }}>
            <Popover
                placement="left"
                content={<PopoverContent />}
                title={<PopoverTitle />}
                trigger="click"
            >
                <ControlButton><GaoDeFeaturesToolIcon size="24" /></ControlButton>
            </Popover>
        </div>
    );
};


// 气泡卡片标题
const PopoverTitle = () => {
    return <h1 className="text-center">地图要素选择器</h1>;
};

// 气泡卡片内容
const PopoverContent = () => {

    function handleChange(e: ChangeEvent<HTMLInputElement>, feature: Feature) {
        if (e.target.checked && !feature.isLoad) {
            // 如果该复选框是被选中的，且mapFeatures中没有这个要素，就往mapFeatures中加这个数据
            feature.isLoad = true;
        } else if (!e.target.checked && feature.isLoad) {
            // 如果该复选框是取消选中的，且mapFeatures中有这个要素，就往mapFeatures中移除这个数据
            feature.isLoad = false;
        }
        // 往map实例中添加要显示的要素
        const curMapFeatures = [];
        for (const feature of features) {
            if (feature.isLoad) {
                curMapFeatures.push(feature.type);
            }
        }
        map.setFeatures(curMapFeatures);
        console.log("features: ", map.getFeatures());
    }

    return (
        <Content>
            {
                features.map((feature) => {
                    return (
                        <label key={feature.zhName}>
                            <input
                                type="checkbox"
                                name="mapFeatures"
                                defaultChecked={true}
                                onChange={(e) => handleChange(e, feature)}
                            />
                            {feature.zhName}
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