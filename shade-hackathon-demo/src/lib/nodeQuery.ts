const LCD_ENDPOINT = 'https://lcd.secret.express'


export async function getScrtSupply() {
  const response = await fetch(LCD_ENDPOINT+'/cosmos/bank/v1beta1/supply/uscrt')
  const amountJson = await response.json()
  console.log(amountJson)
  return (Number(amountJson.amount.amount)/(10**6)).toString();
}