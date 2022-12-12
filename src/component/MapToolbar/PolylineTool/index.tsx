import {ControlButton} from "../index";
import {PolylineEditToolIcon, PolylineEditorIcon} from "../../../assets/Icon";
import {useStore} from "../../../store";
import {observer} from "mobx-react-lite";
import {mapInfos} from "../../../store/MapInfos";
import {pointLayer} from "../../../store/Layer/PointLayer";

export const PolylineTool = observer(() => {

    const {polylineLayer} = useStore();

    function editToolSwitch() {
        !polylineLayer.isEditingMode && mapInfos.closeAllLayers();
        !polylineLayer.isEditingMode ? polylineLayer.startEditing() : polylineLayer.stopEditing();
    }
    function editorSwitch() {
        !polylineLayer.isEditorMode && mapInfos.closeAllLayers();
        !polylineLayer.isEditorMode ? polylineLayer.openEditors() : polylineLayer.closeEditors();
    }

    return (
        <>
            <ControlButton onClick={editToolSwitch}>
                <PolylineEditToolIcon size="24" isSelected={polylineLayer.isEditingMode} />
            </ControlButton>
            <ControlButton onClick={editorSwitch}>
                <PolylineEditorIcon size="24" isSelected={polylineLayer.isEditorMode} />
            </ControlButton>
        </>

    );
})