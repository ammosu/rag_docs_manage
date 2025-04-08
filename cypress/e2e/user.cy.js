describe('使用者註冊、登入與權限管理', () => {
  const username = 'testuser' + Date.now();
  const email = `${username}@example.com`;
  const password = 'password123';

  it('應該可以註冊新使用者', () => {
    cy.visit('/register');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.contains('註冊成功').should('exist');
  });

  it('應該可以登入', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.contains('登入成功').should('exist');
  });

  it('登入後應可存取個人資料頁', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.visit('/profile');
    cy.contains(username).should('exist');
    cy.contains(email).should('exist');
  });

  it('未登入時存取個人資料應被拒絕', () => {
    cy.clearCookies();
    cy.visit('/profile');
    cy.contains('請先登入').should('exist');
  });
});