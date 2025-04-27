import React, { useEffect, useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import * as XLSX from 'xlsx';

const App = () => {
  const [data, setData] = useState({});
  const [rootId, setRootId] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const idParam = queryParams.get('id');
    if (idParam) {
      setRootId(parseInt(idParam));
    }
    loadExcel();
  }, []);

  const loadExcel = async () => {
    const response = await fetch('/Test_family_tree.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    
    const idMap = {};
    jsonData.forEach(entry => {
      idMap[entry['Unique ID']] = {
        name: entry['Name'],
        father: entry['Father ID'],
        mother: entry['Mother ID'],
        spouse: entry['Spouse Ids'],
        children: entry['Children Ids'],
      };
    });
    setData(idMap);
  };

  const renderNode = (id, depth = 0) => {
    if (!id || depth > 2 || !data[id]) return null;
    const person = data[id];

    return (
      <TreeNode label={`${person.name} (ID: ${id})`}>
        {/* Render father and mother if upward depth */}
        {depth === 0 && (
          <>
            {renderNode(person.father, depth + 1)}
            {renderNode(person.mother, depth + 1)}
          </>
        )}
        {/* Render children if downward depth */}
        {depth >= 0 && person.children && person.children.split(';').map(childId => {
          const cleanId = parseInt(childId.trim());
          return renderNode(cleanId, depth + 1);
        })}
      </TreeNode>
    );
  };

  if (!rootId || Object.keys(data).length === 0) return <div>Loading...</div>;

  return (
    <div style={{ margin: "50px" }}>
      <h1>Family Tree Viewer</h1>
      <Tree
        label={<strong>{data[rootId]?.name} (ID: {rootId})</strong>}
      >
        {renderNode(rootId)}
      </Tree>
    </div>
  );
};

export default App;
