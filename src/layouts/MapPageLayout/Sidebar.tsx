import styled from "styled-components";

import {GaoDeFeaturesTool} from "../../components/ToolSet/GaoDeFeaturesTool";
import {GaoDeLayerTool} from "../../components/ToolSet/GaoDeLayerTool";
import {MapStyleTool} from "../../components/ToolSet/MapStyleTool";
import {
    CircleTool,
    ClearTool,
    EllipseTool,
    PointTool,
    PolygonTool,
    PolylineTool,
    RectTool
} from "../../components/ToolSet/OverlayTool";

export const iconSize = "16";

export const Sidebar = () => {
    return (
        <SidebarDiv>
            <p>Tool</p>
            <span>点</span>
            <PointTool />
            <span>-----</span>
            <span>线</span>
            <PolylineTool />
            <span>-----</span>
            <span>多边形</span>
            <PolygonTool />
            <span>-----</span>
            <span>矩形</span>
            <RectTool />
            <span>-----</span>
            <span>圆形</span>
            <CircleTool />
            <span>-----</span>
            <span>椭圆</span>
            <EllipseTool />
            <span>-----</span>
            <span>清除</span>
            <ClearTool />
            <span>-----</span>
            <span>图层</span>
            <GaoDeLayerTool />
            <span>-----</span>
            <span>要素</span>
            <GaoDeFeaturesTool />
            <span>-----</span>
            <span>样式</span>
            <MapStyleTool />
        </SidebarDiv>
    );
};

const SidebarDiv = styled.div`
    position: absolute;
    left: 0;
    top: 3rem;
    bottom: 1.5rem;
    width: 3rem;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    overflow-y: scroll;
    background: #f0f0f0;
    
    &::-webkit-scrollbar {
        display: none;
    }
    
    span, p {
        margin: 1px auto;
        font-size: .5rem;
    }
    
    p {
        font-weight: bold;
    }
`;

// 操作按钮样式
export const ToolButton = styled.div`
    height: 1.5rem;
    width: 1.5rem;
    margin: 1px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    cursor: pointer;
    border-radius: 25%;
    
    &:hover {
        transition-duration: 1s;
        background-color: #bfbfbf;
    }
`;