import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'
import config from '../config/analize.js'

class ServicesModel extends AbstractModel {
  async updateOsVers() {
    const sqlSelect = 'SELECT id, os_ver FROM transitions'
    const transitions = await this.query(sqlSelect) || []
    for (const transition of transitions) {
      if (!await this.getOsVersion(transition.os_ver)) {
        await this.saveOsVersion(transition.os_ver)
      }
    }
    return true
  }

  async cleanUrls() {
    const sqlSelect = 'SELECT * FROM pages'

    const pages = await this.query(sqlSelect) || []

    for (const page of pages) {
      if (page.url.includes(config.host)) {
        continue
      }

      const sqlDelete = `
          DELETE
          FROM pages
          WHERE id = ${page.id}`
      await this.query(sqlDelete)
    }
  }

  async cleanTransitions() {
    const sqlSelect = 'SELECT id, url, url_id FROM transitions'
    const transitions = await this.query(sqlSelect) || []

    for (const transition of transitions) {
      if (!transition.url_id) {
        let id = await this.getPageURL(transition.url)
        if (!id) {
          id = await this.savePageURL(transition.url)
        }

        const sqlUpdate = `
            UPDATE transitions
            SET url_id = ${id}
            WHERE id = ${transition.id}`
        await this.query(sqlUpdate)
      }
    }
  }
}

export default new ServicesModel(db.pool)
