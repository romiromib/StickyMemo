import { useState, useEffect, useCallback } from 'react'
import BoardList from '../components/BoardList'
import TagFilter from '../components/TagFilter'
import SearchBar from '../components/SearchBar'
import { DragDropContext } from '@hello-pangea/dnd';
import Board from '../components/Board';
import dynamic from 'next/dynamic';

const DynamicBoardContent = dynamic(() => import('../components/BoardContent'), { ssr: false });

const getTagColor = (tag) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F7B731', '#9B59B6'];
  return colors[Math.abs(hash) % colors.length];
};

export default function Home() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const savedBoards = localStorage.getItem('stickyNoteBoards');
    if (savedBoards) {
      setBoards(JSON.parse(savedBoards));
    }
  }, []);

  useEffect(() => {
    if (boards.length > 0) {
      localStorage.setItem('stickyNoteBoards', JSON.stringify(boards));
    }
  }, [boards]);

  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedTag, setSelectedTag] = useState(null);

  const onDragEnd = useCallback((result) => {
    const { source, destination } = result;
    
    if (!destination) {
      return;
    }

    setBoards(prevBoards => {
      const newBoards = JSON.parse(JSON.stringify(prevBoards));
      const board = newBoards.find(b => b.id === source.droppableId);

      if (!board) {
        return prevBoards;
      }

      const newNotes = Array.from(board.notes);
      const [reorderedItem] = newNotes.splice(source.index, 1);
      newNotes.splice(destination.index, 0, reorderedItem);

      // 드래그 앤 드롭 후의 순서를 저장
      newNotes.forEach((note, index) => {
        note.order = index;
      });

      board.notes = newNotes;

      return newBoards;
    });
  }, []);

  const addBoard = useCallback((title) => {
    const newBoard = {
      id: Date.now().toString(),
      title,
      notes: [],
      tags: []
    };
    setBoards(prevBoards => [...prevBoards, newBoard]);
  }, []);

  const addNote = useCallback((boardId, content) => {
    setBoards(prevBoards => prevBoards.map(board => {
      if (board.id === boardId) {
        const newNote = {
          id: Date.now().toString(),
          content,
          tags: [],
          createdAt: new Date().toISOString(),
          color: '#ffd700',
          order: board.notes.length // 새 메모의 순서를 설정
        };
        return { ...board, notes: [...board.notes, newNote] };
      }
      return board;
    }));
  }, []);

  const toggleTag = useCallback((tag) => {
    setSelectedTag(prevTag => prevTag === tag ? null : tag);
  }, []);

  const editNote = useCallback((boardId, noteId, content) => {
    setBoards(prevBoards => prevBoards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          notes: board.notes.map(note =>
            note.id === noteId ? { ...note, content } : note
          )
        };
      }
      return board;
    }));
  }, []);

  const deleteNote = useCallback((boardId, noteId) => {
    setBoards(prevBoards => prevBoards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          notes: board.notes.filter(note => note.id !== noteId)
        };
      }
      return board;
    }));
  }, []);

  const addTag = useCallback((boardId, noteId, tag) => {
    setBoards(prevBoards => prevBoards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          notes: board.notes.map(note => {
            if (note.id === noteId) {
              return { ...note, tags: [...note.tags, tag] };
            }
            return note;
          }),
          tags: [...new Set([...board.tags, tag])]
        };
      }
      return board;
    }));
  }, []);

  const changeNoteColor = useCallback((boardId, noteId, color) => {
    setBoards(prevBoards => prevBoards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          notes: board.notes.map(note =>
            note.id === noteId ? { ...note, color } : note
          )
        };
      }
      return board;
    }));
  }, []);

  const editBoardTitle = useCallback((boardId, newTitle) => {
    setBoards(prevBoards => prevBoards.map(board =>
      board.id === boardId ? { ...board, title: newTitle } : board
    ));
  }, []);

  const deleteBoard = useCallback((boardId) => {
    setBoards(prevBoards => prevBoards.filter(board => board.id !== boardId));
    if (selectedBoardId === boardId) {
      setSelectedBoardId(null);
    }
  }, [selectedBoardId]);

  const selectedBoard = boards.find(board => board.id === selectedBoardId);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="container">
        <h1>StickyMemo App ㅁㅌㅁㅇ</h1>
        <SearchBar onSearch={setSearchTerm} />
        <div className="sort-controls">
          <select   id="sort-select"
            name="sort"
            value={sortType} 
            onChange={(e) => setSortType(e.target.value)}>
            <option value="order">사용자 지정</option>
            <option value="createdAt">생성일</option>
            <option value="alphabetical">알파벳순</option>
            <option value="tags">태그 수</option>
          </select>
          <button onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}>
            {sortDirection === 'asc' ? '오름차순' : '내림차순'}
          </button>
        </div>
        <div className="app-layout">
          <div className="board-list-container">
            <button onClick={() => addBoard(prompt('보드 이름을 입력하세요:'))}>
              새 보드 추가
            </button>
            <BoardList 
              boards={boards}
              selectedBoardId={selectedBoardId}
              onSelectBoard={setSelectedBoardId}
            />
          </div>
          {selectedBoard && (
            <DynamicBoardContent
              board={selectedBoard}
              onAddNote={addNote}
              onAddTag={addTag}
              onDeleteNote={deleteNote}
              onDeleteBoard={deleteBoard}
              onEditNote={editNote}
              onChangeNoteColor={changeNoteColor}
              onEditBoardTitle={editBoardTitle}
              searchTerm={searchTerm}
              sortType={sortType}
              sortDirection={sortDirection}
              selectedTag={selectedTag}
              onToggleTag={toggleTag}
              getTagColor={getTagColor}
            />
          )}
        </div>
      </div>
    </DragDropContext>
  );
}