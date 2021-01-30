const fs = require('fs')
const handler = require('./handler')

const validEvent = {
  body: fs.readFileSync('./fixtures/shipments.json', 'utf8')
}

const invalidJsonEvent = {
  body: fs.readFileSync('./fixtures/invalidJson.txt', 'utf8')
}

const invalidSchemaEvent = {
  body: fs.readFileSync('./fixtures/invalidSchema.json', 'utf8')
}

const context = {
  accountReference: 'acme'
}

describe('Handler', () => {
  it('Only returns Shift OMS orders', () => {
    const result = handler(validEvent, context);

    expect(result.success).toBe(true);

    const allOrders = Object.keys(result.data).flatMap(key => result.data[key])

    expect(allOrders.length).toEqual(2);

    const [order1, order2] = allOrders;

    expect(order1.O_ID).toBe(order1.OMS_ORDER_ID);
    expect(order2.O_ID).toBe(order2.OMS_ORDER_ID);
  })

  it('Classes an order as cancelled if the order lines are all for 0 quantity', () => {
    const result = handler(validEvent, context);

    expect(result.success).toBe(true);

    const [cancelledOrder] = result.data.cancellation;

    const orderLineQuantities = cancelledOrder.ORDER_LINES.map(orderLine => parseInt(orderLine.QUANTITY));

    expect(Math.max.apply(this, orderLineQuantities)).toBe(0);
  })

  it('Classes an order as fulfillment if any order line is for more than 0 quantity', () => {
    const result = handler(validEvent, context);

    expect(result.success).toBe(true);

    const [fulfillmentOrder] = result.data.fulfillment;

    const orderLineQuantities = fulfillmentOrder.ORDER_LINES.map(orderLine => parseInt(orderLine.QUANTITY));

    expect(Math.max.apply(this, orderLineQuantities)).toBeGreaterThanOrEqual(1);
  })

  it('Throws an exception when invalid JSON is passed through', () => {
    const result = handler(invalidJsonEvent, context);

    expect(result.success).toBe(false);
    expect(result.error).toBe('JSON unparseable');
  })

  it('Throws an exception when the data does not match the schema', () => {
    const result = handler(invalidSchemaEvent, context);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Data does not match schema');
  })
})