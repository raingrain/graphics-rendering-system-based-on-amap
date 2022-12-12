import {ControlButton} from "../index";
import {EllipseEditorIcon, EllipseEditToolIcon} from "../../../assets/Icon";
import {useStore} from "../../../store";
import {observer} from "mobx-react-lite";

export const EllipseTool = observer(() => {

    const {ellipseLayer} = useStore();

    function editToolSwitch() {
        !ellipseLayer.isEditingMode ? ellipseLayer.startEditing() : ellipseLayer.stopEditing();
    }

    function editorSwitch() {
        !ellipseLayer.isEditorMode ? ellipseLayer.openEditors() : ellipseLayer.closeEditors();
    }

    return (
        <>
            <ControlButton onClick={editToolSwitch}>
                <EllipseEditToolIcon size="24" isSelected={ellipseLayer.isEditingMode} />
            </ControlButton>
            <ControlButton onClick={editorSwitch}>
                <EllipseEditorIcon size="24" isSelected={ellipseLayer.isEditorMode} />
            </ControlButton>
        </>

    );
});