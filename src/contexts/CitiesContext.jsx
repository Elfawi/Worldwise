import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const BASE_URL = "http://localhost:3000"; // Adjust the URL as needed
const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
        currentCity: {},
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}
function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        // setIsLoading(true);
        const response = await fetch(`${BASE_URL}/cities`);
        if (!response.ok) {
          throw new Error("Failed to fetch cities");
        }
        const data = await response.json();
        // setCities(data);
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        console.error("Error fetching cities:", error);
        dispatch({ type: "rejected", payload: "Error fetching cities" });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (currentCity.id === +id) return;
      dispatch({ type: "loading" });

      try {
        const response = await fetch(`${BASE_URL}/cities/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch city");
        }
        const data = await response.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch (error) {
        console.error("Error fetching City:", error);
        dispatch({ type: "rejected", payload: "Error fetching City" });
      }
    },
    [currentCity.id]
  );
  async function createCity(newCity) {
    dispatch({ type: "loading" });

    try {
      const response = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to create city");
      }
      const data = await response.json();
      dispatch({ type: "city/created", payload: data });
    } catch (error) {
      console.error("Error creating City:", error);
      dispatch({ type: "rejected", payload: "Error creating City" });
    }
  }
  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      const response = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete city");
      }
      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      console.error("Error deleting City:", error);
      dispatch({ type: "rejected", payload: "Error deleting City" });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(CitiesContext);
  if (!context) {
    throw new Error("useCities must be used within a CitiesProvider");
  }
  return context;
}
export { CitiesProvider, useCities };
