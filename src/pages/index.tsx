import Header from '../components/Header';
import Footer from '../components/Footer';
import TeamCard from '../components/TeamCard';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-4">Welcome to the Football Club Website</h1>
        <p className="text-center mb-8">Explore our teams and their achievements.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Example Team Cards */}
          <TeamCard teamName="Team A" logo="/path/to/logoA.png" description="Description of Team A" />
          <TeamCard teamName="Team B" logo="/path/to/logoB.png" description="Description of Team B" />
          <TeamCard teamName="Team C" logo="/path/to/logoC.png" description="Description of Team C" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;