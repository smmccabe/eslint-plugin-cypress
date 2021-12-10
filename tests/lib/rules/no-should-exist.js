'use strict'

const rule = require('../../../lib/rules/no-should-exist')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]
const parserOptions = { ecmaVersion: 6 }

ruleTester.run('no-should-exist', rule, {
  valid: [
    { code: 'somethingelse.should("exist")', parserOptions },

    { code: 'cy.get("a").should("not.exist")', parserOptions },
    { code: 'cy.contains("test").should("not.exist")', parserOptions },
    { code: 'cy.get("a").should("be.visible")', parserOptions },
    { code: 'cy.contains("test")', parserOptions },

    // disable the eslint rule
    {
      code: `
        cy.get('a').should('exist'); // eslint-disable-line no-should-exist
      `,
      parserOptions,
    },
    {
      code: `
        /* eslint-disable-next-line no-should-exist */
        cy.get('a').should('exist')
      `,
      parserOptions,
    },
    {
      code: `
        /* eslint-disable no-should-exist */
        cy.get('a').should('exist')
        /* eslint-enable no-should-exist */
      `,
      parserOptions,
    },
  ],

  invalid: [
    { code: 'cy.get("a").should("exist")', parserOptions, errors },
    { code: 'cy.contains("test").should("exist")', parserOptions, errors },
    { code: 'cy.get("a").contains("test").should("exist")', parserOptions, errors },
  ],
})
