import { create } from "zustand";

interface SliderState {
    activeSlide: number;
    totalSlides: number;
    setActiveSlide: (index: number) => void;
    setTotalSlides: (total: number) => void;
}

export const useSliderStore = create<SliderState>((set) => ({
    activeSlide: 0,
    totalSlides: 1,
    setActiveSlide: (index) => set({ activeSlide: index }),
    setTotalSlides: (total) => set({ totalSlides: total }),
}));
