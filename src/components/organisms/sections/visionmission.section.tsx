import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import { Section } from '@/components/atoms/section';
import CompanyData from '@/data/company.data';
import { LightbulbIcon, TargetIcon } from 'lucide-react';

const VisionmissionSection = () => {
  return (
    <Section id="visionmissions">
      <span className="typo-overline text-primary">Our Identity</span>
      <h2 className="typo-heading-lg mb-12">Visi dan Misi</h2>

      <div className="flex flex-col gap-6 md:flex-row">
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>Visi</CardTitle>
            <CardAction>
              <div className="w-fit rounded-lg bg-yellow-100 p-2">
                <LightbulbIcon className="text-yellow-500" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="typo-body-md text-muted-foreground">
              {CompanyData.vision}
            </p>
          </CardContent>
        </Card>
        <Card className="w-full md:w-2/3">
          <CardHeader>
            <CardTitle>Misi</CardTitle>
            <CardAction>
              <div className="w-fit rounded-lg bg-red-100 p-2">
                <TargetIcon className="text-red-500" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            {CompanyData.missions.map((m, i) => (
              <p key={i} className="typo-body-md text-muted-foreground">
                <b>{i + 1}.</b> {m}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </Section>
  );
};

export default VisionmissionSection;
