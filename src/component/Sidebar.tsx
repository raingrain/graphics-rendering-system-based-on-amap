import styled from "styled-components";

import {GaoDeFeaturesTool} from "./ToolSet/GaoDeFeaturesTool";
import {GaoDeLayerTool} from "./ToolSet/GaoDeLayerTool";
import {MapStyleTool} from "./ToolSet/MapStyleTool";
import {PointTool, PolylineTool, PolygonTool, RectTool, CircleTool, EllipseTool, ClearTool} from "./ToolSet/OverlayTool";

export const Sidebar = () => {
    return (
        <SidebarDiv>
            <OverlayToolbarDiv>
                <PointTool />
                <PolylineTool/>
                <PolygonTool/>
                <RectTool/>
                <CircleTool/>
                <EllipseTool/>
                <ClearTool/>
            </OverlayToolbarDiv>
            <MapPropertiesToolbarDiv>
                <GaoDeFeaturesTool/>
                <GaoDeLayerTool/>
                <MapStyleTool/>
            </MapPropertiesToolbarDiv>
        </SidebarDiv>
    );
}

const SidebarDiv = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    bottom: 1.5rem;
    width: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
`;

const OverlayToolbarDiv = styled.div`
    margin-bottom: auto;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
`

const MapPropertiesToolbarDiv = styled.div`
    margin-top: auto;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
`