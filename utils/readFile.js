import fs from 'fs'

export default (filepath, encoding = 'utf8') => {
  try {
    return JSON.parse(fs.readFileSync(filepath, {encoding}))
  } catch (e) {
    return {}
  }
}
