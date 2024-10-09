export default function BoardList({ boards, selectedBoardId, onSelectBoard }) {
  return (
    <div className="board-list">
      {boards.map(board => (
        <div 
          key={board.id} 
          className={`board-item ${board.id === selectedBoardId ? 'selected' : ''}`}
          onClick={() => onSelectBoard(board.id)}
        >
          {board.title}
        </div>
      ))}
    </div>
  );
}