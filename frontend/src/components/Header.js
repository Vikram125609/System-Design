import { useContext } from "react";
import userContext from "../utils/userContext";
export default function Header() {
    const { user, setUser } = useContext(userContext);

    return (
        <div>
            <h1>Using useContext -&gt; {user.jaykara}</h1>
            <input value={user.sharangat_mantra} onChange={e => setUser({ ...user, sharangat_mantra: e.target.value })} />
        </div>
    );
}