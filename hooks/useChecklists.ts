import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Category = 'Recovery' | 'Camp' | 'Nav' | 'Safety' | 'Misc';

export interface ChecklistItem {
  id: string;
  name: string;
  category: Category;
  checked: boolean;
  notes: string;
}

export interface Checklist {
  id: string;
  name: string;
  items: ChecklistItem[];
  createdAt: number;
}

const STORAGE_KEY = '@overland_checklists';

const CYBERTRUCK_RTT_TEMPLATE: Omit<Checklist, 'id' | 'createdAt'> = {
  name: 'Cybertruck RTT',
  items: [
    // Recovery
    { id: 't1', name: 'Hi-Lift Jack', category: 'Recovery', checked: false, notes: '' },
    { id: 't2', name: 'Kinetic Recovery Rope', category: 'Recovery', checked: false, notes: '30ft, 30K lb' },
    { id: 't3', name: 'D-Shackles (x4)', category: 'Recovery', checked: false, notes: '' },
    { id: 't4', name: 'Traction Boards (x2)', category: 'Recovery', checked: false, notes: 'MAXTRAX or similar' },
    { id: 't5', name: 'Shovel', category: 'Recovery', checked: false, notes: '' },
    { id: 't6', name: 'Tire Deflators', category: 'Recovery', checked: false, notes: '' },
    { id: 't7', name: 'Air Compressor', category: 'Recovery', checked: false, notes: 'On-board or portable' },
    // Camp
    { id: 't8', name: 'Roof Top Tent', category: 'Camp', checked: false, notes: 'Check straps and ladder' },
    { id: 't9', name: 'Sleeping Bags (x2)', category: 'Camp', checked: false, notes: '' },
    { id: 't10', name: 'Camp Stove + Fuel', category: 'Camp', checked: false, notes: '' },
    { id: 't11', name: 'Water Jugs (10gal)', category: 'Camp', checked: false, notes: '' },
    { id: 't12', name: 'Cooler with Ice', category: 'Camp', checked: false, notes: '' },
    { id: 't13', name: 'Headlamps (x2)', category: 'Camp', checked: false, notes: '' },
    { id: 't14', name: 'Camping Chairs', category: 'Camp', checked: false, notes: '' },
    // Nav
    { id: 't15', name: 'Garmin InReach', category: 'Nav', checked: false, notes: 'Charged + subscription active' },
    { id: 't16', name: 'Offline Maps (Gaia GPS)', category: 'Nav', checked: false, notes: 'Download before trip' },
    { id: 't17', name: 'Paper Maps / Atlas', category: 'Nav', checked: false, notes: 'Benchmark or National Geographic' },
    { id: 't18', name: 'Compass', category: 'Nav', checked: false, notes: '' },
    // Safety
    { id: 't19', name: 'First Aid Kit', category: 'Safety', checked: false, notes: 'Check expiry dates' },
    { id: 't20', name: 'Fire Extinguisher', category: 'Safety', checked: false, notes: '' },
    { id: 't21', name: 'Emergency Blankets (x2)', category: 'Safety', checked: false, notes: '' },
    { id: 't22', name: 'Flares / Road Triangles', category: 'Safety', checked: false, notes: '' },
    { id: 't23', name: 'Bear Spray', category: 'Safety', checked: false, notes: '' },
    // Misc
    { id: 't24', name: 'Duct Tape + Zip Ties', category: 'Misc', checked: false, notes: '' },
    { id: 't25', name: 'Multi-tool / Leatherman', category: 'Misc', checked: false, notes: '' },
    { id: 't26', name: 'Power Bank (large)', category: 'Misc', checked: false, notes: 'Charge from Cybertruck frunk' },
    { id: 't27', name: 'Trash Bags', category: 'Misc', checked: false, notes: 'Leave No Trace' },
  ],
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useChecklists() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setChecklists(JSON.parse(raw));
      }
    } catch (err) {
      console.error('useChecklists load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async (updated: Checklist[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setChecklists(updated);
    } catch (err) {
      console.error('useChecklists save error:', err);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createChecklist = useCallback(
    async (name: string, useTemplate = false): Promise<Checklist> => {
      const newChecklist: Checklist = {
        id: generateId(),
        name,
        items: useTemplate
          ? CYBERTRUCK_RTT_TEMPLATE.items.map((item) => ({ ...item, id: generateId() }))
          : [],
        createdAt: Date.now(),
      };
      await save([...checklists, newChecklist]);
      return newChecklist;
    },
    [checklists, save]
  );

  const deleteChecklist = useCallback(
    async (id: string) => {
      await save(checklists.filter((c) => c.id !== id));
    },
    [checklists, save]
  );

  const addItem = useCallback(
    async (
      checklistId: string,
      item: Omit<ChecklistItem, 'id' | 'checked'>
    ) => {
      const updated = checklists.map((c) => {
        if (c.id !== checklistId) return c;
        return {
          ...c,
          items: [
            ...c.items,
            { ...item, id: generateId(), checked: false },
          ],
        };
      });
      await save(updated);
    },
    [checklists, save]
  );

  const deleteItem = useCallback(
    async (checklistId: string, itemId: string) => {
      const updated = checklists.map((c) => {
        if (c.id !== checklistId) return c;
        return { ...c, items: c.items.filter((i) => i.id !== itemId) };
      });
      await save(updated);
    },
    [checklists, save]
  );

  const toggleItem = useCallback(
    async (checklistId: string, itemId: string) => {
      const updated = checklists.map((c) => {
        if (c.id !== checklistId) return c;
        return {
          ...c,
          items: c.items.map((i) =>
            i.id === itemId ? { ...i, checked: !i.checked } : i
          ),
        };
      });
      await save(updated);
    },
    [checklists, save]
  );

  const updateItemNotes = useCallback(
    async (checklistId: string, itemId: string, notes: string) => {
      const updated = checklists.map((c) => {
        if (c.id !== checklistId) return c;
        return {
          ...c,
          items: c.items.map((i) =>
            i.id === itemId ? { ...i, notes } : i
          ),
        };
      });
      await save(updated);
    },
    [checklists, save]
  );

  const getProgress = useCallback((checklist: Checklist): number => {
    if (checklist.items.length === 0) return 0;
    const checked = checklist.items.filter((i) => i.checked).length;
    return checked / checklist.items.length;
  }, []);

  return {
    checklists,
    loading,
    createChecklist,
    deleteChecklist,
    addItem,
    deleteItem,
    toggleItem,
    updateItemNotes,
    getProgress,
    TEMPLATE: CYBERTRUCK_RTT_TEMPLATE,
  };
}
