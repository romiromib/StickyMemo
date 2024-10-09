import { Droppable } from '@hello-pangea/dnd';
import StickyNote from './StickyNote';
import TagFilter from './TagFilter';

export default function BoardContent({
  board,
  onAddNote,
  onAddTag,
  onDeleteNote,
  onDeleteBoard,
  onEditNote,
  onChangeNoteColor,
  onEditBoardTitle,
  searchTerm,
  sortType,
  sortDirection,
  selectedTag,
  onToggleTag,
  getTagColor
}) {
  const filteredAndSortedNotes = board.notes
    .filter(note => 
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(note => !selectedTag || note.tags.includes(selectedTag))
    .sort((a, b) => {
      if (sortType === 'order') {
        return a.order - b.order;
      }
      if (sortType === 'createdAt') {
        return sortDirection === 'asc' 
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortType === 'alphabetical') {
        return sortDirection === 'asc'
          ? a.content.localeCompare(b.content)
          : b.content.localeCompare(a.content);
      }
      if (sortType === 'tags') {
        return sortDirection === 'asc'
          ? a.tags.length - b.tags.length
          : b.tags.length - a.tags.length;
      }
      return 0;
    });

  return (
    <div className="board-content">
      <h2>{board.title}</h2>
      <button onClick={() => onAddNote(board.id, prompt('메모 내용을 입력하세요:'))}>
        새 메모 추가
      </button>
      <button onClick={() => onDeleteBoard(board.id)}>보드 삭제</button>
      <TagFilter 
        tags={board.tags || []} 
        selectedTag={selectedTag} 
        onSort={onToggleTag}
        getTagColor={getTagColor}  // 이 줄을 추가해 주세요
      />
      <Droppable droppableId={board.id.toString()} direction="horizontal">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="notes-container">
            {filteredAndSortedNotes.map((note, index) => (
              <StickyNote
                key={note.id}
                note={note}
                index={index}
                boardId={board.id}
                onAddTag={onAddTag}
                onDeleteNote={onDeleteNote}
                onEditNote={onEditNote}
                onChangeColor={onChangeNoteColor}
                allTags={board.tags || []}
                getTagColor={getTagColor}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}