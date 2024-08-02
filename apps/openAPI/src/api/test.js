const test = async (req, res) => {

  return res.status(200).json({
    body: req.body,
    query: req.query,
    message: '200 okay test',
  });

}

export default test;
