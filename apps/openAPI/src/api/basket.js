const basket = async (req, res) => {
 
  const basketId = req.params.basketId

  console.log("basketId : ", basketId)

  return res.status(200).json({
    body: req.body,
    query: req.query,
    message: '200 basket ' + basketId,
  });

}

export default basket;
