import "./style.css";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

function App() {
  const locations = ["hpa-An", "maesot", "mandalay", "myawaddy", "yangon"];
  const [search, setSearch] = useState("");
  const [result, setResult] = useState("");
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      let tempData = {};
      for (const location of locations) {
        const querySnapshot = await getDocs(collection(db, location));  
        querySnapshot.forEach((doc) => {
          tempData[location] = doc.data().numbers || [];
        });
      }
      setData(tempData);
    };
  
    fetchData();
  }, []);  

  const handleSearch = () => {
    const searchNumber = String(search.trim()); // Ensure it's a number
    let found = false;
  
    for (const [location, numbers] of Object.entries(data)) {
      if (numbers.includes(searchNumber)) {
        setResult(`Voucher-${searchNumber}\nis in ${location.charAt(0).toUpperCase() + location.slice(1)}`);
        found = true;
        break;
      }
    }
  
    if (!found) setResult("Not found in any city");
  };
  

  return (
    <div className="app">
      <div className="overlay"></div>

      <h2>Search for a City</h2>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Enter 4-digit number"
      />
      <button onClick={handleSearch}>Search</button>
      {result && <h1 className="tracking-result">{result}</h1>}
    </div>
  );
}

export default App;