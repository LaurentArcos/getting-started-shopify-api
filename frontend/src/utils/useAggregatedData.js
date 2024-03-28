import { useState, useEffect } from 'react';

const sizes = ["NO SIZE", "XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const isSize = (value) => {
  
  const upperValue = value ? value.toUpperCase() : "";
  return sizes.includes(upperValue) || upperValue === "TAILLE UNIQUE";
};

const normalizeColor = (color) => {
  
  if (!color) return "Non spécifié";
  return color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();
};

export const useAggregatedData = (orders, metafields, sessionOrderIds) => {
  const [aggregatedData, setAggregatedData] = useState([]);

  useEffect(() => {
    const aggregate = () => {
      const data = {};

      orders.filter(order => sessionOrderIds.includes(order.id))
            .forEach(order => {
              order.line_items.forEach(item => {
                const parts = item.variant_title ? item.variant_title.split(' / ') : [];
                const firstPart = parts.length > 0 ? parts[0] : undefined;
                const secondPart = parts.length > 1 ? parts[1] : undefined;

                let size, color;
                if (isSize(firstPart)) {
                  size = firstPart === "TAILLE UNIQUE" ? "NO SIZE" : firstPart.toUpperCase();
                  color = normalizeColor(secondPart);
                } else if (isSize(secondPart)) {
                  size = secondPart.toUpperCase();
                  color = normalizeColor(firstPart);
                } else {
                  size = "NO SIZE";
                  color = normalizeColor(firstPart);
                }

                const metafieldValue = metafields[item.product_id] || 'Non spécifié';
                const key = `${metafieldValue}-${item.title}-${color}`;

                if (!data[key]) {
                  data[key] = {
                    metafield: metafieldValue,
                    product: item.title,
                    color: color,
                    sizes: {},
                    sku: item.sku,
                    rowSpan: 0,
                  };
                }

                data[key].sizes[size] = (data[key].sizes[size] || 0) + item.quantity;
              });
            });

      const sortedData = Object.values(data).sort((a, b) => a.metafield.localeCompare(b.metafield) || a.product.localeCompare(b.product));

      // Calcul du rowSpan
      const metafieldProductCounts = {};
      sortedData.forEach(item => {
        const groupKey = `${item.metafield}-${item.product}`;
        metafieldProductCounts[groupKey] = (metafieldProductCounts[groupKey] || 0) + 1;
      });

      sortedData.forEach(item => {
        const groupKey = `${item.metafield}-${item.product}`;
        item.rowSpan = metafieldProductCounts[groupKey];
      });

      setAggregatedData(sortedData);
    };

    aggregate();
  }, [orders, metafields, sessionOrderIds]);

  return aggregatedData;
};
