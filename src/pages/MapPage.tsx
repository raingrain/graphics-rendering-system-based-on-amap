import {Navbar} from "../layout/MapPageLayout/Navbar";
import {MapContainer} from "../layout/MapPageLayout/MapContainer";
import {observer} from "mobx-react-lite";
import {Sidebar} from "../layout/MapPageLayout/Sidebar";
import {BottomInfoPanel} from "../layout/MapPageLayout/BottomInfoPanel";

export const MapPage = observer(() => {
    return (
            <div style={{
                position: "relative",
                width: "100vw",
                height: "100vh"
            }}>
                <Navbar />
                <Sidebar/>
                <MapContainer />
                <BottomInfoPanel />
            </div>
    );
});