import {ChangeEvent} from "react";
import {LayersType} from "../../utils/setLayers/LayersType";

export interface Info {
    name: string,
    type: string | LayersType,
    isLoad?: boolean
}

interface Props {
    infos: Info[],
    inputType: "radio" | "checkbox",
    inputName?: string
    handleChange: (e: ChangeEvent<HTMLInputElement>, info: Info, infos: Info[]) => void,
    defaultChecked: boolean | ((info: Info) => boolean)
}

function SetPanel(props: Props) {

    const {infos, inputType, handleChange, defaultChecked} = props;

    return (
        <div className="grid grid-cols-2 gap-0.5 my-4">
            {
                infos.map((info, index, infos) =>
                    <label
                        key={info.name}
                        className="mapPanel-labelAndButton flex flex-row items-center justify-around rounded-2xl m-2 cursor-pointer"
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

export {SetPanel};