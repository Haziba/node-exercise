const fs = require('fs')
const handler = require('./handler')

const event = {
  body: fs.readFileSync('./fixtures/shipments.json', 'utf8')
}

const context = {
  accountReference: 'acme'
}

describe('Handler', () => {
  it('Parses the event data into JSON', () => {
    const data = handler(event, context)

    const { ORDERS: orders } = data

    expect(orders.length).toBeGreaterThanOrEqual(1)

    const [order] = orders
    expect(typeof order.O_ID).toBe('string');
  })

  it('Only returns Shift OMS orders', () => {
    const data = handler(event, context);

    const { ORDERS: orders } = data;

    expect(orders.length).toEqual(2);

    const [order1, order2] = orders;

    expect(order1.O_ID).toBe(order1.OMS_ORDER_ID);
    expect(order2.O_ID).toBe(order2.OMS_ORDER_ID);
  })
})