export default function handler(req, res) {
  res.setPreviewData({}, { maxAge: 10 });
  res.end();
}
