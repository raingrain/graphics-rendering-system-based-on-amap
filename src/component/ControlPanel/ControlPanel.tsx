import {ChangeEvent} from "react";
import {LayersType} from "../../utils/setLayers/LayersType";
import "./ControlPanel.scss";

export interface Info {
    name: string,
    type: string | LayersType,
    isLoad?: boolean
}

interface Props {
    title: string,
    infos: Info[],
    inputType: "radio" | "checkbox",
    inputName?: string
    handleChange: (e: ChangeEvent<HTMLInputElement>, info: Info, infos: Info[]) => void,
    defaultChecked: boolean | ((info: Info) => boolean)
}

function ControlPanel(props: Props) {

    const {title, infos, inputType, handleChange, defaultChecked} = props;

    return (
        <div className="grid grid-cols-2 gap-0.5">
            <h3 className="col-start-1 col-end-3 text-center">{title}</h3>
            {
                infos.map((info, index, infos) =>
                    <label
                        key={info.name}
                        className="flex flex-row items-center justify-around rounded-2xl m-2 cursor-pointer"
                    >
                        <input
                            type={inputType}
                            name={Object.hasOwn(props, "inputName") ? props.inputName : undefined}
                            value={info.name}
                            defaultChecked={typeof defaultChecked === "boolean" ? defaultChecked : defaultChecked(info)}
                            onChange={(e) => handleChange(e, info, infos)}
                        />
                        {info.name}
                    </label>
                )
            }
        </div>
    );
}

export {ControlPanel};