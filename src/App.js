import "./style.css";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { Button, Input, List, Divider, Spin } from "antd"; // Import Spin component for loading indicator
import { SearchOutlined } from "@ant-design/icons";

function App() {
  const locations = ["hpa-An", "maesot", "mandalay", "myawaddy", "yangon", "chiang-Mai"];
  const [search, setSearch] = useState("");
  const [result, setResult] = useState("");
  const [data, setData] = useState({});
  const [history, setHistory] = useState([]);  // For storing search history
  const [loading, setLoading] = useState(true); // Add loading state

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
      setLoading(false); // Set loading to false once data is fetched
    };

    fetchData();
  }, []);

  const formatString = (str) => {
    return str.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const handleSearch = () => {
    const searchNumber = String(search.trim());
    let found = false;
    let locationFound = "";

    for (const [location, numbers] of Object.entries(data)) {
      if (numbers.includes(searchNumber)) {
        locationFound = formatString(location);
        setResult(`Voucher-${searchNumber} is in ${locationFound}`);
        found = true;
        break;
      }
    }

    if (!found) {
      setResult("Not found in any city");
    }

    // Update search history (store the last 10 searches)
    setHistory((prev) => {
      const newHistory = [`${searchNumber}: ${found ? locationFound : "Not found"}`, ...prev];
      return newHistory.slice(0, 3);  // Keep only the last 3 searches
    });
  };

  return (
    <div className="app">
      <div className="overlay"></div>

      <h1 className="title">Find which city your voucher is in</h1>
      <Input
        size="large"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Enter your voucher number"
        style={{ width: "225px" }}
      />

      <Button type="primary" icon={<SearchOutlined />} style={{color: "black", backgroundColor: "gold"}} onClick={handleSearch}>Search</Button>

      {/* Show loading spinner and fetching message while fetching data */}
      {loading ? (
        <div className="spin-container" style={{ display: "flex", flexDirection: "column", textAlign: "center", marginTop: "20px" }}>
          <Spin size="large" />
          <h1 style={{fontSize: "25px"}}>Fetching data...</h1>
        </div>
      ) : (
        result && 
        <>
          <h2 className="tracking-result">{result}</h2>
          <Divider style={{ margin: "0", borderColor: "black", borderWidth: "2px", opacity: "0.6"}} />
        </>
      )}

      {history.length > 0 && (
        <div className="search-history">
          <h2>Search History</h2>
          <List
            size="small"
            bordered
            style={{border: "2px solid black", fontSize:"18px", backgroundColor: "gold"}}
            dataSource={history}
            renderItem={(item) => (
              <List.Item>{item}</List.Item>
            )}
          />
        </div>
      )}

      <img
        src="/thingyan-3-people.png" // Make sure this is the correct path
        alt="decorative"
        className="bottom-left-image decoration"
      />

      <img
        src="/thingyan-1-people.png" // Make sure this is the correct path
        alt="decorative"
        className="bottom-right-image decoration"
      />
    </div>
  );
}

export default App;
