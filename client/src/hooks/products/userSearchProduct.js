import axios from "axios";
import { useState } from "react";
import { productRoute } from "../../utils/APIRoutes";

const useSearchProduct = () => {
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const searchProductFunction = async (searchInput) => {
    setIsSearchLoading(true);

    try {
      const encodedSearchInput = encodeURIComponent(searchInput);

      const response = await axios.get(
        `${productRoute}/search?searchInput=${encodedSearchInput}`
      );
      setIsSearchLoading(false);
      return response.data;
    } catch (error) {
      setIsSearchLoading(false);
      setSearchError(error.response.data.mesage);
      throw error.response.data.message;
    }
  };

  return { searchProductFunction, isSearchLoading, searchError };
};

export default useSearchProduct;
