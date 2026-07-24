function MemoryCard({ memory }){
    return (
        <li className="memory-card">
            <img src={memory.photo_url} alt={memory.caption} className="memory-photo" />
            <p className="memory-caption">{memory.caption}</p>
        </li>
    )
}

export default MemoryCard