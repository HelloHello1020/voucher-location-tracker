import "./style.css";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

function App() {
  const maesot = ["1111"];

  const mywaddy = [];

  const hpaAn = [];

  const yangon = [];

  const mandalay = [];

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
    if (maesot.includes(search)) {
      setResult(`Your item\n${search}\nis in Maesot`);
    }

    else if (mywaddy.includes(search)) {
      setResult(`Your item\n${search}\nis in Myawaddy`);    
    }

    else if (hpaAn.includes(search)) {
      setResult(`Your item\n${search}\nis in Hpa-An`);    
    }

    else if (yangon.includes(search)) {
      setResult(`Your item\n${search}\nis in Yangon`);    
    }

    else if (mandalay.includes(search)) {
      setResult(`Your item\n${search}\nis in Mandalay`);    
    }
    
    else {
      setResult("Not found in any city");
    }
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