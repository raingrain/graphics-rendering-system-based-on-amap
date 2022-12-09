import {GithubOutlined} from "@ant-design/icons";
import {AMapIcon, ReactIcon, TSIcon} from "../../assets/Icon";

export function NavBar() {
    return (
        <nav className="grid grid-cols-3" style={{
            width: "100vw",
            height: "50px"
        }}>
            {/*占2/3和3/3*/}
            <div className="col-start-2 col-end-3 mx-auto grid grid-rows-2">
                {/*上下再分成两行*/}
                <div className="flex justify-center items-center">
                    <AMapIcon size={"16"} />&nbsp;+&nbsp;<ReactIcon size={"16"} />&nbsp;+&nbsp;<TSIcon size={"16"} />
                </div>
                <p className="text-base font-bold">AMap-React-TS</p>
            </div>
            <a className="flex items-center mr-4 ml-auto" href="https://github.com/raingrain/mini-amap-react-ts" target="_blank">
                {/*github图标*/}
                <GithubOutlined style={{fontSize: "2rem"}} />
            </a>
        </nav>
    );
}
