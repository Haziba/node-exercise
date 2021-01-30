const fs = require('fs')
const handler = require('./handler')

const event = {
  body: fs.readFileSync('./fixtures/shipments.json', 'utf8')
}

const context = {
  accountReference: 'acme'
}

describe('Handler', () => {
  it('Only returns Shift OMS orders', () => {
    const data = handler(event, context);

    const allOrders = Object.keys(data).flatMap(key => data[key])

    expect(allOrders.length).toEqual(2);

    const [order1, order2] = allOrders;

    expect(order1.O_ID).toBe(order1.OMS_ORDER_ID);
    expect(order2.O_ID).toBe(order2.OMS_ORDER_ID);
  })

  it('Classes an order as cancelled if the order lines are all for 0 quantity', () => {
    const { _, cancellation } = handler(event, context);

    const [cancelledOrder] = cancellation;

    const orderLineQuantities = cancelledOrder.ORDER_LINES.map(orderLine => parseInt(orderLine.QUANTITY));

    expect(Math.max.apply(this, orderLineQuantities)).toBe(0);
  })

  it('Classes an order as fulfillment if any order line is for more than 0 quantity', () => {
    const { fulfillment, _ } = handler(event, context);

    const [fulfillmentOrder] = fulfillment;

    const orderLineQuantities = fulfillmentOrder.ORDER_LINES.map(orderLine => parseInt(orderLine.QUANTITY));

    expect(Math.max.apply(this, orderLineQuantities)).toBeGreaterThanOrEqual(1);
  })
})