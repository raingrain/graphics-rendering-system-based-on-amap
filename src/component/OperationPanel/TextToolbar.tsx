import {map} from "../MapContainer/MapContainer";
import React, {useRef} from "react";
import {Collapse} from "antd";

const {Panel} = Collapse;

function TextToolbar() {
    const Text = useRef<HTMLInputElement>(null);
    const addBtn = useRef<HTMLButtonElement>(null);

    let texts: AMap.Text[] = [];

    function newText(content: string) {
        const text = new AMap.Text({
            map,
            position: map.getCenter(),
            draggable: true,
            text: content,
            anchor: "center", // 设置文本标记锚点
            cursor: "pointer",
            extData: {
                id: texts.length + 1
            },
            style: {
                // 'padding': '.75rem 1.25rem',
                // 'margin-bottom': '1rem',
                "border-radius": ".25rem",
                "background-color": "white",
                // 'width': '15rem',
                "max-width": "250px",
                "border-width": 0,
                "box-shadow": "0 2px 6px 0 rgba(114, 124, 245, .5)",
                "text-align": "center",
                "font-size": ".5rem",
                "color": "blue"
            }
        });
        text.on("rightclick", removeAText);
        texts.push(text);
    }

    function addTextToMap() {
        if (Text.current && Text.current.value !== "") {
            newText(Text.current.value);
            Text.current.value = "";
        } else {
            alert("请输入内容");
        }
    }

    function removeAText(e: any) {
        e.target.setMap(null);
    }

    function allowRemoveText() {
        texts.forEach((text) => text.on("rightclick", removeAText));
    }

    function forbidRemoveText() {
        texts.forEach((text) => text.off("rightclick", removeAText));
    }

    function startEditingText() {
        texts.forEach((text) => text.setDraggable(true));
        allowRemoveText();
        addBtn.current!.addEventListener("click", addTextToMap);
    }

    function stopEditingText() {
        texts.forEach((text) => text.setDraggable(false));
        forbidRemoveText();
        addBtn.current!.removeEventListener("click", addTextToMap);
    }

    function removeAllText() {
        if (texts.length === 0) {
            alert("没有文本标注");
        } else {
            map.remove(texts);
            texts = [];
            alert("已经全部清除");
        }
    }

    return (
        <div className="grid grid-cols-2 gap-0.5 my-4">
            <label className="mapPanel-labelAndButton flex flex-row items-center justify-around rounded-2xl m-2 cursor-pointer">
                <input
                    type="radio"
                    name="editText"
                    defaultChecked={false}
                    onChange={startEditingText}
                />
                开始编辑
            </label>
            <label className="mapPanel-labelAndButton flex flex-row items-center justify-around rounded-2xl m-2 cursor-pointer">
                <input
                    type="radio"
                    name="editText"
                    defaultChecked={true}
                    onChange={stopEditingText}
                />
                停止编辑
            </label>
            <label className="col-start-1 col-end-3 rounded-2xl m-2">
                <input type="text" ref={Text} placeholder="输入注记内容" className="w-full h-full m-auto rounded-2xl pl-2 border-2 border-blue-300 focus:outline-none focus:ring focus:border-blue-300" />
            </label>
            <button className="mapPanel-labelAndButton col-start-1 col-end-3 rounded-2xl m-2 text-center" ref={addBtn}>放置文本标记</button>
            <button className="mapPanel-labelAndButton col-start-1 col-end-3 rounded-2xl m-2 text-center" onClick={removeAllText}>清除所有文本标注</button>
        </div>
    );
}

export {TextToolbar};