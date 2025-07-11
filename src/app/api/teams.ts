import type { NextApiRequest, NextApiResponse } from 'next';

const teams = [
  {
    id: 1,
    name: 'Team A',
    logo: '/path/to/logoA.png',
    description: 'Description of Team A',
  },
  {
    id: 2,
    name: 'Team B',
    logo: '/path/to/logoB.png',
    description: 'Description of Team B',
  },
  // Add more teams as needed
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(teams);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}