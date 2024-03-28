import { useContext, useEffect } from "react";
import { DataContext } from "../utils/dataContext";
import { useSessionSelection } from '../utils/sessionSelectionContext';
import { useSessions } from "../utils/sessionContext";
import { useNavigate } from 'react-router-dom';
import { useAggregatedData } from '../utils/useAggregatedData';
import { useProblems } from "../utils/problemContext";

const Preparation = () => {
  const { sessions } = useSessions();
  const { selectedPickingSessionId, selectSession } = useSessionSelection();
  const { orders, metafields, fetchMetafieldsForProduct, } = useContext(DataContext);
  const navigate = useNavigate();
  const { problems } = useProblems();

  const session = sessions.find(session => session.id === selectedPickingSessionId);
  const sessionOrderIds = session ? session.orderIds : [];
  
  useEffect(() => {
    sessionOrderIds.forEach(orderId => {
      const order = orders.find(order => order.id === orderId);
      order.line_items.forEach(async (item) => {
        if (!metafields[item.product_id]) {
          await fetchMetafieldsForProduct(item.product_id);
        }
      });
    });
  }, [sessionOrderIds, orders, metafields, fetchMetafieldsForProduct]);

  const displayData = useAggregatedData(orders, metafields, sessionOrderIds);

  const handleSessionChange = (e) => {
    selectSession(e.target.value);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleStartPickingClick = () => {
    if (session) {
      navigate(`/sessions/picking/${encodeURIComponent(session.name)}`);
    }
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
            {["NO SIZE", "XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"].map(size => <th key={size}>{size}</th>)}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
        {displayData.map((item, index) => {
          const isFirstOfGroup = index === 0 || displayData[index - 1].metafield !== item.metafield || displayData[index - 1].product !== item.product;
          return (
            <tr key={index} >
                {isFirstOfGroup && <td rowSpan={item.rowSpan}>{item.metafield}</td>}
                {isFirstOfGroup && <td rowSpan={item.rowSpan}>{item.product}</td>}
              <td className="size-column">{item.color}</td>
              {["NO SIZE", "XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"].map(size => {
                  const isProblematicVariant = problems.some(problem => problem.sku === item.sku && problem.size === size);
                  return (
                    <td key={size} style={{ backgroundColor: isProblematicVariant ? 'red' : 'white' }} className="size-column">
                      {item.sizes[size] || ''}
                    </td>
                  );
                })}
              <td className="size-column" >{Object.values(item.sizes).reduce((acc, qty) => acc + qty, 0)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Preparation;
