import BaseDAO from './base-dao.js'

export default class UploadDAO extends BaseDAO {
  constructor({ db }) {
    super(db, 'uploads')
  }
}