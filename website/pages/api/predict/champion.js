import { IntegratedPredictor } from '../../../lib/predictor';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const predictor = new IntegratedPredictor();
      const result = predictor.predictChampion();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
