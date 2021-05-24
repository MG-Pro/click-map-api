import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'
import config from '../config/analize.js'
import dataModel from './dataModel.js'

class UserModel extends AbstractModel {
  async getByVisitorId(visitorId) {
    const sqlSelect = `
        SELECT *
        FROM visitors
        WHERE visitor_id = "${visitorId}"`
    const result = await this.query(sqlSelect)
    return result[0]
  }

  async add(visitorId) {
    const sqlInsert = `
        INSERT INTO visitors(visitor_id)
        VALUES ("${visitorId}")`
    await this.query(sqlInsert)
    return this.getLastId()
  }

  async getList(minTransCount = 100) {
    const sqlSelect = `
        SELECT v.id, COUNT(a.visitor_id) AS trans_count, v.create_date
        FROM visitors v
                 INNER JOIN transitions a ON v.id = a.visitor_id
        GROUP BY v.id
        HAVING trans_count >= ${minTransCount}
        ORDER BY trans_count DESC`

    return await this.query(sqlSelect)
  }

  async getAllSessions(idType = false, stringifySessions = true) {
    const sqlSelect = 'SELECT visitor_id, timestamp, url, url_id FROM transitions'
    const transitions = await this.query(sqlSelect) || []

    let pages
    if (idType) {
      const sqlPagesSelect = 'SELECT * FROM pages'
      pages = await this.query(sqlPagesSelect) || []
    }

    const visitors = await this.getList()
    const sessions = []

    return visitors.map((v) => {
      const visitorSessions = transitions.reduce((acc, t) => {
        if (t.visitor_id === v.id) {
          const currentT = sessions[sessions.length - 1] || t
          const delay = +(t.timestamp) - +(currentT.timestamp)

          if (delay < config.sessionMaxInterval) {
            if (sessions[sessions.length - 1]?.url_id !== t.url_id) {
              // const d = new Date(+t.timestamp)
              sessions.push({
                ...t,
                // date: d.toLocaleDateString() + ' ' + d.toLocaleTimeString(),
              })
            }
          } else {
            if (sessions.length >= config.sessionMinLength) {
              const resultSessions = idType && pages?.length
                ? sessions.map(({url_id: urlId}) => pages.find((page) => page.id === urlId)?.id)
                : [...sessions]

              const result = {
                length: resultSessions.length,
                items: idType && stringifySessions ? resultSessions.join('~') : resultSessions,
              }

              const index = sessions.findIndex(({url}) => url.includes(config.targetUrlFragment))
              result.targetIndex = index >= 0 ? index : null

              acc.push(result)
            }
            sessions.length = 0
          }
        }
        return acc
      }, [])

      return {
        visitor_id: v.id,
        session_count: visitorSessions.length,
        sessions: visitorSessions,
      }
    })
  }

  async flatSections() {
    const visitors = await this.getAllSessions()
    // const reduceMap = dataModel.transitionReduceMap()

    const vs = visitors.reduce((acc, visitor) => {
      visitor.sessions.forEach((session) => {
        if (session.items.length > config.sessionMaxLength) {
          return acc
        }

        const result = {
          VisitorId: visitor.visitor_id,
          Class: session.targetIndex ? config.targetClassId : config.anotherClassId,
        }

        session.items.forEach((transition, ti) => {
          const step = `Step${ti + 1}`
          result[step] = transition.url_id
        })

        acc.push(result)
      })

      return acc
    }, [])

    return this.fillEmptyTrans(vs)
  }

  fillEmptyTrans(sessions, filler = null) {
    sessions.forEach((row) => {
      const rowLength = Object.keys(row).length - 1
      if (rowLength < config.sessionMaxLength) {
        const gap = config.sessionMaxLength - rowLength
        for (let i = 1; i <= gap; i++) {
          const step = `Step${rowLength + i}`
          row[step] = filler
        }
      }
    })

    return sessions
  }

  getTransitionGroup(transition, reduceMap) {
    const group = Object.entries(reduceMap).find(([key, val]) => {
      if (val === 'main') {
        const regExp = new RegExp(key, 'i')
        return regExp.test(transition.url)
      }
      return transition.url.includes(key)
    })
    return group[1]
  }
}

export default new UserModel(db.pool)
