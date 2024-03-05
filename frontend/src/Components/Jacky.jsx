import { useLocation } from "react-router-dom";

const Jacky = () => {
  const location = useLocation();
  const { selectedOrders } = location.state || { selectedOrders: [] };

  // Fonction pour regrouper les articles
  const groupedItems = () => {
    const items = selectedOrders.flatMap(order => order.line_items);
    const grouped = {};

    items.forEach(item => {
      // Identifier unique basé sur le nom, la couleur, et la taille
      const identifier = `${item.title}-${item.variant_title}`;
      if (grouped[identifier]) {
        // Additionne les quantités si l'article existe déjà
        grouped[identifier].quantity += item.quantity;
      } else {
        // Sinon, crée une nouvelle entrée
        grouped[identifier] = { ...item };
      }
    });

    return Object.values(grouped); // Convertit l'objet en tableau
  };

  return (
    <div>
      <h2>Détails de la Session</h2>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Taille</th>
            <th>Couleur</th>
            <th>Quantité</th>
            <th>SKU</th>
          </tr>
        </thead>
        <tbody>
          {groupedItems().map((item, index) => (
            <tr key={index}>
              <td>{item.title}</td>
              <td>{item.variant_title.split(' / ')[0]}</td>
              <td>{item.variant_title.split(' / ')[1]}</td>
              <td>{item.quantity}</td>
              <td>{item.sku}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Jacky;