const palette = [
    '#d4501a', // orange
    '#2e7d32', // green
    '#0277bd', // blue
    '#6a1b9a', // purple
    '#c2185b', // pink
    '#f9a825', // amber
    '#00838f', // teal
    '#5d4037', // brown
]

export function colorForSkill(skill) {
    const str = String(skill.id ?? skill.title ?? '')
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    return palette[Math.abs(hash) % palette.length]
}