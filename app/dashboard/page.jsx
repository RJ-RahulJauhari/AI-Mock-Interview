import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";

const DashboardPage = () => {
  return (
    <div className="p-10">
      {/* Dashboard Header */}
      <header>
        <h2 className="font-bold text-4xl">Dashboard</h2>
        <p className="text-gray-500">Create and Start your AI Mockup Interview</p>
      </header>

      {/* Create New Interview Section */}
      <section className="my-5">
        <h3 className="text-2xl font-semibold mb-3">Create New Interview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <AddNewInterview />
        </div>
      </section>

      {/* Previous Interviews Section */}
      <section>
        <h3 className="text-2xl font-bold mb-3">Previous Interviews</h3>
        <div>
          <InterviewList />
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
