export default function TagFilter({ tags, selectedTag, onSort, getTagColor }) {
    return (
      <div className="tag-filter">
        <h3>태그로 정렬:</h3>
        {tags.map((tag) => (
          <button 
            key={tag} 
            onClick={() => onSort(tag)}
            className={selectedTag === tag ? 'selected' : ''}
            style={{ backgroundColor: getTagColor(tag) }}
            title={tag}
          >
            {tag.length > 10 ? tag.substring(0, 10) + '...' : tag}
          </button>
        ))}
      </div>
    );
}