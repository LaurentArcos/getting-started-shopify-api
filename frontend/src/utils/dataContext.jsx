import { createContext, useContext, useState, useEffect } from 'react';

import PropTypes from 'prop-types';

export const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [metafields, setMetafields] = useState({});
  const [locationId, setLocationId] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchLocations();
  }, []);


  const fetchOrders = () => {
    fetch("http://localhost:3001/api/orders")
      .then((response) => response.json())
      .then((data) => {
        setOrders(data.orders || []);
      })
      .catch((error) => console.error("Error fetching orders:", error));
  };

  const fetchLocations = () => {
    fetch("http://localhost:3001/api/locations")
      .then((response) => response.json())
      .then((data) => {
        if (data.locations && data.locations.length > 0) {
          setLocationId(data.locations[0].id);
        }
      })
      .catch((error) => console.error("Error fetching locations:", error));
  };

  const fetchMetafieldsForProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/metafields/${productId}`);
      const data = await response.json();
      
      const entrepotMetafield = data.metafields.find(mf => mf.namespace === "localisation" && mf.key === "entrepot");
      setMetafields((prevMetafields) => ({
        ...prevMetafields,
        [productId]: entrepotMetafield?.value
      }));
    } catch (error) {
      console.error("Error fetching metafields:", error);
    }
  };

  return (
    <DataContext.Provider value={{ orders, metafields, fetchMetafieldsForProduct, setOrders, setMetafields, locationId }}>
      {children}
    </DataContext.Provider>
  );
};


DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
