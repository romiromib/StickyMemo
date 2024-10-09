import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';

export default function StickyNote({ note, index, boardId, onAddTag, onDeleteNote, onEditNote, onChangeColor, allTags, getTagColor }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const [newTag, setNewTag] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(boardId, note.id, newTag.trim());
      setNewTag('');
    }
  };

  const handleEdit = () => {
    onEditNote(boardId, note.id, editedContent);
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={note.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="sticky-note"
          style={{
            ...provided.draggableProps.style,
            backgroundColor: note.color,
            opacity: snapshot.isDragging ? 0.5 : 1,
          }}
        >
          <button className="delete-btn" onClick={() => onDeleteNote(boardId, note.id)}>×</button>
          <div 
            className="content-container"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {isEditing ? (
              <>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <button onClick={handleEdit}>저장</button>
              </>
            ) : (
              <>
                <p>{note.content}</p>
                {isHovering && <button className="edit-btn" onClick={() => setIsEditing(true)}>수정</button>}
              </>
            )}
          </div>
          <small>{new Date(note.createdAt).toLocaleString()}</small>
          <div className="tags">
            {note.tags.map((tag) => (
              <span 
                key={tag} 
                className="tag" 
                style={{ backgroundColor: getTagColor(tag) }}
                title={tag}
              >
                {tag.length > 10 ? tag.substring(0, 10) + '...' : tag}
              </span>
            ))}
          </div>
          <select 
            value={newTag} 
            onChange={(e) => setNewTag(e.target.value)}
          >
            <option value="">태그 선택</option>
            {allTags.filter(tag => !note.tags.includes(tag)).map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="새 태그 입력"
          />
          <button onClick={handleAddTag}>태그 추가</button>
          <select value={note.color} onChange={(e) => onChangeColor(boardId, note.id, e.target.value)}>
            <option value="#ffd700">노랑</option>
            <option value="#ff7f50">주황</option>
            <option value="#98fb98">연두</option>
            <option value="#87cefa">하늘</option>
          </select>
        </div>
      )}
    </Draggable>
  );
}