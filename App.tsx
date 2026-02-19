import React, { useState, useEffect, useRef } from 'react';
import { AppState, Person, DayProgress } from './types';
import { CombinedDayCard } from './components/CombinedDayCard';
import { ScoreBoard } from './components/ScoreBoard';
import { getCurrentRamadhanDay, getGregorianDateString } from './utils';
import { Calendar, ChevronDown } from 'lucide-react';

// Helper to create empty daily data
const createInitialDaily = (): Record<number, DayProgress> => {
  const daily: Record<number, DayProgress> = {};
  for (let i = 1; i <= 30; i++) {
    daily[i] = {
      puasa: false,
      tarawih: false,
      tadarus: false,
      lailatulQodar: false,
    };
  }
  return daily;
};

// Default State
const DEFAULT_STATE: AppState = {
  faizal: { daily: createInitialDaily(), zakat: false },
  ainun: { daily: createInitialDaily(), zakat: false },
};

function App() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Refs for scrolling
  const currentDayRef = useRef<HTMLDivElement>(null);
  const currentDayNum = getCurrentRamadhanDay();
  const currentDateStr = getGregorianDateString();

  // Load from local storage and migrate if necessary
  useEffect(() => {
    const saved = localStorage.getItem('ramadhan-tracker-v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Check if migration is needed
        if (parsed.faizal && !parsed.faizal.daily) {
            console.log("Migrating data...");
            const migratedState: AppState = {
                faizal: { daily: parsed.faizal, zakat: false },
                ainun: { daily: parsed.ainun, zakat: false },
            };
            setState(migratedState);
        } else {
            setState(parsed);
        }
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ramadhan-tracker-v1', JSON.stringify(state));
    }
  }, [state, isLoaded]);

  // Function to scroll to today
  const scrollToToday = () => {
    if (currentDayRef.current) {
        currentDayRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
  };

  // Auto-scroll effect on load
  useEffect(() => {
    if (isLoaded) {
        setTimeout(scrollToToday, 500);
        setTimeout(scrollToToday, 1000);
    }
  }, [isLoaded]);

  const handleDailyUpdate = (person: Person, day: number, type: keyof DayProgress) => {
    setState((prev) => {
      const newState = {
        ...prev,
        [person]: {
          ...prev[person],
          daily: {
            ...prev[person].daily,
            [day]: {
              ...prev[person].daily[day],
              [type]: !prev[person].daily[day][type],
            },
          },
        },
      };
      return newState;
    });
  };

  const handleZakatToggle = (person: Person) => {
      setState(prev => ({
          ...prev,
          [person]: {
              ...prev[person],
              zakat: !prev[person].zakat
          }
      }));
  };

  // Generate array [1...30]
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  if (!isLoaded) return null;

  return (
    // Main Container: Fixed height (100vh), Flex Column, Hidden overflow on body to prevent double scrollbars
    <div className="h-screen w-full flex flex-col bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] bg-fixed overflow-hidden relative">
      
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/95 to-teal-100/90 -z-10 pointer-events-none" />

      {/* FIXED TOP SECTION: Header + Scoreboard */}
      <div className="flex-none z-20 bg-white/50 backdrop-blur-md shadow-sm border-b border-emerald-100/50">
        <div className="max-w-md mx-auto px-4 pt-4 pb-2">
            {/* Header */}
            <header className="text-center mb-3">
              <h1 className="font-amiri text-2xl font-bold text-emerald-800 leading-tight drop-shadow-sm">
                Ramadhan Tracker
              </h1>
              <p className="text-emerald-600 text-xs font-medium">
                Jurnal Ibadah Faizal & Ainun
              </p>
            </header>

            {/* Scoreboard (Fixed) */}
            <ScoreBoard 
                faizalData={state.faizal} 
                ainunData={state.ainun} 
                onZakatToggle={handleZakatToggle}
            />
        </div>
      </div>

      {/* SCROLLABLE BOTTOM SECTION: List of Days */}
      <div className="flex-1 overflow-y-auto scroll-smooth relative">
        <div className="max-w-md mx-auto px-4 pt-4 pb-28"> 
            <div className="flex flex-col gap-4">
                {days.map((day) => (
                    <CombinedDayCard
                        key={day}
                        ref={day === currentDayNum ? currentDayRef : null}
                        day={day}
                        faizalData={state.faizal.daily[day]}
                        ainunData={state.ainun.daily[day]}
                        onUpdate={handleDailyUpdate}
                        isToday={day === currentDayNum}
                    />
                ))}
            </div>
        </div>
      </div>

      {/* Floating Today Button (Sticky Footer Overlay) */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center z-50 pointer-events-none">
        <button 
            onClick={scrollToToday}
            className="pointer-events-auto group flex items-center gap-3 bg-white/90 backdrop-blur-md border border-emerald-200 shadow-xl shadow-emerald-100/50 text-emerald-800 px-5 py-3 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-emerald-500/10"
        >
            <div className="bg-emerald-100 p-1.5 rounded-full text-emerald-600">
                <Calendar className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start text-left mr-1">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                    Hari Ini ({currentDateStr})
                </span>
                <span className="text-sm font-bold leading-none">
                    Ramadhan {currentDayNum}
                </span>
            </div>
            <ChevronDown className="w-4 h-4 text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>

    </div>
  );
}

export default App;