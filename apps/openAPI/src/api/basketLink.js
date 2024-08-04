const basketLink = async (req, res) => {

  return res.status(200).json({
    body: req.body,
    query: req.query,
    message: '200 basketLink',
  });

}

export default basketLink;
