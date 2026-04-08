import { pillars } from '@/lib/theme';
import PillarPage from '@/components/PillarPage';

export const metadata = { title: 'Studio' };

export default function StudioPage() {
  const pillar = pillars.find((p) => p.id === 'studio')!;
  return <PillarPage pillar={pillar} />;
}
