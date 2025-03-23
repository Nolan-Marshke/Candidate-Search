// src/pages/CandidateSearch.tsx
import { useState, useEffect } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved candidates from local storage on component mount
  useEffect(() => {
    const storedCandidates = localStorage.getItem('potentialCandidates');
    if (storedCandidates) {
      setSavedCandidates(JSON.parse(storedCandidates));
    }
  }, []);

  // Fetch initial list of candidates
  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const users = await searchGithub();
      const detailedCandidates: Candidate[] = await Promise.all(
        users.map(async (user: { login: string }) => {
          return await searchGithubUser(user.login);
        })
      );
      setCandidates(detailedCandidates);
      setCurrentCandidate(detailedCandidates[0] || null);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load of candidates
  useEffect(() => {
    fetchCandidates();
  }, []);

  // Save candidate to potential candidates list
  const handleSaveCandidate = () => {
    if (currentCandidate) {
      const updatedSavedCandidates = [...savedCandidates, currentCandidate];
      setSavedCandidates(updatedSavedCandidates);
      
      // Save to local storage
      localStorage.setItem('potentialCandidates', JSON.stringify(updatedSavedCandidates));
      
      // Move to next candidate
      moveToNextCandidate();
    }
  };

  // Move to next candidate without saving
  const moveToNextCandidate = () => {
    const currentIndex = candidates.findIndex(c => c.id === currentCandidate?.id);
    const nextIndex = currentIndex + 1;

    if (nextIndex < candidates.length) {
      setCurrentCandidate(candidates[nextIndex]);
    } else {
      // If no more candidates, fetch new batch
      fetchCandidates();
    }
  };

  // Reject current candidate and move to next
  const handleRejectCandidate = () => {
    moveToNextCandidate();
  };

  // Render loading state
  if (isLoading) {
    return <div className="text-center mt-10">Loading candidates...</div>;
  }

  // Render when no candidates are available
  if (!currentCandidate) {
    return <div className="text-center mt-10">No more candidates available.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Candidate Search</h1>
      
      <div className="max-w-md mx-auto bg-black/50 rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center">
          <img 
            src={currentCandidate.avatar_url} 
            alt={`${currentCandidate.name}'s avatar`} 
            className="w-32 h-32 rounded-full mb-4 object-cover"
          />
          
          <h2 className="text-2xl font-semibold">{currentCandidate.name || currentCandidate.login}</h2>
          
          <div className="text-center mt-2">
            {currentCandidate.location && <p>Location: {currentCandidate.location}</p>}
            {currentCandidate.company && <p>Company: {currentCandidate.company}</p>}
            {currentCandidate.email && <p>Email: {currentCandidate.email}</p>}
            
            <a 
              href={currentCandidate.html_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 hover:underline mt-2 inline-block"
            >
              View GitHub Profile
            </a>
          </div>
          
          <div className="flex justify-center space-x-4 mt-6">
            <button 
              onClick={handleSaveCandidate} 
              className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition"
              aria-label="Save Candidate"
            >
              <FaPlus />
            </button>
            
            <button 
              onClick={handleRejectCandidate} 
              className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition"
              aria-label="Reject Candidate"
            >
              <FaMinus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateSearch;