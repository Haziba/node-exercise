const handler = (event, context) => {
  const data = JSON.parse(event.body);

  data.ORDERS = data.ORDERS.filter(order => order.O_ID === order.OMS_ORDER_ID);

  return data;
}

module.exports = handler
