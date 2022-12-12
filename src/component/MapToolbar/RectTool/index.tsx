import {ControlButton} from "../index";
import {RectEditorIcon, RectEditToolIcon} from "../../../assets/Icon";
import {useStore} from "../../../store";
import {observer} from "mobx-react-lite";

export const RectTool = observer(() => {

    const {rectLayer} = useStore();

    function editToolSwitch() {
        !rectLayer.isEditingMode ? rectLayer.startEditing() : rectLayer.stopEditing();
    }

    function editorSwitch() {
        !rectLayer.isEditorMode ? rectLayer.openEditors() : rectLayer.closeEditors();
    }

    return (
        <>
            <ControlButton onClick={editToolSwitch}>
                <RectEditToolIcon size="24" isSelected={rectLayer.isEditingMode} />
            </ControlButton>
            <ControlButton onClick={editorSwitch}>
                <RectEditorIcon size="24" isSelected={rectLayer.isEditorMode} />
            </ControlButton>
        </>

    );
});