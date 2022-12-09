import {useNavigate} from "react-router-dom";

export function Home() {
    const navigate = useNavigate();
    const go = (address: string) => {
        navigate(address);
    }

    return (
        <>
            <button onClick={() => go('/map')}>go to map</button>
        </>
    );
}
