import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TeamCard from '../../components/TeamCard';

const TeamDetail = () => {
  const router = useRouter();
  const { teamId } = router.query;

  // Placeholder data for demonstration purposes
  const teamData = {
    name: 'FC Example',
    logo: '/path/to/logo.png',
    description: 'This is an example football club.',
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{teamData.name}</h1>
        <TeamCard team={teamData} />
      </main>
      <Footer />
    </div>
  );
};

export default TeamDetail;