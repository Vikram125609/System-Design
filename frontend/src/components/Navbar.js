import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import userContext from "../utils/userContext";
import { removeItem } from "../features/cartSlice";
export default function Navbar() {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);
    const { user } = useContext(userContext);
    return (
        <div>
            <h1>Navbar -&gt; {user.sharangat_mantra}</h1>
            <h1>Cart = {cart.items.map((item) => item + ' ')}</h1>
            <button onClick={() => dispatch(removeItem())}>
                Remove
            </button>
        </div>
    );
}