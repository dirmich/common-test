const ROLES = {
  admin: ['view:comment', 'create:comment', 'update:comment', 'delete:comment'],
  moderator: ['view:comment', 'create:comment', 'delete:comment'],
  user: ['view:comment', 'create:comment'],
}

const hasPermission = (role, permission) => {
  // return ROLES[role] ? ROLES[role].includes(permission) : false
  return ROLES[role]?.includes(permission) ?? false
}

console.log('admin', hasPermission('admin', 'delete:comment'))
console.log('admin2', hasPermission('admin2', 'delete:comment'))
console.log('moderator', hasPermission('moderator', 'delete:comment'))
console.log('user', hasPermission('user', 'delete:comment'))
