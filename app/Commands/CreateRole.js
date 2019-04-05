'use strict'

const { Command } = require('@adonisjs/ace')
const Role = use('Role')
const Database = use('Database')
const roles = use('/../../resources/permission/roles.js')

class CreateRole extends Command {
  static get signature () {
    return 'create:role'
  }

  static get description () {
    return 'Creating roles'
  }

  async handle (args, options) {
    this.info('Start ...')
    try {
      for (let i = 0; i < roles.length; i++){
        await Role.create({
          slug: roles[i].slug,
          name: roles[i].name,
          description: roles[i].description
        })
        this.success(`${roles[i].name} created`)
      }
    } catch (e) {
      this.error(e)
    }

    this.success(`${this.icon('success')} Creating roles success`)
    await Database.close()
  }
}

module.exports = CreateRole
