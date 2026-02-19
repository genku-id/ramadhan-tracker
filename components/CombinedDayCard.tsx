import React from 'react';
import { DayProgress, Person, DAILY_TASK_TYPES, LAST_10_DAYS_TASK, TASK_LABELS, DailyTaskType } from '../types';
import { getRamadhanDate, triggerMiniConfetti, cn } from '../utils';
import { Check, Moon, BookOpen, Star, Sunset } from 'lucide-react';

interface CombinedDayCardProps {
  day: number;
  faizalData: DayProgress;
  ainunData: DayProgress;
  onUpdate: (person: Person, day: number, type: keyof DayProgress, e: React.MouseEvent) => void;
  isToday: boolean;
}

const ICONS: Record<DailyTaskType, React.ReactNode> = {
  puasa: <Sunset className="w-4 h-4" />,
  tarawih: <Moon className="w-4 h-4" />,
  tadarus: <BookOpen className="w-4 h-4" />,
  lailatulQodar: <Star className="w-4 h-4" />,
};

export const CombinedDayCard = React.forwardRef<HTMLDivElement, CombinedDayCardProps>(({ day, faizalData, ainunData, onUpdate, isToday }, ref) => {
  const dateStr = getRamadhanDate(day);
  
  // Tasks to show for this day
  const tasksToShow = [...DAILY_TASK_TYPES];
  if (day >= 21) {
    tasksToShow.push(LAST_10_DAYS_TASK);
  }

  const isFaizalFull = tasksToShow.every(t => faizalData[t]);
  const isAinunFull = tasksToShow.every(t => ainunData[t]);

  // Render a single row for a task
  const TaskRow = ({ task }: { task: DailyTaskType }) => (
    <div className="flex items-center justify-between py-2 border-b last:border-0 border-slate-50">
        {/* Faizal Checkbox (Left) */}
        <div 
            onClick={(e) => {
                if(!faizalData[task]) triggerMiniConfetti(e.clientX, e.clientY);
                onUpdate('faizal', day, task, e);
            }}
            className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300",
                faizalData[task] 
                    ? "bg-emerald-500 text-white shadow-emerald-200 shadow-lg scale-110" 
                    : "bg-slate-100 text-slate-300 hover:bg-slate-200"
            )}
        >
            <Check className={cn("w-6 h-6", faizalData[task] ? "opacity-100" : "opacity-0")} />
        </div>

        {/* Center Label */}
        <div className="flex flex-col items-center justify-center w-20">
            <div className={cn(
                "p-1.5 rounded-full mb-1",
                (faizalData[task] || ainunData[task]) ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400"
            )}>
                {ICONS[task]}
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">
                {TASK_LABELS[task]}
            </span>
        </div>

        {/* Ainun Checkbox (Right) */}
        <div 
             onClick={(e) => {
                if(!ainunData[task]) triggerMiniConfetti(e.clientX, e.clientY);
                onUpdate('ainun', day, task, e);
            }}
            className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300",
                ainunData[task] 
                    ? "bg-pink-500 text-white shadow-pink-200 shadow-lg scale-110" 
                    : "bg-slate-100 text-slate-300 hover:bg-slate-200"
            )}
        >
            <Check className={cn("w-6 h-6", ainunData[task] ? "opacity-100" : "opacity-0")} />
        </div>
    </div>
  );

  return (
    <div 
        ref={ref}
        id={`day-${day}`}
        className={cn(
            "bg-white/80 backdrop-blur-sm rounded-xl border transition-all duration-300 scroll-mt-32",
            isToday ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500 transform scale-[1.02] z-10" : "border-slate-100 shadow-sm"
        )}
    >
      {/* Card Header */}
      <div className={cn(
          "px-4 py-2 rounded-t-xl border-b border-slate-100 flex justify-between items-center",
          isToday ? "bg-emerald-50" : "bg-slate-50/50"
      )}>
        <h3 className="font-amiri font-bold text-lg text-slate-800">Ramadhan {day}</h3>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider bg-white px-2 py-1 rounded-md shadow-sm">{dateStr}</p>
      </div>

      {/* Progress Bars Summary (Visual Only) */}
      <div className="flex h-1.5 w-full">
        <div className={cn("flex-1 transition-all", isFaizalFull ? "bg-emerald-500" : "bg-slate-200")} />
        <div className="w-[1px] bg-white" />
        <div className={cn("flex-1 transition-all", isAinunFull ? "bg-pink-500" : "bg-slate-200")} />
      </div>

      {/* Columns Header */}
      <div className="grid grid-cols-3 py-2 bg-slate-50/30 text-xs font-bold text-slate-400 uppercase tracking-widest text-center border-b border-slate-50">
        <span className="text-emerald-600">Faizal</span>
        <span>Misi</span>
        <span className="text-pink-500">Ainun</span>
      </div>

      {/* List */}
      <div className="p-3 flex flex-col gap-1">
        {tasksToShow.map((task) => (
          <TaskRow key={task} task={task} />
        ))}
      </div>
    </div>
  );
});

CombinedDayCard.displayName = 'CombinedDayCard';