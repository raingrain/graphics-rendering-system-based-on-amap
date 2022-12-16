import {NavBar} from "../component/NavBar";
import {MapScreen} from "../component/MapScreen";
import {observer} from "mobx-react-lite";

export const Map = observer(() => {
    return (
        <>
            <NavBar />
            <MapScreen />
        </>
    );
});