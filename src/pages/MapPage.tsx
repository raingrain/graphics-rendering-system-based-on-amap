import {Navbar} from "../layouts/MapPageLayout/Navbar";
import {MapContainer} from "../layouts/MapPageLayout/MapContainer";
import {observer} from "mobx-react-lite";
import {Sidebar} from "../layouts/MapPageLayout/Sidebar";
import {BottomInfoPanel} from "../layouts/MapPageLayout/BottomInfoPanel";

export const MapPage = observer(() => {
    return (
        <div style={{
            position: "relative",
            width: "100vw",
            height: "100vh"
        }}>
            <Navbar />
            <Sidebar />
            <MapContainer />
            <BottomInfoPanel />
        </div>
    );
});