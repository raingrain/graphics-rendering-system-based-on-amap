import "./NavBar.scss";

import {LeftCircleOutlined, GithubOutlined} from "@ant-design/icons";

import {panel} from "../MapContainer/MapContainer.jsx";
import {useRef} from "react";

function NavBar() {
    const openCloseBtn = useRef<HTMLDivElement>(null);

    return (
        <nav>
            <div className="btn">
                <div className="open-close-btn" ref={openCloseBtn}>
                    <LeftCircleOutlined
                        style={{
                            fontSize: "2rem"
                        }}
                        onClick={function () {
                            panel.current!.classList.toggle("open-close-panel");
                            openCloseBtn.current!.classList.toggle("open-close");
                        }}
                    />
                </div>
            </div>
            <div className="react-amap-title">
                <svg className="icon" viewBox="0 0 1024 1024" version="1.1"
                     xmlns="http://www.w3.org/2000/svg" width="64" height="64">
                    <path d="M512 511.8m-80 0a80 80 0 1 0 160 0 80 80 0 1 0-160 0Z" fill="#61DAFB" ></path>
                    <path
                        d="M960.5 511.8c0-62.8-73.8-117.2-188.5-150.1 28.9-115.8 18.7-206.9-35.7-238.3-54.5-31.4-138.5 5.3-224.3 88.2-85.8-82.9-169.8-119.6-224.3-88.2-54.4 31.4-64.6 122.6-35.7 238.3C137.3 394.6 63.5 449 63.5 511.8S137.3 629 252 661.9c-28.9 115.7-18.7 206.9 35.7 238.3 13.4 7.8 28.6 11.6 45.2 11.6 39.7 0 87.8-21.8 140-64.2 13-10.6 26.1-22.6 39.1-35.2 13 12.6 26.1 24.6 39.1 35.2 52.2 42.4 100.2 64.2 140 64.2 16.6 0 31.8-3.8 45.2-11.6 54.4-31.4 64.6-122.5 35.7-238.3 114.7-32.9 188.5-87.3 188.5-150.1zM716.8 157.2c35.3 20.4 42.7 94.3 17.6 194.8-36.7-8.4-76.7-14.7-119.3-18.6-24.7-34.9-50.2-66.4-75.8-94 59.2-57.3 114.2-88.4 152-88.4 9.6-0.1 18.2 2 25.5 6.2zM637 584c-13.8 24-28.4 47-43.3 69-26.1 2-53.3 3.1-81.7 3.1-28.3 0-55.5-1.1-81.6-3.1-15-22-29.5-45.1-43.3-69-14.1-24.5-26.7-48.6-38.1-72.2 11.4-23.6 24-47.7 38.1-72.2 14.1-24.5 28.7-47.4 43.4-69.1 26.1-2 53.3-3.1 81.6-3.1 28.3 0 55.5 1.1 81.6 3.1 14.7 21.6 29.3 44.6 43.4 69 14.1 24.5 26.7 48.6 38.1 72.2-11.5 23.7-24.1 47.8-38.2 72.3z m58.8-26.4c11.2 26.6 20.4 52.1 28 76.5-24.9 5.6-51.7 10.4-80.3 14 9.3-14.5 18.4-29.3 27.3-44.6 8.8-15.4 17.1-30.7 25-45.9zM512 756.5c-17.7-19.2-35.1-40.1-52.2-62.6 17.1 0.8 34.5 1.3 52.2 1.3 17.7 0 35.1-0.5 52.2-1.3-17.1 22.5-34.5 43.4-52.2 62.6zM380.5 648.1c-28.6-3.6-55.3-8.4-80.3-14 7.6-24.4 16.8-49.9 28-76.5 7.9 15.2 16.1 30.5 25 45.9 8.9 15.2 18 30 27.3 44.6zM328.2 466c-11.2-26.6-20.4-52.1-28-76.5 24.9-5.6 51.6-10.4 80.2-14-9.2 14.4-18.4 29.2-27.2 44.6-8.8 15.4-17.1 30.7-25 45.9zM512 267.1c17.3 18.7 34.8 39.8 52.1 62.7-17.1-0.8-34.4-1.3-52.1-1.3-17.7 0-35 0.5-52.1 1.3 17.3-22.9 34.8-44 52.1-62.7z m158.7 153c-8.9-15.3-18-30.1-27.2-44.6 28.6 3.6 55.3 8.4 80.2 14-7.6 24.4-16.8 49.9-28 76.5-7.8-15.2-16.1-30.5-25-45.9zM307.2 157.2c7.2-4.2 15.8-6.2 25.6-6.2 37.8 0 92.7 31.1 151.9 88.4-25.6 27.6-51.1 59.2-75.8 94-42.5 3.9-82.6 10.2-119.3 18.6-25.1-100.6-17.6-174.5 17.6-194.8zM102.5 511.8c0-40.8 60.3-84.2 160-112.6 11.1 36 25.6 73.8 43.5 112.6-17.8 38.8-32.4 76.6-43.5 112.6-99.7-28.4-160-71.9-160-112.6z m345.8 305.5c-59.7 48.5-111.1 66.4-141.1 49.2-35.3-20.4-42.7-94.3-17.6-194.8 36.7 8.4 76.7 14.7 119.3 18.6 24.4 34.5 49.9 66.1 75.8 94.2-12.1 11.7-24.2 22.9-36.4 32.8z m268.5 49.2c-29.9 17.3-81.4-0.6-141.1-49.2-12.1-9.9-24.3-21.1-36.5-32.8 26-28.1 51.4-59.7 75.8-94.2 42.5-3.9 82.6-10.2 119.3-18.7 25.2 100.6 17.7 174.5-17.5 194.9z m44.8-242.1c-11.1-36-25.6-73.8-43.5-112.6 17.8-38.8 32.4-76.6 43.5-112.6 99.7 28.5 160 71.9 160 112.6-0.1 40.7-60.4 84.2-160 112.6z"
                        fill="#61DAFB" ></path>
                </svg>
                <h1>React-Amap</h1>
                <svg className="icon" viewBox="0 0 1024 1024" version="1.1"
                     xmlns="http://www.w3.org/2000/svg" width="64" height="64">
                    <path
                        d="M872.18 94.08L95.95 545.34c-27.56 16.01-36.93 51.33-20.92 78.89a57.713 57.713 0 0 0 30.91 25.51l294.68 102.61v168.81c-0.81 20.38 15.06 37.56 35.45 38.37 20.38 0.81 37.56-15.06 38.37-35.45 0.04-0.97 0.04-1.95 0-2.92V778.15l313.38 109.54c30.09 10.53 63.01-5.33 73.54-35.41a57.7 57.7 0 0 0 2.7-11.22l94.3-689.26c4.31-31.58-17.8-60.68-49.38-64.99a57.746 57.746 0 0 0-36.8 7.27z m-93.37 139.84L424.62 682.17 164.45 591.8l614.36-357.88zM498.38 708.03l374.56-474.11-79.35 575.63-295.21-101.52z"
                        fill="#61DAFB"></path>
                </svg>
            </div>
            <div className="github">
                <a href="https://github.com/raingrain/react-amap" target="_blank">
                    <GithubOutlined
                        style={{
                            fontSize: "2rem",
                            color: "#000"
                        }}
                    />
                </a>
            </div>
        </nav>
    );
}

export default NavBar;