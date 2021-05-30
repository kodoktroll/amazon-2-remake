import { createSlice } from "@reduxjs/toolkit";
// import { RootState } from "../app/store";

const initialState = {
    items: []
}

export const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        addToBasket: (state, action) => {
            state.items = [...state.items, action.payload]
        },
        removeFromBasket: (state, action) => {
            const indexElem = state.items.findIndex(item => item.id === action.payload.id);
            if(indexElem >= 0) {
                const head = state.items.slice(0, indexElem);
                // exclude current index
                const tail = state.items.slice(indexElem+1, state.items.length);
                state.items = [...head, ...tail];
            }
        }
    }
});

export const { addToBasket, removeFromBasket } = basketSlice.actions;

export const selectItems = (state) => state.basket.items;

export const selectTotal = (state) => state.basket.items.reduce((total, item) => total + item.price, 0);

export default basketSlice.reducer;
