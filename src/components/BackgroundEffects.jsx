import React from 'react';

const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Glow Orbs - Mantidos pois são leves (apenas 2 elementos) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-red-600/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-red-900/20 blur-[150px]" />
    </div>
  );
};


export default React.memo(BackgroundEffects);
