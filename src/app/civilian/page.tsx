import { pillars } from '@/lib/theme';
import PillarPage from '@/components/PillarPage';

export const metadata = { title: 'Civilian' };

export default function CivilianPage() {
  const pillar = pillars.find((p) => p.id === 'civilian')!;
  return <PillarPage pillar={pillar} />;
}
