const cdSinglesQuery = `
    SELECT column_name FROM information_schema.columns WHERE table_name = 'cd_singles'
    UNION
    SELECT column_name FROM information_schema.columns WHERE table_name = 'cd_singles_tracks';
    `;

module.exports = cdSinglesQuery;
