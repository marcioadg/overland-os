import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { useChecklists } from '../../hooks/useChecklists';
import { ChecklistCard } from '../../components/ChecklistCard';

export default function ChecklistsScreen() {
  const {
    checklists,
    loading,
    createChecklist,
    deleteChecklist,
    addItem,
    deleteItem,
    toggleItem,
    getProgress,
  } = useChecklists();

  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [useTemplate, setUseTemplate] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) {
      Alert.alert('Name required', 'Please enter a checklist name.');
      return;
    }
    setCreating(true);
    try {
      await createChecklist(name, useTemplate);
      setModalVisible(false);
      setNewName('');
      setUseTemplate(false);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={checklists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChecklistCard
            checklist={item}
            progress={getProgress(item)}
            onToggleItem={toggleItem}
            onDeleteItem={deleteItem}
            onAddItem={addItem}
            onDeleteChecklist={deleteChecklist}
          />
        )}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listCount}>
              {checklists.length} {checklists.length === 1 ? 'checklist' : 'checklists'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>No checklists yet</Text>
            <Text style={styles.emptySub}>
              Create one below — or start with the{'\n'}Cybertruck RTT template
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+ New Checklist</Text>
      </TouchableOpacity>

      {/* Create Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Checklist</Text>

            <TextInput
              style={styles.input}
              placeholder="Checklist name"
              placeholderTextColor={Colors.textMuted}
              value={newName}
              onChangeText={setNewName}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleCreate}
            />

            <TouchableOpacity
              style={[styles.templateToggle, useTemplate && styles.templateToggleActive]}
              onPress={() => setUseTemplate(!useTemplate)}
              activeOpacity={0.7}
            >
              <View style={[styles.toggleIndicator, useTemplate && styles.toggleIndicatorActive]} />
              <View style={styles.templateInfo}>
                <Text style={styles.templateLabel}>🛻 Use Cybertruck RTT Template</Text>
                <Text style={styles.templateSub}>27 pre-built items across 5 categories</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setModalVisible(false);
                  setNewName('');
                  setUseTemplate(false);
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.createBtn, creating && styles.createBtnDisabled]}
                onPress={handleCreate}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator size="small" color={Colors.text} />
                ) : (
                  <Text style={styles.createText}>Create</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 100,
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listCount: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  emptySub: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 16,
    paddingBottom: 40,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 10,
    color: Colors.text,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  templateToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 10,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  templateToggleActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent + '11',
  },
  toggleIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.textMuted,
  },
  toggleIndicatorActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  templateInfo: {
    flex: 1,
    gap: 2,
  },
  templateLabel: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  templateSub: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: Colors.cardBorder,
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.textSecondary,
    fontWeight: '700',
    fontSize: 15,
  },
  createBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    alignItems: 'center',
  },
  createBtnDisabled: {
    opacity: 0.6,
  },
  createText: {
    color: Colors.text,
    fontWeight: '800',
    fontSize: 15,
  },
});
