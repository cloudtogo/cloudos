import { createReducer } from "../../utils/PicassoUtils"
import {
  ActionTypes,
  LoadCanvasPayload,
  ReduxAction
} from "../../constants/ActionConstants"

const initialState: CanvasReduxState = {
  pageWidgetId: "0"
}

const canvasReducer = createReducer(initialState, {
  [ActionTypes.UPDATE_CANVAS]: (
    state: CanvasReduxState,
    action: ReduxAction<LoadCanvasPayload>
  ) => {
    console.log(action.payload);
    return { pageWidgetId: action.payload.pageWidgetId }
  }
})

export interface CanvasReduxState {
  pageWidgetId: string
}

export default canvasReducer
