import { TreeNode } from "react-organizational-chart";

export function TreeBuilder({ personId, familyMap, level, maxLevel }) {
  if (!personId || !familyMap[personId] || level > maxLevel) {
    return null;
  }

  const person = familyMap[personId];
  const children = person['Children Ids'] || [];

  return (
    <TreeNode label={<div className="node-style">{person['Name']}</div>}>
      {children.map((childId) => (
        <TreeBuilder
          key={childId}
          personId={childId}
          familyMap={familyMap}
          level={level + 1}
          maxLevel={maxLevel}
        />
      ))}
    </TreeNode>
  );
}
