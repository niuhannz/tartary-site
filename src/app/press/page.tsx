import { pillars } from '@/lib/theme';
import PillarPage from '@/components/PillarPage';

export const metadata = { title: 'Press' };

export default function PressPage() {
  const pillar = pillars.find((p) => p.id === 'press')!;
  return <PillarPage pillar={pillar} />;
}
