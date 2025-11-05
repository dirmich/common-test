// Simple arrow functions for base64 ⟷ hex conversion

// Convert base64 to hex (little-endian 4-byte)
const b64ToHex = (b64) => {
  const buf = Buffer.alloc(4)
  Buffer.from(b64, "base64").copy(buf)
  return `0x${buf.readUInt32LE(0).toString(16)}`
}

// Convert hex to base64 (little-endian 4-byte)
const hexToB64 = (hex) => {
  const buf = Buffer.alloc(4)
  buf.writeUInt32LE(parseInt(hex.replace("0x", ""), 16), 0)
  return buf.toString("base64")
}

// Examples
console.log("Base64 to Hex:")
console.log(`AwgAAA== => ${b64ToHex("AwgAAA==")}`)
console.log(`AwMAAA== => ${b64ToHex("AwMAAA==")}`)
console.log(`AwQAAA== => ${b64ToHex("AwQAAA==")}`)

console.log("\nHex to Base64:")
console.log(`0xa03 => ${hexToB64("0xa03")}`)
console.log(`0xA03 => ${hexToB64("0xA03")}`)
console.log(`0x803 => ${hexToB64("0x803")}`)
console.log(`0x303 => ${hexToB64("0x303")}`)

// Export functions
module.exports = { b64ToHex, hexToB64 }
