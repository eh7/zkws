import QRCode from 'qrcode'

const basketLink = async (req, res) => {

  const qrcodeUrl = await QRCode.toDataURL('http://eh7.co.uk')

  return res.status(200).send("<img src='" + qrcodeUrl + "'><br/>" + qrcodeUrl);

  return res.status(200).json({
    body: req.body,
    query: req.query,
    message: '200 basketLink',
    qrData: qrcodeUrl,
  });

}

export default basketLink;
