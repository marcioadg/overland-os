import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Colors, CategoryColors } from '../constants/colors';
import { ProgressBar } from './ProgressBar';
import type { Checklist, ChecklistItem, Category } from '../hooks/useChecklists';

interface ChecklistCardProps {
  checklist: Checklist;
  progress: number;
  onToggleItem: (checklistId: string, itemId: string) => void;
  onDeleteItem: (checklistId: string, itemId: string) => void;
  onAddItem: (checklistId: string, item: Omit<ChecklistItem, 'id' | 'checked'>) => void;
  onDeleteChecklist: (id: string) => void;
}

const CATEGORIES: Category[] = ['Recovery', 'Camp', 'Nav', 'Safety', 'Misc'];

export function ChecklistCard({
  checklist,
  progress,
  onToggleItem,
  onDeleteItem,
  onAddItem,
  onDeleteChecklist,
}: ChecklistCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<Category>('Misc');
  const [newItemNotes, setNewItemNotes] = useState('');

  const handleAdd = () => {
    if (!newItemName.trim()) return;
    onAddItem(checklist.id, {
      name: newItemName.trim(),
      category: newItemCategory,
      notes: newItemNotes.trim(),
    });
    setNewItemName('');
    setNewItemNotes('');
    setAddingItem(false);
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Checklist',
      `Delete "${checklist.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDeleteChecklist(checklist.id) },
      ]
    );
  };

  const checked = checklist.items.filter((i) => i.checked).length;

  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{checklist.name}</Text>
          <Text style={styles.itemCount}>
            {checked}/{checklist.items.length} items
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={confirmDelete} style={styles.deleteBtn}>
            <Text style={styles.deleteText}>🗑</Text>
          </TouchableOpacity>
          <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {/* Progress */}
      <View style={styles.progressRow}>
        <ProgressBar progress={progress} />
      </View>

      {/* Expanded Items */}
      {expanded && (
        <View style={styles.itemsContainer}>
          {CATEGORIES.map((cat) => {
            const catItems = checklist.items.filter((i) => i.category === cat);
            if (catItems.length === 0) return null;
            return (
              <View key={cat} style={styles.categoryGroup}>
                <View style={[styles.categoryLabel, { backgroundColor: CategoryColors[cat] + '22' }]}>
                  <View style={[styles.categoryDot, { backgroundColor: CategoryColors[cat] }]} />
                  <Text style={[styles.categoryText, { color: CategoryColors[cat] }]}>{cat}</Text>
                </View>
                {catItems.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    onToggle={() => onToggleItem(checklist.id, item.id)}
                    onDelete={() => onDeleteItem(checklist.id, item.id)}
                  />
                ))}
              </View>
            );
          })}

          {/* Add Item */}
          {addingItem ? (
            <View style={styles.addForm}>
              <TextInput
                style={styles.input}
                placeholder="Item name"
                placeholderTextColor={Colors.textMuted}
                value={newItemName}
                onChangeText={setNewItemName}
                autoFocus
              />
              <TextInput
                style={styles.input}
                placeholder="Notes (optional)"
                placeholderTextColor={Colors.textMuted}
                value={newItemNotes}
                onChangeText={setNewItemNotes}
              />
              <View style={styles.categoryPicker}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.catChip,
                      newItemCategory === cat && { backgroundColor: CategoryColors[cat] },
                    ]}
                    onPress={() => setNewItemCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.catChipText,
                        newItemCategory === cat && styles.catChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.addActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setAddingItem(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
                  <Text style={styles.saveText}>Add Item</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.addItemBtn} onPress={() => setAddingItem(true)}>
              <Text style={styles.addItemText}>+ Add Item</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

interface ItemRowProps {
  item: ChecklistItem;
  onToggle: () => void;
  onDelete: () => void;
}

function ItemRow({ item, onToggle, onDelete }: ItemRowProps) {
  return (
    <View style={styles.itemRow}>
      <TouchableOpacity onPress={onToggle} style={styles.checkbox} activeOpacity={0.7}>
        <View style={[styles.checkboxInner, item.checked && styles.checkboxChecked]}>
          {item.checked && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
      <View style={styles.itemContent}>
        <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
          {item.name}
        </Text>
        {item.notes ? (
          <Text style={styles.itemNotes}>{item.notes}</Text>
        ) : null}
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.itemDeleteBtn}>
        <Text style={styles.itemDeleteText}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  headerLeft: {
    flex: 1,
    gap: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  name: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  itemCount: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  deleteBtn: {
    padding: 4,
  },
  deleteText: {
    fontSize: 16,
  },
  chevron: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  progressRow: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  itemsContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
  },
  categoryGroup: {
    paddingHorizontal: 16,
    gap: 4,
  },
  categoryLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  checkmark: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  itemContent: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    color: Colors.text,
    fontSize: 15,
  },
  itemNameChecked: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  itemNotes: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  itemDeleteBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDeleteText: {
    color: Colors.textMuted,
    fontSize: 20,
    lineHeight: 24,
  },
  addForm: {
    marginHorizontal: 16,
    gap: 10,
    marginTop: 8,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    color: Colors.text,
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  catChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.cardBorder,
  },
  catChipText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  catChipTextActive: {
    color: Colors.text,
    fontWeight: '700',
  },
  addActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.cardBorder,
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.accent,
    alignItems: 'center',
  },
  saveText: {
    color: Colors.text,
    fontWeight: '700',
  },
  addItemBtn: {
    marginHorizontal: 16,
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.accent,
    alignItems: 'center',
  },
  addItemText: {
    color: Colors.accent,
    fontWeight: '700',
    fontSize: 14,
  },
});
