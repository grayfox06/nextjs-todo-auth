import { Add_Todo, Delete_Todo } from '../action';

const initialState = {
  list: [],
};
export const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case Add_Todo:
      const { data, id } = action.payload;
      return {
        ...state,
        list: [...state.list, { data, id }],
      };

    case Delete_Todo:
      let newList = state.list.filter((newItem) => newItem.id !== action.id);
      return {
        ...state,
        list: newList,
      };
    default:
      return state;
  }
};
