import {useStore} from "../../../store";
import {ControlButton} from "../index";
import {PolygonEditToolIcon, PolygonEditorIcon} from "../../../assets/Icon";
import {observer} from "mobx-react-lite";
import {mapInfos} from "../../../store/MapInfos";

export const PolygonTool = observer(() => {

    const {polygonLayer} = useStore();

    function editToolSwitch() {
        !polygonLayer.isEditingMode && mapInfos.closeAllLayers();
        !polygonLayer.isEditingMode ? polygonLayer.startEditing() : polygonLayer.stopEditing();
    }

    function editorSwitch() {
        !polygonLayer.isEditorMode && mapInfos.closeAllLayers();
        !polygonLayer.isEditorMode ? polygonLayer.openEditors() : polygonLayer.closeEditors();
    }

    return (
        <>
            <ControlButton onClick={editToolSwitch}>
                <PolygonEditToolIcon size="24" isSelected={polygonLayer.isEditingMode} />
            </ControlButton>
            <ControlButton onClick={editorSwitch}>
                <PolygonEditorIcon size="24" isSelected={polygonLayer.isEditorMode} />
            </ControlButton>
        </>

    );
});