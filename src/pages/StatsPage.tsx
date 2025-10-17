// Stats page - displays statistics and analytics
// Shows scores and performance metrics from the database

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DatePicker } from '../components/DatePicker';
import '../App.css';

interface StatsPageProps {
  onBack: () => void;
}

interface UserStats {
  username: string;
  totalSubmitted: number;
  successCount: number;
  failCount: number;
  wasteCount: number;
  successPercent: number;
  failPercent: number;
  wastePercent: number;
}

type SortColumn = 'username' | 'totalSubmitted' | 'successPercent' | 'failPercent' | 'wastePercent';
type SortDirection = 'asc' | 'desc';

export function StatsPage({ onBack }: StatsPageProps) {
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>('username');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [speedDiffExpanded, setSpeedDiffExpanded] = useState(false);
  const [speedDiffMin, setSpeedDiffMin] = useState(0);
  const [speedDiffMax, setSpeedDiffMax] = useState(150);
  const [timeToCrossingExpanded, setTimeToCrossingExpanded] = useState(false);
  const [timeToCrossingMin, setTimeToCrossingMin] = useState(3);
  const [timeToCrossingMax, setTimeToCrossingMax] = useState(10);
  const [angleExpanded, setAngleExpanded] = useState(false);
  const [angleMin, setAngleMin] = useState(20);
  const [angleMax, setAngleMax] = useState(180);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch all scores with date filtering
        let query = supabase
          .from('scores')
          .select('username, result, created_at, speed_difference, time_to_crossing, angle')
          .order('username');
        
        // Apply date filters if set
        if (startDate) {
          query = query.gte('created_at', new Date(startDate).toISOString());
        }
        if (endDate) {
          // Add 1 day to include the entire end date
          const endDateTime = new Date(endDate);
          endDateTime.setDate(endDateTime.getDate() + 1);
          query = query.lt('created_at', endDateTime.toISOString());
        }
        
        // Apply speed difference filters
        if (speedDiffMin > 0 || speedDiffMax < 150) {
          query = query.gte('speed_difference', speedDiffMin).lte('speed_difference', speedDiffMax);
        }
        
        // Apply time to crossing filters
        if (timeToCrossingMin > 3 || timeToCrossingMax < 10) {
          query = query.gte('time_to_crossing', timeToCrossingMin).lte('time_to_crossing', timeToCrossingMax);
        }
        
        // Apply angle filters
        if (angleMin > 20 || angleMax < 180) {
          query = query.gte('angle', angleMin).lte('angle', angleMax);
        }
        
        const { data: scores, error } = await query;

        if (error) throw error;

        // Group by username and calculate stats
        const statsMap = new Map<string, UserStats>();
        
        scores?.forEach((score) => {
          const username = score.username || 'Unknown';
          
          if (!statsMap.has(username)) {
            statsMap.set(username, {
              username,
              totalSubmitted: 0,
              successCount: 0,
              failCount: 0,
              wasteCount: 0,
              successPercent: 0,
              failPercent: 0,
              wastePercent: 0
            });
          }
          
          const stats = statsMap.get(username)!;
          stats.totalSubmitted++;
          
          if (score.result === 'success') stats.successCount++;
          else if (score.result === 'fail') stats.failCount++;
          else if (score.result === 'waste') stats.wasteCount++;
        });
        
        // Calculate percentages
        const statsArray = Array.from(statsMap.values()).map(stats => ({
          ...stats,
          successPercent: stats.totalSubmitted > 0 ? (stats.successCount / stats.totalSubmitted) * 100 : 0,
          failPercent: stats.totalSubmitted > 0 ? (stats.failCount / stats.totalSubmitted) * 100 : 0,
          wastePercent: stats.totalSubmitted > 0 ? (stats.wasteCount / stats.totalSubmitted) * 100 : 0
        }));
        
        setUserStats(statsArray);
      } catch (err: any) {
        console.error('Error fetching stats:', err);
        setError(err.message || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [startDate, endDate, speedDiffMin, speedDiffMax, timeToCrossingMin, timeToCrossingMax, angleMin, angleMax]);

  const handleSpeedDiffSliderChange = (isMin: boolean, value: number) => {
    if (isMin) {
      setSpeedDiffMin(Math.min(value, speedDiffMax));
    } else {
      setSpeedDiffMax(Math.max(value, speedDiffMin));
    }
  };

  const handleTimeToCrossingSliderChange = (isMin: boolean, value: number) => {
    if (isMin) {
      setTimeToCrossingMin(Math.min(value, timeToCrossingMax));
    } else {
      setTimeToCrossingMax(Math.max(value, timeToCrossingMin));
    }
  };

  const handleAngleSliderChange = (isMin: boolean, value: number) => {
    if (isMin) {
      setAngleMin(Math.min(value, angleMax));
    } else {
      setAngleMax(Math.max(value, angleMin));
    }
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to ascending when switching columns
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const calculateTotalStats = (): UserStats | null => {
    if (userStats.length === 0) return null;

    const totals = userStats.reduce((acc, stats) => ({
      username: 'TOTAL',
      totalSubmitted: acc.totalSubmitted + stats.totalSubmitted,
      successCount: acc.successCount + stats.successCount,
      failCount: acc.failCount + stats.failCount,
      wasteCount: acc.wasteCount + stats.wasteCount,
      successPercent: 0,
      failPercent: 0,
      wastePercent: 0
    }), {
      username: 'TOTAL',
      totalSubmitted: 0,
      successCount: 0,
      failCount: 0,
      wasteCount: 0,
      successPercent: 0,
      failPercent: 0,
      wastePercent: 0
    });

    // Calculate percentages
    totals.successPercent = totals.totalSubmitted > 0 ? (totals.successCount / totals.totalSubmitted) * 100 : 0;
    totals.failPercent = totals.totalSubmitted > 0 ? (totals.failCount / totals.totalSubmitted) * 100 : 0;
    totals.wastePercent = totals.totalSubmitted > 0 ? (totals.wasteCount / totals.totalSubmitted) * 100 : 0;

    return totals;
  };

  const getSortedStats = () => {
    const sorted = [...userStats].sort((a, b) => {
      let aValue: string | number = a[sortColumn];
      let bValue: string | number = b[sortColumn];

      // For string comparison (username)
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // For number comparison
      return sortDirection === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return sorted;
  };

  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div className="stats-page">
      <div className="stats-container">
        <div className="stats-header">
          <h1>Statistics</h1>
          <button onClick={onBack} className="back-button">Back to Game</button>
        </div>
        
        <div className="stats-content">
          <div className="filters-section">
            <h3>Filters</h3>
            <div className="filter-controls">
              <div className="filter-group">
                <label htmlFor="start-date">Start Date:</label>
                <DatePicker
                  id="start-date"
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="Select date"
                />
              </div>
              <div className="filter-group">
                <label htmlFor="end-date">End Date:</label>
                <DatePicker
                  id="end-date"
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="Select date"
                />
              </div>
              <div className="filter-group">
                <label>Speed Difference:</label>
                <button
                  onClick={() => {
                    setSpeedDiffExpanded(!speedDiffExpanded);
                    if (!speedDiffExpanded) {
                      setTimeToCrossingExpanded(false);
                      setAngleExpanded(false);
                    }
                  }}
                  className={`filter-toggle-button ${speedDiffExpanded ? 'expanded' : ''}`}
                >
                  {`${speedDiffMin} - ${speedDiffMax} kt`}
                </button>
              </div>
              <div className="filter-group">
                <label>Time to Crossing:</label>
                <button
                  onClick={() => {
                    setTimeToCrossingExpanded(!timeToCrossingExpanded);
                    if (!timeToCrossingExpanded) {
                      setSpeedDiffExpanded(false);
                      setAngleExpanded(false);
                    }
                  }}
                  className={`filter-toggle-button ${timeToCrossingExpanded ? 'expanded' : ''}`}
                >
                  {`${timeToCrossingMin} - ${timeToCrossingMax} min`}
                </button>
              </div>
              <div className="filter-group">
                <label>Angle:</label>
                <button
                  onClick={() => {
                    setAngleExpanded(!angleExpanded);
                    if (!angleExpanded) {
                      setSpeedDiffExpanded(false);
                      setTimeToCrossingExpanded(false);
                    }
                  }}
                  className={`filter-toggle-button ${angleExpanded ? 'expanded' : ''}`}
                >
                  {`${angleMin}° - ${angleMax}°`}
                </button>
              </div>
              {(startDate || endDate || speedDiffMin > 0 || speedDiffMax < 150 || timeToCrossingMin > 3 || timeToCrossingMax < 10 || angleMin > 20 || angleMax < 180) && (
                <button 
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                    setSpeedDiffMin(0);
                    setSpeedDiffMax(150);
                    setSpeedDiffExpanded(false);
                    setTimeToCrossingMin(3);
                    setTimeToCrossingMax(10);
                    setTimeToCrossingExpanded(false);
                    setAngleMin(20);
                    setAngleMax(180);
                    setAngleExpanded(false);
                  }}
                  className="clear-filters-button"
                >
                  Clear Filters
                </button>
              )}
            </div>
            {speedDiffExpanded && (
              <div className="dual-slider-container">
                <div className="dual-slider-wrapper">
                  <input
                    type="range"
                    className="dual-slider dual-slider-min"
                    min="0"
                    max="150"
                    value={speedDiffMin}
                    onChange={(e) => handleSpeedDiffSliderChange(true, parseInt(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, #333 0%, #333 ${(speedDiffMin / 150) * 100}%, #4a9eff ${(speedDiffMin / 150) * 100}%, #4a9eff ${(speedDiffMax / 150) * 100}%, #333 ${(speedDiffMax / 150) * 100}%, #333 100%)`
                    }}
                  />
                  <input
                    type="range"
                    className="dual-slider dual-slider-max"
                    min="0"
                    max="150"
                    value={speedDiffMax}
                    onChange={(e) => handleSpeedDiffSliderChange(false, parseInt(e.target.value))}
                    style={{ background: 'none' }}
                  />
                </div>
                <div className="slider-labels">
                  <span>0 kt</span>
                  <span>150 kt</span>
                </div>
              </div>
            )}
            {timeToCrossingExpanded && (
              <div className="dual-slider-container">
                <div className="dual-slider-wrapper">
                  <input
                    type="range"
                    className="dual-slider dual-slider-min"
                    min="3"
                    max="10"
                    step="0.5"
                    value={timeToCrossingMin}
                    onChange={(e) => handleTimeToCrossingSliderChange(true, parseFloat(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, #333 0%, #333 ${((timeToCrossingMin - 3) / 7) * 100}%, #4a9eff ${((timeToCrossingMin - 3) / 7) * 100}%, #4a9eff ${((timeToCrossingMax - 3) / 7) * 100}%, #333 ${((timeToCrossingMax - 3) / 7) * 100}%, #333 100%)`
                    }}
                  />
                  <input
                    type="range"
                    className="dual-slider dual-slider-max"
                    min="3"
                    max="10"
                    step="0.5"
                    value={timeToCrossingMax}
                    onChange={(e) => handleTimeToCrossingSliderChange(false, parseFloat(e.target.value))}
                    style={{ background: 'none' }}
                  />
                </div>
                <div className="slider-labels">
                  <span>3 min</span>
                  <span>10 min</span>
                </div>
              </div>
            )}
            {angleExpanded && (
              <div className="dual-slider-container">
                <div className="dual-slider-wrapper">
                  <input
                    type="range"
                    className="dual-slider dual-slider-min"
                    min="20"
                    max="180"
                    step="5"
                    value={angleMin}
                    onChange={(e) => handleAngleSliderChange(true, parseInt(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, #333 0%, #333 ${((angleMin - 20) / 160) * 100}%, #4a9eff ${((angleMin - 20) / 160) * 100}%, #4a9eff ${((angleMax - 20) / 160) * 100}%, #333 ${((angleMax - 20) / 160) * 100}%, #333 100%)`
                    }}
                  />
                  <input
                    type="range"
                    className="dual-slider dual-slider-max"
                    min="20"
                    max="180"
                    step="5"
                    value={angleMax}
                    onChange={(e) => handleAngleSliderChange(false, parseInt(e.target.value))}
                    style={{ background: 'none' }}
                  />
                </div>
                <div className="slider-labels">
                  <span>20°</span>
                  <span>180°</span>
                </div>
              </div>
            )}
          </div>
          
          {loading && <p>Loading statistics...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && userStats.length === 0 && (
            <p>No test scores recorded yet.</p>
          )}
          {!loading && !error && userStats.length > 0 && (
            <table className="stats-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('username')} style={{ cursor: 'pointer' }}>
                    Name{renderSortIcon('username')}
                  </th>
                  <th onClick={() => handleSort('totalSubmitted')} style={{ cursor: 'pointer' }}>
                    Total Submitted{renderSortIcon('totalSubmitted')}
                  </th>
                  <th onClick={() => handleSort('successPercent')} style={{ cursor: 'pointer' }}>
                    % Success{renderSortIcon('successPercent')}
                  </th>
                  <th onClick={() => handleSort('failPercent')} style={{ cursor: 'pointer' }}>
                    % Fail{renderSortIcon('failPercent')}
                  </th>
                  <th onClick={() => handleSort('wastePercent')} style={{ cursor: 'pointer' }}>
                    % Waste{renderSortIcon('wastePercent')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const totalStats = calculateTotalStats();
                  return totalStats && (
                    <tr className="total-row">
                      <td className="username-cell total-cell">{totalStats.username}</td>
                      <td className="number-cell total-cell">{totalStats.totalSubmitted}</td>
                      <td className="percent-cell success total-cell">{totalStats.successPercent.toFixed(1)}%</td>
                      <td className="percent-cell fail total-cell">{totalStats.failPercent.toFixed(1)}%</td>
                      <td className="percent-cell waste total-cell">{totalStats.wastePercent.toFixed(1)}%</td>
                    </tr>
                  );
                })()}
                {getSortedStats().map((stats) => (
                  <tr key={stats.username}>
                    <td className="username-cell">{stats.username}</td>
                    <td className="number-cell">{stats.totalSubmitted}</td>
                    <td className="percent-cell success">{stats.successPercent.toFixed(1)}%</td>
                    <td className="percent-cell fail">{stats.failPercent.toFixed(1)}%</td>
                    <td className="percent-cell waste">{stats.wastePercent.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
