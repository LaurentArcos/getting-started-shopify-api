import { useContext, useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { DataContext } from "../utils/dataContext";
import { useSessions } from "../utils/sessionContext";

const PickingScreen = () => {
  const { orders, metafields } = useContext(DataContext);
  const { name } = useParams();
  const { sessions } = useSessions();
  const session = useMemo(() => sessions.find(s => s.name === name), [sessions, name]);
  const sessionId = session ? session.id : '';

  const [variants, setVariants] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sizeOrder = ["NO SIZE", "XXXS", "XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  useEffect(() => {
    const sessionOrders = session ? orders.filter(order => session.orderIds.includes(order.id)) : [];

    let productVariants = [];
    sessionOrders.forEach(order => {
      order.line_items.forEach(item => {
        const metaValue = metafields[item.product_id] || 'Non spécifié';
        const variantKey = `${item.product_id}-${item.variant_id}-${metaValue}`;

        const variantIndex = productVariants.findIndex(variant => variant.key === variantKey);
        if (variantIndex === -1) {
          productVariants.push({
            key: variantKey,
            title: item.title,
            color: item.variant_title.split(' / ')[1],
            size: item.variant_title.split(' / ')[0],
            quantity: item.quantity,
            metafieldValue: metaValue,
          });
        } else {
          productVariants[variantIndex].quantity += item.quantity;
        }
      });
    });

    productVariants.sort((a, b) => 
      a.metafieldValue.localeCompare(b.metafieldValue) || 
      a.title.localeCompare(b.title) || 
      a.color.localeCompare(b.color) || 
      sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size)
    );
    setVariants(productVariants);
  }, []);

  const goToPreviousVariant = () => setCurrentIndex(prevIndex => Math.max(0, prevIndex - 1));
  const goToNextVariant = () => setCurrentIndex(prevIndex => Math.min(variants.length - 1, prevIndex + 1));

  const currentVariant = variants[currentIndex];

  return (
    <div className="picking-screen">
      <Link to={`/sessions/details/${sessionId}`} className="back-link">Retour vers détails de la session</Link>
      <div className="navigation-buttons">
        <button onClick={goToPreviousVariant} disabled={currentIndex === 0} className="navigation-button">←</button>
        <span className="variant-index">{currentIndex + 1} / {variants.length}</span>
        <button onClick={goToNextVariant} disabled={currentIndex === variants.length - 1} className="navigation-button">→</button>
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
        <button onClick={goToPreviousVariant} className="problem-button">Problème</button>
        <button onClick={goToNextVariant} className="validation-button">OK</button>
      </div>
    </div>
  );
};

export default PickingScreen;
