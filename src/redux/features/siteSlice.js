import {createSlice, PayloadAction} from "@reduxjs/toolkit"

const initialState = {
    breadCrumb: []
}

export const TestTitleSlice = createSlice({
    name: "site_setting",
    initialState,
    reducers: {
        reset: (state) => {
            state.breadCrumb = []
        },

        setBreadCrumb: (state, action) => {
            state.breadCrumb = action.payload
        }
    }
})

export const {reset,setBreadCrumb} = TestTitleSlice.actions
export default TestTitleSlice.reducer

