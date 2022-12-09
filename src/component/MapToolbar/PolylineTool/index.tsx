import {ControlButton} from "../index";
import {PolylineEditToolIcon, PolylineEditorIcon} from "../../../assets/Icon";
import {useState} from "react";
import {useStore} from "../../../store";

export const PolylineTool = () => {

    const [isEditToolOpen, setIsEditToolOpen] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const {polylineLayer} = useStore();

    function editToolSwitch() {
        !isEditToolOpen ? polylineLayer.startEditing() : polylineLayer.stopEditing();
        setIsEditToolOpen(prevState => !prevState);
    }
    function editorSwitch() {
        !isEditorOpen? polylineLayer.openEditor() : polylineLayer.closeEditor();
        setIsEditorOpen(prevState => !prevState);
    }

    return (
        <>
            <ControlButton onClick={editToolSwitch}>
                <PolylineEditToolIcon size="24" isSelected={isEditToolOpen} />
            </ControlButton>
            <ControlButton onClick={editorSwitch}>
                <PolylineEditorIcon size="24" isSelected={isEditorOpen} />
            </ControlButton>
        </>

    );
}