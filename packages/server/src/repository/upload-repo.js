import BaseRepository from './base-repo.js'

export default class UploadRepository extends BaseRepository {
  constructor({ uploadDao }) {
    super(uploadDao)
    this.uploadDao = uploadDao
  }
}