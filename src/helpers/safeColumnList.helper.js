import format from 'pg-format';

const build = (requestedColumns = ['*'], allowedColumns = []) => {
  if (requestedColumns.length === 1 && requestedColumns[0] === '*') {
    return '*';
  }

  const filtered = requestedColumns.filter((col) =>
    allowedColumns.includes(col)
  );

  if (filtered.length === 0) {
    throw new Error('No valid columns provided');
  }

  return filtered.map((col) => format.ident(col)).join(', ');
};

export default { build };
