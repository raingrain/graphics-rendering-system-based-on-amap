import {PointEditToolIcon} from "../../../assets/Icon";
import {useState} from "react";
import {useStore} from "../../../store";
import {ControlButton} from "../index";
import {observer} from "mobx-react-lite";
import {mapInfos} from "../../../store/MapInfos";


export const PointTool = observer(() => {

    const {pointLayer} = useStore();

    function editToolSwitch() {
        !pointLayer.isEditingMode && mapInfos.closeAllLayers();
        !pointLayer.isEditingMode ? pointLayer.startEditing() : pointLayer.stopEditing();
    }

    return (
        <ControlButton onClick={editToolSwitch}>
            <PointEditToolIcon size="24" isSelected={pointLayer.isEditingMode} />
        </ControlButton>
    );
});



