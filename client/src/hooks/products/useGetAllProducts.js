import axios from "axios";
import { productRoute } from "../../utils/APIRoutes";
import { useState } from "react";

const useGetAllProducts = () => {
  const [productData, setProductData] = useState([]);
  const [isGetLoading, setIsGetLoading] = useState(false);
  const [getError, setGetError] = useState(null);

  const getProductsFunction = async (filterOptions) => {
    setIsGetLoading(true);

    try {
      const userToken = localStorage.getItem("userToken");
      const response = await axios.get(productRoute, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: filterOptions,
      });
      setProductData(response.data);
      setIsGetLoading(false);
    } catch (error) {
      console.log(error);
      setGetError(error);
      setIsGetLoading(false);
    }
  };

  return {
    getProductsFunction,
    productData,
    isGetLoading,
    setIsGetLoading,
    getError,
  };
};

export default useGetAllProducts;

// import axios from "axios";
// import { useState, useEffect } from "react";
// import { productRoute } from "../utils/APIRoutes";

// const useGetAllProducts = (filterOptions) => {
//   const [productData, setProductData] = useState([]);
//   const [isGetLoading, setIsGetLoading] = useState(false);
//   const [getError, setGetError] = useState(null);
//   const [getRefresh, setGetRefresh] = useState(false);

//   useEffect(() => {
//     setIsGetLoading(true);

//     const getData = async () => {
//       try {
//         const userToken = localStorage.getItem("userToken");
//         const response = await axios.get(productRoute, {
//           headers: {
//             Authorization: `Bearer ${userToken}`,
//           },
//           params: filterOptions,
//         });
//         setProductData(response.data);
//         setIsGetLoading(false);
//       } catch (error) {
//         console.log(error);
//         setGetError(error);
//         setIsGetLoading(false);
//       }
//     };
//     getData();
//   }, [getRefresh]);

//   return { productData, isGetLoading, getError, getRefresh, setGetRefresh };
// };

// export default useGetAllProducts;
