// src/pages/SavedCandidates.tsx
import { useState, useEffect } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  // Load saved candidates from local storage on component mount
  useEffect(() => {
    const storedCandidates = localStorage.getItem('potentialCandidates');
    if (storedCandidates) {
      setSavedCandidates(JSON.parse(storedCandidates));
    }
  }, []);

  // Remove a candidate from the saved list
  const handleRemoveCandidate = (candidateToRemove: Candidate) => {
    const updatedCandidates = savedCandidates.filter(
      candidate => candidate.id !== candidateToRemove.id
    );
    
    setSavedCandidates(updatedCandidates);
    localStorage.setItem('potentialCandidates', JSON.stringify(updatedCandidates));
  };

  // Render when no saved candidates
  if (savedCandidates.length === 0) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-3xl font-bold mb-4">Potential Candidates</h1>
        <p>No candidates have been accepted yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Potential Candidates</h1>
      
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="text-left">Avatar</th>
              <th className="text-left">Name</th>
              <th className="text-left">Username</th>
              <th className="text-left">Location</th>
              <th className="text-left">Company</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {savedCandidates.map(candidate => (
              <tr key={candidate.id}>
                <td>
                  <img 
                    src={candidate.avatar_url} 
                    alt={`${candidate.name}'s avatar`} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </td>
                <td>{candidate.name || 'N/A'}</td>
                <td>{candidate.login}</td>
                <td>{candidate.location || 'N/A'}</td>
                <td>{candidate.company || 'N/A'}</td>
                <td>
                  <div className="flex space-x-2">
                    <a 
                      href={candidate.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:underline"
                    >
                      View Profile
                    </a>
                    <button 
                      onClick={() => handleRemoveCandidate(candidate)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SavedCandidates;