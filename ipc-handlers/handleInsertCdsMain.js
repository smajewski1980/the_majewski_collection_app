async function handleInsertCdsMain(e, data) {
  return JSON.stringify({
    msg: 'hello form the "backend"',
    dataBackAtYa: data,
  });
}

module.exports = handleInsertCdsMain;
