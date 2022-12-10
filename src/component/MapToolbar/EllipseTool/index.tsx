import {ControlButton} from "../index";
import {EllipseEditToolIcon, EllipseEditorIcon, CircleEditToolIcon, CircleEditorIcon} from "../../../assets/Icon";
import {useState} from "react";
import {useStore} from "../../../store";

export const EllipseTool = () => {
    const [isEditToolOpen, setIsEditToolOpen] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const {ellipseLayer} = useStore();

    function editToolSwitch() {
        !isEditToolOpen ? ellipseLayer.startEditing() : ellipseLayer.stopEditing();
        setIsEditToolOpen(prevState => !prevState);
    }

    function editorSwitch() {
        !isEditorOpen ? ellipseLayer.openEditor() : ellipseLayer.closeEditor();
        setIsEditorOpen(prevState => !prevState);
    }

    return (
        <>
            <ControlButton onClick={editToolSwitch}>
                <EllipseEditToolIcon size="24" isSelected={isEditToolOpen} />
            </ControlButton>
            <ControlButton onClick={editorSwitch}>
                <EllipseEditorIcon size="24" isSelected={isEditorOpen} />
            </ControlButton>
        </>

    );
}