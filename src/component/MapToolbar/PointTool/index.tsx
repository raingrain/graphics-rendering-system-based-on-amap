import {PointEditToolIcon} from "../../../assets/Icon";
import {useState} from "react";
import {useStore} from "../../../store";
import {ControlButton} from "../index";


export const PointTool = () => {

    const [isEditToolOpen, setIsEditToolOpen] = useState(false);

    const {pointLayer} = useStore();

    function editToolSwitch() {
        !isEditToolOpen ? pointLayer.startEditing() : pointLayer.stopEditing();
        setIsEditToolOpen(prevState => !prevState);
    }

    return (
        <ControlButton onClick={editToolSwitch}>
            <PointEditToolIcon size="24" isSelected={isEditToolOpen} />
        </ControlButton>
    );
};



