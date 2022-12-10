import {ControlButton} from "../index";
import {RectEditToolIcon, RectEditorIcon} from "../../../assets/Icon";
import {useState} from "react";
import {useStore} from "../../../store";

export const RectTool = () => {

    const [isEditToolOpen, setIsEditToolOpen] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const {rectLayer} = useStore();

    function editToolSwitch() {
        !isEditToolOpen ? rectLayer.startEditing() : rectLayer.stopEditing();
        setIsEditToolOpen(prevState => !prevState);
    }
    function editorSwitch() {
        !isEditorOpen? rectLayer.openEditor() : rectLayer.closeEditor();
        setIsEditorOpen(prevState => !prevState);
    }

    return (
        <>
            <ControlButton onClick={editToolSwitch}>
                <RectEditToolIcon size="24" isSelected={isEditToolOpen} />
            </ControlButton>
            <ControlButton onClick={editorSwitch}>
                <RectEditorIcon size="24" isSelected={isEditorOpen} />
            </ControlButton>
        </>

    );
}