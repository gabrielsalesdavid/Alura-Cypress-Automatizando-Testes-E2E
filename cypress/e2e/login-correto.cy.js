describe('Página de Cadastro', () => {
    beforeEach(() => {
    cy.visit('https://adopet-frontend-cypress.vercel.app/');
    cy.get('[data-test="login-button"]').click();
    })
  it('Deve preencher os campos de login corretamente e autenticar o usuário na página', () => {
    cy.get('[data-test="input-loginEmail"]').type('maria@gmail.com');
    cy.get('[data-test="input-loginPassword"]').type('Senha123');
    cy.get('[data-test="submit-button"]').click();
  })
})