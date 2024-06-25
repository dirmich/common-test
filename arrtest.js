const test = () => {
  return Array.from({ length: 5 }).map((_, i) => ({
    level: (i + 1).toString(),
  }))
}

console.log(test())
