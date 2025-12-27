const { Types } = require('mongoose');

const toObjectId = (id) =>
  id instanceof Types.ObjectId ? id : new Types.ObjectId(id);

const cleanNull = (input) => {
  // null / undefined
  if (input === null || input === undefined) return undefined;

  // primitive (string, number, boolean, date, ObjectId, etc.)
  if (typeof input !== 'object' || input instanceof Date) {
    return input;
  }

  // Array → giữ nguyên phần tử, chỉ clean bên trong object
  if (Array.isArray(input)) {
    return input
      .map(cleanNull)
      .filter(v => v !== undefined);
  }

  // Plain object
  return Object.fromEntries(
    Object.entries(input)
      .map(([key, value]) => [key, cleanNull(value)])
      .filter(([, value]) => value !== undefined)
  );
};

module.exports = { cleanNull };



module.exports = { toObjectId,cleanNull };
