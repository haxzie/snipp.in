import { PANELS } from "./initialState";

export default {
 getPanels: (state) => {
  return state.panelsById.map(panelId => PANELS[panelId])
 },
 getActivePanelId: (state) => {
   return state.activePanelId
 }
};
