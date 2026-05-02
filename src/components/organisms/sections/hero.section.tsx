import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/atoms/item';
import { Section } from '@/components/atoms/section';
import CompanyData from '@/data/company.data';

const HeroSection = () => {
  return (
    <Section>
      <h1 className="typo-display text-primary">{CompanyData.name}</h1>
      <p className="typo-body-md text-muted-foreground max-w-lg">
        {CompanyData.description}
      </p>

      <div className="mt-12 flex w-full max-w-lg flex-wrap items-center gap-2">
        <Item className="max-w-28">
          <ItemContent>
            <ItemDescription>Materi ajar</ItemDescription>
            <ItemTitle className="text-2xl font-semibold tabular-nums">
              10
            </ItemTitle>
          </ItemContent>
        </Item>
        <Item className="max-w-28">
          <ItemContent>
            <ItemDescription>Artikel</ItemDescription>
            <ItemTitle className="text-2xl font-semibold tabular-nums">
              3
            </ItemTitle>
          </ItemContent>
        </Item>
        <Item className="max-w-28">
          <ItemContent>
            <ItemDescription>Anggota</ItemDescription>
            <ItemTitle className="text-2xl font-semibold tabular-nums">
              42
            </ItemTitle>
          </ItemContent>
        </Item>
      </div>
    </Section>
  );
};

export default HeroSection;
