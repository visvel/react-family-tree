import React, { useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";

const treeData = {
  label: "Queen Victoria (1819–1901)",
  children: [
    {
      label: "Edward VII (1841–1910)",
      children: [
        {
          label: "George V (1865–1936)",
          children: [
            {
              label: "Edward VIII (1894–1972)"
            },
            {
              label: "George VI (1895–1952)",
              children: [
                {
                  label: "Queen Elizabeth II (1926–2022)",
                  children: [
                    {
                      label: "King Charles III (b. 1948)",
                      children: [
                        {
                          label: "Princess Diana (1961–1997)",
                          children: [
                            { label: "Prince William (b. 1982)" },
                            { label: "Prince Harry (b. 1984)" }
                          ]
                        }
                      ]
                    },
                    {
                      label: "Princess Anne (b. 1950)",
                      children: [
                        { label: "Peter Phillips (b. 1977)" },
                        { label: "Zara Tindall (b. 1981)" }
                      ]
                    },
                    {
                      label: "Prince Andrew (b. 1960)",
                      children: [
                        { label: "Princess Beatrice (b. 1988)" },
                        { label: "Princess Eugenie (b. 1990)" }
                      ]
                    },
                    {
                      label: "Prince Edward (b. 1964)",
                      children: [
                        { label: "Lady Louise Windsor (b. 2003)" },
                        { label: "James, Earl of Wessex (b. 2007)" }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              label: "Mary, Princess Royal (1897–1965)"
            },
            {
              label: "Prince Henry, Duke of Gloucester (1900–1974)"
            },
            {
              label: "Prince George, Duke of Kent (1902–1942)"
            },
            {
              label: "Prince John (1905–1919)"
            }
          ]
        }
      ]
    },
    {
      label: "Princess Victoria (1840–1901)"
    },
    {
      label: "Princess Alice (1843–1878)"
    },
    {
      label: "Prince Alfred (1844–1900)"
    },
    {
      label: "Princess Helena (1846–1923)"
    },
    {
      label: "Princess Louise (1848–1939)"
    },
    {
      label: "Prince Arthur (1850–1942)"
    },
    {
      label: "Prince Leopold (1853–1884)"
    },
    {
      label: "Princess Beatrice (1857–1944)"
    }
  ]
};

function findSubtree(node, label) {
  if (node.label === label) return node;
  if (!node.children) return null;
  for (const child of node.children) {
    const result = findSubtree(child, label);
    if (result) return { ...node, children: [result] };
  }
  return null;
}

function renderTree(node, onSelect) {
  return (
    <TreeNode
      key={node.label}
      label={
        <div
          className="p-2 bg-white shadow rounded-xl cursor-pointer hover:bg-gray-100"
          onClick={() => onSelect(node.label)}
        >
          {node.label}
        </div>
      }
    >
      {node.children && node.children.map(child => renderTree(child, onSelect))}
    </TreeNode>
  );
}

export default function QueenElizabethFamilyTree() {
  const [selectedLabel, setSelectedLabel] = useState(null);
  const root = selectedLabel ? findSubtree(treeData, selectedLabel) : treeData;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Family Tree of Queen Elizabeth II</h1>
      <Tree
        lineWidth={"2px"}
        lineColor={"gray"}
        lineBorderRadius={"8px"}
        label={<div className="p-2 bg-white shadow rounded-xl">{root.label}</div>}
      >
        {root.children && root.children.map(child => renderTree(child, setSelectedLabel))}
      </Tree>
      {selectedLabel && (
        <button
          onClick={() => setSelectedLabel(null)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reset Tree
        </button>
      )}
    </div>
  );
}
