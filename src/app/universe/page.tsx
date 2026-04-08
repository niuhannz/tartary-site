import { pillars } from '@/lib/theme';
import PillarPage from '@/components/PillarPage';

export const metadata = { title: 'Universe' };

export default function UniversePage() {
  const pillar = pillars.find((p) => p.id === 'universe')!;
  return <PillarPage pillar={pillar} />;
}
