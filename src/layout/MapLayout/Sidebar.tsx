import styled from "styled-components";

import {GaoDeFeaturesTool} from "../../component/ToolSet/GaoDeFeaturesTool";
import {GaoDeLayerTool} from "../../component/ToolSet/GaoDeLayerTool";
import {MapStyleTool} from "../../component/ToolSet/MapStyleTool";
import {PointTool, PolylineTool, PolygonTool, RectTool, CircleTool, EllipseTool, ClearTool} from "../../component/ToolSet/OverlayTool";

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