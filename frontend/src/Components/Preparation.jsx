import { useEffect, useContext, useState } from "react";
import { DataContext } from "../utils/dataContext";
import { useSessionSelection } from '../utils/sessionSelectionContext';
import { useSessions } from "../utils/sessionContext";
import { useNavigate } from 'react-router-dom';
// import { useProblems } from "../utils/ProblemContext";

const Preparation = () => {
  // const { isItemProblematic } = useProblems();
  const { sessions } = useSessions();
  const { selectedPickingSessionId, selectSession } = useSessionSelection();
  const { orders, metafields, fetchMetafieldsForProduct } = useContext(DataContext);
  const [displayData, setDisplayData] = useState([]);
  const sizes = ["NO SIZE", "XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const navigate = useNavigate();


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
      aggregateData(currentSessionOrders); // Utilisez cette fonction pour l'agrégation basée sur le SKU
    };
  
    loadMetafields();
  }, [selectedPickingSessionId, sessions, orders, metafields, fetchMetafieldsForProduct]);
  
  const aggregateData = (orders) => {
    const aggregatedData = {};
  
    orders.forEach(order => {
      order.line_items.forEach(item => {
        const { sku, product_id, title, quantity } = item;
        const [size, color] = item.variant_title.split(' / ');
        const metafieldValue = metafields[product_id] || 'Non spécifié';
        // Utilisation d'une clé combinée de metafield et de titre pour le regroupement
        const key = `${metafieldValue}-${title}-${color}`;
  
        if (!aggregatedData[key]) {
          aggregatedData[key] = {
            metafield: metafieldValue,
            product: title,
            color: color,
            sizes: {},
            sku, // Stocker le SKU si nécessaire pour l'affichage
            rowSpan: 0, // Utilisé pour le "rowSpan" dans le rendu
          };
        }
  
        // Ajout ou mise à jour de la quantité pour la taille spécifique
        aggregatedData[key].sizes[size] = (aggregatedData[key].sizes[size] || 0) + quantity;
      });
    });
  
    // Conversion en tableau pour le rendu et calcul du rowSpan
    const sortedData = Object.values(aggregatedData).sort((a, b) => a.metafield.localeCompare(b.metafield) || a.product.localeCompare(b.product));
  
    // Calcul du rowSpan (nombre de lignes partageant le même metafield et produit)
    const metafieldProductCounts = {};
    sortedData.forEach(item => {
      const groupKey = `${item.metafield}-${item.product}`;
      if (!metafieldProductCounts[groupKey]) {
        metafieldProductCounts[groupKey] = 1;
      } else {
        metafieldProductCounts[groupKey]++;
      }
    });
  
    // Assigner le rowSpan à chaque item
    sortedData.forEach(item => {
      const groupKey = `${item.metafield}-${item.product}`;
      item.rowSpan = metafieldProductCounts[groupKey];
    });
  
    setDisplayData(sortedData);
  };
  
  const handleSessionChange = (e) => {
    selectSession(e.target.value);
  };

  const handlePrint = () => {

    window.print();
    
  };

  const handleStartPickingClick = () => {
    const selectedSession = sessions.find(session => session.id === selectedPickingSessionId);
    const sessionName = selectedSession ? selectedSession.name : '';

    navigate(`/sessions/picking/${encodeURIComponent(sessionName)}`);
  };

  return (
    <div id="printableArea">
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
      
        <button onClick={handleStartPickingClick}>Démarrer Picking</button>
       </div>
      <table className="table-preparation">
      <thead>
  <tr>
    <th>Ref</th>
    <th>Produit</th>
    <th>Couleur</th>
    {sizes.map((size, index) => <th key={`size-header-${index}`}>{size}</th>)}
    <th>Total</th>
  </tr>
</thead>
<tbody>
  {displayData.map((item, index) => {
    const isFirstOfGroup = index === 0 || displayData[index - 1].metafield !== item.metafield || displayData[index - 1].product !== item.product;
    return (
      <tr key={index}>
        {isFirstOfGroup && <td rowSpan={item.rowSpan}>{item.metafield}</td>}
        {isFirstOfGroup && <td rowSpan={item.rowSpan}>{item.product}</td>}
        <td className="size-column">{item.color}</td>
        {sizes.map((size) => (
          <td key={size} className="size-column">{item.sizes[size] || ''}</td>
        ))}
        <td className="size-column">{Object.values(item.sizes).reduce((acc, qty) => acc + qty, 0)}</td>
      </tr>
    );
  })}
</tbody>
      </table>
    </div>

  );
};

export default Preparation;
