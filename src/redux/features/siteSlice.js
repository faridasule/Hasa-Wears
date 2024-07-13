import {createSlice, PayloadAction} from "@reduxjs/toolkit"

// type BreadCrumb = {
//     title: string,
//     url?: string
// }

// export interface SiteSettingState {
//     breadCrumb: BreadCrumb[]
// }

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

