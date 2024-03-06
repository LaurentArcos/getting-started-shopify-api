import { useLocation } from 'react-router-dom';
import { useEffect, useContext } from "react";
import { DataContext } from "../utils/dataContext"; 

const Jacky = () => {
  const location = useLocation();
  const { orders,fetchMetafieldsForProduct,  metafields } = useContext(DataContext);
  const { selectedOrderIds } = location.state || { selectedOrderIds: [] };
  
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  useEffect(() => {
    
    const productIds = selectedOrderIds.flatMap(orderId =>
      orders.find(order => order.id === orderId)?.line_items.map(item => item.product_id) || []
    );
    const uniqueProductIds = [...new Set(productIds)];
    uniqueProductIds.forEach(productId => {
      if (!metafields[productId]) {
        fetchMetafieldsForProduct(productId);
      }
    });
    
  }, [selectedOrderIds, orders, fetchMetafieldsForProduct, metafields]);

  
  const aggregateData = () => {
    let aggregatedItems = {};
    selectedOrderIds.forEach(orderId => {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        order.line_items.forEach(item => {
          const { title, variant_title, quantity, product_id } = item; // Destructure product_id here
          const [size, color] = variant_title.split(' / ');
          const metafieldValue = metafields[product_id] || 'Non spécifié';
  
          // Create a unique key for aggregating items. Note: You might want to consider if metafieldValue should be part of this key since it's fetched asynchronously
          const key = `${title}-${color}-${product_id}`;
  
          // If the aggregated item for this key doesn't exist, initialize it with the product_id, title, color, and an empty sizes object
          if (!aggregatedItems[key]) {
            aggregatedItems[key] = { product_id, title, color, metafieldValue, sizes: {} }; // Include product_id here
          }
  
          // Initialize the size count if it doesn't exist, then increment it by the quantity
          if (!aggregatedItems[key].sizes[size]) aggregatedItems[key].sizes[size] = 0;
          aggregatedItems[key].sizes[size] += quantity;
        });
      }
    });
    return aggregatedItems;
  };

  const items = aggregateData();
  return (
    <div className="jacky">
      
      <table>
        <thead>
          <tr>
            <th colSpan="3"></th>
            <th>Taille</th>
            {sizes.map(size => <th key={size}>{size}</th>)}
            <th>Total</th>
          </tr>
          <tr>
            <th>Ref</th>
            <th>Produit</th>
            <th>Couleur</th>
            <th></th>
            {sizes.map(size => <th key={size}></th>)}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(items).map((key, index) => {
            const item = items[key];
            const totals = sizes.reduce((acc, size) => acc + (item.sizes[size] || 0), 0);
            const metafieldValue = metafields[item.product_id] || 'Non spécifié';

            return (
              <tr key={index}>
                <td>{metafieldValue}</td>
                <td>{item.title}</td>
                <td>{item.color}</td>
                <td></td>
                {sizes.map(size => <td key={size}>{item.sizes[size] || 0}</td>)}
                <td>{totals}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Jacky;
