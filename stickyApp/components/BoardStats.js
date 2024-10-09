export default function BoardStats({ notes }) {
    const totalNotes = notes.length
    const totalTags = notes.reduce((acc, note) => acc + note.tags.length, 0)
    const uniqueTags = [...new Set(notes.flatMap(note => note.tags))].length
  
    const tagFrequency = notes.flatMap(note => note.tags)
      .reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1
        return acc
      }, {})
  
    const mostUsedTag = Object.entries(tagFrequency)
      .sort((a, b) => b[1] - a[1])[0]
  
    return (
      <div className="board-stats">
        <h3>보드 통계</h3>
        <p>총 메모 수: {totalNotes}</p>
        <p>총 태그 수: {totalTags}</p>
        <p>고유 태그 수: {uniqueTags}</p>
        {mostUsedTag && (
          <p>가장 많이 사용된 태그: {mostUsedTag[0]} ({mostUsedTag[1]}회)</p>
        )}
        <h4>태그 사용 빈도</h4>
        <ul>
          {Object.entries(tagFrequency)
            .sort((a, b) => b[1] - a[1])
            .map(([tag, count]) => (
              <li key={tag}>{tag}: {count}회</li>
            ))
          }
        </ul>
      </div>
    )
  }