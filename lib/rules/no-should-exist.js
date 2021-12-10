'use strict'

module.exports = {
  meta: {
    docs: {
      description: 'Prevent using should(\'exist\') which is redundant',
      category: 'Possible Errors',
      recommended: false,
      url: '',
    },
    schema: [],
    messages: {
      unexpected: 'Exist is already checked implicitly',
    },
  },
  create (context) {
    return {
      CallExpression (node) {
        if (isCallingShould(node)) {
          if (isExistsArgument(node)) {
            context.report({ node, messageId: 'unexpected' })
          }
        }
      },
    }
  },
}

function nodeIsCalledByCy (node) {
  if (node.type === 'Identifier' && node.name === 'cy') return true

  if (typeof node.callee === 'undefined' || typeof node.callee.object === 'undefined') {
    return false
  }

  return nodeIsCalledByCy(node.callee.object)
}

function isCallingShould (node) {
  return node.callee.type === 'MemberExpression' &&
         nodeIsCalledByCy(node) &&
         node.callee.property.type === 'Identifier' &&
         node.callee.property.name === 'should'
}

function isExistsArgument (node) {
  return node.arguments.length > 0 &&
         node.arguments[0].type === 'Literal' &&
         node.arguments[0].value === 'exist'
}
