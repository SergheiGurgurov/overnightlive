//tables
const t = {
  anlStats: {
    name: "anl_stats",
    columns: {
      username: "username",
      emoji: "emojitype",
      count: "emojicount",
      epoch: "epoch",
    },
  },
};

function getStats() {
  return `SELECT * FROM ${t.anlStats};`;
}

/**
 *
 * @typedef {{
 * username: string,
 * emoji: string,
 * count: number,
 * epoch: number
 * }} UserInteraction
 *
 * */

/**
 * @param {UserInteraction[]} data
 * @returns
 */
function insertStats(data) {
  const table = t.anlStats.name;
  const c = t.anlStats.columns;

  return `
    INSERT INTO ${table}
    (${c.epoch}, ${c.username}, ${c.emoji}, ${c.count})
    VALUES
    ${data
      .map((record) => {
        return `(${record.epoch}, '${record.username}', '${record.emoji}', ${record.count})`;
      })
      .join(", ")};`;
}

module.exports = {
  getStats,
  insertStats,
};
