const handler = (event, context) => {
  const data = JSON.parse(event.body);

  const orders = filterOutNonShiftOMSOrders(data.ORDERS);

  const fulfillment = fulfillmentOrders(orders);
  const cancellation = cancellationOrders(orders);

  return { fulfillment, cancellation };
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
