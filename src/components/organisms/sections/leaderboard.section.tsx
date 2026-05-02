import { Section } from '@/components/atoms/section';
import GenerationTabs from '@/components/molecules/generation-tabs';
import type { Generation } from '@/data/options/generations.option';
import { now } from '@/utils/date';
import { useState } from 'react';

const LeaderboardSsection = () => {
  const [generation, setGeneration] = useState<Generation>(
    now().format('YYYY') as Generation
  );

  return (
    <Section>
      <span className="typo-overline text-primary text-end">Hall of Fame</span>
      <h2 className="typo-heading-lg text-end">Top Performers</h2>
      <p className="typo-body-md text-muted-foreground mb-12 text-end">
        Ruang apresiasi untuk yang sudah berjuang dan kasih effort maksimal
      </p>
      <GenerationTabs value={generation} onValueChange={setGeneration} />
    </Section>
  );
};

export default LeaderboardSsection;
