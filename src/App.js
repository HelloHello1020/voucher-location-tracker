import "./style.css";
import { useState} from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { Button, Input, List, Divider, Spin } from "antd"; // Import Spin component for loading indicator
import { SearchOutlined } from "@ant-design/icons";

function App() {
  const locations = ["cities", "thai-to-myanamr", "myanmar-to-thai"];
  const [search, setSearch] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);  // For storing search history
  const [loading, setLoading] = useState(false); // Loading state for searching

  const formatDocumentName = (str) => {
    return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const handleSearch = async () => {
    const searchNumber = search.trim(); // Ensure it's trimmed
  
    if (searchNumber.length !== 4) {
      setResult("Voucher number must be exactly 4 digits.");
      return;
    }
  
    setLoading(true);
    let found = false;
    let documentName = "";
    let message = "";
  
    // Iterate through all collections
    for (const location of locations) {
      const querySnapshot = await getDocs(collection(db, location));
  
      // Use a for...of loop to search through each document in the collection
      for (const doc of querySnapshot.docs) {
        const numbers = doc.data().numbers || []; // Assuming "numbers" is an array in your document
        if (numbers.includes(searchNumber)) {
          documentName = formatDocumentName(doc.id); // Get the document ID (name)
          found = true;
          // Check if the collection is "cities" or not
          message = location === "cities" 
            ? `Voucher-${searchNumber} found in ${documentName}`
            : `Voucher-${searchNumber} found between ${documentName}`;
          break; // Stop the loop once the document is found
        }
      }
  
      if (found) break; // If found, stop searching in other collections
    }
  
    if (!found) {
      setResult("Voucher number not found.");
    } else {
      setResult(message); // Use the dynamic message based on the collection
    }
  
    // Update search history (store the last 3 searches)
    setHistory((prev) => {
      const newHistory = [`${searchNumber}: ${found ? documentName : "Not found"}`, ...prev];
      return newHistory.slice(0, 3);  // Keep only the last 3 searches
    });
  
    setLoading(false); // End loading
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
        style={{ width: "218px" }}
      />

      <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} disabled={!search.trim()}>
        Search
      </Button>

      {/* Show loading spinner and fetching message while searching */}
      {loading ? (
        <div className="spin-container" style={{ display: "flex", flexDirection: "column", textAlign: "center", marginTop: "20px" }}>
          <Spin size="large" />
          <h1 style={{fontSize: "25px" }}>Searching...</h1>
        </div>
      ) : (
        result && 
        <>
          <h2 className="tracking-result">{result}</h2>
          <Divider style={{ margin: "0", borderColor: "black", borderWidth: "2px", opacity: "0.2"}} />
        </>
      )}

      {history.length > 0 && (
        <div className="search-history">
          <h2>Search History</h2>
          <List
            size="small"
            bordered
            style={{border: "2px solid black", fontSize:"18px"}}
            dataSource={history}
            renderItem={(item) => (
              <List.Item>{item}</List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
}

export default App;
