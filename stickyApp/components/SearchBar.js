import { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    onSearch(e.target.value)
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="메모 또는 태그 검색"
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  )
}