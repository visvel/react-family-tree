import { useEffect, useState } from "react";
import { readExcelFile } from "./utils/readExcel";
import { TreeBuilder } from "./components/TreeBuilder";
import { OrganizationalChart } from "react-organizational-chart";
import { useSearchParams } from "react-router-dom";
import "./index.css";

function App() {
  const [familyMap, setFamilyMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function fetchData() {
      const data = await readExcelFile();
      setFamilyMap(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading family data...</div>;
  }

  const idParam = searchParams.get("id");
  const maxLevelParam = searchParams.get("level") || 2;
  const personId = idParam ? parseInt(idParam) : null;
  const maxLevel = parseInt(maxLevelParam);

  if (!personId || !familyMap[personId]) {
    return <div>Please provide a valid person ID in the URL (e.g., `?id=22`).</div>;
  }

  return (
    <div style={{ margin: "20px" }}>
      <h1>🌳 Family Tree Viewer</h1>
      <OrganizationalChart
        label={<div className="node-style">{familyMap[personId]['Name']}</div>}
      >
        <TreeBuilder
          personId={personId}
          familyMap={familyMap}
          level={0}
          maxLevel={maxLevel}
        />
      </OrganizationalChart>
    </div>
  );
}

export default App;
