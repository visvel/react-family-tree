import * as XLSX from 'xlsx';

export async function readExcelFile() {
  const response = await fetch('/Test_family_tree.xlsx');
  const data = await response.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json(worksheet);

  const familyMap = {};
  json.forEach(person => {
    person['Spouse Ids'] = String(person['Spouse Ids'] || '')
      .split(';')
      .map(id => id.trim())
      .filter(id => id)
      .map(id => parseInt(id));
    person['Children Ids'] = String(person['Children Ids'] || '')
      .split(';')
      .map(id => id.trim())
      .filter(id => id)
      .map(id => parseInt(id));
    familyMap[person['Unique ID']] = person;
  });

  return familyMap;
}
