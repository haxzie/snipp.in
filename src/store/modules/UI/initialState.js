const PANELS = {
  explorer: {
    id: "explorer",
    icon: "FileTextIcon",
    name: "File Explorer",
  },
  search: {
    id: "search",
    icon: "SearchIcon",
    name: "Search",
  },
};

export { PANELS };

export default function initialState() {
  return {
    activePanelId: PANELS.explorer.id,
    panelsById: ['explorer', 'search']
  };
}
