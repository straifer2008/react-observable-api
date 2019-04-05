module.exports = [
  {
    role: {
      name: 'Admin',
      slug: 'admin'
    },
    permissions: {
      slug: 'adminPermission',
      actions: ['read', 'create', 'update', 'delete']
    }
  },
  {
     role: {
       name: 'User',
       slug: 'user'
     },
     permissions: {
       slug: 'userPermission',
       actions: ['read']
     }
   },
]
