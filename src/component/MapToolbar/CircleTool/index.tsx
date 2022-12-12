import {ControlButton} from "../index";
import {CircleEditorIcon, CircleEditToolIcon} from "../../../assets/Icon";
import {useStore} from "../../../store";
import {observer} from "mobx-react-lite";

export const CircleTool = observer(() => {

    const {circleLayer} = useStore();

    function editToolSwitch() {
        !circleLayer.isEditingMode ? circleLayer.startEditing() : circleLayer.stopEditing();
    }

    function editorSwitch() {
        !circleLayer.isEditorMode ? circleLayer.openEditors() : circleLayer.closeEditors();
    }

    return (
        <>
            <ControlButton onClick={editToolSwitch}>
                <CircleEditToolIcon size="24" isSelected={circleLayer.isEditingMode} />
            </ControlButton>
            <ControlButton onClick={editorSwitch}>
                <CircleEditorIcon size="24" isSelected={circleLayer.isEditorMode} />
            </ControlButton>
        </>

    );
});