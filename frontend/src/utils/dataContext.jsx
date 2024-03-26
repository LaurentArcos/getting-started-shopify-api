import { createContext, useContext, useState, useEffect } from 'react';

import PropTypes from 'prop-types';

export const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [metafields, setMetafields] = useState({});
  const [locationId, setLocationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const ordersResponse = await fetch("http://localhost:3001/api/orders");
      const ordersData = await ordersResponse.json();
      setOrders(ordersData.orders || []);
  
      const locationsResponse = await fetch("http://localhost:3001/api/locations");
      const locationsData = await locationsResponse.json();
      if (locationsData.locations && locationsData.locations.length > 0) {
        setLocationId(locationsData.locations[0].id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
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
    <DataContext.Provider value={{ orders, metafields, fetchMetafieldsForProduct, setOrders, setMetafields, locationId, isLoading}}>
      {children}
    </DataContext.Provider>
  );
};


DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
