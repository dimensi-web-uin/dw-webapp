import HeroSection from '../organisms/sections/hero.section';
import LeaderboardSsection from '../organisms/sections/leaderboard.section';
import RecentArticlesSection from '../organisms/sections/recent-articles.section';
import VisionmissionSection from '../organisms/sections/visionmission.section';

const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <RecentArticlesSection />
      <LeaderboardSsection />
      <VisionmissionSection />
    </>
  );
};

export default LandingPage;
