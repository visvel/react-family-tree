import React, { useEffect, useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import * as XLSX from 'xlsx';

function App() {
  const [data, setData] = useState({});
  const [rootPerson, setRootPerson] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/family_tree.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const idMap = {};
      jsonData.forEach(row => {
        idMap[row['Unique ID']] = {
          id: row['Unique ID'],
          name: row['Name'],
          fatherId: row['Father ID'],
          motherId: row['Mother ID'],
          spouseIds: row['Spouse Ids'] ? row['Spouse Ids'].toString().split(';').map(s => parseInt(s.trim())) : [],
          childrenIds: row['Children Ids'] ? row['Children Ids'].toString().split(';').map(c => parseInt(c.trim())) : [],
        };
      });

      setData(idMap);

      // Get ID from URL
      const params = new URLSearchParams(window.location.search);
      const id = parseInt(params.get('id'));

      if (id && idMap[id]) {
        setRootPerson(idMap[id]);
      }
    };

    fetchData();
  }, []);

  const renderNode = (personId, level = 0, maxLevel = 2) => {
    const person = data[personId];
    if (!person || level > maxLevel) return null;

    return (
      <TreeNode label={`${person.name} (ID: ${person.id})`}>
        {person.childrenIds.map(childId => renderNode(childId, level + 1, maxLevel))}
      </TreeNode>
    );
  };

  if (!rootPerson) return <div>Loading Family Tree...</div>;

  const father = rootPerson.fatherId ? data[rootPerson.fatherId] : null;
  const mother = rootPerson.motherId ? data[rootPerson.motherId] : null;

  return (
    <div style={{ margin: '20px' }}>
      <h1>Family Tree Viewer</h1>
      <Tree
        lineWidth={'2px'}
        lineColor={'green'}
        lineBorderRadius={'10px'}
        label={`${rootPerson.name} (ID: ${rootPerson.id})`}
      >
        {/* Parents (2 levels up) */}
        {father && (
          <TreeNode label={`Father: ${father.name} (ID: ${father.id})`}>
            {father.fatherId && data[father.fatherId] && (
              <TreeNode label={`Grandfather: ${data[father.fatherId].name} (ID: ${data[father.fatherId].id})`} />
            )}
            {father.motherId && data[father.motherId] && (
              <TreeNode label={`Grandmother: ${data[father.motherId].name} (ID: ${data[father.motherId].id})`} />
            )}
          </TreeNode>
        )}

        {mother && (
          <TreeNode label={`Mother: ${mother.name} (ID: ${mother.id})`}>
            {mother.fatherId && data[mother.fatherId] && (
              <TreeNode label={`Grandfather: ${data[mother.fatherId].name} (ID: ${data[mother.fatherId].id})`} />
            )}
            {mother.motherId && data[mother.motherId] && (
              <TreeNode label={`Grandmother: ${data[mother.motherId].name} (ID: ${data[mother.motherId].id})`} />
            )}
          </TreeNode>
        )}

        {/* Children (2 levels down) */}
        {rootPerson.childrenIds.map(childId => (
          <TreeNode key={childId} label={`Child: ${data[childId]?.name} (ID: ${childId})`}>
            {data[childId]?.childrenIds.map(grandchildId => (
              <TreeNode key={grandchildId} label={`Grandchild: ${data[grandchildId]?.name} (ID: ${grandchildId})`} />
            ))}
          </TreeNode>
        ))}
      </Tree>
    </div>
  );
}

export default App;
