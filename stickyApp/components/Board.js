import { Draggable } from '@hello-pangea/dnd';
import StickyNote from './StickyNote';

export default function Board({ board, onAddNote, onAddTag, onDeleteNote, onDeleteBoard, onEditNote, onChangeNoteColor, onEditBoardTitle, searchTerm, sortType, sortDirection, selectedTag }) {
  const filteredAndSortedNotes = board.notes
    .filter(note => 
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(note => !selectedTag || note.tags.includes(selectedTag))
    .sort((a, b) => {
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
    <div className="board">
      <h2>{board.title}</h2>
      <button onClick={() => onAddNote(board.id, prompt('메모 내용을 입력하세요:'))}>
        새 메모 추가
      </button>
      <button onClick={() => onDeleteBoard(board.id)}>보드 삭제</button>
      {filteredAndSortedNotes.map((note, index) => (
        <Draggable key={note.id} draggableId={note.id.toString()} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{
                ...provided.draggableProps.style,
                opacity: snapshot.isDragging ? 0.5 : 1,
              }}
            >
              <StickyNote
                id={note.id}
                content={note.content}
                tags={note.tags}
                createdAt={note.createdAt}
                color={note.color}
                onAddTag={(tag) => onAddTag(board.id, note.id, tag)}
                onDelete={() => onDeleteNote(board.id, note.id)}
                onEdit={(content) => onEditNote(board.id, note.id, content)}
                onChangeColor={(color) => onChangeNoteColor(board.id, note.id, color)}
                allTags={board.tags || []}
              />
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
}