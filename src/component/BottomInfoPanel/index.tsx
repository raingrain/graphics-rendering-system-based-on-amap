import {observer} from "mobx-react-lite";
import {useStore} from "../../store";
import styled from "styled-components";

export const BottomInfoPanel = observer(() => {

    const {mapInfos} = useStore();

    return (
        <Panel>
            <div>zoom: {mapInfos.zoom}</div>
            <div>mouseLngLat: {mapInfos.mouseLngLat}</div>
            <div>mapCenter: {mapInfos.centerPoint}</div>
        </Panel>
    );
});

const Panel = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    left: 250px;
    height: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    div {
        margin-right: 2rem;
        font-size: .5rem;
    }
`

