import { pillars } from '@/lib/theme';
import PillarPage from '@/components/PillarPage';

export const metadata = { title: 'System' };

export default function SystemPage() {
  const pillar = pillars.find((p) => p.id === 'system')!;
  return <PillarPage pillar={pillar} />;
}
