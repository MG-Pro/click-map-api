import express from 'express'
import path from 'path'
import readFile from '../utils/readFile.js'

const router = express.Router()

router.get('*', (req, res) => {
  const {version = '🤷'} = readFile(path.resolve('package.json'))

  res.send(`
      <div style="font-family: sans-serif">
        <h1>ClickStream Storage API 🌐</h1> 
        <h2>ver. ${version}</h2>
      </div>`)
})

export default router
