import {Navbar} from "../layout/MapLayout/Navbar";
import {MapContainer} from "../layout/MapLayout/MapContainer";
import {observer} from "mobx-react-lite";
import {Sidebar} from "../layout/MapLayout/Sidebar";
import {BottomInfoPanel} from "../layout/MapLayout/BottomInfoPanel";

export const Map = observer(() => {
    return (
        <>
            <Navbar />
            <div style={{position: "absolute", "inset": "50px 0 0"}}>
                <Sidebar/>
                <MapContainer />
                <BottomInfoPanel />
            </div>
        </>
    );
});