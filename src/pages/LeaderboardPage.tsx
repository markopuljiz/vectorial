// Leaderboard page
// Shows top performers and user statistics

import { useEffect, useState } from 'react';
import '../styles/LeaderboardPage.css';

interface LeaderboardEntry {
  username: string;
  total_scenarios: number;
  avg_time: number;
  success_rate: number;
}

export function LeaderboardPage({ onBack }: { onBack: () => void }) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual database query
      // This is a placeholder - you'll need to create the proper SQL query
      
      // Example data for now
      const mockData: LeaderboardEntry[] = [
        { username: 'pilot123', total_scenarios: 45, avg_time: 342, success_rate: 94 },
        { username: 'atc_trainee', total_scenarios: 38, avg_time: 389, success_rate: 89 },
        { username: 'skymaster', total_scenarios: 52, avg_time: 401, success_rate: 87 },
      ];
      
      setLeaderboard(mockData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <button className="back-button" onClick={onBack}>← Back</button>
          <h1>Leaderboard</h1>
        </div>

        <div className="filter-tabs">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All Time
          </button>
          <button 
            className={filter === 'today' ? 'active' : ''} 
            onClick={() => setFilter('today')}
          >
            Today
          </button>
          <button 
            className={filter === 'week' ? 'active' : ''} 
            onClick={() => setFilter('week')}
          >
            This Week
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading leaderboard...</div>
        ) : (
          <div className="leaderboard-table">
            <div className="table-header">
              <div className="rank-col">Rank</div>
              <div className="name-col">Trainee</div>
              <div className="stat-col">Scenarios</div>
              <div className="stat-col">Avg Time</div>
              <div className="stat-col">Success Rate</div>
            </div>
            
            {leaderboard.map((entry, index) => (
              <div key={entry.username} className="table-row">
                <div className="rank-col">
                  <span className={`rank-badge rank-${index + 1}`}>
                    {index + 1}
                  </span>
                </div>
                <div className="name-col">{entry.username}</div>
                <div className="stat-col">{entry.total_scenarios}</div>
                <div className="stat-col">{formatTime(entry.avg_time)}</div>
                <div className="stat-col">{entry.success_rate}%</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
