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
import {iconSize, ToolButton} from "../../layouts/MapPageLayout/Sidebar";

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
        <ToolButton onClick={() => editToolSwitch(pointLayer)}>
            <PointEditToolIcon size={iconSize} isSelected={pointLayer.isEditingMode} />
        </ToolButton>
    );
});

export const PolylineTool = observer(() => {
    return (
        <>
            <ToolButton onClick={() => editToolSwitch(polylineLayer)}>
                <PolylineEditToolIcon size={iconSize} isSelected={polylineLayer.isEditingMode} />
            </ToolButton>
            <ToolButton onClick={() => editorSwitch(polylineLayer)}>
                <PolylineEditorIcon size={iconSize} isSelected={polylineLayer.isEditorMode} />
            </ToolButton>
        </>
    );
});

export const PolygonTool = observer(() => {
    return (
        <>
            <ToolButton onClick={() => editToolSwitch(polygonLayer)}>
                <PolygonEditToolIcon size={iconSize} isSelected={polygonLayer.isEditingMode} />
            </ToolButton>
            <ToolButton onClick={() => editorSwitch(polygonLayer)}>
                <PolygonEditorIcon size={iconSize} isSelected={polygonLayer.isEditorMode} />
            </ToolButton>
        </>
    );
});

export const RectTool = observer(() => {
    return (
        <>
            <ToolButton onClick={() => editToolSwitch(rectLayer)}>
                <RectEditToolIcon size={iconSize} isSelected={rectLayer.isEditingMode} />
            </ToolButton>
            <ToolButton onClick={() => editorSwitch(rectLayer)}>
                <RectEditorIcon size={iconSize} isSelected={rectLayer.isEditorMode} />
            </ToolButton>
        </>
    );
});

export const CircleTool = observer(() => {
    return (
        <>
            <ToolButton onClick={() => editToolSwitch(circleLayer)}>
                <CircleEditToolIcon size={iconSize} isSelected={circleLayer.isEditingMode} />
            </ToolButton>
            <ToolButton onClick={() => editorSwitch(circleLayer)}>
                <CircleEditorIcon size={iconSize} isSelected={circleLayer.isEditorMode} />
            </ToolButton>
        </>
    );
});

export const EllipseTool = observer(() => {
    return (
        <>
            <ToolButton onClick={() => editToolSwitch(ellipseLayer)}>
                <EllipseEditToolIcon size={iconSize} isSelected={ellipseLayer.isEditingMode} />
            </ToolButton>
            <ToolButton onClick={() => editorSwitch(ellipseLayer)}>
                <EllipseEditorIcon size={iconSize} isSelected={ellipseLayer.isEditorMode} />
            </ToolButton>
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
        <ToolButton onClick={handleClick}>
            {contextHolder}
            <ClearToolIcon size={iconSize} />
        </ToolButton>
    );
};