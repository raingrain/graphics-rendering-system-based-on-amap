import {mapInfos} from "../../store/MapInfos";
import {observer} from "mobx-react-lite";
import {
    CircleEditorIcon,
    CircleEditToolIcon,
    ClearToolIcon,
    EllipseEditorIcon,
    EllipseEditToolIcon,
    PointEditToolIcon,
    PolygonEditorIcon,
    PolygonEditToolIcon,
    PolylineEditorIcon,
    PolylineEditToolIcon,
    RectEditorIcon,
    RectEditToolIcon
} from "../../assets/Icon";
import {pointLayer} from "../../store/Layer/PointLayer";
import {polylineLayer} from "../../store/Layer/PolylineLayer";
import {polygonLayer} from "../../store/Layer/PolygonLayer";
import {rectLayer} from "../../store/Layer/RectLayer";
import {circleLayer} from "../../store/Layer/CircleLayer";
import {ellipseLayer} from "../../store/Layer/EllipseLayer";
import {message} from "antd";
import styled from "styled-components";

function editToolSwitch(layer: any) {
    !layer.isEditingMode && mapInfos.closeAllLayers();
    !layer.isEditingMode ? layer.startEditing() : layer.stopEditing();
}

function editorSwitch(layer: any) {
    !layer.isEditorMode && mapInfos.closeAllLayers();
    !layer.isEditorMode ? layer.openEditors() : layer.closeEditors();
}

export const PointTool = observer(() => {
    return (
        <ControlButton onClick={() => editToolSwitch(pointLayer)}>
            <PointEditToolIcon size="24" isSelected={pointLayer.isEditingMode} />
        </ControlButton>
    );
});

export const PolylineTool = observer(() => {
    return (
        <>
            <ControlButton onClick={() => editToolSwitch(polylineLayer)}>
                <PolylineEditToolIcon size="24" isSelected={polylineLayer.isEditingMode} />
            </ControlButton>
            <ControlButton onClick={() => editorSwitch(polylineLayer)}>
                <PolylineEditorIcon size="24" isSelected={polylineLayer.isEditorMode} />
            </ControlButton>
        </>
    );
});

export const PolygonTool = observer(() => {
    return (
        <>
            <ControlButton onClick={() => editToolSwitch(polygonLayer)}>
                <PolygonEditToolIcon size="24" isSelected={polygonLayer.isEditingMode} />
            </ControlButton>
            <ControlButton onClick={() => editorSwitch(polygonLayer)}>
                <PolygonEditorIcon size="24" isSelected={polygonLayer.isEditorMode} />
            </ControlButton>
        </>
    );
});

export const RectTool = observer(() => {
    return (
        <>
            <ControlButton onClick={() => editToolSwitch(rectLayer)}>
                <RectEditToolIcon size="24" isSelected={rectLayer.isEditingMode} />
            </ControlButton>
            <ControlButton onClick={() => editorSwitch(rectLayer)}>
                <RectEditorIcon size="24" isSelected={rectLayer.isEditorMode} />
            </ControlButton>
        </>
    );
});

export const CircleTool = observer(() => {
    return (
        <>
            <ControlButton onClick={() => editToolSwitch(circleLayer)}>
                <CircleEditToolIcon size="24" isSelected={circleLayer.isEditingMode} />
            </ControlButton>
            <ControlButton onClick={() => editorSwitch(circleLayer)}>
                <CircleEditorIcon size="24" isSelected={circleLayer.isEditorMode} />
            </ControlButton>
        </>
    );
});

export const EllipseTool = observer(() => {
    return (
        <>
            <ControlButton onClick={() => editToolSwitch(ellipseLayer)}>
                <EllipseEditToolIcon size="24" isSelected={ellipseLayer.isEditingMode} />
            </ControlButton>
            <ControlButton onClick={() => editorSwitch(ellipseLayer)}>
                <EllipseEditorIcon size="24" isSelected={ellipseLayer.isEditorMode} />
            </ControlButton>
        </>
    );
});

export const ClearTool = () => {

    const [messageApi, contextHolder] = message.useMessage();

    function handleClick() {
        mapInfos.removeAll() ? messageApi.success({
            content: "全部清除成功",
            duration: 2
        }) : messageApi.error({
            content: "地图上不存在矢量图形",
            duration: 2
        });
    }

    return (
        <ControlButton onClick={handleClick}>
            {contextHolder}
            <ClearToolIcon size="24" />
        </ControlButton>
    );
};

export const ControlButton = styled.div`
    height: 2rem;
    width: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    cursor: pointer;
    
    &:hover {
        background-color: #d9d9d9;
    }
`;