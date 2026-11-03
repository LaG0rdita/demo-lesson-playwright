import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { faker } from '@faker-js/faker/locale/en'
import { PASSWORD, USERNAME } from '../../config/env-data'

let loginPage: LoginPage

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page)
  await loginPage.open()
})

test('signIn button disabled when incorrect data inserted', async ({}) => {
  await loginPage.usernameField.fill(faker.lorem.word(2))
  await loginPage.passwordField.fill(faker.lorem.word(7))
  await expect(loginPage.signInButton).toBeDisabled()
})

test('error message displayed when incorrect credentials used (username-input-error)', async ({}) => {
  // implement test
})

test('login with correct credentials and verify order creation page', async ({}) => {
  // verify at least few elements on the order creation page
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)
  await expect(orderCreationPage.statusButton).toBeVisible()
  await expect(orderCreationPage.usernameInput).toBeVisible()
  await expect(orderCreationPage.phoneInput).toBeVisible()
  await expect(orderCreationPage.commentInput).toBeVisible()
  await expect(orderCreationPage.createOrderButton).toBeVisible()
})

test('login and create order', async ({}) => {
  // implement test
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)
  //let's create an order
  await orderCreationPage.usernameInput.fill('random-user')
  await orderCreationPage.phoneInput.fill('00000000')
  await orderCreationPage.commentInput.fill('nearby')
  await orderCreationPage.createOrderButton.click()
  //now verify success message
  await expect(orderCreationPage.successMessage).toBeVisible()
})

test('check errors on order creation', async ({}) => {
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)
  //let's create an order
  await orderCreationPage.usernameInput.fill('a')
  await orderCreationPage.phoneInput.fill('00000')
  await orderCreationPage.commentInput.fill('nearby')
  //checks
  await expect(orderCreationPage.createOrderButton).toBeDisabled()
  //now verify error message
  await expect(orderCreationPage.customerNameError).toBeVisible()
  await expect(orderCreationPage.phoneError).toBeVisible()
})

test('logout from order page', async ({}) => {
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)
  //logout
  await orderCreationPage.logoutButton.click()

  //checks
  await expect(loginPage.signInButton).toBeVisible()
  await expect(orderCreationPage.logoutButton).toBeHidden()
  //URL
  //await expect(loginPage.url).toContain('signin')
  console.log(loginPage.page.url())
  //expect(loginPage.page.url()).toContain('signin')
})

test('order not found page', async ({}) => {
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)
  //search for order
  await orderCreationPage.statusButton.click()
  //fill order number
  await orderCreationPage.searchOrderInput.fill('20000')
  await orderCreationPage.searchOrderButton.click()

  //checks
  await expect(orderCreationPage.orderNotFoundText).toBeVisible()
  await expect(orderCreationPage.orderNotFoundImage).toBeVisible()
})

//tracking number 20613
test('order found page', async ({}) => {
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)
  //search for order
  await orderCreationPage.statusButton.click()
  //fill order number
  await orderCreationPage.searchOrderInput.fill('20613')
  await orderCreationPage.searchOrderButton.click()

  //checks
  await expect(orderCreationPage.orderStatusOpen).toBeVisible()
  await expect(orderCreationPage.orderNameDetails).toBeVisible()
})
