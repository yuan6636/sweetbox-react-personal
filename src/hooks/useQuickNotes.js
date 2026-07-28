import { useState } from 'react';

export function useQuickNotes({ watch, getValues, setValue }) {
  const [selectedChips, setSelectedChips] = useState([]); // 已選的訂閱備註

  // 訂閱備註字數
  const currentNote = watch('note', '');

  //訂閱備註快選
  const quickNoteChips = [
    '請在下午送達。',
    '請直接放門口。',
    '請放管理室。',
    '請提前來電。',
    '對堅果過敏。',
    '對花生過敏。',
  ];

  const toggleChip = (chip) => {
    const currentText = getValues('note') || '';
    if (selectedChips.includes(chip)) {
      setSelectedChips(selectedChips.filter((item) => item !== chip));
      setValue('note', currentText.replace(chip, ''), { shouldValidate: true });
    } else {
      setSelectedChips([...selectedChips, chip]);
      setValue('note', currentText + chip, { shouldValidate: true });
    }
  };

  return { selectedChips, currentNote, quickNoteChips, toggleChip };
}
