import { useEffect, useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { DataContext } from "../utils/dataContext";

const Jacky = () => {
  const location = useLocation();
  const { orders, fetchMetafieldsForProduct, metafields } = useContext(DataContext);
  const { selectedOrderIds, sessionName } = location.state || { selectedOrderIds: [], sessionName: '' };
  const [displayData, setDisplayData] = useState([]);

  const sizes = ["NO SIZE","XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  useEffect(() => {
    // Assurez-vous que tous les metafields nécessaires sont chargés.
    const loadMetafields = async () => {
      let needsFetching = false;
      selectedOrderIds.forEach(orderId => {
        const order = orders.find(o => o.id === orderId);
        order.line_items.forEach(item => {
          if (!metafields[item.product_id]) {
            needsFetching = true;
            fetchMetafieldsForProduct(item.product_id);
          }
        });
      });
      if (needsFetching) {
        // Un petit délai pour simuler l'attente du chargement
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    };

    loadMetafields().then(() => {
      const aggregatedData = aggregateOrders();
      setDisplayData(aggregatedData);
    });
  }, [orders, metafields, selectedOrderIds, fetchMetafieldsForProduct]);

  // Aggregate orders into a structured format for easy rendering
  const aggregateOrders = () => {
    let aggregated = {};
    selectedOrderIds.forEach(orderId => {
      const order = orders.find(o => o.id === orderId);
      order.line_items.forEach(({ product_id, variant_title, quantity, title }) => {
        const [size, color] = variant_title.split(' / ');
        const metafieldValue = metafields[product_id] || 'Non spécifié';
        // Clé unique par combinaison de produit et référence
        const key = `${product_id}-${metafieldValue}`;
  
        // Assurez-vous que nous initialisons correctement l'agrégat pour chaque produit
        if (!aggregated[key]) {
          aggregated[key] = {
            ref: metafieldValue,
            title: title, // Ajouter le titre ici
            colors: {},
          };
        }
  
        // Initialiser ou mettre à jour les données de couleur
        if (!aggregated[key].colors[color]) {
          aggregated[key].colors[color] = { sizeCounts: {}, total: 0 };
        }
  
        // Mettre à jour les quantités par taille et le total
        let colorData = aggregated[key].colors[color];
        colorData.sizeCounts[size] = (colorData.sizeCounts[size] || 0) + quantity;
        colorData.total += quantity;
      });
    });
  
    // Convertir en tableau pour le rendu, y compris le tri si nécessaire
    return Object.values(aggregated).map(({ ref, title, colors }) => ({
      ref,
      title,
      colors: Object.entries(colors).map(([color, data]) => ({
        color,
        ...data,
      })),
    })).sort((a, b) => a.ref.localeCompare(b.ref)); // Trier par référence, ajuster si nécessaire
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="jacky">
      <div className='print-button'>
      <button onClick={handlePrint}>Imprimer</button>
      </div>
      <div className="jacky-title">
       <h2>{sessionName}</h2>
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
            {sizes.map(() => <th key={sizes}></th>)}
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

export default Jacky;
