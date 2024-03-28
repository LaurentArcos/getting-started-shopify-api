import { useContext, useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { DataContext } from "../utils/dataContext";
import { useSessions } from "../utils/sessionContext";


const PickingScreen = () => {
  const { orders, metafields } = useContext(DataContext);
  const { name } = useParams();
  const { sessions } = useSessions();
  const session = useMemo(() => sessions.find(s => s.name === decodeURIComponent(name)), [sessions, name]);
  const sessionId = session ? session.id : '';

  const [variants, setVariants] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!session) return;

    const sessionOrders = orders.filter(order => session.orderIds.includes(order.id));

    let skuVariants = [];
    sessionOrders.forEach(order => {
      order.line_items.forEach(item => {
        
        const sku = item.sku;
        const metaValue = metafields[item.product_id] || 'Non spécifié';

        const variantIndex = skuVariants.findIndex(v => v.sku === sku);
        if (variantIndex === -1) {
          skuVariants.push({
            sku,
            product_id: item.product_id,
            variant_id: item.variant_id,
            title: item.title,
            color: item.variant_title.split(' / ')[1],
            size: item.variant_title.split(' / ')[0],
            quantity: item.quantity,
            metafieldValue: metaValue,
          });
        } else {
          skuVariants[variantIndex].quantity += item.quantity;
        }
      });
    });

    setVariants(skuVariants);
  }, [session, orders, metafields]);

  const goToPreviousVariant = () => setCurrentIndex(prevIndex => Math.max(0, prevIndex - 1));
  const goToNextVariant = () => setCurrentIndex(prevIndex => Math.min(variants.length - 1, prevIndex + 1));

  const currentVariant = variants[currentIndex];

  return (
    <div className="picking-screen">
      <Link to={`/sessions/details/${sessionId}`} className="back-link">Retour vers détails de la session</Link>
      <div className="navigation-buttons">
        <button className="navigation-button" onClick={goToPreviousVariant} disabled={currentIndex === 0}>←</button>
        <span className="variant-index">{currentIndex + 1} / {variants.length}</span>
        <button className="navigation-button" onClick={goToNextVariant} disabled={currentIndex === variants.length - 1}>→</button>
      </div>
      {currentVariant && (
        <div className="variant-details">
          <h1>{currentVariant.title}</h1>
          <h2 className="metafield">{currentVariant.metafieldValue}</h2>
          <p className="color">{currentVariant.color}</p>
          <p className="size">Taille {currentVariant.size}</p>
          <p className="quantity">x {currentVariant.quantity}</p>
        </div>
      )}
      <div className="validation-buttons">
        <button className="problem-button" onClick={goToNextVariant}>Problème</button>
        <button className="validation-button" onClick={goToNextVariant}>OK</button>
      </div>
    </div>
  );
};

export default PickingScreen;