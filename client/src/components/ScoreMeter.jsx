const LABELS = [
  { min: 80, text: 'Strong resume' },
  { min: 50, text: 'Getting there' },
  { min: 0, text: 'Needs more detail' },
];

export default function ScoreMeter({ score }) {
  const label = LABELS.find((l) => score >= l.min)?.text || '';

  return (
    <div className="score-meter">
      <div className="score-ring" style={{ '--score': score }}>
        {score}
      </div>
      <div className="score-label">
        <strong>{label}</strong>
        Resume score
      </div>
    </div>
  );
}
