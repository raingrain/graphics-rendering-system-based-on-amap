// 地图实例
import {map} from "../../../layout/MapLayout/MapContainer";
// 鹰眼控件设置函数

// 样式按钮图标
import {MapStyleToolIcon} from "../../../assets/Icon";
// 导入气泡卡片控件
import {Popover} from "antd";
import styled from "styled-components";

// 样式类类型
import {Style} from "./types";

// 导入样式对应图片，不能以src直接插入image标签（大坑）
// @ts-ignore
import normal from "../../../assets/mapStyleImage/normal.png";
// @ts-ignore
import dark from "../../../assets/mapStyleImage/dark.png";
// @ts-ignore
import graffiti from "../../../assets/mapStyleImage/graffiti.png";
// @ts-ignore
import light from "../../../assets/mapStyleImage/light.png";
// @ts-ignore
import wine from "../../../assets/mapStyleImage/wine.png";
// @ts-ignore
import whitesmoke from "../../../assets/mapStyleImage/whitesmoke.png";
// @ts-ignore
import fresh from "../../../assets/mapStyleImage/fresh.png";
// @ts-ignore
import grey from "../../../assets/mapStyleImage/grey.png";
// @ts-ignore
import macaron from "../../../assets/mapStyleImage/macaron.png";
// @ts-ignore
import blue from "../../../assets/mapStyleImage/blue.png";
// @ts-ignore
import darkblue from "../../../assets/mapStyleImage/darkblue.png";
import {useStore} from "../../../store";
import {ControlButton} from "../OverlayTool";


// 样式数据
// name为样式中文名字
// type为样式类型英文名字
// image为图像
const styles: Style[] = [
    {
        zhName: "标准",
        type: "normal",
        image: normal
    },
    {
        zhName: "幻影黑",
        type: "dark",
        image: dark
    },
    {
        zhName: "涂鸦",
        type: "graffiti",
        image: graffiti
    },
    {
        zhName: "月关银",
        type: "light",
        image: light
    },
    {
        zhName: "酱籽",
        type: "wine",
        image: wine
    },
    {
        zhName: "远山黛",
        type: "whitesmoke",
        image: whitesmoke
    },
    {
        zhName: "草色青",
        type: "fresh",
        image: fresh
    },
    {
        zhName: "雅士灰",
        type: "grey",
        image: grey
    },
    {
        zhName: "马卡龙",
        type: "macaron",
        image: macaron
    },
    {
        zhName: "靛青蓝",
        type: "blue",
        image: blue
    },
    {
        zhName: "极夜蓝",
        type: "darkblue",
        image: darkblue
    }
];

// 地图样式选择器
export const MapStyleTool = () => {

    return (
        <div style={{
        // position: "absolute",
        //     right: "1rem",
        //     top: "37vh"
    }}>
            <Popover
                placement="left"
                content={<PopoverContent />}
                title={<PopoverTitle />}
                trigger="click"
            >
                <ControlButton><MapStyleToolIcon size="24" /></ControlButton>
            </Popover>
        </div>
    );
};


// 气泡卡片标题
const PopoverTitle = () => {
    return <h1 className="text-center">地图样式选择器</h1>;
};

// 气泡卡片内容
const PopoverContent = () => {

    const {gaoDeControls} = useStore();

    // 设置地图样式
    function setStyle(styleType: string) {
        // 样式路径
        styleType = "amap://styles/" + styleType;
        // 往map实例上添加样式
        map.setMapStyle(styleType);
        // 同时设置鹰眼控件
        // setControl("HawkEye", {mapStyle: "amap://styles/" + mapStyle.Style});
        gaoDeControls.setHawkEye({mapStyle: styleType});
    }

    return (
        <Content>
            {
                styles.map((style) => {
                    return (
                        <div key={style.zhName} onClick={() => setStyle(style.type)}>
                            <img src={style.image} alt={style.zhName} />
                            <div>{style.zhName}</div>
                        </div>
                    );
                })
            }
        </Content>
    );
};

// 气泡卡片内容样式
const Content = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 1.5rem;
    height: 250px;
    overflow-y: scroll;
    
    &::-webkit-scrollbar {
        display: none;
    }
    
    div {
        display: flex;
        flex-direction: column;
        width: 100px;
        height: 100px;
        cursor: pointer;
        
        div {
            font-size: .5rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
`;
