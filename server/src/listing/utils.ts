export function nameTextFilter(name: string) {
  const filter: (string | RegExp)[] = [
    ' LP Cheniere',
    ' Common Units',
    / [0-9]*\.?[0-9]+%/,
    ' III',
    ' II',
    ' I ',
    ` Class `,
    ` Common S`,
    '  (The) Dep Shs',
    ' American Depositary',
    ' Warrant',
    ' Diversified ',
    ' Ordinary S',
    ' Ordinary s',
    ' Depositary',
    ' LLC',
    ' N.A.',
    " Fixed-Rate "
  ];
  let editedName = name;
  filter.forEach((str) => {
    if (editedName.search(str) >= 0) {
      editedName = editedName.split(str)[0];
    }
  });
  return editedName;
}
