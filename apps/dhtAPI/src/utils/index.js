
const toObject = (_data) => {
  return JSON.parse(JSON.stringify(_data, (key, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value // return everything else unchanged
  ))
}

export {
  toObject
}
