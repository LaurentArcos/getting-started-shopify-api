import { useEffect, useContext, useState } from "react";
import { DataContext } from "../utils/dataContext";
import { useSessionSelection } from '../utils/sessionSelectionContext';
import { useSessions } from "../utils/sessionContext";

const PreparationAndDetails = () => {
  const { sessions } = useSessions();
  const { selectedPickingSessionId, selectSession } = useSessionSelection();
  const { orders, metafields, fetchMetafieldsForProduct } = useContext(DataContext);
  const [displayData, setDisplayData] = useState([]);
  const sizes = ["NO SIZE", "XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  useEffect(() => {
    const currentSessionOrders = selectedPickingSessionId
      ? sessions.find(session => session.id === selectedPickingSessionId)?.orderIds.map(orderId => orders.find(order => order.id === orderId)).filter(order => order)
      : [];

    const loadMetafields = async () => {
      const promises = currentSessionOrders.flatMap(order => 
        order.line_items.map(item => {
          if (!metafields[item.product_id]) {
            return fetchMetafieldsForProduct(item.product_id);
          }
          return Promise.resolve();
        })
      );
      await Promise.all(promises);
      aggregateOrders(currentSessionOrders);
    };

    loadMetafields();
  }, [selectedPickingSessionId, sessions, orders, metafields, fetchMetafieldsForProduct]);

  const aggregateOrders = (currentSessionOrders) => {
    let aggregated = {};
    currentSessionOrders.forEach(order => {
      order.line_items.forEach(({ product_id, variant_title, quantity, title }) => {
        const [size, color] = variant_title.split(' / ');
        const metafieldValue = metafields[product_id] || 'Non spécifié';
        const key = `${product_id}-${metafieldValue}`;

        if (!aggregated[key]) {
          aggregated[key] = {
            ref: metafieldValue,
            title: title,
            colors: {},
          };
        }

        if (!aggregated[key].colors[color]) {
          aggregated[key].colors[color] = { sizeCounts: {}, total: 0 };
        }

        let colorData = aggregated[key].colors[color];
        colorData.sizeCounts[size] = (colorData.sizeCounts[size] || 0) + quantity;
        colorData.total += quantity;
      });
    });

    setDisplayData(Object.values(aggregated).map(({ ref, title, colors }) => ({
      ref,
      title,
      colors: Object.entries(colors).map(([color, data]) => ({
        color,
        ...data,
      })),
    })).sort((a, b) => a.ref.localeCompare(b.ref)));
  };

  const handleSessionChange = (e) => {
    selectSession(e.target.value);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="orders-title">
        <label htmlFor="sessionSelect">Session: </label>
        <select className="sessionSelect" value={selectedPickingSessionId || ''} onChange={handleSessionChange}>
          <option value="">Choisir une session</option>
          {sessions.map(session => (
            <option key={session.id} value={session.id}>{session.name}</option>
          ))}
        </select>
      </div>
      <div className='print-button'>
        <button onClick={handlePrint}>Imprimer</button>
      </div>
  
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
            {sizes.map((size, index) => <th key={`size-header-${index}`}></th>)}
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
  {displayData.map(({ ref, title, colors }, index) => (
    colors.map((color, colorIndex) => (
      <tr key={`${index}-${colorIndex}`}>
        {colorIndex === 0 && <td rowSpan={colors.length}>{ref}</td>}
        {colorIndex === 0 && <td rowSpan={colors.length}>{title}</td>}
        <td colSpan="2">{color.color}</td>
        {["NO SIZE","XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"].map(size => (
          <td key={size}>{color.sizeCounts[size] || 0}</td>
        ))}
        <td>{color.total}</td>
      </tr>
    ))
  ))}
</tbody>
      </table>
    </div>


  );
};

export default PreparationAndDetails;
