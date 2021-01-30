const executionResult = require('./executionResult');

const handler = (event, context) => {
  let data;

  try
  {
    data = JSON.parse(event.body);
  } catch (ex)
  {
    return executionResult.failure('JSON unparseable');
  }

  try
  {
    const orders = filterOutNonShiftOMSOrders(data.ORDERS);

    const fulfillment = fulfillmentOrders(orders);
    const cancellation = cancellationOrders(orders);

    return executionResult.success({ fulfillment, cancellation });
  } catch (ex)
  {
    return executionResult.failure('Data does not match schema');
  }
}

const filterOutNonShiftOMSOrders = orders => {
  return orders.filter(order => order.O_ID === order.OMS_ORDER_ID);
}

const fulfillmentOrders = orders => {
  return orders.filter(order => order.ORDER_LINES.some(orderLine => parseInt(orderLine.QUANTITY) > 0));
}

const cancellationOrders = orders => {
  return orders.filter(order => !order.ORDER_LINES.some(orderLine => parseInt(orderLine.QUANTITY) > 0));
}

module.exports = handler
