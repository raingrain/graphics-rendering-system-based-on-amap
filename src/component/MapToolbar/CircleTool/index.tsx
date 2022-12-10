import {ControlButton} from "../index";
import {CircleEditorIcon, CircleEditToolIcon} from "../../../assets/Icon";
import {useState} from "react";
import {useStore} from "../../../store";

export const CircleTool = () => {

    const [isEditToolOpen, setIsEditToolOpen] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const {circleLayer} = useStore();

    function editToolSwitch() {
        !isEditToolOpen ? circleLayer.startEditing() : circleLayer.stopEditing();
        setIsEditToolOpen(prevState => !prevState);
    }

    function editorSwitch() {
        !isEditorOpen ? circleLayer.openEditor() : circleLayer.closeEditor();
        setIsEditorOpen(prevState => !prevState);
    }

    return (
        <>
            <ControlButton onClick={editToolSwitch}>
                <CircleEditToolIcon size="24" isSelected={isEditToolOpen} />
            </ControlButton>
            <ControlButton onClick={editorSwitch}>
                <CircleEditorIcon size="24" isSelected={isEditorOpen} />
            </ControlButton>
        </>

    );
};