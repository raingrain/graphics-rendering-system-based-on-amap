import styled from "styled-components";
import {GaoDeFeaturesTool} from "./GaoDeFeaturesTool";
import {GaoDeLayerTool} from "./GaoDeLayerTool";
import {MapStyleTool} from "./MapStyleTool";
import {PointTool} from "./PointTool";
import {ClearTool} from "./ClearTool";
import {PolylineTool} from "./PolylineTool";
import {PolygonTool} from "./PolygonTool";

export const MapToolbar = () => {
    return (
        <div style={{
            display: "flex",
            position: "absolute",
            top: "1rem",
            left: "600px"
        }}>
            <ClearTool/>
            <PolygonTool/>
            <PolylineTool/>
            <PointTool />
            <GaoDeFeaturesTool />
            <GaoDeLayerTool />
            <MapStyleTool />
        </div>
    );
};

export const ControlButton = styled.div`
    height: 2rem;
    width: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: 1px solid #e0e0e0;
    background: #fff;
    cursor: pointer;
    
    &:hover{
        background-color: #d9d9d9;
    }
`;