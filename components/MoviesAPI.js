import { useState } from "react";

export default function useMoviesAPI() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const searchMovies = async (searchTerm) => {
    //SearchTerm is empty
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    //Use date to avoid cacheing issues
    const url = `https://imdb.iamidiotareyoutoo.com/search?q=${encodeURIComponent(searchTerm)}&t=${Date.now()}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      setData(json.description || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, error, searchMovies };
}