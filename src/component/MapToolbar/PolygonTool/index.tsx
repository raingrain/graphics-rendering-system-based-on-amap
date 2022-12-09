import {useState} from "react";
import {useStore} from "../../../store";
import {ControlButton} from "../index";
import {PolygonEditToolIcon, PolygonEditorIcon} from "../../../assets/Icon";

export const PolygonTool = () => {
    const [isEditToolOpen, setIsEditToolOpen] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const {polygonLayer} = useStore();

    function editToolSwitch() {
        !isEditToolOpen ? polygonLayer.startEditing() : polygonLayer.stopEditing();
        setIsEditToolOpen(prevState => !prevState);
    }

    function editorSwitch() {
        !isEditorOpen ? polygonLayer.openPolygonEditor() : polygonLayer.closePolygonEditor();
        setIsEditorOpen(prevState => !prevState);
    }

    return (
        <>
            <ControlButton onClick={editToolSwitch}>
                <PolygonEditToolIcon size="24" isSelected={isEditToolOpen} />
            </ControlButton>
            <ControlButton onClick={editorSwitch}>
                <PolygonEditorIcon size="24" isSelected={isEditorOpen} />
            </ControlButton>
        </>

    );
};