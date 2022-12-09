import {ControlButton} from "../index";
import {ClearToolIcon} from "../../../assets/Icon";
import {useStore} from "../../../store";
import {message} from "antd";

export const ClearTool = () => {

    const {pointLayer, polylineLayer, polygonLayer} = useStore();

    const [messageApi, contextHolder] = message.useMessage();

    function handleClick() {
        pointLayer.removeAllPoints() || polylineLayer.removeAllPolylines() || polygonLayer.removeAllPolygons() ? messageApi.success({
            content: "全部清除成功",
            duration: 2
        }) : messageApi.error({
            content: "地图上不存在矢量图形",
            duration: 2
        });
    }

    return (
        <ControlButton onClick={handleClick}>
            {contextHolder}
            <ClearToolIcon size="24" />
        </ControlButton>
    );
}