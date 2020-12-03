import { useState, useEffect } from "react";

const MapsApiToken = "pk.30d683f73fda9cbaef6ff286d0560e15";
const ApiUrl = "https://us1.unwiredlabs.com";
const Endpoint = "/v2/search.php";

export const useFetchAddress = () => {
  const [data, setData] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  useEffect(() => {
    if (searchQuery === "") return;

    const fetchData = async () => {
      try {
        setError(null);

        const encodedSearchQuery = encodeURI(searchQuery);

        const response = await fetch(`${ApiUrl}${Endpoint}?token=${MapsApiToken}&q=${encodedSearchQuery}`);
        const results = await response.json();
        console.log(`${ApiUrl}${Endpoint}?token=${MapsApiToken}&q=${encodedSearchQuery}`);
        console.log(results);
        if (results.status === "error") {
          console.log(`1`);
          setError(results);
          return;
        }
        if (!results || !results.address) {
          console.log(`2`);
          setError({ error: "No addresses found. :(" });
          return;
        }
        if (response.ok) {
          console.log(`3`);
          if (results && results.address) {
            const regions = results.address.map((coordinate) => {
              return {
                longitude: parseFloat(coordinate.lon),
                latitude: parseFloat(coordinate.lat),
                latitudeDelta: 0.00000002,
                longitudeDelta: 0.042,
                display_name: coordinate.display_name,
              };
            });
            setData(regions);
          }
        } else {
          setError(results);
        }
      } catch (err) {
        setError(err);
      }
    };
    fetchData();
  }, [searchQuery]);
  return [data, setSearchQuery, error];
};
