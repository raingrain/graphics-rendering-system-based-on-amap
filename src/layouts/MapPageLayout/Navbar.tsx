import {GithubOutlined} from "@ant-design/icons";
import {AMapIcon, AntDIcon, MobxIcon, ReactIcon, TSIcon, ViteIcon} from "../../assets/Icon";
import {iconSize} from "./Sidebar";

export function Navbar() {
    return (
        <nav className="grid grid-cols-3" style={{
            position: "absolute",
            width: "100vw",
            height: "3rem",
            background: "linear-gradient(to right, #f0f0f0, #bfbfbf)"
        }}>
            {/*占2/3和3/3*/}
            <div className="col-start-2 col-end-3 mx-auto grid grid-rows-2">
                {/*上下再分成两行*/}
                <div className="flex justify-center items-center">
                    <AMapIcon size={iconSize} />&nbsp;+&nbsp;<ViteIcon size={iconSize}/>&nbsp;+&nbsp;<ReactIcon size={iconSize} />&nbsp;+&nbsp;<TSIcon size={iconSize} />&nbsp;+&nbsp;<MobxIcon size={iconSize} />&nbsp;+&nbsp;<AntDIcon size={iconSize}/>
                </div>
                <p className="text-base font-bold text-center">RainGrain-Map</p>
            </div>
            <a className="flex items-center mr-4 ml-auto" href="https://github.com/raingrain/mini-amap-react-ts" target="_blank">
                {/*github图标*/}
                <GithubOutlined style={{fontSize: "2rem"}} />
            </a>
        </nav>
    );
}
