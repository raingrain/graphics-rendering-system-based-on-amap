import {AMap, map} from "../MapContainer/MapContainer";

let polylines: AMap.Polyline[] = [];
let polylineEditors: any[] = [];

let temporaryPolyline: AMap.Polyline | null = null;
let points: AMap.Marker[] = [];

function newPolyline() {
    const polyline = new AMap.Polyline({
        path: points.map((point) => point.getPosition()!),
        strokeColor: "blue",
        strokeWeight: 6,
        strokeOpacity: 1,
        extData: {
            id: polylines.length + 1
        }
    });
    polylines.push(polyline);
    map.add(polyline);
    temporaryPolyline !== null && map.remove(temporaryPolyline);
    map.remove(points);
    points = [];
}

function newTemporaryPolyline() {
    temporaryPolyline !== null && map.remove(temporaryPolyline);
    temporaryPolyline = new AMap.Polyline({
        path: points.map((point) => point.getPosition()!),
        strokeColor: "red",
        strokeWeight: 6
    });
    map.add(temporaryPolyline!);
}

function collectPoints(e: any) {
    const marker = new AMap.Marker({
        map: map,
        position: e.lnglat,
        draggable: true,
        label: {
            content: `${points.length + 1}`
        },
        extData: {
            id: points.length + 1
        }
    } as AMap.MarkerOptions);
    points.push(marker);
    marker.on("dragging", newTemporaryPolyline);
    newTemporaryPolyline();
}

function startDrawingPolyline() {
    map.on("click", collectPoints);
}


function stopDrawingPolyline() {
    map.off("click", collectPoints);
    newPolyline();
}

function startEditingPolyline() {
    polylines.forEach((polyline) => {
        const polylineEditor = new AMap.PolylineEditor(map, polyline);
        polylineEditor.open();
        polylineEditors.push(polylineEditor);
    });
}

function stopEditingPolyline() {
    polylineEditors.forEach((polylineEditor) => {
        polylineEditor.close();
    });
}

function removeAllPolyline() {
    map.remove(polylines);
    map.remove(points);
    temporaryPolyline !== null && map.remove(temporaryPolyline);
    polylines = [];
    points = [];
    polylineEditors = [];
}

function PolylineToolbar() {

    return (
        <div className="grid grid-cols-2 gap-0.5 my-4">
            <label className="mapPanel-labelAndButton flex flex-row items-center justify-around rounded-2xl m-2 cursor-pointer">
                <input
                    type="radio"
                    name="drawPolyline"
                    defaultChecked={false}
                    onChange={startDrawingPolyline}
                />
                选取一组点
            </label>
            <label className="mapPanel-labelAndButton flex flex-row items-center justify-around rounded-2xl m-2 cursor-pointer">
                <input
                    type="radio"
                    name="drawPolyline"
                    defaultChecked={true}
                    onChange={stopDrawingPolyline}
                />
                根据选取点绘制折线
            </label>
            <label className="mapPanel-labelAndButton flex flex-row items-center justify-around rounded-2xl m-2 cursor-pointer">
                <input
                    type="radio"
                    name="editPolyline"
                    defaultChecked={false}
                    onChange={startEditingPolyline}
                />
                打开折线编辑器
            </label>
            <label className="mapPanel-labelAndButton flex flex-row items-center justify-around rounded-2xl m-2 cursor-pointer">
                <input
                    type="radio"
                    name="editPolyline"
                    defaultChecked={true}
                    onChange={stopEditingPolyline}
                />
                关闭折线编辑器
            </label>
            <button onClick={removeAllPolyline} className="mapPanel-labelAndButton col-start-1 col-end-3 rounded-2xl m-2 text-center">清除所有Polyline</button>
        </div>
    );
}

export {PolylineToolbar};