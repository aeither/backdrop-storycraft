import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Timeline {
  id: number;
  imageUrl: string;
}

interface State {
  timeline: Timeline[];
}

interface Actions {
  setTimeline: (timelines: Timeline[]) => void;
  reset: () => void;
}

const initialState: State = { timeline: [] };

const useTimelineStore = create<State & Actions>()(
  persist(
    set => ({
      timeline: [],
      setTimeline: timelines =>
        set(state => ({
          ...state,
          timeline: timelines,
        })),
      reset: () => {
        set(initialState);
      },
    }),
    { name: "timelineStore" },
  ),
);

export default useTimelineStore;
