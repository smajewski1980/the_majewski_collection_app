const cdCompilationsQuery = `
  SELECT column_name FROM information_schema.columns WHERE table_name = 'cd_compilations'
UNION
SELECT column_name FROM information_schema.columns WHERE table_name = 'cd_compilations_tracks';
`;

module.exports = cdCompilationsQuery;
