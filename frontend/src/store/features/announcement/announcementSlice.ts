import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Announcements {
  general: object,
  deadline: object,
  all: object,
}

const initialState: Announcements = {
  general: {},
  deadline: {},
  all: {}
};

const announcementSlice = createSlice({
  name: 'announcement',
  initialState,
  reducers: {
    setGeneralAnnouncements(state, action: PayloadAction<any>) {
      state.general = action.payload;
    },
    setDeadlineAnnouncements(state, action: PayloadAction<any>) {
      state.deadline = action.payload;
    },
    setAnnouncements(state, action: PayloadAction<any>) {
      state.all = action.payload
    }
  },
});

export const { setGeneralAnnouncements, setDeadlineAnnouncements, setAnnouncements} = announcementSlice.actions;

export default announcementSlice.reducer;
