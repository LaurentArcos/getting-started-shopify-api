import React, { useEffect, useState } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/orders')
      .then(response => response.json())
      .then(data => {
        setOrders(data.orders || []);
      })
      .catch(error => console.error('Error fetching orders:', error));
  }, []);

  const toggleOrderDetails = (id) => {
    setExpandedOrderId(prevState => prevState === id ? null : id);
  };

  const handleFulfillmentChange = (orderId, isChecked) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, fulfillment_status: isChecked ? 'fulfilled' : '' };
      }
      return order;
    });

    setOrders(updatedOrders);
  };

  const filteredOrders = orders.filter(order => order.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <div className='search'>
        <input
          type="number"
          placeholder="Rechercher par numéro de commande"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredOrders.length > 0 ? (
        <div>
          {filteredOrders.map((order) => (
            <React.Fragment key={order.id}>
              <div className='order' onClick={() => toggleOrderDetails(order.id)}>
                <div className="order-info">
                  <div className='order-id'><strong>{order.name}</strong> (id:{order.id})</div>
                  <div className="customer-name">{order.customer.first_name} {order.customer.last_name}</div>
                </div>
                <div className='order-status'>
                  {order.fulfillment_status === 'fulfilled' && (
                    <img src={`./check.png`} alt="Fulfilled" style={{ width: '40px', marginRight: '20px' }} />
                  )}
                  <div className="order-meta">
                    <div className="order-price">{order.current_subtotal_price} €</div>
                    <div className="order-date">{new Date(order.created_at).toLocaleString()}</div>
                  </div>
                </div>
              </div>
              {expandedOrderId === order.id && (
                <div className='order-details'>
                  <div className='order-label'>
                    <input 
                      type="checkbox" 
                      checked={order.fulfillment_status === 'fulfilled'} 
                      onChange={(e) => handleFulfillmentChange(order.id, e.target.checked)} 
                    /> Marquer comme traitée
                  </div>
                  <div className='order-items'>
                    {order.line_items.map((item) => (
                      <div className='item' key={item.id}>
                        <div className='item-name'>{item.title} - qté : {item.quantity}</div>
                        <div className='item-sizeandcolor'>{item.variant_title}</div>
                        <div className='item-details'>
                          <span className='item-sku'>(sku: {item.sku})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <p>Aucune commande trouvée</p>
      )}
    </div>
  );
};

export default Orders;
