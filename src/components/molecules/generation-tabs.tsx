import {
  GenerationOpts,
  type Generation,
} from '@/data/options/generations.option';
import { Tabs, TabsList, TabsTrigger } from '../atoms/tabs';

const GenerationTabs = ({
  value,
  onValueChange,
}: {
  value: Generation;
  onValueChange: (v: Generation) => void;
}) => {
  return (
    <Tabs
      defaultValue={value}
      onValueChange={(v) => onValueChange(v as Generation)}
    >
      <TabsList variant={'line'}>
        {GenerationOpts.map((item, i) => (
          <TabsTrigger key={i} value={item.value}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default GenerationTabs;
