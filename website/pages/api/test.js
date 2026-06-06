export default function handler(req, res) {
  if (req.method === 'POST') {
    res.status(200).json({ message: 'POST works!', body: req.body });
  } else if (req.method === 'GET') {
    res.status(200).json({ message: 'GET works!' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
