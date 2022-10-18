import {AMap, map} from "../MapContainer/MapContainer";
import {Collapse} from "antd";

const { Panel } = Collapse;


function EditMarKer() {

    let markers: AMap.Marker[] = [];

    function newMarker(e: any) {
        const marker = new AMap.Marker({
            map: map,
            position: e.lnglat,
            draggable: true,
            label: {
                content: `${markers.length + 1}`
            },
            extData: {
                id: markers.length + 1
            }
        } as AMap.MarkerOptions);
        marker.on("rightclick", removeAMarker);
        markers.push(marker);
    }

    function removeAMarker(e: any) {
        e.target.setMap(null);
    }

    function allowRemoveMarker() {
        markers.forEach((marker) => marker.on("rightclick", removeAMarker));
    }

    function forbidRemoveMarker() {
        markers.forEach((marker) => marker.off("rightclick", removeAMarker));
    }

    function startEditingMarker() {
        markers.forEach((marker) => marker.setDraggable(true));
        allowRemoveMarker();
        map.on("click", newMarker);
    }

    function stopEditingMarker() {
        markers.forEach((marker) => marker.setDraggable(false));
        forbidRemoveMarker();
        map.off("click", newMarker);
    }

    function removeAllMarker() {
        if (markers.length === 0) {
            alert("没有点标注");
        } else {
            map.remove(markers);
            markers = [];
            alert("已经全部清除");
        }
    }

    return (
        <Collapse>
            <Panel header="设置点标注" key="1">
                <div className="grid grid-cols-2 gap-0.5 my-4">
                    <h3 className="col-start-1 col-end-3 text-center">设置点标记</h3>
                    <label className="mapPanel-labelAndButton flex flex-row items-center justify-around rounded-2xl m-2 cursor-pointer">
                        <input
                            type="radio"
                            name="editMarker"
                            defaultChecked={false}
                            onChange={startEditingMarker}
                        />
                        开始编辑
                    </label>
                    <label className="mapPanel-labelAndButton flex flex-row items-center justify-around rounded-2xl m-2 cursor-pointer">
                        <input
                            type="radio"
                            name="editMarker"
                            defaultChecked={true}
                            onChange={stopEditingMarker}
                        />
                        停止编辑
                    </label>
                    <button onClick={removeAllMarker} className="mapPanel-labelAndButton col-start-1 col-end-3 rounded-2xl m-2 text-center">清除所有点标注
                    </button>
                </div>
            </Panel>
        </Collapse>

    );
}

export {EditMarKer};