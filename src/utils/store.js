import { create } from 'zustand';

const getPerformanceTier = () => {
  const isMobile = window.innerWidth <= 768;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const hwConcurrency = navigator.hardwareConcurrency || 4;
  
  if (isMobile || (isTouch && hwConcurrency <= 4)) return 'LOW';
  if (hwConcurrency <= 6) return 'MEDIUM';
  return 'HIGH';
};
export const useStore = create((set) => ({
  sceneState: 'HERO', // 'HERO', 'ABOUT', 'PHILOSOPHY', 'JOURNEY', 'UNIVERSE', 'PROJECT', 'MEDIA_SECTION', 'NETWORK'
  scrollProgress: 0,
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  performanceTier: getPerformanceTier(),
  
  hoveredProject: null,
  activeProject: null,
  activeFilter: 'ALL',
  
  activeNetworkNode: null,
  hoveredNetworkNode: null,

  setSceneState: (state) => set({ sceneState: state }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setHoveredProject: (id) => set({ hoveredProject: id }),
  setActiveProject: (id) => set({ activeProject: id }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  setActiveNetworkNode: (id) => set({ activeNetworkNode: id }),
  setHoveredNetworkNode: (id) => set({ hoveredNetworkNode: id }),

  activeLabFilter: 'ALL',
  setActiveLabFilter: (filter) => set({ activeLabFilter: filter }),
}));

// Listen for reduced motion changes
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
  useStore.setState({ reducedMotion: e.matches });
});
