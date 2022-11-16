interface DirectionProps {
  distance: number;
  isWalking: boolean;
  label: string;
  directionName?: string;
}

function Direction({
  distance,
  isWalking,
  label,
  directionName,
}: DirectionProps) {
  return (
    <div className="direction">
      {isWalking && (
        <div data-testid="walk-distance">
          Walk {(distance / 1000).toFixed(2)} km
        </div>
      )}

      {!isWalking && (
        <div>
          <span data-testid="label">{label}</span>
          {directionName && (
            <>
              <span> - </span>
              <span data-testid="direction-name">
                ({directionName} Direction)
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Direction;
