import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import userContext from "../utils/userContext";
import { addItem } from "../features/cartSlice";
export default function Footer() {
    const [item, setItem] = useState('');
    const { user } = useContext(userContext);
    const dispatch = useDispatch();
    const addToCart = () => {
        dispatch(addItem(item));
    }
    return (
        <div>
            <h1>Footer -&gt; {user.powerfull_manter}</h1>
            <input
                type="text"
                onChange={(e) => setItem(e.target.value)}
                value={item}
            />
            <button onClick={addToCart}>
                Add
            </button>
        </div>
    );
}