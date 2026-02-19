import React from 'react';
import { Person, UserData } from '../types';
import { Trophy, Crown, Coins, Check } from 'lucide-react';
import { cn, triggerConfetti } from '../utils';

interface ScoreBoardProps {
  faizalData: UserData;
  ainunData: UserData;
  onZakatToggle: (person: Person) => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ faizalData, ainunData, onZakatToggle }) => {
  const calculateTotal = (data: UserData): number => {
    let total = 0;
    // Sum daily tasks
    Object.values(data.daily).forEach(day => {
      total += Object.values(day).filter(Boolean).length;
    });
    // Add Zakat bonus
    if (data.zakat) total += 5;
    return total;
  };

  const faizalScore = calculateTotal(faizalData);
  const ainunScore = calculateTotal(ainunData);
  
  const maxScore = 105;

  let leader: Person | 'tie' = 'tie';
  if (faizalScore > ainunScore) leader = 'faizal';
  if (ainunScore > faizalScore) leader = 'ainun';

  const ZakatButton = ({ person, isPaid, colorClass }: { person: Person, isPaid: boolean, colorClass: string }) => (
    <button
        onClick={() => {
            if (!isPaid) triggerConfetti();
            onZakatToggle(person);
        }}
        className={cn(
            "flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition-all w-full shadow-sm active:scale-95",
            isPaid 
                ? `bg-white border-${colorClass}-500 text-${colorClass}-600 ring-1 ring-${colorClass}-500` 
                : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
        )}
    >
        <div className={cn("p-1 rounded-full transition-colors", isPaid ? `bg-${colorClass}-100` : "bg-slate-200")}>
            <Coins className="w-3 h-3" />
        </div>
        <span className="uppercase tracking-wide">Zakat {person}</span>
        {isPaid && <Check className="w-3 h-3 ml-auto" />}
    </button>
  );

  return (
    // Removed 'sticky top-2 z-50' to make it static
    <div className="w-full bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mb-4">
      {/* Compact Header */}
      <div className="bg-emerald-600 px-4 py-2 text-white flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span className="font-bold text-sm tracking-wide">SKOR</span>
        </div>
        <div className="text-[10px] font-bold bg-emerald-800/40 px-2 py-0.5 rounded-full border border-emerald-500/50">
           Target: {maxScore}
        </div>
      </div>

      <div className="p-3">
        {/* Scores */}
        <div className="flex items-end justify-between gap-4 mb-3 relative">
            {/* VS Badge */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <span className="bg-slate-100 text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-slate-200">VS</span>
            </div>

            {/* Faizal */}
            <div className="flex-1 flex flex-col items-center">
                {leader === 'faizal' && <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-bounce mb-1" />}
                <div className={cn("text-3xl font-amiri font-bold transition-all leading-none", leader === 'faizal' ? "text-emerald-600" : "text-slate-400")}>
                    {faizalScore}
                </div>
                <span className="text-[10px] font-bold tracking-widest text-emerald-600 uppercase mt-1">Faizal</span>
            </div>

            {/* Ainun */}
            <div className="flex-1 flex flex-col items-center">
                {leader === 'ainun' && <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-bounce mb-1" />}
                <div className={cn("text-3xl font-amiri font-bold transition-all leading-none", leader === 'ainun' ? "text-pink-500" : "text-slate-400")}>
                    {ainunScore}
                </div>
                <span className="text-[10px] font-bold tracking-widest text-pink-500 uppercase mt-1">Ainun</span>
            </div>
        </div>

        {/* Compact Zakat Section */}
        <div className="flex gap-2 pt-2 border-t border-slate-50 bg-slate-50/30 -mx-3 -mb-3 p-3">
            <ZakatButton person="faizal" isPaid={faizalData.zakat} colorClass="emerald" />
            <ZakatButton person="ainun" isPaid={ainunData.zakat} colorClass="pink" />
        </div>
      </div>
    </div>
  );
};