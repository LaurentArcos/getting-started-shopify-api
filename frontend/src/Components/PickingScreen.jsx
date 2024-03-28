import { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DataContext } from "../utils/dataContext";
import { useSessions } from "../utils/sessionContext";
import { useAggregatedData } from "../utils/useAggregatedData";
import { useProblems } from "../utils/problemContext";


const sizesOrder = ["NO SIZE", "XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const PickingScreen = () => {
  const { orders, metafields } = useContext(DataContext);
  const { name } = useParams();
  const { sessions } = useSessions();
  const session = sessions.find(s => decodeURIComponent(name) === s.name);
  const sessionOrderIds = session ? session.orderIds : [];
  const { addProblem, isProblematic } = useProblems();

  const aggregatedData = useAggregatedData(orders, metafields, sessionOrderIds);

  const [flatVariantList, setFlatVariantList] = useState([]);
  useEffect(() => {
    const newList = [];
    aggregatedData.forEach(item => {
      const sortedSizes = Object.entries(item.sizes).sort((a, b) => sizesOrder.indexOf(a[0]) - sizesOrder.indexOf(b[0]));
      sortedSizes.forEach(([size, quantity]) => {
        newList.push({
          ...item,
          size,
          quantity,
        });
      });
    });
    setFlatVariantList(newList);
  }, [aggregatedData]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const goToPreviousVariant = () => setCurrentIndex(prevIndex => Math.max(0, prevIndex - 1));
  const goToNextVariant = () => setCurrentIndex(prevIndex => Math.min(flatVariantList.length - 1, prevIndex + 1));

  const currentVariant = flatVariantList[currentIndex] || {};

  const handleProblemClick = () => {
    addProblem({
      sku: currentVariant.sku,
      size: currentVariant.size,
    });
    goToNextVariant();
  };

  return (
    <div className="picking-screen">
      <Link to="/sessions" className="back-link">Retour vers la liste des sessions</Link>
      <div className="navigation-buttons">
        <button className="navigation-button" onClick={goToPreviousVariant} disabled={currentIndex === 0}>←</button>
        <span className="variant-index">{currentIndex + 1} / {flatVariantList.length}</span>
        <button className="navigation-button" onClick={goToNextVariant} disabled={currentIndex >= flatVariantList.length - 1}>→</button>
      </div>
      <div className="variant-details" style={{ color: isProblematic(currentVariant.sku, currentVariant.size) ? 'red' : 'inherit' }}>
        <h1>{currentVariant.product}</h1>
        <h2 className="metafield">{currentVariant.metafield}</h2>
        <p className="color">{currentVariant.color}</p>
        <p className="size">{currentVariant.size}</p>
        <p className="quantity">x {currentVariant.quantity}</p>
      </div>
      <div className="validation-buttons">
      <button className="problem-button" onClick={handleProblemClick}>Problème</button>
        <button className="validation-button" onClick={goToNextVariant}>OK</button>
      </div>
    </div>
  );
};

export default PickingScreen;
